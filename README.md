# Faceme - AstraZeneca Neurodiversity Hack
Assisting individuals with Prosopagnosia using label detection and facial recognition

Individuals with Prosopagnosia often experience that "it's on the tip of my tongue!" feeling when they can't connect a name to a face and have to focus on anothers facial feautures to remember them. Faceme's goal is remedy this issue. With the power of AI, when a user uploads an image of a person, the app provides a set of facial features for the image and then prompts the user to give a name. Then, users can filter saved images by searching by features and can view the name of the person.

## Website Architecture
### Backend
 - Python & Flask
    - User authentication with JSON Web Tokens
 - MongoDB
 - Firebase
    - Image storage
 - Google Cloud Vision API
### Frontend
 - TypeScript/React
 - Redux State Management
 - Material UI
 - Yarn
## Setup
### Backend
Create a virtual environment and download the necessary dependencies
by running ```pip install -r requirements.txt``` then start the server with ```python app.py```
### Frontend
With npm, if yarn is not installed, run ```npm install --global yarn``` 
then run ```yarn install``` to download the dependencies and run ```yarn start``` to start the frontend web server
