import os, io
from google.cloud import vision_v1
from google.cloud.vision_v1 import types
import pandas as pd 

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'modular-sign-308619-bb4843b1dbe7.json'

def get_labels(image):

    client = vision_v1.ImageAnnotatorClient()
    content = image.read()
   
    image = vision_v1.types.Image(content = content)
    response = client.label_detection(image = image, max_results = 40)

    labels = response.label_annotations
    label_data = pd.DataFrame(columns = ['description'])

    for label in labels:
        print(type(label))
        label_data = label_data.append(
            dict(
                description = label.description
            ), ignore_index = True
        )

    desc_column = label_data.loc[:,'description']
    label_ar = desc_column.values

    label_ar = label_ar[5:]
    label_list = label_ar.tolist()

    return label_list


