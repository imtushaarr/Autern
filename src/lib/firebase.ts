// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2pJD2xKbwgIK7R4zLLAnDr-QVWU7yPag",
  authDomain: "autern-ade24.firebaseapp.com",
  projectId: "autern-ade24",
  storageBucket: "autern-ade24.firebasestorage.app",
  messagingSenderId: "861060638025",
  appId: "1:861060638025:web:67c50eff7d59247e756698"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase app
export default app;
