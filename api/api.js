import { db } from "./firebase";
import crypto from "crypto-js";
import { collection, getDoc, query, where } from "firebase/firestore";

export function getCollection(collectionName) {
    return collection(db, collectionName);
}

export function convertStringToHash(string){
    return crypto.SHA256(string).toString();
}

export function checkLoginExists(username, password){
    const usersCollection = getCollection("users");
    const hashed_password = convertStringToHash(password);
    const user = query(usersCollection,where("username", "==", "tapan")) //.where("password", "==", hashed_password)
    console.log(user)
    if(user.exists){
        return true;
    }
    return false;
}
