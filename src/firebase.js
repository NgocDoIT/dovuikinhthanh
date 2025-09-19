// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0X_5ycR6gcRPCFIRnmufLG3er48L1f8I",
  authDomain: "appconggiao-user-5cc72.firebaseapp.com",
  projectId: "appconggiao-user-5cc72",
  storageBucket: "appconggiao-user-5cc72.firebasestorage.app",
  messagingSenderId: "528047092598",
  appId: "1:528047092598:web:971b3e0abd91853937c057",
  measurementId: "G-6FK2JTJ84N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
