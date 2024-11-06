from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
from models import db
from config import Config
from routes.auth_routes import auth_bp
from flask_jwt_extended import JWTManager

def test_db_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='root',
            port=3306
        )
        print("Successfully connected to MySQL server!")
        connection.close()
        return True
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return False

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)
    
    # Load configuration
    app.config.from_object(config_class)
    config_class.init_app(app)
    
    # Initialize extensions
    db.init_app(app)
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app

def init_db(app):
    try:
        with app.app_context():
            # Instead of dropping all tables, we'll just create them if they don't exist
            db.create_all()
            print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

if __name__ == '__main__':
    try:
        if not test_db_connection():
            print("Failed to connect to MySQL server. Please check if the server is running and credentials are correct.")
        else:
            app = create_app()
            init_db(app)
            print("Starting Flask application...")
            app.run(debug=True)
    except Exception as e:
        print(f"An error occurred while starting the application: {e}")