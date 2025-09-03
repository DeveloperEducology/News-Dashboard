// Import the initializeApp function from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx2JVCtMkTJ-4avKf7MIzphK_r2h0xI6w",
  authDomain: "news-app-58828.firebaseapp.com",
  projectId: "news-app-58828",
  storageBucket: "news-app-58828.appspot.com",  // ✅ fixed
  messagingSenderId: "1088426103182",
  appId: "1:1088426103182:web:a9e9b5fd52f8716ea794df",
  measurementId: "G-7JK0Y75X13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize other Firebase services you need
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
