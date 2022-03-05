import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'
import Layout from '../../components/Layout/Layout'
import { FiMoreVertical } from 'react-icons/fi'
import Modal from '../../components/Modal/Modal'
import { Notification, Util } from '../../helpers/util'
import apiRoutes from '../../api_routes'
import DataContext from '../../context/DataContext'

import "./style.css"

const util = new Util();
const notif = new Notification()

function Dashboard() {
    const { decodedLocalData, localData } = useContext(DataContext)
    const [visibility, setVisibility] = useState(false)
    const [loadingUser, setUserLoading] = useState(false);
    const [loadingCase, setCaseLoading] = useState(false);
    const [loadingSuspect, setSuspectLoading] = useState(false);
    const [error, setError] = useState("")
    const [userData, setUserData] = useState([]);
    const [casesData, setCasesData] = useState([])
    const [suspectsData, setSuspectsData] = useState([])

    // targeted officerId
    const [targetOfficerId, setTargetOfficerId] = useState("")


    useEffect(() => {
        (async () => {
            let options, url;
            // get officerdata
            try {
                url = apiRoutes.getOfficers;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    }
                }
                setUserLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    return notif.error(data.message)
                }

                setUserLoading(false);
                setUserData(data.data)
            } catch (err) {
                setUserLoading(false);
                notif.error(err.message)
            }
            // get cases data
            try {
                url = apiRoutes.getCases;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    }
                }
                setCaseLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    return notif.error(data.message)
                }

                setCaseLoading(false);
                setCasesData(data.data)

            } catch (err) {
                setCaseLoading(false);
                notif.error(err.message)
            }

            // get suspect
            try {
                url = apiRoutes.allSuspects;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    }
                }
                setSuspectLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    return notif.error(data.message)
                }

                setSuspectLoading(false);
                setSuspectsData(data.data)

            } catch (err) {
                setSuspectLoading(false);
                notif.error(err.message)
            }
        })()
    }, [])

    const restData = { loadingUser, loadingCase, loadingSuspect, userData, casesData, suspectsData }

    function handleTargetOfficerId(e) {
        let id = e.target.dataset.id;
        if (id !== undefined || id !== "") {
            setVisibility(true)
            return setTargetOfficerId(id);
        }
        setVisibility(false)
    }

    return (
        <Layout>
            <LeftNavbar active="dashboard" />
            <MainCont>
                <div className="head">
                    <h3>CTC DASHBOARD</h3>
                </div>
                <br />
                <StatCards data={restData} />
                <br />
                {localData.role === "admin" && <RequestContainer data={restData} handleTargetOfficerId={handleTargetOfficerId} />}
                {visibility && <Modal setVisibility={setVisibility}>
                    <RequestCard setVisibility={setVisibility} targetOfficerId={targetOfficerId} />
                </Modal>}
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Dashboard

function StatCards({ data }) {

    let { loadingUser, loadingCase, loadingSuspect, userData, casesData, suspectsData } = data;

    return (
        <div className="cards-container">
            <div className="card-box">
                <p>Total Cases</p>
                <h4>{loadingCase === true ? "loading..." : casesData.length}</h4>
            </div>
            <div className="card-box">
                <p>Total Suspects</p>
                <h4>{loadingSuspect === true ? "loading..." : suspectsData.length}</h4>
            </div>
            <div className="card-box">
                <p>Total Users</p>
                <h4>{loadingUser === true ? "loading..." : userData.length}</h4>
            </div>
        </div>
    )
}

function RequestContainer({ data, handleTargetOfficerId }) {

    const { loadingUser, userData } = data;

    let newUserData = userData.filter((users) => users.userStatus === "pending")

    function capitalizeFullname(text) {
        if (text !== "") {
            let fN = text.split(" ");

            let fName = fN[0].charAt(0).toUpperCase() + fN[0].slice(1);
            let lName =
                fN[1] !== undefined
                    ? fN[1].charAt(0).toUpperCase() + fN[1].slice(1)
                    : "";
            return { fName, lName };
        }
    }

    return (
        <div className="request-cont mt-5">
            <div className="head">
                <p>Officers Request</p>
                <small>registeration</small>
            </div>
            <br />
            <div className="body">
                <table className="tbl-body table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Contacts</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loadingUser === true ?
                                <tr>
                                    <td>loading...</td>
                                </tr>
                                :
                                newUserData && newUserData.length === 0 ?
                                    <tr>
                                        <td>No officer requests.</td>
                                    </tr>
                                    :
                                    newUserData.map((users, i) => {
                                        if (users.userStatus === "pending") {
                                            return (
                                                <tr className="mt-3" key={i}>
                                                    <td className="user-info">
                                                        <img src={`https://avatars.dicebear.com/api/micah/${users.userName}.svg`} alt="" />
                                                        <small>{capitalizeFullname(users.userName).fName + capitalizeFullname(users.userName).lName}</small>
                                                    </td>
                                                    <td className="contact">
                                                        <small>{users.mail}</small>
                                                    </td>
                                                    <td className="type">
                                                        <small>
                                                            {capitalizeFullname(users.userRank).fName + capitalizeFullname(users.userRank).lName}
                                                        </small>
                                                    </td>
                                                    <td className="status">
                                                        <Badge type="warning" text="Pending" />
                                                    </td>
                                                    <td className="action">
                                                        <FiMoreVertical className="icon" data-id={users.userId} onClick={(e) => {
                                                            handleTargetOfficerId(e)
                                                        }} />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function RequestCard({ setVisibility, targetOfficerId }) {
    const { decodedLocalData, localData } = useContext(DataContext)
    const [loading, setLoading] = useState(false);
    const [approvedloading, setApprovedLoading] = useState(false);
    const [error, setError] = useState("")
    const [data, setData] = useState([])

    let url, options;

    useEffect(() => {
        (async () => {
            // fetch user based on userid
            try {
                url = apiRoutes.getOfficersId;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ userId: targetOfficerId })
                }
                setLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    setError(data.message)
                    return notif.error(data.message)
                }

                setLoading(false);
                setData(data.data)
            } catch (err) {
                setLoading(false);
                setError(err.message)
                notif.error(err.message)
            }
        })()
    }, [])

    async function approveOfficerRequests(e) {
        let officerId = e.target.dataset.id
        if (officerId !== undefined && officerId !== "") {
            // grant officer request
            try {
                url = apiRoutes.approveRegRequest;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ userId: localData.id, officerId: targetOfficerId })
                }
                setApprovedLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    return notif.error(data.message)
                }

                setApprovedLoading(false);
                notif.success(data.message)
                setVisibility(false)
                window.location.reload(true)

            } catch (err) {
                setApprovedLoading(false);
                setError(err.message)
                notif.error(err.message)
            }
        }
    }

    return (
        <div className="request-card">
            {
                approvedloading === true ?
                    <p>Loading...</p>
                    :
                    data && data.length === 0 ?
                        <p>No Officer Found</p>
                        :
                        error !== "" ?
                            <p>{error}</p>
                            :
                            data.map((user) => {
                                return (
                                    <>
                                        <div className="user-info">
                                            <img src={`https://avatars.dicebear.com/api/micah/${user.userName}.svg`} alt="" />
                                            <h4>{user.userName}</h4>
                                            <small>{user.mail}</small>
                                            <br />
                                            <p className="type">{user.userRank.toUpperCase()}</p>
                                            <p className="type">{user.phoneNumber}</p>
                                        </div>
                                        <br />
                                        <div className="action">
                                            <button className="accept btn" data-id={user.userId} onClick={(e) => {
                                                approveOfficerRequests(e)
                                            }}>{approvedloading === true ? "approving officer..." : "Approve"}</button>
                                            <button className="cancel btn" onClick={() => {
                                                setVisibility(false)
                                            }}>Cancel</button>
                                        </div>
                                    </>
                                )
                            })

            }
        </div>
    )
}


function Badge({ text, type }) {
    return (
        <span className={type === "warning" ? "w-badge" : type === "success" ? "s-badge" : type === "danger" ? "d-badge" : ""}>
            <small>{text}</small>
        </span>
    )
}