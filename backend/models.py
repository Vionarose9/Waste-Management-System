from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(100), nullable=False)
    landmark = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    centre_id = db.Column(db.Integer, db.ForeignKey('centre.centre_id'), nullable=False)
    
    # Relationships
    phone_numbers = db.relationship('UserPhoneNumber', backref='user', lazy=True)
    waste_requests = db.relationship('WasteRequest', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.user_id}>'

class UserPhoneNumber(db.Model):
    __tablename__ = 'user_phone_number'
    user_id = db.Column(db.String(50), db.ForeignKey('user.user_id'), primary_key=True)
    phone_number = db.Column(db.String(15), nullable=False)

    def __repr__(self):
        return f'<UserPhoneNumber {self.user_id}>'

class Centre(db.Model):
    __tablename__ = 'centre'
    centre_id = db.Column(db.Integer, primary_key=True)
    centre_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    
    # Relationships
    admins = db.relationship('Admin', backref='centre', lazy=True)
    vehicles = db.relationship('Vehicle', backref='centre', lazy=True)
    users = db.relationship('User', backref='centre', lazy=True)

    def __repr__(self):
        return f'<Centre {self.centre_name}>'

class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.String(50), primary_key=True)
    admin_name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    centre_id = db.Column(db.Integer, db.ForeignKey('centre.centre_id'), nullable=False)
    
    # Relationships
    waste_requests = db.relationship('WasteRequest', backref='admin', lazy=True)
    analysis_reports = db.relationship('AnalysisReport', backref='admin', lazy=True)

    def __repr__(self):
        return f'<Admin {self.admin_name}>'

class Vehicle(db.Model):
    __tablename__ = 'vehicle'
    vehicle_id = db.Column(db.String(50), primary_key=True)
    vehicle_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    centre_id = db.Column(db.Integer, db.ForeignKey('centre.centre_id'), nullable=False)
    
    # Relationships
    waste_requests = db.relationship('WasteRequest', backref='vehicle', lazy=True)

    def __repr__(self):
        return f'<Vehicle {self.vehicle_id}>'

class WasteRequest(db.Model):
    __tablename__ = 'waste_request'
    req_id = db.Column(db.String(50), primary_key=True)
    req_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    waste_type = db.Column(db.String(50), nullable=False)
    admin_id = db.Column(db.String(50), db.ForeignKey('admin.admin_id'), nullable=False)
    vehicle_id = db.Column(db.String(50), db.ForeignKey('vehicle.vehicle_id'), nullable=True)
    user_id = db.Column(db.String(50), db.ForeignKey('user.user_id'), nullable=False)
    notification = db.Column(db.Boolean, default=True)
    
    # Relationships
    waste_collection = db.relationship('WasteCollection', backref='waste_request', lazy=True, uselist=False)

    def __repr__(self):
        return f'<WasteRequest {self.req_id}>'

class WasteCollection(db.Model):
    __tablename__ = 'waste_collection'
    collection_id = db.Column(db.String(50), primary_key=True)
    req_id = db.Column(db.String(50), db.ForeignKey('waste_request.req_id'), nullable=False)
    collection_quantity = db.Column(db.Float, nullable=False)
    collection_date = db.Column(db.DateTime, nullable=False)
    report_id = db.Column(db.String(50), db.ForeignKey('analysis_report.report_id'), nullable=False)

    def __repr__(self):
        return f'<WasteCollection {self.collection_id}>'

class AnalysisReport(db.Model):
    __tablename__ = 'analysis_report'
    report_id = db.Column(db.String(50), primary_key=True)
    wet_waste_qty = db.Column(db.Float, nullable=False)
    biodegradable_waste = db.Column(db.Float, nullable=False)
    nonbiodegradable_waste = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    admin_id = db.Column(db.String(50), db.ForeignKey('admin.admin_id'), nullable=False)
    
    # Relationships
    waste_collections = db.relationship('WasteCollection', backref='analysis_report', lazy=True)

    def __repr__(self):
        return f'<AnalysisReport {self.report_id}>'