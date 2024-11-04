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

# Test database connection before initializing Flask-SQLAlchemy
def test_db_connection():
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='vijju@2004',
            port=3305
        )
        print("Successfully connected to MySQL server!")
        connection.close()
        return True
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return False

# Check database connection and create database if needed
if not test_db_connection():
    print("ERROR: Cannot connect to MySQL. Please check if MySQL server is running and credentials are correct.")
else:
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='vijju@2004',
            port=3305
        )
        with connection.cursor() as cursor:
            cursor.execute('CREATE DATABASE IF NOT EXISTS waste_management_system')
        connection.close()
        print("Database check/creation completed successfully!")
    except pymysql.Error as e:
        print(f"Error creating database: {e}")
        raise SystemExit(1)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f'<User {self.user_id}>'

# Create the database tables
def init_db():
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

# def setup_database():
#     try:
#         # Create database if it doesn't exist
#         connection = pymysql.connect(
#             host='127.0.0.1',
#             user='root',
#             password='vijju@2004',
#             port=3305
#         )
#         with connection.cursor() as cursor:
#             cursor.execute('CREATE DATABASE IF NOT EXISTS waste_management_system')
#             cursor.execute('USE waste_management_system')
            
#             # Grant privileges
#             cursor.execute("GRANT ALL PRIVILEGES ON waste_management_system.* TO 'root'@'127.0.0.1'")
#             cursor.execute("GRANT ALL PRIVILEGES ON waste_management_system.* TO 'root'@'localhost'")
#             cursor.execute("FLUSH PRIVILEGES")
            
#         connection.close()
#         print("Database setup completed successfully!")
#         return True
#     except pymysql.Error as e:
#         print(f"Error setting up database: {e}")
#         return False

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
    try:
        existing_user = User.query.filter_by(user_id=data['userId']).first()
        if existing_user:
            return jsonify({'error': 'User ID already exists'}), 409

        # Create new user
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(name=data['name'], user_id=data['userId'], password=hashed_password)

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

def main():
    try:
        # Test initial connection
        if not test_db_connection():
            print("Failed to connect to MySQL server. Please check if the server is running and credentials are correct.")
            return

        # Setup database and privileges
        # if not setup_database():
        #     print("Failed to setup database. Please check MySQL configurations.")
        #     return

        # Initialize database tables
        init_db()
        
        # Start the Flask application
        print("Starting Flask application...")
        app.run(debug=True)
        
    except Exception as e:
        print(f"An error occurred while starting the application: {e}")

if __name__ == '__main__':
    main()