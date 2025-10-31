// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwvnRhl_FNFC5D9tqnBYM5ywrFkVQapuE",
  authDomain: "kfet-insa-cvl.firebaseapp.com",
  projectId: "kfet-insa-cvl",
  storageBucket: "kfet-insa-cvl.firebasestorage.app",
  messagingSenderId: "613049856597",
  appId: "1:613049856597:web:fcbd6240383b88eafadadc",
  measurementId: "G-M9Q08RCY91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);