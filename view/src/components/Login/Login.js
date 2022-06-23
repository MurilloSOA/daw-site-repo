import React from "react";
import { toast } from "react-toastify";

import "./Login.css";

function Login() {
    function validateLoginForm(username,password){

        let valid = true

        // eslint-disable-next-line eqeqeq
        if(username.value.trim() == 0){
            toast.error("Username is blank.");
            username.classList.add("input-warning");
            valid = false;
        }

        if(password.value === ""){
            toast.error("Password is blank.");
            password.classList.add("input-warning");
            valid = false;
        }

        return valid;
    }


    function handleLogin(event){
        event.preventDefault();

        let username = document.querySelector("#login-username");
        let password = document.querySelector("#login-password");

        let valid = validateLoginForm(username,password);
        if(!valid) return;

        toast.success("Fazer tratamento do login aqui")
    }

    function clearWarning(event){
        let target = event.target;

        if(target.classList.contains("input-warning"))
            target.classList.remove("input-warning");
    }

    return (
        <>
            <header className="header__main">
                <a href="/" className="header__main-logo" style={{margin:"1em auto", textAlign: "center"}}>MyGameReviews</a>
            </header>
            <main>
                <div className="loginbox__main">
                    <form className="loginbox__form">
                        <legend className="loginbox__form-legend">Login</legend>
                            <div className="loginbox__form-fieldset-formgroup">
                                <input className="loginbox__form-fieldset-input" type="text" id="login-username" onFocus={clearWarning} name="login-username" placeholder="Username"/>
                            </div>
                            <div className="loginbox__form-fieldset-formgroup">
                                <input className="loginbox__form-fieldset-input" type="password" id="login-password" onFocus={clearWarning} name="login-password" placeholder="Password"/>
                            </div>
                            <div className="loginbox__form-fieldset-formgroup">
                                <input className="loginbox__form-fieldset-button" type="submit" onClick={handleLogin} id="login-button" value="Login"/> 
                            </div>
                            <div className="loginbox__register">
                                <a href="/register" className="loginbox__register-link">Register</a>
                            </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Login;