from flask import Flask, render_template, request, jsonify  # Important libraries required for my api to work
from math import ceil  # I have imported the ceil function from the math library to allow my pagination to work


app = Flask(__name__)

'''
This is my data dictionary database that holds all the user data for my api
I have based all my code on the same functionality used for Reqres.in
'''
user_data = [
    {"id": 1, "email": "george.bluth@reqres.in", "first_name": "George", "last_name": "Bluth", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"},
    {"id": 2, "email": "janet.weaver@reqres.in", "first_name": "Janet", "last_name": "Weaver", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"},
    {"id": 3, "email": "emma.wong@reqres.in", "first_name": "Emma", "last_name": "Wong", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"},
    {"id": 4, "email": "eve.holt@reqres.in", "first_name": "Eve", "last_name": "Holt", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"},
    {"id": 5, "email": "charles.morris@reqres.in", "first_name": "Charles", "last_name": "Morris", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"},
    {"id": 6, "email": "tracey.ramos@reqres.in", "first_name": "Tracey", "last_name": "Ramos", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"},
    {"id": 7, "email": "michael.lawson@reqres.in", "first_name": "Michael", "last_name": "Lawson", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"},
    {"id": 8, "email": "lindsay.ferguson@reqres.in", "first_name": "Lindsay", "last_name": "Ferguson", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"},
    {"id": 9, "email": "tobias.funke@reqres.in", "first_name": "Tobias", "last_name": "Funke", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"},
    {"id": 10, "email": "byron.fields@reqres.in", "first_name": "Byron", "last_name": "Fields", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"},
    {"id": 11, "email": "george.edwards@reqres.in", "first_name": "George", "last_name": "Edwards", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"},
    {"id": 12, "email": "rachel.howell@reqres.in", "first_name": "Rachel", "last_name": "Howell", "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"}
]


per_page = 6  # Max items per page variable


@app.route('/')  # This is the initial route that renders the html page
def index():
    return render_template('index.html')


@app.route('/api/users/', methods=['GET'])  # This is the get users api caller
def get_users():
    page = request.args.get('page', default=1, type=int)  # This checks for a get parameter called 'page'

    i = (page - 1) * per_page  # index
    data = user_data[i:i+per_page]  # between

    return {
        "page": page,  # Current Page Number
        "per_page": per_page,  # Utilises the variable at the start
        "total": len(user_data),  # Gets the total entries in the dictionary
        "total_pages": int(ceil(len(user_data) / per_page)),
        "data": data  # new data format
    }


@app.route('/api/users', methods=['POST'])
def new_user():
    input_data = request.get_json()  # get all submitted input data

    if len(user_data) == 0:  # check if user dictionary empty
        next_iteration = 1
    else:
        next_iteration = user_data[-1]["id"] + 1  # gets last iteration from data dictionary and then +1

    user_entry = {
        "id": next_iteration,
        "email": input_data["email"],
        "first_name": input_data["first_name"],
        "last_name": input_data["last_name"],
        "avatar": input_data["avatar"],
    }

    user_data.append(user_entry)  # open up the data dictionary and add the new data in
    return jsonify(user_entry), 201  # specific status code


@app.route('/api/users/<int:user_id>', methods=['GET'])
def load_user(user_id):
    grab_user = [user for user in user_data if user["id"] == user_id]  # searches the data dictionary for user id match
    if grab_user:  # if user exists
        return jsonify(grab_user), 201  # specific status code
    else:  # if user doesn't exist
        return jsonify("User Not Found"), 404  # specific status code


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    grab_user = [user for user in user_data if user["id"] == user_id]  # searches the data dictionary for user id match
    if grab_user:  # if user exists
        i = user_data.index(grab_user[0])  # get the index of where the data is located in the dictionary

        data = request.get_json()

        user_data[i] = {
            "id": user_id,
            "email": data["email"],
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "avatar": data["avatar"],
        }

        return jsonify(user_data[i]), 200  # formats to json with specific response cde
    else:
        return jsonify("User Not Found"), 404


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    grab_user = [user for user in user_data if user["id"] == user_id]  # searches the data dictionary for user id match
    if grab_user:  # if user exists
        user_data.remove(grab_user[0])  # remove the entry from the data dictionary
        return jsonify({}), 204
    else:
        return jsonify("User Not Found"), 404


if __name__ == '__main__':
    app.run()
