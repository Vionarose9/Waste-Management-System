from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, WasteRequest, User, Admin, Centre, Vehicle
from datetime import datetime
import uuid

waste_request_bp = Blueprint('waste_request', __name__)

@waste_request_bp.route('/create', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
@jwt_required()
def create_waste_request():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    current_user_id = get_jwt_identity()
    data = request.json

    if not all(key in data for key in ('wasteType', 'quantity')):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        centre = Centre.query.get(user.centre_id)
        if not centre:
            return jsonify({'error': 'Centre not found'}), 404

        admin = Admin.query.filter_by(centre_id=centre.centre_id).first()
        if not admin:
            return jsonify({'error': 'No admin found for the user\'s centre'}), 404

        new_request = WasteRequest(
            req_id=str(uuid.uuid4()),
            req_date=datetime.utcnow(),
            status='Pending',
            waste_type=data['wasteType'],
            quantity=float(data['quantity']),
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

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@waste_request_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_requests():
    current_user_id = get_jwt_identity()
    
    try:
        user_requests = WasteRequest.query.filter_by(user_id=current_user_id).all()
        return jsonify([
            {
                'req_id': req.req_id,
                'req_date': req.req_date,
                'status': req.status,
                'waste_type': req.waste_type,
                'quantity': req.quantity
            } for req in user_requests
        ]), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

# ... other routes remain the same

@waste_request_bp.route('/admin/notifications', methods=['GET'])
@jwt_required()
def get_admin_notifications():
    current_user_id = get_jwt_identity()
    
    try:
        admin = Admin.query.get(current_user_id)
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        notifications = WasteRequest.query.join(User).filter(
            WasteRequest.admin_id == admin.admin_id,
            WasteRequest.notification == True,
            User.centre_id == admin.centre_id
        ).all()

        return jsonify({
            'notifications': [
                {
                    'req_id': req.req_id,
                    'req_date': req.req_date,
                    'waste_type': req.waste_type,
                    'user_id': req.user_id
                } for req in notifications
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@waste_request_bp.route('/assign-vehicle', methods=['POST'])
@jwt_required()
def assign_vehicle():
    current_user_id = get_jwt_identity()
    data = request.json

    if not all(key in data for key in ('request_id', 'vehicle_id')):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        admin = Admin.query.get(current_user_id)
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        waste_request = WasteRequest.query.get(data['request_id'])
        if not waste_request:
            return jsonify({'error': 'Waste request not found'}), 404

        if waste_request.admin_id != admin.admin_id:
            return jsonify({'error': 'Unauthorized to modify this request'}), 403

        vehicle = Vehicle.query.get(data['vehicle_id'])
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404

        if vehicle.centre_id != admin.centre_id:
            return jsonify({'error': 'Vehicle does not belong to your centre'}), 400

        waste_request.vehicle_id = vehicle.vehicle_id
        db.session.commit()

        return jsonify({
            'message': 'Vehicle assigned successfully',
            'request_id': waste_request.req_id,
            'vehicle_id': vehicle.vehicle_id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500