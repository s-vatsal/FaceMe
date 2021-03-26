from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import os
import pymongo

app = Flask(__name__)
CORS(app)
pword = "passowrd"
connection_url = 'mongodb+srv://nishgowda:' + pword + '@cluster0.w5elw.mongodb.net/faceme?retryWrites=true&w=majority'
print(connection_url)
client = pymongo.MongoClient(connection_url)
db = client.get_database('faceme')

@app.route('/api/items')
def get_items():
    # get data from mongodb
    data = []
    return data, 200

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "No Image", 400

    image = request.files['image']
    url = request.form['img_url']
    filename = secure_filename(image.filename)
    #  mimetype = image.mimetype
    ## DO STUFF WITH IMAGE HERE, CALL FUNCTIONS
    data = {
        'uid': 1,
        'filename': filename,
        'img_url': url,
    }
    db.faceme.insert_one(data)
    return json.dumps(data), 200

if __name__ == "__main__":
    # Quick test configuration. Please use proper Flask configuration options
    # in production settings, and use a separate file or environment variables
    # to manage the secret key!
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.debug = True
    app.run()