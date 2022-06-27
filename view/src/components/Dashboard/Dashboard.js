import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "./Dashboard.css"

function Dashboard(){
    return (
        <main className="dashboard__main">
            <nav className="dashboard__nav">
                <ul className="dashboard__nav-list">
                    <NavLink to="developers"><li className="dashboard__nav-link">Developers</li></NavLink>
                    <NavLink to="games"><li className="dashboard__nav-link">Games</li></NavLink>
                    <NavLink to="profiles"><li className="dashboard__nav-link">Profiles</li></NavLink>
                    <NavLink to="users"><li className="dashboard__nav-link">Users</li></NavLink>
                </ul>
            </nav>
            <Outlet/>
        </main>
    )
}

export default Dashboard;