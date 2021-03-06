import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { Provider } from "react-redux";
import Store from "./redux/store";

const firebaseConfig = {
  apiKey: "AIzaSyAtEkILsi7zHyMGbZpTQhFDmBUysQf7v6A",
  authDomain: "petune-cookie.firebaseapp.com",
  projectId: "petune-cookie",
  storageBucket: "petune-cookie.appspot.com",
  messagingSenderId: "964001051056",
  appId: "1:964001051056:web:fb6c1ee853d8cbd5afe675",
  measurementId: "G-LTYSBVCH54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App db={db} storage={storage} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
