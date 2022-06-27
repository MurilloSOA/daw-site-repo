import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../constants";

import "./Games.css";

function Games() {

    const navigate = useNavigate();

    useEffect(() => {
        findAllGames();
        // eslint-disable-next-line
    },[])

    function findAllGames(){
        fetch(server + '/games',{
            method: "GET",
            headers: {
                'Accept': 'application/json'
            },
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                res.forEach(element => {
                    addgameToList(element);
                });
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

    function addgameToList(item){
        let div = document.createElement("div");
                div.classList.add("games__main-gamelist-item");
                div.id = "gameId-" + item.id;
                div.addEventListener("click", () => {
                    navigate("/games/"+item.id);
                })
        
                let p = document.createElement("p");
                p.classList.add("games__main-gamelist-item-id");
                p.innerHTML = item.id;
        
                let p2 = document.createElement("p");
                p2.classList.add("games__main-gamelist-item-title");
                p2.innerHTML = item.name;

                let p3 = document.createElement("p");
                p3.classList.add("games__main-gamelist-item-launchdate");
                p3.innerHTML = item.launchDate;

                let p4 = document.createElement("p");
                p4.classList.add("games__main-gamelist-item-developer");
                p4.innerHTML = item.developer.name;
        
                div.append(p,p2,p3,p4);
                document.querySelector(".games__main-gamelist").appendChild(div);
    }

    return (
        <>
            <main className="games__main">
                <div className="games__main-gamelist">
                </div>
            </main>
        </>
    );
};

export default Games;