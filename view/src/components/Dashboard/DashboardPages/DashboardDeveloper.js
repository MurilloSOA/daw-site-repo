import React from "react";

import "./DashboardPages.css";

function DashboardDeveloper(){
    return (
        <section className="dashboard__dev-main">
            <div className="dashboard__dev-create">
                <div className="dashboard__dev-subtitle">Create Developer</div>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <input type="text" className="dashboard__dev-inputCreate"/>
                    <button className="dashboard__dev-buttonCreate">Create</button>
                </div>
            </div>
            <div className="dashboard__dev-list">
                <div className="dashboard__dev-subtitle">Developer List</div>
                <div className="dashboard__dev-list-div">
                    <table className="dashboard__dev-list-table">
                        <thead className="dashboard__dev-list-tableHead">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </thead>
                        <tbody className="dashboard__dev-list-tableBody">

                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default DashboardDeveloper;