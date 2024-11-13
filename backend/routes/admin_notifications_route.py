from flask import Blueprint, jsonify, request,make_response
from models import db, WasteRequest, Admin
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from . import admin_notification_bp

# admin_notification_bp = Blueprint('admin_notifications', __name__)

@admin_notification_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
@admin_notification_bp.route('/test', methods=['GET'])
def get_waste_test():
    return jsonify({'msg': "hi"}), 200

@admin_notification_bp.route('/getnotif', methods=['GET', 'POST'])
@jwt_required()
def handle_notifications():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        print(f"JWT Identity: {admin_id}")
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        if request.method == 'GET':
            # Get unread waste requests for admin's centre
            notifications = WasteRequest.query.filter_by(
                admin_id=admin_id,
                notification=True
            ).order_by(WasteRequest.req_date.desc()).all()

            # Count unread notifications
            count = len(notifications)

            return jsonify({
                'count': count,
                'notifications': [{
                    'req_id': req.req_id,
                    'req_date': req.req_date.isoformat(),
                    'status': req.status,
                    'waste_type': req.waste_type,
                    'user': {
                        'user_id': req.user.user_id,
                        'name': f"{req.user.first_name} {req.user.last_name}",
                        'address': f"{req.user.street}, {req.user.city}",
                        'landmark': req.user.landmark
                    }
                } for req in notifications]
            }), 200

        elif request.method == 'POST':
            req_id = request.json.get('req_id')
            if not req_id:
                return jsonify({'error': 'req_id is required'}), 400

            # Find the waste request
            waste_request = WasteRequest.query.filter_by(
                req_id=req_id,
                admin_id=admin_id
            ).first()
            
            if not waste_request:
                return jsonify({'error': 'Waste request not found'}), 404

            # Mark notification as read
            waste_request.notification = False
            db.session.commit()

            return jsonify({'message': 'Notification marked as read'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500