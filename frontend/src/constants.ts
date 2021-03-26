import firebase from 'firebase'
const apiUrl = "http://localhost:5000/api"

const firebaseConfig = {
    apiKey: "AIzaSyDNDTBgStrrOqIDXoqU5oxd2z3jU6TRsI8",
    authDomain: "faceme-93529.firebaseapp.com",
    projectId: "faceme-93529",
    storageBucket: "faceme-93529.appspot.com",
    messagingSenderId: "1007847687042",
    appId: "1:1007847687042:web:e1981a928887ecf249459b",
    measurementId: "G-6LDTZE98N4"
  }
  // Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()
const storage = firebase.storage()
export {
    apiUrl, firebase, storage
};