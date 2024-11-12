from flask import request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User, UserPhoneNumber, Admin
from . import auth_bp
from datetime import datetime, timedelta
from config import Config
import logging
from flask_jwt_extended import (
    jwt_required, 
    create_access_token,
    get_jwt_identity,
    get_jwt,
    JWTManager
)

bcrypt = Bcrypt()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input
    required_fields = ['firstName', 'lastName', 'userId', 'phoneNumber', 'city', 'street', 'landmark', 'password', 'confirmPassword', 'centreId']
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({'error': 'Passwords do not match'}), 400

    try:
        existing_user = User.query.filter_by(user_id=data['userId']).first()
        if existing_user:
            return jsonify({'error': 'User ID already exists'}), 409

        # Create new user
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(
            user_id=data['userId'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            city=data['city'],
            street=data['street'],
            landmark=data['landmark'],
            password=hashed_password,
            centre_id=int(data['centreId'])
        )

        new_phone_number = UserPhoneNumber(
            user_id=data['userId'],
            phone_number=data['phoneNumber']
        )

        db.session.add(new_user)
        db.session.add(new_phone_number)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=data['userId'])
        
        return jsonify({
            'message': 'User created successfully',
            'token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred while creating the user: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data or not data.get('userId') or not data.get('password'):
        return jsonify({'error': 'Missing userId or password'}), 400

    user = User.query.filter_by(user_id=data['userId']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.user_id)

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'userId': user.user_id,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'city': user.city,
                'street': user.street,
                'landmark': user.landmark,
                'centreId': user.centre_id
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid userId or password'}), 401

@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.json

    if not data or not data.get('adminId') or not data.get('password'):
        return jsonify({'error': 'Missing adminId or password'}), 400

    admin = Admin.query.filter_by(admin_id=data['adminId']).first()

    if admin and bcrypt.check_password_hash(admin.password, data['password']):
        access_token = create_access_token(identity=admin.admin_id)

        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'admin': {
                'adminId': admin.admin_id,
                'adminName': admin.admin_name,
                'centreId': admin.centre_id
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid adminId or password'}), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        response = jsonify({"message": "Successfully logged out"})
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(user_id=current_user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        phone_number = UserPhoneNumber.query.filter_by(user_id=current_user_id).first()
        
        return jsonify({
            "userId": user.user_id,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "city": user.city,
            "street": user.street,
            "landmark": user.landmark,
            "centreId": user.centre_id,
            "phoneNumber": phone_number.phone_number if phone_number else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/admin-profile', methods=['GET'])
@jwt_required()
def get_admin_profile():
    try:
        current_admin_id = get_jwt_identity()
        admin = Admin.query.filter_by(admin_id=current_admin_id).first()
        
        if not admin:
            return jsonify({"error": "Admin not found"}), 404
            
        return jsonify({
            "adminId": admin.admin_id,
            "adminName": admin.admin_name,
            "centreId": admin.centre_id,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        db.session.execute('SELECT 1')
        return jsonify({'message': 'Database connection successful'}), 200
    except Exception as e:
        return jsonify({'error': f'Database connection failed: {str(e)}'}), 500