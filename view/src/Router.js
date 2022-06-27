import React from "react";
import { BrowserRouter, Routes, Route, Outlet} from "react-router-dom";

import DashboardAuth from "./components/Dashboard/DashboardAuth";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import GamePage from "./components/Games/GamePage/GamePage";
import DashboardDeveloper from "./components/Dashboard/DashboardPages/DashboardDeveloper";
import DashboardGame from "./components/Dashboard/DashboardPages/DashboardGame";
import DashboardProfile from "./components/Dashboard/DashboardPages/DashboardProfile";
import DashboardUser from "./components/Dashboard/DashboardPages/DashboardUser";

function Router({ token, setToken }){
    return (
        <BrowserRouter>
            <Routes>
                {/* Dashboard Routes */}
                {/* <Route element={<DashboardAuth/>}> */}
                    <Route path="/dashboard" element={<Dashboard/>}>
                        <Route path="developers" element={<DashboardDeveloper/>}/>
                        <Route path="games" element={<DashboardGame/>}/>
                        <Route path="profiles" element={<DashboardProfile/>}/>
                        <Route path="users" element={<DashboardUser/>}/>
                    </Route>
                {/* </Route> */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route element={<Navbar/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/games" element={<Outlet/>}>
                        <Route path="" element={<Games/>}/>
                        <Route path=":gameId" element={<GamePage/>}/>
                    </Route>
                </Route>
                <Route path="*" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;