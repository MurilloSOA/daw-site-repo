import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../constants";

import "./Home.css";

function Home() {

    const navigate = useNavigate();

    useEffect(() => {
        findRecentGames();
        findRecentReviews();
        // eslint-disable-next-line
    },[])
    
    function findRecentGames(){
        fetch(server + '/game/findRecent',{
            method: "GET",
            headers: {
                'Accept': 'application/json'
            },
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                res.forEach(element => {
                    addGameToDiv(element);
                });
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

    function findRecentReviews(){
        fetch(server + '/reviews/findRecent',{
            method: "GET",
            headers: {
                'Accept': 'application/json'
            },
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                res.forEach(element => {
                    addReviewToDiv(element);
                });
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

    function addGameToDiv(item){
        let div = document.createElement("div");
        div.classList.add("main__recent-games-item");
        div.id = "gameId-" + item.id
        div.addEventListener("click", () => {
            navigate("/games/"+item.id)
        })

        let p = document.createElement("p");
        p.classList.add("main__recent-games-item-id");
        p.innerHTML = item.id;

        let p2 = document.createElement("p");
        p2.classList.add("main__recent-games-item-title");
        p2.innerHTML = item.name;

        div.append(p,p2);
        document.querySelector(".main__recent-games-table").appendChild(div);
    }

    function addReviewToDiv(item){
        let div = document.createElement("div");
        div.classList.add("main__recent-reviews-item");
        div.addEventListener("click", () => {
            navigate("/games/"+item.gameId)
        })

        let p = document.createElement("p");
        p.classList.add("main__recent-reviews-item-user");
        p.innerHTML = item.user.username;

        let p2 = document.createElement("p");
        p2.classList.add("main__recent-reviews-item-game");
        p2.innerHTML = item.game.name;

        let p3 = document.createElement("p");
        p3.classList.add("main__recent-reviews-item-score");
        p3.innerHTML = item.score;

        div.append(p,p2,p3);
        document.querySelector(".main__recent-reviews-table").appendChild(div);
    }

    return (
        <main className="main">
            <section className="main__recent-games">
                <p className="main__recent-title">Recently Added Games</p>
                <div className="main__recent-games-table">
                </div>
            </section>
            <section className="main__recent-reviews">
                <p className="main__recent-title">Recent Reviews</p>
                <div className="main__recent-reviews-table"></div>
            </section>
        </main>
    );
};

export default Home;