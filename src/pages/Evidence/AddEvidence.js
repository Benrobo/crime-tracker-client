import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import apiRoutes from "../../api_routes"
import DataContext from "../../context/DataContext"
import { Util, Notification } from "../../helpers/util"

const util = new Util()
const notif = new Notification(4000)

function AddEvidence() {
    return (
        <Layout>
            <LeftNavbar active="addEvidence" />
            <MainCont>
                <AddEvidenceForm />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default AddEvidence



function AddEvidenceForm() {
    const { localData } = useContext(DataContext)
    const [loadingCase, setCaseLoading] = useState(false);
    const [loadingEvidence, setEvidenceLoading] = useState(false);
    const [loadingsuspects, setSuspectLoading] = useState(false);
    const [casesData, setCasesData] = useState([])
    const [suspectsdata, setSuspectsData] = useState([])

    // form fields state
    const [caseId, setCaseId] = useState("");
    const [evidence, setEvidence] = useState("")
    const [suspectName, setSuspectName] = useState("")
    const [note, setNote] = useState("")
    const [suspectId, setSuspectId] = useState("")


    // get cases data
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
                console.log(data);
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
        })()
    }, [])
    // get suspectdata
    useEffect(() => {
        (async () => {
            try {
                let url = apiRoutes.allSuspects;
                let options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    }
                }
                setSuspectLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();
                console.log(data);
                if (data && data.error === true) {
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

    function getSuspectName(id) {
        let name = suspectsdata.filter((suspect) => {
            return suspect.id === id
        })[0].suspectName
        setSuspectName(name)
    }

    async function addEvidence() {
        if (caseId === "") {
            return notif.error("caseid cant be empty")
        };
        if (evidence === "") {
            return notif.error("evidence cant be empty")
        }
        if (note === "") {
            return notif.error("note cant be empty")
        }
        if (suspectName === "") {
            return notif.error("suspectName cant be empty")
        }
        if (suspectId === "") {
            return notif.error("suspectId cant be empty")
        }

        try {
            let url = apiRoutes.addEvidence;
            let options = {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    userId: localData.id,
                    caseId,
                    suspectName,
                    evidence,
                    suspectId,
                    note
                })
            }
            setEvidenceLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();
            console.log(data);
            if (data && data.error === true) {
                setEvidenceLoading(false)
                return notif.error(data.message)
            }

            setEvidenceLoading(false);
            notif.success(data.message)
        } catch (err) {
            setEvidenceLoading(false);
            notif.error(err.message)
        }

    }

    return (
        <div className="addevidence-cont">
            <div className="head">
                <h3>Add Evidence</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <select name="" id="" className="select" onChange={(e) => {
                        setCaseId(e.target.value)
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
                <div className="box">
                    <label htmlFor="">Evidence</label>
                    <input type="text" placeholder="Knife and bottle" defaultValue={evidence} onChange={(e) => setEvidence(e.target.value)} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <select name="" id="" className="select" onChange={(e) => {
                        setSuspectId(e.target.value)
                        getSuspectName(e.target.value)
                    }}>
                        <option value="">{loadingsuspects ? "loading..." : "-- suspects name ---"}</option>
                        {
                            loadingsuspects ?
                                <option value="">Loading...</option>
                                :
                                suspectsdata && suspectsdata.length === 0 ?
                                    <option value="">No suspects</option>
                                    :
                                    suspectsdata.map((list) => {
                                        return (
                                            <option key={list.id} value={list.id}>{list.suspectName}</option>
                                        )
                                    })
                        }
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="2" defaultValue={note} onChange={(e) => setNote(e.target.value)} className="note"></textarea>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn" onClick={() => addEvidence()}>
                        {loadingEvidence ? "Adding evidence..." : "Add Evidence"}
                    </button>
                </div>
            </div>
        </div>
    )
}


