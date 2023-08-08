import React from "react";
import { checkLoginExists } from "../api/api";

export default function Login({ signUp, isSigningUp }) {
  const SubmitInfo = async (e) => {
    e.preventDefault();
    console.log("submitLogin");
    const userResult = await checkLoginExists(e.target.username.value, e.target.password.value);
    alert(userResult? "Login successful" : "Login failed");
  };
  return (
    <div className="login" onSubmit={SubmitInfo}>
      <h1>{isSigningUp ? "Sign up" : "Log in"}</h1>
      <form className="login--form">
        <input name="username" type="text" placeholder="Username" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {isSigningUp && (
          <input
            name="confirm-password"
            type="password"
            placeholder="Confirm Password"
            required
          />
        )}
        <button>{isSigningUp ? "Sign up" : "Log in"}</button>
      </form>
      <p>
        {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <a onClick={signUp} href="#">
          {isSigningUp ? "Log in" : "Sign up"}
        </a>
      </p>
    </div>
  );
}
