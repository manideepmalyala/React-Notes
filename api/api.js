import { db } from "./firebase";
import crypto from "crypto-js";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Returns a reference to the Firestore collection with the given name.
 * @param {string} collectionName - The name of the collection to retrieve.
 * @returns {CollectionReference} A reference to the Firestore collection.
 */
export function getCollection(collectionName) {
  return collection(db, collectionName);
}

/**
 * Returns a hashed version of the given string using the SHA256 algorithm.
 * @param {string} string - The string to hash.
 * @returns {string} The hashed version of the string.
 */
export function convertStringToHash(string) {
  return crypto.SHA256(string).toString();
}

/**
 * Checks if a user with the given email and password exists in the database.
 * @param {string} email - The email of the user to check.
 * @param {string} password - The password of the user to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the user exists, false otherwise.
 */
export async function checkLoginExists(email, password) {
  const usersCollection = getCollection("users");
  const hashed_password = convertStringToHash(password);
  const q = query(
    usersCollection,
    where("email", "==", email),
    where("password", "==", hashed_password)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * Checks if a user with the given email exists in the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the user exists, false otherwise.
 */
export async function checkUserExists(email) {
  const usersCollection = getCollection("users");
  const q = query(usersCollection, where("email", "==", email));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * Creates a new user in the database with the given email and password.
 * @param {{email: string, password: string}} userdetails - An object containing the email and password of the user to create.
 * @returns {Promise<DocumentReference>} A Promise that resolves to the user's credentials if the user is created successfully.
 * @throws An error if there is a problem creating the user.
 */
export async function createUser(userdetails) {
  const usersCollection = getCollection("users");
  const hashed_password = convertStringToHash(userdetails.password);

  try {
    const userCredential = await addDoc(usersCollection, {
      email: userdetails.email,
      password: hashed_password,
      createdOn: Date.now(),
    });
    alert("User created successfully");
    return userCredential;
  } catch (ex) {
    alert("Error creating user", ex);
  }
}

// export async function getUserFilteredNotes(userid){
//   const notesCollection = getCollection("notes");
//   const q = query(notesCollection, where("userid", "==", userid));
//   const querySnapshot = await getDocs(q);
//   return querySnapshot;

// }

export async function getuserDocumentID(email){
  const usersCollection = getCollection("users");
  const q = query(usersCollection, where("email", "==",email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].id;
}