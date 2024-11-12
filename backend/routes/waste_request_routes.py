from flask import Blueprint, request, jsonify
from models import db, WasteRequest, User, Admin
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

waste_request_bp = Blueprint('waste_request', __name__)

@waste_request_bp.route('/list', methods=['GET'])
@jwt_required()
def get_waste_requests():
    try:
        user_id = get_jwt_identity()
        requests = WasteRequest.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'req_id': req.req_id,
            'req_date': req.req_date.isoformat(),
            'status': req.status,
            'waste_type': req.waste_type
        } for req in requests]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@waste_request_bp.route('/new', methods=['POST'])
@jwt_required()
def create_waste_request():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'req_date' not in data or 'waste_type' not in data:
            return jsonify({'error': 'Missing required fields'}), 422

        # Get the latest req_id
        latest_request = WasteRequest.query.order_by(WasteRequest.req_id.desc()).first()
        new_req_id = str(int(latest_request.req_id) + 1).zfill(5) if latest_request else '00001'

        # Get the user's centre_id
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Find an admin with the same centre_id
        admin = Admin.query.filter_by(centre_id=user.centre_id).first()
        if not admin:
            return jsonify({'error': 'No admin found for this centre'}), 404

        new_request = WasteRequest(
            req_id=new_req_id,
            req_date=datetime.strptime(data['req_date'], '%Y-%m-%d'),
            status='Pending',
            waste_type=data['waste_type'],
            user_id=user_id,
            admin_id=admin.admin_id,
            notification=True
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({
            'message': 'Waste request created successfully',
            'req_id': new_request.req_id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500