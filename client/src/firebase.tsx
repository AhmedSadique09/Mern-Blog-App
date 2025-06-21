// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5fd19.firebaseapp.com",
  projectId: "mern-blog-5fd19",
  storageBucket: "mern-blog-5fd19.firebasestorage.app",
  messagingSenderId: "850500145631",
  appId: "1:850500145631:web:16ec6acd487938252e746a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);