from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_username
from py4web.utils.form import Form, FormStyleBulma
from .settings import APP_FOLDER
import json, os

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth.user, url_signer)
def index():
    
    filename = os.path.join(APP_FOLDER, "data", "FoodData.json")
    # Load the JSON data from the file
    with open(filename, 'r') as file:
        json_data = json.load(file)
    
    return dict(
        get_plate_url = URL('get_plate', signer=url_signer),
        add_food_url = URL('add_food', signer=url_signer),
        view_info_url = URL('view_info', signer=url_signer),
        remove_entry_url = URL('remove_entry', signer=url_signer),
        update_total_url = URL('update_total', signer=url_signer),
        make_plate_public_url = URL('make_plate_public', signer=url_signer),
        make_plate_private_url = URL('make_plate_private', signer=url_signer),
        check_privacy_url = URL('check_privacy', signer=url_signer),
        get_public_users_url = URL('get_public_users', signer=url_signer),
        get_public_plate_url = URL('get_public_plate', signer=url_signer),
        url_signer=url_signer
    )

@action('get_food_data')
@action.uses(auth.user)
def get_food_data():
    filename = os.path.join(APP_FOLDER, "data", "FoodData.json")
    with open(filename, 'r') as file:
        json_data = json.load(file)
    return json_data

# Removes an entry from current user's plate
@action("remove_entry", method=["GET", "POST"])
@action.uses(db, auth.user)
def remove_entry():
    db(db.plate.id == request.json.get("entry_id")).delete()
    plate_rows = db(db.plate.created_by == auth.current_user.get('id')).select()
    return dict(plate_rows=plate_rows)

# Gets all entries in the plate for current user
@action("get_plate")
@action.uses(db, auth.user)
def get_plate():
    rows = db(db.plate.created_by == auth.current_user.get('id')).select().as_list()
    return dict(rows=rows)

# Add new row to plate
@action('add_food', method=["GET", "POST"])
@action.uses(db, auth.user)
def add_food():
    food_name = request.json.get("food_name")
    quantity = request.json.get("quantity")
    calories = 10  # Change to be proportional to actual calories with respect to quantity
    #print(get_username(), food_name, quantity, calories)
    try:
        db.plate.insert(
            food_name=food_name,
            quantity=quantity,
            calories=calories
        )
        print("Data inserted successfully into the plate table.")
    except Exception as e:
        print(f"Error inserting row into plate table: {e}")
    
    plate_rows = db(db.plate).select().as_list()
    return dict(plate_rows=plate_rows)


@action('update_total', method=["GET", "POST"])
@action.uses(db, auth.user)
def update_total():
    plate_rows = request.json.get("plate")
    quantity, calories, proteins, lipid_fat, carbs, sugars, fiber, calcium, iron, sodium = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

    for row in plate_rows:
        if isinstance(row, dict):
            if "quantity" in row:
                quantity += float(row["quantity"])
                calories += float(row["calories"])
                proteins += float(row["proteins"])
                lipid_fat += float(row["lipid_fat"])
                carbs += float(row["carbs"])
                sugars += float(row["sugars"])
                fiber += float(row["fiber"])
                calcium += float(row["calcium"])
                iron += float(row["iron"])
                sodium += float(row["sodium"])
            else:
                # Handle missing "quantity" key in the row dictionary
                print("Missing 'quantity' key in a row dictionary.")
        else:
            # Handle non-dictionary row elements in the list
            print("Non-dictionary element found in the plate_rows list.")

    return dict(quantity=quantity, calories=calories, proteins=proteins, lipid_fat=lipid_fat, carbs=carbs,
                sugars=sugars, fiber=fiber, calcium=calcium, iron=iron, sodium=sodium)


@action('make_plate_public', method=["GET", "POST"])
@action.uses(db, auth.user)
def make_plate_public():
    db.public_plates.insert(user_id = auth.current_user.get('id'))
    return dict()

@action('make_plate_private', method=["GET", "POST"])
@action.uses(db, auth.user)
def make_plate_private():
    db(db.public_plates.user_id == auth.current_user.get('id')).delete();
    return dict()

@action('check_privacy', method=["GET", "POST"])
@action.uses(db, auth.user)
def check_privacy():
    status = 0
    query = db(db.public_plates.user_id == auth.current_user.get('id')).select()
    # User not in db, meaning they are private
    if len(query) == 0:
        status = 1
    return dict(status=status)

@action("get_public_users", method=["GET", "POST"])
@action.uses()
def get_public_users():
    rows = db(db.public_plates).select(db.public_plates.user_id).as_list()
    usernames = []
    for i in range(len(rows)):
        usernames.append(db(db.auth_user.id == rows[i]['user_id']).select(db.auth_user.username))
    return dict(rows=rows, usernames=usernames)

@action("get_public_plate", method=["GET", "POST"])
@action.uses(db, auth.user)
def get_public_plate():
    username = request.json.get("username")
    public_plate = db((db.auth_user.username == username) & (db.public_plates.user_id == db.auth_user.id)).select(
        db.plate.ALL).as_list()
    return dict(plate=public_plate)