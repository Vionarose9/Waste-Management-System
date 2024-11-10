from flask import request, jsonify
from flask_bcrypt import Bcrypt
from models import db, User, UserPhoneNumber,Admin
from . import auth_bp
import jwt  # Add this import
from datetime import datetime, timedelta
from config import Config
import logging

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

    if len(data['firstName']) < 2 or len(data['lastName']) < 2:
        return jsonify({'error': 'First and last name must be at least 2 characters'}), 400

    if len(data['userId']) < 4:
        return jsonify({'error': 'User ID must be at least 4 characters'}), 400

    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if not data['phoneNumber'].isdigit() or len(data['phoneNumber']) != 10:
        return jsonify({'error': 'Phone number must be 10 digits'}), 400

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

        # Create new user phone number
        new_phone_number = UserPhoneNumber(
            user_id=data['userId'],
            phone_number=data['phoneNumber']
        )

        db.session.add(new_user)
        db.session.add(new_phone_number)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
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
        token = jwt.encode({
            'user_id': user.user_id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')

        return jsonify({
            'message': 'Login successful',
            'token': token,
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
        token = jwt.encode({
            'admin_id': admin.admin_id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'admin': {
                'adminId': admin.admin_id,
                'adminName': admin.admin_name,
                'centreId': admin.centre_id
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid adminId or password'}), 401
    


@auth_bp.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        db.session.execute('SELECT 1')
        return jsonify({'message': 'Database connection successful'}), 200
    except Exception as e:
        return jsonify({'error': f'Database connection failed: {str(e)}'}), 500