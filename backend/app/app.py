from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
from urllib.parse import quote_plus
import pymysql

app = Flask(__name__)
CORS(app)

# Database configuration
encoded_password = quote_plus('vijju@2004')
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:{encoded_password}@127.0.0.1:3305/waste_management_system"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User model
class User(db.Model):
    __tablename__ = 'user'  # Fixed: Changed _tablename_ to __tablename__
    user_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(100), nullable=False)
    landmark = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    centre_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):  # Fixed: Changed _repr_ to __repr__
        return f'<User {self.user_id}>'

# Database initialization function
def init_db():
    try:
        with app.app_context():
            # Drop all tables
            db.drop_all()
            # Create all tables
            db.create_all()
            print("Database tables dropped and recreated successfully!")
    except Exception as e:
        print(f"Error recreating database tables: {e}")
        raise

# Test database connection
def test_db_connection():
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='vijju@2004',
            port=3305  # Fixed: Changed port to match the URI
        )
        print("Successfully connected to MySQL server!")
        connection.close()
        return True
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return False

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input
    required_fields = ['firstName', 'lastName', 'userId', 'city', 'street', 'landmark', 'password', 'confirmPassword', 'centreId']
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

    # Check if user already exists
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

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred while creating the user: {str(e)}'}), 500

@app.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        return jsonify({'message': 'Database connection successful'}), 200
    except Exception as e:
        return jsonify({'error': f'Database connection failed: {str(e)}'}), 500

if __name__ == '__main__':  # Fixed: Changed _main_ to __main__
    try:
        # Test initial connection
        if not test_db_connection():
            print("Failed to connect to MySQL server. Please check if the server is running and credentials are correct.")
        else:
            # Initialize database tables
            init_db()
            # Start the Flask application
            print("Starting Flask application...")
            app.run(debug=True)
    except Exception as e:
        print(f"An error occurred while starting the application: {e}")