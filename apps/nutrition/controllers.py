import datetime
import random

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_username
from py4web.utils.form import Form, FormStyleBulma

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth.user)
def index():
    plate_rows = db(db.plate.created_by == auth.current_user.get('id')).select()
    return dict(plate_rows=plate_rows, url_signer=url_signer)

