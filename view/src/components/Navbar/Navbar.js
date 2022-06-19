import React from "react";

import {
    NavLink
} from "react-router-dom";

function Navbar() {
    
    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/games">Games</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;