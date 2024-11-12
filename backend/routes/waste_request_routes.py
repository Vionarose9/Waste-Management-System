from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, WasteRequest, User, Admin
from datetime import datetime
import uuid

waste_request_bp = Blueprint('waste_request', __name__)

@waste_request_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_requests():
    current_user_id = get_jwt_identity()
    user_requests = WasteRequest.query.filter_by(user_id=current_user_id).all()
    requests_data = []
    for req in user_requests:
        requests_data.append({
            'req_id': req.req_id,
            'waste_type': req.waste_type,
            'status': req.status,
            'req_date': req.req_date.isoformat()
        })
    return jsonify(requests_data), 200

@waste_request_bp.route('/create', methods=['POST'])
@jwt_required()
def create_waste_request():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    admin = Admin.query.filter_by(centre_id=user.centre_id).first()
    if not admin:
        return jsonify({"msg": "No admin found for the user's centre"}), 404

    new_request = WasteRequest(
        req_id=str(uuid.uuid4()),
        req_date=datetime.utcnow(),
        status='Pending',
        waste_type=data['wasteType'],
        admin_id=admin.admin_id,
        user_id=current_user_id,
        notification=True
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({
        'message': 'Waste collection request created successfully',
        'request_id': new_request.req_id
    }), 201