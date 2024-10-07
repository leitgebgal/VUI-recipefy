import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAwAoWWf4l3_rkYh_o3GD4U8d6rrXI-_Vo",
    authDomain: "recipeblog-3e02e.firebaseapp.com",
    projectId: "recipeblog-3e02e",
    storageBucket: "recipeblog-3e02e.appspot.com",
    messagingSenderId: "902661832620",
    appId: "1:902661832620:web:c02ca80056a1dbafdc0409",
    measurementId: "G-L295H3VJL8"
};

// init firebase
const app = initializeApp(firebaseConfig);

// init firestore service
export const db = getFirestore(app);

//init firebase auth
export const auth = getAuth(app);

// init firebase storage
export const storage = getStorage(app);