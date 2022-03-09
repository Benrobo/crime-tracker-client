import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { AiOutlineDashboard, AiOutlineUserSwitch, AiOutlineWarning } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { TiZoomOutline } from "react-icons/ti";
import DataContext from "../../context/DataContext";


function LeftNavbar({ active }) {
    const { localData, decodedLocalData } = useContext(DataContext);

    return (
        <div className="left-navbar-container">
            <div className="head">
                <h3>Logo</h3>
            </div>
            <br />
            <div className="list-cont">
                <Link
                    to={`/officer/dashboard/${localData.id}`}
                    className={active === "dashboard" ? "link active" : "link"}
                >
                    <AiOutlineDashboard className="icon" />
                    Dashboard
                </Link>
                <Link
                    to="/officer/assignCase"
                    className={active === "assignCase" ? "link active" : "link"}
                >
                    <RiErrorWarningLine className="icon" />
                    Assign Case
                </Link>
                <Link
                    to="/officer/viewCase"
                    className={active === "viewCase" ? "link active" : "link"}
                >
                    <RiErrorWarningLine className="icon" />
                    View Case
                </Link>
                <Link
                    to="/officer/users"
                    className={active === "users" ? "link active" : "link"}
                >
                    <FiUsers className="icon" />
                    Users
                </Link>
                <Link
                    to="/officer/suspects/add"
                    className={active === "addSuspects" ? "link active" : "link"}
                >
                    <AiOutlineUserSwitch className="icon" />
                    Add Suspects
                </Link>
                <Link
                    to="/officer/suspects"
                    className={active === "suspects" ? "link active" : "link"}
                >
                    <AiOutlineWarning className="icon" />
                    View Suspects
                </Link>
                <Link
                    to="/officer/addEvidence"
                    className={active === "addEvidence" ? "link active" : "link"}
                >
                    <RiErrorWarningLine className="icon" />
                    Add Evidence
                </Link>
                <Link
                    to="/officer/evidence"
                    className={active === "evidence" ? "link active" : "link"}
                >
                    <TiZoomOutline className="icon" />
                    Evidence
                </Link>
            </div>
        </div>
    );
}

export default LeftNavbar;
