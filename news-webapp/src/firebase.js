// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEr9M6rzRxJf-fjSzZFp2EV4oYSw5GY0U",
  authDomain: "news-app-caddf.firebaseapp.com",
  projectId: "news-app-caddf",
  storageBucket: "news-app-caddf.firebasestorage.app",
  messagingSenderId: "466544322783",
  appId: "1:466544322783:web:d6ca6f33addebc37d2e16a",
  measurementId: "G-K1KD3EHFJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;

if (typeof window !== 'undefined') {
  // Check if analytics is supported before initializing
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics };
