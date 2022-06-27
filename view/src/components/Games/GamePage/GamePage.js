import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Switch from "react-switch";

import { server } from "../../../constants";
import AuthContext from "../../../contexts/AuthContext";
import UserIDContext from "../../../contexts/UserIDContext";

import "./GamePage.css";

function GamePage(){

    const context = useContext(AuthContext);
    const userContext = useContext(UserIDContext);
    const navigate = useNavigate();

    let { gameId } = useParams();

    //const userId = document.querySelector(".header__main-message").id;
    const [checked, setChecked] = useState(false);
    const [gameData, setGameData] = useState({});
    const [gameDeveloper, setGameDeveloper] = useState({});
    const [reviews, setReviews] = useState([]);
    const [userReviewed, setUserReviewed] = useState(false);

    useEffect(() => {
        console.log(userContext.userId);
        findGameInfo(gameId);
        findGameReviews(gameId);
        // eslint-disable-next-line
    },[])

    function handleSwitchChange(){
        if(checked)
            setChecked(false)
        else
            setChecked(true)
    }

    function findGameInfo(gameId){
        fetch(server + "/games/"+gameId,{
            method: "GET",
            headers: {
                'Accept':'applicaiton/json'
            }
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                setGameData(res);
                setGameDeveloper(res.developer);
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

    function findGameReviews(gameId){
        let url = new URL(server+"/reviews");
        let params = {gameId: gameId}
        url.search = new URLSearchParams(params).toString();

        fetch(url,{
            method: "GET",
            headers: {
                'Accept':'applicaiton/json'
            }
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                if(context.token !== "null" && context.token){
                    //eslint-disable-next-line
                    if(res.find(o => o.userId == userContext.userId) !== undefined){
                        setUserReviewed(true);
                    }
                        
                }
                setReviews(res);
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+ error);
        })
    }

    function handleScoreInput(event){
        event.target.value = removeLetra(event.target.value);
    }

    function removeLetra(value){
        value = value.replace(/[^0-9.]/g, '');
        return value;
    }

    function createReview(_comment,score,recommendation,userId,gameId){
        fetch(server+"/reviews",{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify({
                comment: _comment,
                score: score,
                recommendation: recommendation,
                userId: userId,
                gameId: gameId
            })
        })
        .then(res => res.json())
        .then((res) => {
            if(!res.error){
                toast.success("Review created successfully.");
                setUserReviewed(true)
                navigate("/");
            }
            else throw res.error;
        })
        .catch((error) => {
            toast.error("Error: "+error)
        })
    }

    function validateReviewForm(score){
        let valid = true;

        if(score.value === ""){
            toast.error("Score can't be null");
            score.classList.add("input-warning");
            valid = false;
        }   else {
            if(score.value < 0 || score.value > 5){
                toast.error("Score can't be less than 0 or more than 5");
                score.classList.add("input-warning");
                valid = false
            }
        }

        return valid;
    }

    function handleReview(event){
        event.preventDefault();

        let comment = document.getElementById("inputReviewComment");
        let score = document.getElementById("inputReviewScore");

        let valid = validateReviewForm(score);
        if(!valid) return;

        //eslint-disable-next-line
        if(comment.value.trim() == 0){
            createReview("No comment was provided",score.value,checked,userContext.userId,gameId)
        }   else {
            createReview(comment.value,score.value,checked,userContext.userId,gameId)

        }
    }

    return (
        <main>
            <section className="gamepage__main">
                <div className="gamepage__main-gameInfo-title">{gameData.name}</div>
                <div className="gamepage__main-gameInfo">
                    <div className="gamepage__main-gameInfo-description">{gameData.description}</div>
                    <div className="gamepage__main-gameInfo-developer">{gameDeveloper.name}</div>
                    <div className="gamepage__main-gameInfo-launchDate">{gameData.launchDate}</div>
                </div>
                {
                    context.token !== "null" && context.token && !userReviewed &&
                    <form className="gamepage__main-review-box">
                        <input className="gamepage__main-review-box-score" id="inputReviewScore" onInput={handleScoreInput} type="number" min="0" max="5" step="0.1"/>
                        <Switch className="gamepage__main-review-box-switch" onChange={handleSwitchChange} checked={checked} onColor={'#43793e'} offColor={'#793e3e'} checkedIcon={false} uncheckedIcon={false}></Switch>
                        <textarea className="gamepage__main-review-box-comment" id="inputReviewComment" placeholder="Type in your comment here..."/>
                        <button className="gamepage__main-review-box-button" onClick={handleReview}>Submit Review</button>
                    </form>
                    
                }
                <div className="gamepage__main-reviews-title">Reviews</div>
                <div className="gamepage__main-reviews">
                    {
                        reviews && reviews.map((element) => {
                            return (
                                <div className="gamepage__main-review-item" key={element.id} id={"review-"+element.id}>
                                    <div className={"gamepage__main-review-rec "+ (element.recommendation ? "background__rec" : "background__not")}></div>
                                    <div className="gamepage__main-review-username">{element.user.username}</div>
                                    <div className="gamepage__main-review-score">{element.score.toFixed(1)}</div>
                                    <div className="gamepage__main-review-comment">{element.comment}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </main>
    )

}

export default GamePage;