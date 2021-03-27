from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import pymongo
from labelface import get_labels
from bson.json_util import dumps
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
from flask_jwt_extended import jwt_required

from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
app.secret_key = 'super secret key'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours':24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}


jwt = JWTManager(app)
bcrypt = Bcrypt(app)
# Replace this with your username
MONGO_USER = 'ngowda'
uri = 'mongodb+srv://{}:faceme1234@cluster0.w5elw.mongodb.net/test?retryWrites=true&w=majority'.format(MONGO_USER)
client = pymongo.MongoClient(uri)
db = client.get_database('faceme')
users_collection = db['users']
faces_collections = db['faces']

@app.route('/faces')
def get_items():
    # get data from mongodb
    query = faces_collections.find()
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
    print(data)
    print(data["img_url"][0])
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
    print(faces)
    return dumps(faces), 200

@app.route('/face_features', methods=['GET'])
def face_features():
    labels = faces_collections.distinct("labels")
    print(labels)
    return dumps(labels), 200

@app.route('/submit_face', methods=['POST'])
def submit_face():
    data = dict(request.form)
    print('POST', data)
    labels = data['labels']
    #labels = json.loads(data['labels'])
    labels = labels.split(',')
    label = []
    for string_label  in labels:
        string_label = string_label.replace(']', '')
        string_label = string_label.replace('[', '')
        string_label = string_label.replace('\"', '')
        label.append(string_label)
    data['labels'] = label
    data['user'] = 'nish.gowda6@gmail.com'
    print(data)
    faces_collections.insert_one(data)
    #faces_collections.insert_one(obj)
    return jsonify("Sucesfully submitted face"), 200

@app.route('/faces/<filename>')
def fetch_face(filename):
    print(filename)
    query_object = {'filename': filename}
    faces = faces_collections.find_one(query_object)
    print("FACES", faces)
    return dumps(faces), 200

@app.route('/face_facename/<face_name>')
def fetch_face_facename(face_name):
    print(face_name)
    query = {'faceName': face_name}
    faces = faces_collections.find_one(query)
    print("faces", faces)
    return dumps(faces), 200

@app.route("/verify_access_token", methods=["GET"])
@jwt_required()
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
    # Quick test configuration. Please use proper Flask configuration options
    # in production settings, and use a separate file or environment variables
    # to manage the secret key!

    app.debug = True
    app.run()