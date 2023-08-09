import React from "react";
import { checkUserExists, createUser } from "../api/api";

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

  async function UserCreation(event) {
    event.preventDefault();
    if (await checkUserExists(userdetails.email)) {
      alert("User already exists");
      return;
    }
    if (userdetails.password !== userdetails.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const userCredential = await createUser(userdetails);
    setUser(userCredential);
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
        <button onClick={(event) => UserCreation(event)}>Sign up</button>
      </form>
      <div className="form--footer">
        <p>
          Already have an account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
}
