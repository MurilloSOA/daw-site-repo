import React from "react";
import Navbar from '../Navbar/Navbar';

import "./Home.css";

function Home() {

    return (
        <>
            <Navbar></Navbar>
            <main className="main">
                <section className="main__recent-games">
                    <p className="main__recent-title">Recently Added Games</p>
                </section>
                <section className="main__recent-reviews">
                    <p className="main__recent-title">Recent Reviews</p>
                    <div ></div>
                </section>
            </main>
        </>
    );
};

export default Home;