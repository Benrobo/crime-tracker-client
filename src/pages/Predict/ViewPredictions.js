import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'
import { FiMoreVertical } from 'react-icons/fi'
import "./style.css"
import Layout from '../../components/Layout/Layout'
import img from "../../assets/img/police.png"
import DataContext from '../../context/DataContext'
import apiRoutes from '../../api_routes'
import { Util, Notification } from '../../helpers/util'

const util = new Util();
const notif = new Notification();


function ViewPredictions() {
    const [toggleAction, setToggleAction] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="viewPredictions" />
            <MainCont>
                <h4>View Predictions</h4>
                <hr />
                <br />
                <SuspectCards setToggleAction={setToggleAction} toggleAction={toggleAction} />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default ViewPredictions

function SuspectCards({ setToggleAction, toggleAction }) {

    const { localData } = useContext(DataContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function deleteSuspect(officerId) {
        if (officerId === "") {
            return notif.error("officer id is empty")
        }
        let confirm = window.confirm("Are you sure you wanna delete this suspect?")

        if (confirm) {

            let options, url;
            try {
                url = apiRoutes.deleteSuspects;
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
            <div className="evidence-top-head">
                <div className="bx">
                    <label htmlFor="">Case ID</label>
                    <select name="" id="" className="select">
                        <option value="">-- case id ---</option>
                    </select>
                </div>
                <br />
            </div>
            <div className="top">
                <img src={img} alt="" className="img" />
                {toggleAction && <div className="more-cont">
                    <li>Delete</li>
                </div>}
                <br />
                <FiMoreVertical className="icon" onClick={() => setToggleAction(!toggleAction)} />
                <p className="name">John Doe</p>
                <small>June 10, 2022</small>
                <div className="officer-type">
                    <div className="left">Case Id</div>
                    <div className="right">2345454365346</div>
                </div>
            </div>
            <div className="bottom">
                <div className="box">
                    <small>Physical Score</small>
                    <h6>9/10</h6>
                </div>
                <div className="box mid">
                    <small>Logical Score</small>
                    <h6>5/10</h6>
                </div>
                <div className="box">
                    <small>Probability</small>
                    <h6>70%</h6>
                </div>
            </div>
        </div>
    )
}