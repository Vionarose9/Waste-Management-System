from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, WasteRequest, User, Admin
from datetime import datetime
import uuid

waste_request_bp = Blueprint('waste_request', __name__)

@waste_request_bp.route('/create', methods=['POST'])
@jwt_required()
def create_waste_request():
    current_user_id = get_jwt_identity()
    data = request.json

    if not all(key in data for key in ('wasteType', 'quantity')):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        admin = Admin.query.filter_by(centre_id=user.centre_id).first()
        if not admin:
            return jsonify({'error': 'No admin found for the user\'s centre'}), 404

        new_request = WasteRequest(
            req_id=str(uuid.uuid4()),
            req_date=datetime.utcnow(),
            status='Pending',
            waste_type=data['wasteType'],
            admin_id=admin.admin_id,
            vehicle_id=None,  # This will be assigned by the admin later
            user_id=current_user_id
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({
            'message': 'Waste collection request created successfully',
            'request_id': new_request.req_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500