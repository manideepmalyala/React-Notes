import React from "react";
import { checkLoginExists, checkUserExists, createUser } from "../api/api";
import { Alert } from '@mui/material';

export default function Login({ setIsLoggedIn }) {
  const [userdetails, setUserDetails] = React.useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loginError, setLoginError] = React.useState(false);

  const [user, setUser] = React.useState();
  const [login, setLogin] = React.useState(true);
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
      alert("User already exists, please log in");
      return;
    }
    if (userdetails.password !== userdetails.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const userCredential = await createUser(userdetails);
    setUser(userCredential);
    setUserDetails({
      email: "",
      password: "",
      confirmPassword: ""
    });
    IsLoggingIn();
  }
  function IsLoggingIn() {
    setLogin(!login);
    setLoginError(false);
  }

  async function checkLoginIsValid(event) {
    event.preventDefault();
    const validLogin = await checkLoginExists(userdetails.email, userdetails.password);
    if (validLogin) {
      setIsLoggedIn(true);
    }
    else {
      setLoginError(true);
    }
  }

  return (
    <>
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
          {!login && <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={change}
            value={userdetails.confirmPassword}
          />}
          {login ? <button onClick={(event) => checkLoginIsValid(event)}>Log in</button> :
            <button onClick={(event) => UserCreation(event)}>Sign up</button>}
          <br />
          {loginError && <Alert variant="filled" severity="error" >Invalid login details</Alert>}
        </form>
        <div className="form--footer">
          {!login ? <p>
            Already have an account? <a href="#" onClick={IsLoggingIn}>Log in</a>
          </p> :
            <p>Don't have an account? <a href="#" onClick={IsLoggingIn}>Sign up</a></p>}
        </div>
      </div>
    </>
  );
}
