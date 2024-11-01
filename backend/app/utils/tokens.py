import jwt
import datetime
from flask import current_app

def generate_token(user_id, is_admin=False):
    """
    Generate a JWT token for authentication
    
    :param user_id: ID of the user or admin
    :param is_admin: Boolean to indicate if the token is for an admin
    :return: JWT token
    """
    payload = {
        'user_id': user_id,
        'is_admin': is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(
            hours=current_app.config.get('JWT_EXPIRATION_DELTA', 24)
        )
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    """
    Decode and validate JWT token
    
    :param token: JWT token to decode
    :return: Decoded payload
    """
    try:
        payload = jwt.decode(
            token, 
            current_app.config['SECRET_KEY'], 
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')