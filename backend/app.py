from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import pymongo
from bson.json_util import dumps

app = Flask(__name__)
CORS(app)
# Replace this with your username
MONGO_USER = 'ngowda'
uri = 'mongodb+srv://{}:faceme1234@cluster0.w5elw.mongodb.net/test?retryWrites=true&w=majority'.format(MONGO_USER)
print(uri)
client = pymongo.MongoClient(uri)
db = client.get_database('faceme')
users_collection = db['users']
faces_collections = db['faces']

def get_labels(img):
    return ["black hair", "glasses", "freckles"]


@app.route('/api/items')
def get_items():
    # get data from mongodb
    query = faces_collections.find()
    faces = []
    for face in query:
        faces.append(face)
    return dumps(faces), 200

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "No Image", 400

    image = request.files['image']
    data = dict(request.form)
    print(data)
    print(data["img_url"][0])
    url = data['img_url'][0]
    filename = secure_filename(image.filename)
    #  mimetype = image.mimetype
    ## DO STUFF WITH IMAGE HERE, CALL FUNCTIONS
    obj = {
        'uid': 1,
        'filename': filename,
        'labels': ['black hair', 'glasses', 'frekles'],
        'imageUrl': url,
    }
    print(obj)
    return json.dumps(obj), 200

@app.route('/api/submit_face', methods=['POST'])
def submit_face():
    data = dict(request.form)
    print('POST', data)
    labels = data['labels']
    #labels = json.loads(data['labels'])
    label = []
    for string_label  in labels:
        string_label = string_label.replace(']', '')
        string_label = string_label.replace('[', '')
        string_label = string_label.replace('\"', '')
        label = string_label.split(',')
    data['labels'] = label
    #faces_collections.insert_one(obj)
    return dumps(data), 200


if __name__ == "__main__":
    # Quick test configuration. Please use proper Flask configuration options
    # in production settings, and use a separate file or environment variables
    # to manage the secret key!
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.debug = True
    app.run()