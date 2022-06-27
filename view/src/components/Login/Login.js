import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../constants";

import AuthContext from "../../contexts/AuthContext";

import "./Login.css";

function Login() {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    function doLogin(username,password){
        fetch(server + '/login',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                toast.success("Login successful.");
                localStorage.setItem("userToken",res.token);
                context.token = res.token;
                navigate("/",{replace: true});
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

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

        doLogin(username.value,password.value)
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