import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./components/Home/Home";
import Games from "./components/Games/Games";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/games" element={<Games/>}/>
                <Route  path="/" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;