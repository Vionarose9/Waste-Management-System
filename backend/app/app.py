from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://:password@localhost/waste_management_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User model

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input
    if not all(key in data for key in ('name', 'userId', 'password', 'confirmPassword')):
        return jsonify({'error': 'Missing required fields'}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({'error': 'Passwords do not match'}), 400

    if len(data['name']) < 2:
        return jsonify({'error': 'Name must be at least 2 characters'}), 400

    if len(data['userId']) < 4:
        return jsonify({'error': 'User ID must be at least 4 characters'}), 400

    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    # Check if user already exists
    existing_user = User.query.filter_by(user_id=data['userId']).first()
    if existing_user:
        return jsonify({'error': 'User ID already exists'}), 409

    # Create new user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], user_id=data['userId'], password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while creating the user'}), 500

if __name__ == '__main__':
    app.run(debug=True)