import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login({signUp,isSigningUp}){
    
    return(
        <div className="login">
            <h1>{isSigningUp?"Sign up":"Log in"}</h1>
            <form className="login--form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password"/>
                {isSigningUp && <input type="password" placeholder="Confirm Password"/>}
                <button>{isSigningUp?"Sign up":"Log in"}</button>
            </form>
            <p>{isSigningUp?"Already have an account?":"Don't have an account?"} <a onClick={signUp} href="#">{isSigningUp?"Log in":"Sign up"}</a></p>
            
        </div>
        )
}