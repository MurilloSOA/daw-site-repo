import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import DashboardLoginAuth from "./components/Dashboard/Login/DashboardLoginAuth";
import DashboardLogin from "./components/Dashboard/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function Router({ token, setToken }){
    return (
        <BrowserRouter>
            <Routes>
                {/* Dashboard Routes */}
                <Route element={<DashboardLoginAuth token={ token }/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Route>
                <Route path="/dashboard/login" element={<DashboardLogin setToken={ setToken }/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/games" element={<Games/>}/>
                <Route path="/" element={<Home token={ token }/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;