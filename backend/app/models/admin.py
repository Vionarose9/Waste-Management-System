from .. import db
import datetime

class Admin(db.Model):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    last_login = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'admin_id': self.admin_id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name
        }