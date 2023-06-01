from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_username
from py4web.utils.form import Form, FormStyleBulma

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth.user, url_signer)
def index():
    plate_rows = db(db.plate.created_by == auth.current_user.get('id')).select()
    total_rows = db(db.total.created_by == auth.current_user.get('id')).select()
    return dict(
        plate_rows=plate_rows, 
        total_rows=total_rows,
        edit_entry_url = URL('edit_entry', signer=url_signer),
        remove_entry_url = URL('remove_entry', signer=url_signer),
        add_food_url = URL('add_food', signer=url_signer),
        view_info_url = URL('view_info', signer=url_signer),
        url_signer=url_signer
    )

# Edit a row in plate
@action('edit_entry', method=["GET", "POST"])
@action.uses(db, auth.user)
def edit_entry():
    return dict()

# Remove a row from plate
@action('remove_entry', method=["GET", "POST"])
@action.uses(db, auth.user)
def remove_entry():
    return dict()

# Add new row to plate
@action('add_food', method=["GET", "POST"])
@action.uses(db, auth.user)
def add_food():
    return dict()

# to be changed -- make new html page?
@action('view_info', method=["GET", "POST"])
@action.uses(db, auth.user)
def view_info():
    return dict()
