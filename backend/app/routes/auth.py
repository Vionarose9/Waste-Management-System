from flask import Blueprint, request, jsonify
from .. import bcrypt, db
from ..models.user import User
from ..models.admin import Admin
from ..utils.token import generate_token

# Create a blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/user/signup', methods=['POST'])
def user_signup():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['first_name', 'last_name', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400
    
    # Hash password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Create new user
    new_user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        password=hashed_password,
        contact_number=data.get('contact_number'),
        address=data.get('address'),
        date_of_birth=data.get('date_of_birth')
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User registered successfully",
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/user/login', methods=['POST'])
def user_login():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['email', 'password']):
        return jsonify({"error": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = generate_token(user.user_id)
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    
    # Validate input
    if not all(key in data for key in ['username', 'password']):
        return jsonify({"error": "Missing username or password"}), 400
    
    admin = Admin.query.filter_by(username=data['username']).first()
    
    if admin and bcrypt.check_password_hash(admin.password, data['password']):
        token = generate_token(admin.admin_id, is_admin=True)
        return jsonify({
            "message": "Admin login successful",
            "token": token,
            "admin": admin.to_dict()
        }), 200
    
    return jsonify({"error": "Invalid admin credentials"}), 401