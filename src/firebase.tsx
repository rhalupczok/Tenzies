import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCiGsbSXjUPTJSUBGicG_ngF0evwjMiaAs",
    authDomain: "tenzi-scores.firebaseapp.com",
    projectId: "tenzi-scores",
    storageBucket: "tenzi-scores.appspot.com",
    messagingSenderId: "479399287541",
    appId: "1:479399287541:web:ec1e2996fd810e453983bc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const globalScores = collection(db, "tenzi-scores");
