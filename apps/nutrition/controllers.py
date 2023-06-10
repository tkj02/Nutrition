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
        get_user_item_id_url = URL('get_user_item_id', signer=url_signer),
        update_edit_url = URL('update_edit', signer=url_signer),
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
@action('remove_food', method=["POST"])
@action.uses(db, auth.user)
def remove_food():
    entry_id = request.json.get("entry_id")
    db((db.plates.id == entry_id)).delete()
    return dict()

# Gets all entries in the plate for current user
@action("get_plate", method=["GET", "POST"])
@action.uses(db, auth.user)
def get_plate():
    rows = db(db.plates.created_by == auth.current_user.get('id')).select().as_list()
    return dict(rows=rows)

@action("get_user_item_id", method=["GET", "POST"])
@action.uses(db, auth.user)
def get_user_item_id():
    user_item_id = request.json.get("user_item_id")
    user_rows = db(db.plates.id == user_item_id).select(db.plates.quantity).as_list()
    return dict(user_rows=user_rows)

@action("update_edit", method=["GET", "POST"])
@action.uses(db, auth.user)
def update_edit():
    user_item_id = request.json.get("user_item_id")
    quantity = round(float(request.json.get("quantity")), 2)
    calories = str(round(float(request.json.get("calories")), 2))
    proteins = str(round(float(request.json.get("proteins")), 2))
    lipid_fat = str(round(float(request.json.get("lipid_fat")), 2))
    carbs = str(round(float(request.json.get("carbs")), 2))
    sugars = str(round(float(request.json.get("sugars")), 2))
    fiber = str(round(float(request.json.get("fiber")), 2))
    calcium = str(round(float(request.json.get("calcium")), 2))
    iron = str(round(float(request.json.get("iron")), 2))
    sodium = str(round(float(request.json.get("sodium")), 2))
    
    db(db.plates.id == user_item_id).update(
        quantity=quantity,
        calories=calories,
        proteins=proteins,
        lipid_fat=lipid_fat,
        carbs=carbs,
        sugars=sugars,
        fiber=fiber,
        calcium=calcium,
        iron=iron,
        sodium=sodium
    )
    
    return dict()

# Add new row to plate
@action('add_food', method=["GET", "POST"])
@action.uses(db, auth.user)
def add_food():
    food_name = request.json.get("food_name")
    quantity = round(float(request.json.get("quantity")), 2)
    calories = str(round(float(request.json.get("calories") * quantity), 2))
    proteins = str(round(float(request.json.get("proteins") * quantity), 2))
    lipid_fat = str(round(float(request.json.get("lipid_fat") * quantity), 2))
    carbs = str(round(float(request.json.get("carbs") * quantity), 2))
    sugars = str(round(float(request.json.get("sugars") * quantity), 2))
    fiber = str(round(float(request.json.get("fiber") * quantity), 2))
    calcium = str(round(float(request.json.get("calcium") * quantity), 2))
    iron = str(round(float(request.json.get("iron") * quantity), 2))
    sodium = str(round(float(request.json.get("sodium") * quantity), 2))
    
    db.plates.insert(
        food_name=food_name,
        quantity=quantity,
        calories=calories,
        proteins=proteins,
        lipid_fat=lipid_fat,
        carbs=carbs,
        sugars=sugars,
        fiber=fiber,
        calcium=calcium,
        iron=iron,
        sodium=sodium
    )
    
    plate_rows = db(db.plates.created_by == auth.current_user.get('id')).select().as_list()
    
    return dict(plate_rows=plate_rows)


@action('update_total', method=["GET", "POST"])
@action.uses(db, auth.user)
def update_total():
    plate_rows = db(db.plates.created_by == auth.current_user.get('id')).select().as_list()
    quantity, calories, proteins, lipid_fat, carbs, sugars, fiber, calcium, iron, sodium = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0

    for row in plate_rows:
        if isinstance(row, dict):
            # Calculation logic using row["quantity"], row["calories"], etc.
            quantity += round(float(row["quantity"]), 2)
            calories += round(float(row["calories"]), 2)
            proteins += round(float(row["proteins"]), 2)
            lipid_fat += round(float(row["lipid_fat"]), 2)
            carbs += round(float(row["carbs"]), 2)
            sugars += round(float(row["sugars"]), 2)
            fiber += round(float(row["fiber"]), 2)
            calcium += round(float(row["calcium"]), 2)
            iron += round(float(row["iron"]), 2)
            sodium += round(float(row["sodium"]), 2)
        else:
            # Handle non-dictionary row elements in the list
            print("Non-dictionary element found in the plate_rows list.")

    return dict(
        quantity=quantity,
        calories=calories,
        proteins=proteins,
        lipid_fat=lipid_fat,
        carbs=carbs,
        sugars=sugars,
        fiber=fiber,
        calcium=calcium,
        iron=iron,
        sodium=sodium
    )


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
    user_id = db(db.auth_user.username == username).select("id")[0]["_extra"]["id"];
    public_plate = db(db.plates.created_by == user_id).select().as_list()
    return dict(plate=public_plate)