// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrgw2qq2OTLifwE6lF1w-yA1Xxw_GnMF0",
  authDomain: "dexapp-8e56c.firebaseapp.com",
  projectId: "dexapp-8e56c",
  storageBucket: "dexapp-8e56c.firebasestorage.app",
  messagingSenderId: "7520014385",
  appId: "1:7520014385:web:85464eb5818db17eb5c510",
  measurementId: "G-GVM0JKHXDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, analytics, db };

