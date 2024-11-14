from flask import Blueprint, jsonify,request,make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Admin, Centre, Vehicle, WasteCollection, WasteRequest
from sqlalchemy import func, desc
from . import adminroutes_bp


@adminroutes_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response



@adminroutes_bp.route('/vehicle-performance', methods=['GET'])
@jwt_required()
def get_vehicle_performance():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Nested query to get vehicle performance across centres
        vehicle_performance = db.session.query(
            Centre.centre_id,
            Centre.centre_name,
            Vehicle.vehicle_id,
            Vehicle.vehicle_type,
            func.count(WasteCollection.collection_id).label('total_collections'),
            func.sum(WasteCollection.collection_quantity).label('total_quantity'),
            func.avg(WasteCollection.collection_quantity).label('avg_quantity_per_collection')
        ).join(Vehicle, Vehicle.centre_id == Centre.centre_id)\
         .join(WasteRequest, WasteRequest.vehicle_id == Vehicle.vehicle_id)\
         .join(WasteCollection, WasteCollection.req_id == WasteRequest.req_id)\
         .group_by(Centre.centre_id, Vehicle.vehicle_id)\
         .order_by(desc('total_collections'))\
         .all()

        result = []
        for vp in vehicle_performance:
            result.append({
                'centre_id': vp.centre_id,
                'centre_name': vp.centre_name,
                'vehicle_id': vp.vehicle_id,
                'vehicle_type': vp.vehicle_type,
                'total_collections': vp.total_collections,
                'total_quantity': float(vp.total_quantity) if vp.total_quantity else 0,
                'avg_quantity_per_collection': float(vp.avg_quantity_per_collection) if vp.avg_quantity_per_collection else 0
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500