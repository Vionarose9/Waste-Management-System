import os
from urllib.parse import quote_plus

class Config:
    # Existing configuration
    DB_PASSWORD = 'root'
    ENCODED_PASSWORD = quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://root:{ENCODED_PASSWORD}@localhost:3306/waste_management_system"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'  # Add this line

    @staticmethod
    def init_app(app):
        pass