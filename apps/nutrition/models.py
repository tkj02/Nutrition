from .common import db, Field, auth
from pydal.validators import *

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_username():
    return auth.current_user.get('username') if auth.current_user else None

db.define_table(
    'plate',
    Field('food_name', 'string', requires=IS_NOT_EMPTY()),
    Field('quantity', requires=IS_NOT_EMPTY()),
    Field('calories', 'float', requires=IS_NOT_EMPTY()),
    Field('proteins', 'float', requires=IS_NOT_EMPTY()),
    Field('lipid_fat', 'float', requires=IS_NOT_EMPTY()),
    Field('carbs', 'float', requires=IS_NOT_EMPTY()),
    Field('sugars', 'float', requires=IS_NOT_EMPTY()),
    Field('fiber', 'float', requires=IS_NOT_EMPTY()),
    Field('calcium', 'float', requires=IS_NOT_EMPTY()),
    Field('iron', 'float', requires=IS_NOT_EMPTY()),
    Field('sodium', 'float', requires=IS_NOT_EMPTY()),
    # other fields for each nutritional category
    auth.signature
)

db.define_table(
    'public_plates',
    Field('user_id', 'reference auth_user', requires=IS_IN_DB(db, db.auth_user.id)),
    auth.signature
)

db.commit()
