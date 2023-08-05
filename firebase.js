import { initializeApp } from "firebase/app";
import { getFirestore,collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbmLbI1u5jFeY09b05DjsurUMSr_NO31Q",
  authDomain: "react-notes-be537.firebaseapp.com",
  projectId: "react-notes-be537",
  storageBucket: "react-notes-be537.appspot.com",
  messagingSenderId: "806250104129",
  appId: "1:806250104129:web:d23badc72ac952b4f40dc0"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");