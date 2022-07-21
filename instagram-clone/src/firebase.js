import {getAuth,createUserWithEmailAndPassword ,signInWithEmailAndPassword ,onAuthStateChanged,signOut } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'

const firebaseApp = initializeApp({
    apiKey: "AIzaSyA3bfKoJaHmgqEj7-gBHHJ2kGID5ozNxZg",
    authDomain: "tiktok-clone-7a0a2.firebaseapp.com",
    projectId: "tiktok-clone-7a0a2",
    storageBucket: "tiktok-clone-7a0a2.appspot.com",
    messagingSenderId: "539259707635",
    appId: "1:539259707635:web:1bc23801320f64d6cf5786"
});

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { db, auth, storage ,signInWithEmailAndPassword ,createUserWithEmailAndPassword,onAuthStateChanged,signOut };

