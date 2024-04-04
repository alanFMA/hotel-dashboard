import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB7f3CkA4vA6UHOxzWPi7wsXD2qQtX8FdI",
  authDomain: "hotel-dashboard-30bf3.firebaseapp.com",
  projectId: "hotel-dashboard-30bf3",
  storageBucket: "hotel-dashboard-30bf3.appspot.com",
  messagingSenderId: "423996924728",
  appId: "1:423996924728:web:7c2aa12e86b82dcf4317cd",
  measurementId: "G-N1QWKN371N",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
