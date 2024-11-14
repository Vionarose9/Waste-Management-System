from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
waste_request_bp = Blueprint('waste', __name__)
admin_notification_bp = Blueprint('admin', __name__)
vehicle_bp = Blueprint('vehicle', __name__)
adminroutes_bp = Blueprint('adminroutes', __name__)


from . import auth_routes
from . import waste_request_routes
from . import admin_notifications_route
from .import vehicle_routes
from .import admin_routes

