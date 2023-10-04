import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const globalScores = collection(db, "tenzi-scores");
