from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'  # Change _tablename_ to __tablename__
    user_id = db.Column(db.String(50), primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(100), nullable=False)
    landmark = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    centre_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):  # Change _repr_ to __repr__
        return f'<User {self.user_id}>'

class UserPhoneNumber(db.Model):
    __tablename__ = 'user_phone_number'  # Change _tablename_ to __tablename__
    user_id = db.Column(db.String(50), db.ForeignKey('user.user_id'), primary_key=True)
    phone_number = db.Column(db.String(15), nullable=False)

    def __repr__(self):  # Change _repr_ to __repr__
        return f'<UserPhoneNumber {self.user_id}>'
