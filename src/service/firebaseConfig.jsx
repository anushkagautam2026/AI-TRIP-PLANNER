// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-ZUMHkkuUBo9_sNbtPPbdpn7pJmRHumA",
  authDomain: "ai-trip-planner-2d4e7.firebaseapp.com",
  projectId: "ai-trip-planner-2d4e7",
  storageBucket: "ai-trip-planner-2d4e7.firebasestorage.app",
  messagingSenderId: "69770417712",
  appId: "1:69770417712:web:0c669dca68788f382afff5",
  measurementId: "G-D9PSPC1N6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);