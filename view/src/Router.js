import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./components/Home/Home";
import Games from "./components/Games/Games";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/games" element={<Games/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;