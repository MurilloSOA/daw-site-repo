import React, { useContext } from "react";
import { Outlet , useNavigate } from "react-router-dom";
import { server } from "../../constants";

import AuthContext from "../../contexts/AuthContext";

function DashboardAuth(){

    const context = useContext(AuthContext);
    const navigate = useNavigate();

    if(context.token){
        fetch(server + '/users/checkAdmin',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                token: context.token
            })
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.valid){
                navigate("/",{replace: true});
            }
        })    
    }

    return (
        <Outlet/>
    )
}

export default DashboardAuth;