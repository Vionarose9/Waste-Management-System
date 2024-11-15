from flask import Blueprint, jsonify, request,make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Admin, Vehicle, WasteRequest, User
from .import vehicle_bp
from sqlalchemy import text
from datetime import datetime, timedelta

@vehicle_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response




@vehicle_bp.route('/list', methods=['GET'])
@jwt_required()
def get_vehicles():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        vehicles = Vehicle.query.filter_by(centre_id=admin.centre_id).all()
        
        vehicle_data = []
        for vehicle in vehicles:
            vehicle_data.append({
                'vehicle_id': vehicle.vehicle_id,
                'vehicle_type': vehicle.vehicle_type,
                'status': vehicle.status,
                'centre_id': vehicle.centre_id
            })
        
        return jsonify({
            'vehicles': vehicle_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@vehicle_bp.route('/update-status', methods=['POST'])
@jwt_required()
def update_vehicle_status():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        data = request.json
        vehicle_id = data.get('vehicle_id')
        
        if not vehicle_id:
            return jsonify({'error': 'Vehicle ID is required'}), 400

        vehicle = Vehicle.query.filter_by(vehicle_id=vehicle_id, centre_id=admin.centre_id).first()
        
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404

        # Toggle the status
        new_status = 'active' if vehicle.status != 'active' else 'not active'
        vehicle.status = new_status
        db.session.commit()

        # If the vehicle became active, assign it to matching waste requests
        if new_status == 'active':
            assign_vehicle_to_requests(vehicle)

        return jsonify({
            'message': f'Vehicle status updated successfully to {new_status}',
            'vehicle_id': vehicle.vehicle_id,
            'new_status': new_status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def assign_vehicle_to_requests(vehicle):
    try:
        matching_requests = WasteRequest.query.join(User).filter(
            User.centre_id == vehicle.centre_id,
            WasteRequest.waste_type == vehicle.vehicle_type,
            WasteRequest.vehicle_id == None,
            WasteRequest.status == 'Pending'
        ).all()

        for request in matching_requests:
            request.vehicle_id = vehicle.vehicle_id
            request.status = 'Assigned'

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error assigning vehicle to requests: {str(e)}")
        

@vehicle_bp.route('/waste-stats', methods=['GET'])
def get_vehicle_waste_stats():
    try:
        # Get vehicle_id from the request
        vehicle_id = request.args.get('vehicle_id')

        if not vehicle_id:
            return jsonify({'error': 'Vehicle ID is required'}), 400

        # Call the SQL function
        query = text("""
            SELECT calculate_total_waste_by_vehicle(:vehicle_id) as stats
        """)
        
        result = db.session.execute(query, {'vehicle_id': vehicle_id})

        # Extract the JSON result
        stats = result.scalar()

        if stats is None:
            return jsonify({'error': 'No data found for the given vehicle'}), 404

        return jsonify({'vehicle_stats': stats})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred while fetching vehicle stats'}), 500