import os

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mysql://username:password@localhost/your_database'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret Key - ALWAYS use a strong, unique key in production
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    
    # Other configuration variables can be added here
    JWT_EXPIRATION_DELTA = 24  # hours