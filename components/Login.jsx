import React from "react";
import { db, usersCollection } from "../api/firebase";
import { addDoc } from "firebase/firestore";
import { checkUserExists } from "../api/api";

export default function Login() {
  const [userdetails, setUserDetails] = React.useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [user, setUser] = React.useState();
  function change(event) {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }
  async function createUser(event) {
    event.preventDefault();
    if (await checkUserExists(userdetails.email)) {
      alert("User already exists");
      return;
    }
    if (userdetails.password !== userdetails.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await addDoc(usersCollection, userdetails);
      setUser(userCredential);
      alert("User created successfully");
    } catch (error) {
      alert("Error creating user");
      console.log(error);
    }
  }
  return (
    <div className="login">
      <form className="login--form">
        <input
          type="email"
          placeholder="Email address"
          name="email"
          onChange={change}
          value={userdetails.email}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={change}
          value={userdetails.password}
        />
        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          onChange={change}
          value={userdetails.confirmPassword}
        />
        <button onClick={(event) => createUser(event)}>Sign up</button>
      </form>
      <div className="form--footer">
        <p>
          Already have an account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
}
