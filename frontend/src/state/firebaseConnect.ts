// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "webdevfinal-c9ede.firebaseapp.com",
  projectId: "webdevfinal-c9ede",
  storageBucket: "webdevfinal-c9ede.appspot.com",
  messagingSenderId: "122262973235",
  appId: "1:122262973235:web:241ccf0b96c5342b4e6c46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// auth.setPersistence({type: 'NONE'});
export default app;