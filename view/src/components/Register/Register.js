import React from "react";
import { toast } from "react-toastify";

import "./Register.css";

function Register() {
    function validateRegisterForm(username,email,password,repassword){

        let valid = true
        // eslint-disable-next-line no-useless-escape

        // eslint-disable-next-line eqeqeq
        if(username.value.trim() == 0){
            toast.error("Username is blank.");
            username.classList.add("input-warning");
            valid = false;
        }

        // eslint-disable-next-line eqeqeq
        if(email.value.trim() == 0){
            toast.error("Email is blank");
            email.classList.add("input-warning");
            valid = false;
        }

        if(password.value === ""){
            toast.error("Password is blank");
            password.classList.add("input-warning");
            valid = false;
        }   else if(repassword.value === ""){
            toast.warning("Please retype your password")
            repassword.classList.add("input-attention");
            valid = false;
        }   else {
            // eslint-disable-next-line eqeqeq
            if(password.value != repassword.value){
                toast.warning("Passwords do not match")
                password.classList.add("input-attention");
                repassword.classList.add("input-attention");
            }
        }


        return valid;
    }


    function handleRegister(event){
        event.preventDefault();

        let username = document.querySelector("#register-username");
        let email = document.querySelector("#register-email");
        let password = document.querySelector("#register-password");
        let repassword = document.querySelector("#register-repassword");

        let valid = validateRegisterForm(username,email,password,repassword);
        if(!valid) return;

        toast.success("Fazer tratamento de registro aqui.");
    }

    function clearWarning(event){
        let target = event.target;

        if(target.classList.contains("input-warning"))
            target.classList.remove("input-warning");

        if(target.classList.contains("input-attention"))
            target.classList.remove("input-attention");
    }

    return (
        <>
            <header className="header__main">
                <a href="/" className="header__main-logo" style={{margin:"1em auto", textAlign: "center"}}>MyGameReviews</a>
            </header>
            <main>
                <div className="registerbox__main">
                    <form className="registerbox__form">
                        <legend className="registerbox__form-legend">Register</legend>
                            <div className="registerbox__form-fieldset-formgroup">
                                <input className="registerbox__form-fieldset-input" type="text" id="register-username" onFocus={clearWarning} name="register-username" placeholder="Username"/>
                            </div>
                            <div className="registerbox__form-fieldset-formgroup">
                                <input className="registerbox__form-fieldset-input" type="email" id="register-email" onFocus={clearWarning} name="register-email" placeholder="Email"/>
                            </div>
                            <div className="registerbox__form-fieldset-formgroup">
                                <input className="registerbox__form-fieldset-input" type="password" id="register-password" onFocus={clearWarning} name="register-password" placeholder="Password"/>
                            </div>
                            <div className="registerbox__form-fieldset-formgroup">
                                <input className="registerbox__form-fieldset-input" type="password" id="register-repassword" onFocus={clearWarning} name="register-repassword" placeholder="Retype Password"/>
                            </div>
                            <div className="registerbox__form-fieldset-formgroup">
                                <input className="registerbox__form-fieldset-button" type="submit" onClick={handleRegister} id="register-button" value="Register"/> 
                            </div>
                            <div className="registerbox__login">
                                <a href="/login" className="registerbox__login-link">Login</a>
                            </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;