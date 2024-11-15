from flask import Blueprint, request, jsonify, make_response
from models import db, WasteRequest, User, Admin
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from . import waste_request_bp
from sqlalchemy import text

@waste_request_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS,DELETE")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

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
    
@waste_request_bp.route('/test', methods=['GET'])
def get_waste_test():
    return jsonify({'msg': "hi"}), 200

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
    
    
# @waste_request_bp.route('/update-status', methods=['POST'])
# @jwt_required()
# def update_collection_status():
#     try:
#         data = request.get_json()
#         req_id = data.get('req_id')
        
#         if not req_id:
#             return jsonify({'error': 'Request ID is required'}), 400
            
#         # Call the stored procedure
#         result = db.session.execute(
#             text('CALL update_waste_collection_status(:req_id)'),
#             {'req_id': req_id}
#         )
        
#         # Commit the transaction
#         db.session.commit()
        
#         # Get the first row of the result
#         updated_record = result.fetchone()
        
#         if updated_record:
#             return jsonify({
#                 'success': True,
#                 'message': 'Collection status updated successfully',
#                 'data': {
#                     'req_id': updated_record.req_id,
#                     'status': updated_record.status,
#                     'collection_status': updated_record.collection_status,
#                     'collected_date': updated_record.collected_date.isoformat() if updated_record.collected_date else None
#                 }
#             }), 200
#         else:
#             return jsonify({'error': 'Request not found'}), 404
            
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

@waste_request_bp.route('/mark-collected', methods=['POST'])
@jwt_required()
def mark_as_collected():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'req_id' not in data or 'collection_quantity' not in data:
            return jsonify({'error': 'Missing required fields'}), 422

        # Call the stored procedure
        result = db.session.execute(text('CALL mark_waste_collected(:p_req_id, :p_collection_quantity, :p_user_id)'),
                                    {'p_req_id': data['req_id'],
                                     'p_collection_quantity': data['collection_quantity'],
                                     'p_user_id': user_id})

        # Commit the transaction
        db.session.commit()

        return jsonify({'message': 'Waste request marked as collected successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
@waste_request_bp.route('/delete/<req_id>', methods=['DELETE'])
@jwt_required()
def delete_waste_request(req_id):
    try:
        user_id = get_jwt_identity()
        request = WasteRequest.query.filter_by(req_id=req_id, user_id=user_id).first()
        
        if not request:
            return jsonify({'error': 'Request not found or you do not have permission to delete it'}), 404
        
        db.session.delete(request)
        db.session.commit()
        
        return jsonify({'message': 'Waste request deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500