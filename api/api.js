import { db } from "./firebase";
import crypto from "crypto-js";
import { collection, getDocs, query, where } from "firebase/firestore";

export function getCollection(collectionName) {
  return collection(db, collectionName);
}

export function convertStringToHash(string) {
  return crypto.SHA256(string).toString();
}

export async function checkLoginExists(email, password) {
  const usersCollection = getCollection("users");
  const hashed_password = convertStringToHash(password);
  const q = query(
    usersCollection,
    where("email", "==", email),
    where("password", "==", password) // temp solution until hashed password is implemented
    // where("password", "==", hashed_password)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function checkUserExists(email) {
  const usersCollection = getCollection("users");
  const q = query(usersCollection, where("email", "==", email));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
