from .common import db, Field, auth
from pydal.validators import *

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_username():
    return auth.current_user.get('username') if auth.current_user else None

db.define_table(
    'plate',
    Field('food_name', requires=IS_NOT_EMPTY()),
    Field('quantity', requires=IS_NOT_EMPTY()),
    Field('calories', 'integer', requires=IS_NOT_EMPTY()),
    # other fields for each nutritional category
    auth.signature
)

db.define_table(
    'public_plates',
    Field('user_id', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id)),
    auth.signature
)

db.commit()
