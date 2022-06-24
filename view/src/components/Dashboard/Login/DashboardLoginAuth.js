import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function DashboardLoginAuth({ token }){

    return token ? <Outlet/> : <Navigate to="/dashboard/login" replace/>;
}

export default DashboardLoginAuth;