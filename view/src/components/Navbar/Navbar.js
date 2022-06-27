import React, { useContext, useEffect, useState } from "react";
import {
    Link,
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";

import { server } from "../../constants";
import AuthContext from "../../contexts/AuthContext";
import UserIDContext from "../../contexts/UserIDContext";

import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const userContext = useContext(UserIDContext);

    const [userData, setUserData] = useState({});

    useEffect(() => {
        if(context.token !== "null" && context.token) getUserData();
    //eslint-disable-next-line
    },[])

    function getUserData(){
        fetch(server + '/user/getUserData/'+ context.token,{
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                setUserData(res);
                userContext.userId = res.id;
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error on fetching userData")
        })
    }

    function logOff(){
        localStorage.setItem("userToken", null)
        context.token = null;
        toast.success("Logoff successful.")
        navigate("/");
    }

    return (
        <>
            <header className="header__main">
                <p className="header__main-logo">MyGameReviews</p>
                <nav className="header__nav-main">
                    <ul className="header__nav-list">
                        <li className="header__nav-link"><NavLink to="/">Home</NavLink></li>
                        <li className="header__nav-link"><NavLink to="/games">Games</NavLink></li>
                    </ul>
                </nav>
                {
                    context.token !== "null" && context.token
                    ? 
                    <div className="header__main-profile">
                        <p className="header__main-message" id={userData.id}>Hello, {userData.username}</p>
                        <button className="header__main-logout" onClick={logOff}>Logout</button>
                    </div>
                    : 
                    <div className="header__main-profile">
                        <Link to="/login" className="header__main-login">Login</Link>
                    </div>
                }
            </header>
            <Outlet/>
        </>

    );
};

export default Navbar;