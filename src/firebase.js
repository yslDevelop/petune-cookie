import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAtEkILsi7zHyMGbZpTQhFDmBUysQf7v6A",
  authDomain: "petune-cookie.firebaseapp.com",
  projectId: "petune-cookie",
  storageBucket: "petune-cookie.appspot.com",
  messagingSenderId: "964001051056",
  appId: "1:964001051056:web:fb6c1ee853d8cbd5afe675",
  measurementId: "G-LTYSBVCH54",
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

export default storage;
