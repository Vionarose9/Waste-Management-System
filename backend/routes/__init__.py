from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
waste_request_bp = Blueprint('waste_request', __name__)

# Import routes after creating auth_bp to avoid circular import
from . import auth_routes
