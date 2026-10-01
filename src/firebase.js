import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgj145_ZX1oAej1RboZqpILo5npM5w060",
  authDomain: "react-crud-app-bf8cc.firebaseapp.com",
  projectId: "react-crud-app-bf8cc",
  storageBucket: "react-crud-app-bf8cc.firebasestorage.app",
  messagingSenderId: "253371775748",
  appId: "1:253371775748:web:3be8c0687c504443f5ee51",
  measurementId: "G-HH35XVQVWP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);