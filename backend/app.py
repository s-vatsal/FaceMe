from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import pymongo
from labelface import get_labels
from bson.json_util import dumps
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
jwt = JWTManager(app)
# Replace this with your username
MONGO_URI = os.environ.get('MONGO_URI')
client = pymongo.MongoClient(MONGO_URI)
db = client.get_database('faceme')
users_collection = db['users']
faces_collections = db['faces']

@app.route('/faces')
@jwt_required
def get_items():
    user_data = users_collection.find_one(
    {"email": get_jwt_identity()})
    if (user_data is None):
        return jsonify(message="User not found"), 404
    # get data from mongodb
    query = faces_collections.find({'user': user_data['email']})
    faces = []
    for face in query:
        faces.append(face)
    return dumps(faces), 200

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "No Image", 400

    image = request.files['image']
    labels = get_labels(image)
    data = dict(request.form)
    url = data['img_url'][0]
    filename = secure_filename(image.filename)
    #  mimetype = image.mimetype
    ## DO STUFF WITH IMAGE HERE, CALL FUNCTIONS

    obj = {
        'filename': filename,
        'labels': labels,
        'imageUrl': url,
    }
    print(obj)
    return json.dumps(obj), 200

@app.route('/face_feature/<feature>', methods=["GET"])
def face_feature(feature):
    print("FEATUIRE", feature)
    query = {'labels': feature}
    query  = faces_collections.find(query)
    faces = []
    for face in query:
        faces.append(face)
    return dumps(faces), 200

@app.route('/face_features', methods=['GET'])
def face_features():
    labels = faces_collections.distinct("labels")
    return dumps(labels), 200

@app.route('/submit_face', methods=['POST'])
@jwt_required
def submit_face():
    user_data = users_collection.find_one({"email": get_jwt_identity()})
    if (user_data is None):
        return jsonify(message="User not found"), 404
    
    data = dict(request.form)
    labels = data['labels']
    labels = labels.split(',')
    label = []
    for string_label  in labels:
        string_label = string_label.replace(']', '')
        string_label = string_label.replace('[', '')
        string_label = string_label.replace('\"', '')
        label.append(string_label)
    data['labels'] = label
    data['user'] = user_data['email']
    faces_collections.insert_one(data)
    return jsonify("Sucesfully submitted face"), 200

@app.route('/faces/<filename>')
def fetch_face(filename):
    print(filename)
    query_object = {'filename': filename}
    faces = faces_collections.find_one(query_object)
    return dumps(faces), 200

@app.route('/face_facename/<face_name>')
def fetch_face_facename(face_name):
    print(face_name)
    query = {'faceName': face_name}
    faces = faces_collections.find_one(query)
    return dumps(faces), 200

@app.route("/verify_access_token", methods=["GET"])
@jwt_required
def verify_jwt():
    return jsonify(message="Good access token"), 200

@app.route("/register", methods=["POST"])
def register():
    req = request.get_json(force=True)
    email = req.get('email', None)
    username = req.get('username', None)

    if len(username) < 4 or len(username) > 16 or username.count(" ") > 0:
        return jsonify(message="bad username"), 409
    if users_collection.find_one({"email": email}):
        return jsonify(message="A user with that email already exists."), 409
    elif users_collection.find_one({'username': username}):
        return jsonify(message="A user with that username already exists."), 409
    else:
        password = req.get('password', None)
        if len(password) < 8 or len(password) > 128:
            return jsonify(message="bad password"), 409
        hashed = bcrypt.generate_password_hash(password)
        user_info = dict(email=email,
                         username=username,
                         password=hashed,
                         )
        users_collection.insert_one(user_info)
        return jsonify(message="User added successfully"), 201


@app.route("/login", methods=["POST"])
def login():
    req = request.get_json(force=True)
    email = req.get('email', None)
    password = req.get('password', None)

    account_data = users_collection.find_one({"email": email})
    if (account_data is not None) and bcrypt.check_password_hash(account_data["password"], password):
        access_token = create_access_token(identity=email, expires_delta=False)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401


if __name__ == "__main__":
    app.debug = True
    app.run()