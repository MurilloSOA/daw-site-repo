import React, { useContext } from "react";
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";

import AuthContext from "../../contexts/AuthContext";

import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    function logOff(){
        context.token = null;
        toast.success("Deu bom o logoff")
        navigate("/");
    }

    console.log(context)
    return (
        <header className="header__main">
            <p className="header__main-logo">MyGameReviews</p>
            <nav className="header__nav-main">
                <ul className="header__nav-list">
                    <li className="header__nav-link"><NavLink to="/">Home</NavLink></li>
                    <li className="header__nav-link"><NavLink to="/games">Games</NavLink></li>
                </ul>
            </nav>
            {
                context.token
                ? 
                <div className="header__main-profile">
                    <button onClick={logOff}>Deu bom</button>
                </div>
                : 
                <div className="header__main-profile">
                    <Link to="/login" className="header__nav-login">Login</Link>
                </div>
            }
            
        </header>
    );
};

export default Navbar;