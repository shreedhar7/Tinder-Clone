// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , EmailAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDq0fCYo8hCw4qxIqXpgYtiC7FPmJCxVJk",
  authDomain: "tinder-clone-f5511.firebaseapp.com",
  projectId: "tinder-clone-f5511",
  storageBucket: "tinder-clone-f5511.firebasestorage.app",
  messagingSenderId: "409150403199",
  appId: "1:409150403199:web:289e4a3c4f1057cadc054a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const  auth = getAuth(app);
const provider = new EmailAuthProvider();

export {app , auth , provider};