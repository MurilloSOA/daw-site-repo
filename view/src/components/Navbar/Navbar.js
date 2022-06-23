import React from "react";

import {
    Link,
    NavLink
} from "react-router-dom";

import "./Navbar.css";

function Navbar() {
    return (
        <header className="header__main">
            <p className="header__main-logo">MyGameReviews</p>
            <nav className="header__nav-main">
                <ul className="header__nav-list">
                    <li className="header__nav-link"><NavLink to="/">Home</NavLink></li>
                    <li className="header__nav-link"><NavLink to="/games">Games</NavLink></li>
                </ul>
            </nav>
            <div className="header__main-profile">
                <Link to="/login" className="header__nav-login">Login</Link>
            </div>
        </header>
    );
};

export default Navbar;