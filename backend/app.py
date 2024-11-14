# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# import pymysql
# from models import db, Admin
# from config import Config
# from flask_jwt_extended import JWTManager
# import logging
# from routes import auth_bp, admin_notification_bp, waste_request_bp



# def test_db_connection():
#     try:
#         connection = pymysql.connect(
#             host='localhost',
#             user='root',
#             password='root',
#             port=3306
#         )
#         print("Successfully connected to MySQL server!")
#         connection.close()
#         return True
#     except pymysql.Error as e:
#         print(f"Error connecting to MySQL: {e}")
#         return False

# def create_app(config_class=Config):
#     app = Flask(__name__)
#     jwt = JWTManager(app)
    
#     # Configure CORS
#     CORS(app, 
#      resources={r"/*": {
#          "origins": "*",
#          "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#          "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
#          "supports_credentials": True,
#      }})
        
    
#     # Load configuration
#     app.config.from_object(config_class)
#     config_class.init_app(app)
    
#     # Initialize extensions
#     db.init_app(app)
#     bcrypt = Bcrypt(app)
#     jwt = JWTManager(app)
    
#     # Set up logging
#     logging.basicConfig(level=logging.DEBUG)
    
#     # Register blueprints
#     app.register_blueprint(auth_bp, url_prefix='/api/auth')
#     app.register_blueprint(waste_request_bp, url_prefix='/api/waste-requests')
#     app.register_blueprint(admin_notification_bp, url_prefix='/api/admin')


#     @app.route('/')
#     def index():
#         return "Flask server is running!"

#     return app

# def init_db(app):
#     try:
#         with app.app_context():
#             db.create_all()
#             print("Database tables created successfully!")
#             update_admin_passwords(app)
#     except Exception as e:
#         print(f"Error creating database tables: {e}")
#         raise

# def update_admin_passwords(app):
#     bcrypt = Bcrypt(app)
#     try:
#         with app.app_context():
#             admins = Admin.query.all()
#             print(f"Found {len(admins)} admin records")
            
#             for admin in admins:
#                 print(f"Processing admin: {admin.admin_id}")
#                 # Assume the current password is plain text
#                 plain_password = admin.password
                
#                 # Check if the password is already hashed
#                 if not plain_password.startswith('$2b$'):
#                     # Generate a new bcrypt hash
#                     hashed_password = bcrypt.generate_password_hash(plain_password).decode('utf-8')
                    
#                     # Update the admin's password
#                     admin.password = hashed_password
#                     print(f"Updated password for admin: {admin.admin_id}")
#                 else:
#                     print(f"Password for admin: {admin.admin_id} is already hashed")
            
#             # Commit all changes
#             db.session.commit()
#             print("Successfully processed all admin passwords")
#     except Exception as e:
#         print(f"An error occurred while updating passwords: {str(e)}")
#         db.session.rollback()

# if __name__ == '__main__':
#     try:
#         if not test_db_connection():
#             print("Failed to connect to MySQL server. Please check if the server is running and credentials are correct.")
#         else:
#             app = create_app()
#             init_db(app)
#             CORS(app)
#             print("Starting Flask application...")
#             app.run(debug=True, port=5000)
#     except Exception as e:
#         print(f"An error occurred while starting the application: {e}")

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pymysql
from models import db, Admin
from config import Config
from flask_jwt_extended import JWTManager
import logging
from routes import auth_bp, admin_notification_bp, waste_request_bp,vehicle_bp,adminroutes_bp


def test_db_connection():
    try:
        connection = pymysql.connect(
            host="localhost", user="root", password="root", port=3306
        )
        print("Successfully connected to MySQL server!")
        connection.close()
        return True
    except pymysql.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return False


def create_app(config_class=Config):
    app = Flask(__name__)
    jwt = JWTManager(app)

    # Configure CORS
    # CORS(app,
    #  resources={r"/*": {
    #      "origins": "*",
    #      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    #      "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    #      "supports_credentials": True
    #  }})

    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "Access-Control-Allow-Credentials",
                    "Access-Control-Allow-Headers",
                ],
                "supports_credentials": True,
            }
        },
    )

    # Load configuration
    app.config.from_object(config_class)
    config_class.init_app(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)

    # Set up logging
    logging.basicConfig(level=logging.DEBUG)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(waste_request_bp, url_prefix="/api/waste")
    app.register_blueprint(admin_notification_bp, url_prefix="/api/admin")
    app.register_blueprint(vehicle_bp, url_prefix='/api/vehicles')
    app.register_blueprint(adminroutes_bp, url_prefix='/api/adminroutes')

    @app.route("/")
    def index():
        return "Flask server is running!"

    return app


def init_db(app):
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully!")
            update_admin_passwords(app)
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise


def update_admin_passwords(app):
    bcrypt = Bcrypt(app)
    try:
        with app.app_context():
            admins = Admin.query.all()
            print(f"Found {len(admins)} admin records")

            for admin in admins:
                print(f"Processing admin: {admin.admin_id}")
                # Assume the current password is plain text
                plain_password = admin.password

                # Check if the password is already hashed
                if not plain_password.startswith("$2b$"):
                    # Generate a new bcrypt hash
                    hashed_password = bcrypt.generate_password_hash(
                        plain_password
                    ).decode("utf-8")

                    # Update the admin's password
                    admin.password = hashed_password
                    print(f"Updated password for admin: {admin.admin_id}")
                else:
                    print(f"Password for admin: {admin.admin_id} is already hashed")

            # Commit all changes
            db.session.commit()
            print("Successfully processed all admin passwords")
    except Exception as e:
        print(f"An error occurred while updating passwords: {str(e)}")
        db.session.rollback()


if __name__ == "__main__":
    try:
        if not test_db_connection():
            print(
                "Failed to connect to MySQL server. Please check if the server is running and credentials are correct."
            )
        else:
            app = create_app()
            init_db(app)
            # CORS(app)
            print("Starting Flask application...")
            app.run(debug=True, port=5000)
    except Exception as e:
        print(f"An error occurred while starting the application: {e}")