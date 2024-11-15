from flask import Blueprint, jsonify, request,make_response
from models import db, WasteRequest, Admin,Vehicle,WasteCollection,Centre
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from . import admin_notification_bp
from models import db, User, Admin, UserPhoneNumber
from sqlalchemy.orm import joinedload

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


@admin_notification_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Use joinedload to fetch related WasteCollection and User in a single query
        requests = WasteRequest.query.options(
            joinedload(WasteRequest.waste_collection),
            joinedload(WasteRequest.user)
        ).filter_by(admin_id=admin_id).all()
        
        request_data = []
        for request in requests:
            request_info = {
                'req_id': request.req_id,
                'req_date': request.req_date.isoformat(),
                'status': request.status,
                'waste_type': request.waste_type,
                'user': {
                    'user_id': request.user.user_id,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name
                },
                'collection': None
            }
            
            if request.waste_collection:
                request_info['collection'] = {
                    'collection_id': request.waste_collection.collection_id,
                    'collection_date': request.waste_collection.collection_date.isoformat(),
                    'collection_quantity': request.waste_collection.collection_quantity
                }
            
            request_data.append(request_info)
        
        return jsonify({
            'requests': request_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_notification_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        users = User.query.filter_by(centre_id=admin.centre_id).all()
        
        user_data = []
        for user in users:
            phone_number = UserPhoneNumber.query.filter_by(user_id=user.user_id).first()
            user_data.append({
                'user_id': user.user_id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'city': user.city,
                'street': user.street,
                'landmark': user.landmark,
                'phone_number': phone_number.phone_number if phone_number else None
            })
        
        return jsonify({
            'users': user_data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_notification_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Calculate total requests
        total_requests = WasteRequest.query.filter_by(admin_id=admin_id).count()

        # Calculate active vehicles
        active_vehicles = Vehicle.query.filter_by(centre_id=admin.centre_id, status='active').count()

        # Calculate collection rate
        total_collections = WasteCollection.query.join(WasteRequest).filter(WasteRequest.admin_id == admin_id).count()
        collection_rate = (total_collections / total_requests * 100) if total_requests > 0 else 0

        # Get total users
        total_users = User.query.filter_by(centre_id=admin.centre_id).count()

        # Get recent waste collections instead of waste requests
        recent_collections = WasteCollection.query.join(WasteRequest).filter(WasteRequest.admin_id == admin_id).order_by(WasteCollection.collection_date.desc()).limit(5).all()

        recent_collections_data = []
        for collection in recent_collections:
            recent_collections_data.append({
                'collection_id': collection.collection_id,
                'user': {
                    'first_name': collection.waste_request.user.first_name,
                    'last_name': collection.waste_request.user.last_name
                },
                'waste_type': collection.waste_request.waste_type,
                'collection_date': collection.collection_date.isoformat(),
                'collection_quantity': collection.collection_quantity
            })

        dashboard_data = {
            'totalRequests': total_requests,
            'activeVehicles': active_vehicles,
            'collectionRate': round(collection_rate, 2),
            'totalUsers': total_users,
            'recentCollections': recent_collections_data
        }

        return jsonify(dashboard_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import admin_notification_bp
from models import db, AnalysisReport, Admin, WasteCollection, WasteRequest
from sqlalchemy import func
from datetime import datetime

from flask import jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import admin_notification_bp
from models import db, AnalysisReport, Admin, WasteCollection, WasteRequest
from sqlalchemy import func
from datetime import datetime

@admin_notification_bp.route('/analysis', methods=['GET'])
@jwt_required()
def get_analysis_data():
    try:
        admin_id = get_jwt_identity()
        if not admin_id:
            return jsonify({'error': 'Invalid or expired token'}), 401

        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Populate AnalysisReport table
        try:
            populate_analysis_report(admin_id)
        except Exception as e:
            print(f"Error populating analysis report: {str(e)}")
            return jsonify({'error': str(e)}), 500

        # Aggregate data from AnalysisReport
        try:
            analysis_data = db.session.query(
                func.coalesce(func.sum(AnalysisReport.Household), 0).label('total_household'),
                func.coalesce(func.sum(AnalysisReport.Organic), 0).label('total_organic'),
                func.coalesce(func.sum(AnalysisReport.Recyclable), 0).label('total_recyclable')
            ).filter(AnalysisReport.admin_id == admin_id).first()

            return jsonify({
                'totalHousehold': float(analysis_data.total_household),
                'totalOrganic': float(analysis_data.total_organic),
                'totalRecyclable': float(analysis_data.total_recyclable)
            }), 200

        except Exception as e:
            print(f"Error querying analysis data: {str(e)}")
            return jsonify({'error': 'Error retrieving analysis data'}), 500

    except Exception as e:
        print(f"General error in analysis route: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def populate_analysis_report(admin_id):
    try:
        # Get all waste collections for the admin that don't have an analysis report
        collections_query = db.session.query(WasteCollection).join(
            WasteRequest,
            WasteCollection.req_id == WasteRequest.req_id
        ).filter(
            WasteRequest.admin_id == admin_id,
            ~WasteCollection.collection_id.in_(
                db.session.query(AnalysisReport.collection_id)
            )
        )
        
        collections = collections_query.all()
        
        if not collections:
            print("No new collections found to analyze")
            return

        for collection in collections:
            waste_request = WasteRequest.query.get(collection.req_id)
            if not waste_request:
                continue

            waste_type = waste_request.waste_type.lower()
            
          
            
            new_report = AnalysisReport(
                report_id=f"AR-{collection.collection_id}",
              
                Household=collection.collection_quantity if waste_type == 'household' else 0,
                Organic=collection.collection_quantity if waste_type == 'organic' else 0,
                Recyclable=collection.collection_quantity if waste_type == 'recyclable' else 0,
                date=datetime.utcnow(),
                admin_id=admin_id,
                collection_id=collection.collection_id
            )
            db.session.add(new_report)
        
        db.session.commit()
        print(f"Successfully added {len(collections)} new analysis reports")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in populate_analysis_report: {str(e)}")
        raise Exception(f"Failed to populate analysis report: {str(e)}")

@admin_notification_bp.route('/getnotif', methods=['GET', 'POST'])
@jwt_required()
def handle_notifications():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        print(f"JWT Identity: {admin_id}")
        if not admin:
            return jsonify({'error': 'Admin not found'}), 402

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
    
@admin_notification_bp.route('/data', methods=['GET'])
@jwt_required()
def get_admin_data():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404

        # Fetch the centre information
        centre = Centre.query.get(admin.centre_id)

        admin_data = {
            'admin_id': admin.admin_id,
            'admin_name': admin.admin_name,
            'centre_id': admin.centre_id,
            'centre_name': centre.centre_name if centre else 'Unknown',
            'centre_location': centre.location if centre else 'Unknown'
        }

        return jsonify(admin_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500