import React, { useContext, useState, useEffect } from 'react'

import "./style.css"
import { FiMoreVertical } from 'react-icons/fi'
import img from "../../assets/img/police.png"
import DataContext from '../../context/DataContext'
import apiRoutes from '../../api_routes'
import { Util, Notification } from '../../helpers/util'

const util = new Util();
const notif = new Notification();

export function UserCards({ setToggleAction, toggleAction, id, name, mail, rank, role, date }) {


    const { localData, decodedLocalData } = useContext(DataContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function showMoreAction(e) {
        let parent = e.target.parentElement;
        if (parent.className === "top") {
            let child = parent.querySelector(".more-cont");
            child.classList.toggle("show")
        }
    }

    function hideElem(e) {
        let parent = e.target.parentElement;
        parent.style.display = "none"
    }

    async function deleteOfficerAccount(officerId) {
        if (officerId === "") {
            return notif.error("officer id is empty")
        }
        let confirm;

        if (officerId === localData.id) {
            confirm = window.confirm("Are you sure you wanna delete your account?")
        }
        confirm = window.confirm("Are you sure you wanna delete this officer account?")

        if (confirm) {

            let options, url;
            try {
                url = apiRoutes.deleteOfficer;
                options = {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: localData.id,
                        officerId
                    })
                };
                setLoading(true);
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    return notif.error(data.message);
                }

                setLoading(false);
                notif.success(data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 1200);
            } catch (err) {
                setLoading(false);
                setError(err.message);
                notif.error(err.message);
            }

            return
        }
    }

    return (
        <div className="user-box">
            <div className="top">
                <img src={navigator.connection.downlink > 0.5 ? `https://avatars.dicebear.com/api/micah/${name}.svg` : img} alt="" className="img" />
                <div className="more-cont">
                    <li data-id={id} onClick={async (e) => {
                        let target = e.target.dataset.id;
                        await deleteOfficerAccount(target)
                        // hideElem(e)
                    }}>{loading ? "Deleting account" : "Delete"}</li>
                </div>
                <br />
                {
                    localData.role === "admin" ?
                        <FiMoreVertical className="icon" onClick={(e) => {
                            showMoreAction(e)
                            setToggleAction(!toggleAction)
                        }} />
                        :
                        localData.id === id ?
                            <FiMoreVertical className="icon" onClick={(e) => {
                                showMoreAction(e)
                                setToggleAction(!toggleAction)
                            }} />
                            :
                            ""
                }
                <p className="name">{name} {id === decodedLocalData.id ? (<kbd>you</kbd>) : (<kbd>others</kbd>)}</p>
                <small>{mail}</small>
                <div className="officer-type">
                    <div className="left">Type</div>
                    <div className="right">{rank.toUpperCase().length > 17 ? rank.toUpperCase().slice(0, 17) + "...." : rank.toUpperCase()}</div>
                </div>
            </div>
            <div className="bottom">
                <div className="box">
                    <small>Member since</small>
                    <h6>{date.split(",")[0]}</h6>
                </div>
            </div>
        </div>
    )
}