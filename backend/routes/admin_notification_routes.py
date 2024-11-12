from flask import Blueprint, jsonify
from models import db, WasteRequest, Admin
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

admin_notification_bp = Blueprint('admin', __name__)

@admin_notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        admin_id = get_jwt_identity()
        
        # Get admin's centre_id
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Get unread waste requests for admin's centre
        notifications = WasteRequest.query.filter_by(
            admin_id=admin_id,
            notification=True
        ).order_by(WasteRequest.req_date.desc()).all()

        return jsonify([{
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
        } for req in notifications]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_notification_bp.route('/notifications/<req_id>/mark-read', methods=['POST'])
@jwt_required()
def mark_notification_read(req_id):
    try:
        admin_id = get_jwt_identity()
        
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

@admin_notification_bp.route('/notifications/count', methods=['GET'])
@jwt_required()
def get_notification_count():
    try:
        admin_id = get_jwt_identity()
        
        # Count unread notifications
        count = WasteRequest.query.filter_by(
            admin_id=admin_id,
            notification=True
        ).count()

        return jsonify({'count': count}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500