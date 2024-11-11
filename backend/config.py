import os
from datetime import timedelta
from urllib.parse import quote_plus

class Config:
    DB_PASSWORD = 'root'
    ENCODED_PASSWORD = quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://root:{ENCODED_PASSWORD}@localhost:3306/waste_management_system"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'your-jwt-secret-key-here'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    @staticmethod
    def init_app(app):
        pass