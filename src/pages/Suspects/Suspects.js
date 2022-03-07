import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'
import { BsTrashFill } from 'react-icons/bs'
import "./style.css"
import Layout from '../../components/Layout/Layout'
import DataContext from '../../context/DataContext'
import apiRoutes from '../../api_routes'
import { Util, Notification } from '../../helpers/util'

const util = new Util();
const notif = new Notification();


function Suspects() {
    const { localData } = useContext(DataContext)
    const [loadingCase, setCaseLoading] = useState(false);
    const [loadingSuspect, setSuspectLoading] = useState(false);
    const [error, setError] = useState("")
    const [casesData, setCasesData] = useState([])
    const [suspectsData, setSuspectsData] = useState([])
    const [caseid, setCaseId] = useState("");

    useEffect(() => {
        (async () => {
            // get cases data
            try {
                let url = apiRoutes.getCases;
                let options = {
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
                console.log(data);
                setCaseLoading(false);
                setCasesData(data.data)

            } catch (err) {
                setCaseLoading(false);
                notif.error(err.message)
            }
        })()
    }, [])

    async function FetchSuspects(caseId) {
        if (caseId === "") return;

        try {
            let url = apiRoutes.getSuspects;
            let options = {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: localData.id, caseId })
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

    }

    return (
        <Layout>
            <LeftNavbar active="suspects" />
            <MainCont>
                <h4>View Suspects</h4>
                <br />
                <div className="evidence-top-head">
                    <div className="bx">
                        <label htmlFor="">Case ID</label>
                        <select name="" id="" className="select" onChange={(e) => {
                            setCaseId(e.target.value)
                            FetchSuspects(e.target.value)
                        }}>
                            <option value="">{loadingCase ? "loading..." : "-- case id ---"}</option>
                            {
                                loadingCase ?
                                    <option value="">Loading...</option>
                                    :
                                    casesData && casesData.length === 0 ?
                                        <option value="">No cases</option>
                                        :
                                        casesData.map((list) => {
                                            return (
                                                <option key={list.id} value={list.id}>{list.id}</option>
                                            )
                                        })
                            }
                        </select>
                    </div>
                    <br />
                    {caseid === "" ? <p>Select case and to get suspects</p> : loadingSuspect ? <p>loading suspects</p> : <SuspectsTable suspectsData={suspectsData} />}
                </div>
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Suspects

function SuspectsTable({ suspectsData }) {
    const { localData } = useContext(DataContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    async function deleteSuspect(e) {
        let target = e.target.dataset;

        if (target.caseid === undefined && target.suspectid === undefined) return

        const { caseid, suspectid } = target;

        try {
            let url = apiRoutes.deleteSuspects;
            let options = {
                method: "delete",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: localData.id, suspectId: suspectid, caseId: caseid })
            }
            setLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                console.error(data.message);
                return notif.error(data.message)
            }

            setLoading(false);
            notif.success(data.message);

            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setLoading(false);
            notif.error(err.message)
        }

    }

    return (
        <div className="suspect-table mt-5">
            <div className="head">
                <div className="head-action">
                    clear all
                    <BsTrashFill className="icon" />
                </div>
                <br />
            </div>
            <div className="body">
                <table className="tbl-body table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Case Id</th>
                            <th>SuspectNumber</th>
                            <th>Suspect Name</th>
                            <th>Note</th>
                            <th>Rank</th>
                            <th>Officer Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suspectsData && suspectsData.length > 0 ? suspectsData.map((list, i) => {
                            return (
                                <tr className="mt-3" key={i}>
                                    <td>
                                        <small>{list.caseId}</small>
                                    </td>
                                    <td>
                                        <small>{list.phoneNumber}</small>
                                    </td>
                                    <td>
                                        <small>{list.suspectName}</small>
                                    </td>
                                    <td className="status">
                                        <small>{list.note}</small>
                                    </td>
                                    <td>
                                        <small>{list.rank}/10</small>
                                    </td>
                                    <td>
                                        <small>{list.userName}</small>
                                    </td>
                                    {
                                        list.userId === localData.id ? <td className="action">
                                            <BsTrashFill className="icon" data-caseid={list.caseId} data-suspectid={list.id} onClick={(e) => {
                                                deleteSuspect(e)
                                            }} />
                                        </td>
                                            :
                                            <td><kbd>none</kbd></td>
                                    }
                                </tr>
                            )
                        })
                            :
                            <tr>
                                <td>No suspects.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <hr />
            <p>Suspects Info</p>
            <SuspectInfo suspectData={suspectsData} />
            <hr />
        </div>
    )
}

function SuspectInfo({ suspectData }) {
    return (
        <div className="suspect-info">
            {suspectData && suspectData.length > 0 ?
                suspectData.map((list, i) => {
                    return (
                        <div className="suspects-card" key={i}>
                            <div className="left">
                                <img src={list.suspectImg} alt="" className="img" />
                                <br />
                                <p>{list.suspectName}</p>
                            </div>
                            <div className="right">
                                <div className="rank">Rank: <kbd>{list.rank}/10</kbd> </div>
                                <div className="prob">Probability:              <kbd>
                                    {(parseInt(list.rank) * 100) / 10}%
                                </kbd>
                                </div>
                            </div>
                        </div>
                    )
                })
                :
                "No Information to display."
            }
        </div>
    )
}