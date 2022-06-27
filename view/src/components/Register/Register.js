import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import '../../constants';
import { server } from "../../constants";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    function validateRegisterForm(username,email,password,repassword){

        let valid = true

        // eslint-disable-next-line
        let emailRegExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

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
        }   else if(!email.value.match(emailRegExp)){
            toast.error("Email is invalid");
            email.classList.add("input-warning");
            valid = false;
        }

        if(password.value === ""){
            toast.error("Password is blank");
            password.classList.add("input-warning");
            valid = false;
        }
        else if(password.value.length < 8){
            toast.error("Password must be 8 characters or longer");
            password.classList.add("input-warning");
            valid = false;
        }
        else if(repassword.value === ""){
            toast.warning("Please retype your password")
            repassword.classList.add("input-attention");
            valid = false;
        }
        else {
            // eslint-disable-next-line eqeqeq
            if(password.value != repassword.value){
                toast.warning("Passwords do not match")
                password.classList.add("input-attention");
                repassword.classList.add("input-attention");
            }
        }

        return valid;
    }

    function sendRegister(username, email, password){
        
        fetch(server + '/users',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                profileId: 2
            })
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                toast.success("User "+res.username+" successfully created.");
                navigate("/",{replace: true});
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }


    function handleRegister(event){
        event.preventDefault();

        let username = document.querySelector("#register-username");
        let email = document.querySelector("#register-email");
        let password = document.querySelector("#register-password");
        let repassword = document.querySelector("#register-repassword");

        let valid = validateRegisterForm(username,email,password,repassword);
        if(!valid) return;

        sendRegister(username.value,email.value,password.value);
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