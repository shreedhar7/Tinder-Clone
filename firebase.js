// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth/react-native";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDq0fCYo8hCw4qxIqXpgYtiC7FPmJCxVJk",
  authDomain: "tinder-clone-f5511.firebaseapp.com",
  projectId: "tinder-clone-f5511",
  storageBucket: "tinder-clone-f5511.firebasestorage.app",
  messagingSenderId: "409150403199",
  appId: "1:409150403199:web:289e4a3c4f1057cadc054a",
};

// Initialize Firebase
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (err) {
    console.log("Error initializing app:", err);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

const provider = new EmailAuthProvider();

export { app, auth , provider};
