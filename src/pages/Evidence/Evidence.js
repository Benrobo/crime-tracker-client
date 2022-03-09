import React, { useState, useEffect, useContext } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { BsPen, BsPencilFill, BsTrashFill } from 'react-icons/bs'
import apiRoutes from "../../api_routes"
import DataContext from "../../context/DataContext"
import { Util, Notification } from "../../helpers/util"
import Modal from '../../components/Modal/Modal'

const util = new Util()
const notif = new Notification()


function Evidence() {
    const { localData } = useContext(DataContext)
    const [loadingCase, setCaseLoading] = useState(false);
    const [loadingEvidence, setEvidenceLoading] = useState(false);
    const [error, setError] = useState("")
    const [casesData, setCasesData] = useState([])
    const [evidenceData, setEvidenceData] = useState([])
    const [caseid, setCaseId] = useState("");
    const [editstate, setEditState] = useState(false)

    // updating section
    const [selectedcaseid, setSelectedCaseId] = useState("")
    const [selectedevidenceid, setSelectedEvidenceId] = useState("");
    const [selectedsuspectid, setSelctedSuspectId] = useState("")

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
                setCaseLoading(false);
                setCasesData(data.data)

            } catch (err) {
                setCaseLoading(false);
                notif.error(err.message)
            }
        })()
    }, [])

    async function FetchEvidence(caseId) {
        if (caseId === "") return;

        try {
            let url = apiRoutes.getEvidenceId;
            let options = {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: localData.id, caseId })
            }
            setEvidenceLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();
            if (data && data.error === true) {
                console.error(data.message);
                return notif.error(data.message)
            }

            setEvidenceLoading(false);
            setEvidenceData(data.data)

        } catch (err) {
            setEvidenceLoading(false);
            notif.error(err.message)
        }

    }

    return (
        <Layout>
            <LeftNavbar active="evidence" />
            <MainCont>
                {editstate ?
                    <UpdateEvidence selectedevidenceid={selectedevidenceid} selectedcaseid={selectedcaseid} selectedsuspectid={selectedsuspectid} setEditState={setEditState} />
                    :
                    <>
                        <h4>View Evidence</h4>
                        <br />
                        <div className="evidence-top-head">
                            <div className="bx">
                                <label htmlFor="">Case ID</label>
                                <select name="" id="" className="select" onChange={(e) => {
                                    setCaseId(e.target.value)
                                    FetchEvidence(e.target.value)
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
                            <EvidenceTable data={evidenceData} loading={loadingEvidence} setSelectedCaseId={setSelectedCaseId} setSelectedEvidenceId={setSelectedEvidenceId} setSelctedSuspectId={setSelctedSuspectId} setEditState={setEditState} />
                        </div>
                    </>
                }
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Evidence


function EvidenceTable({ data, loading, setSelectedCaseId, setSelectedEvidenceId, setSelctedSuspectId, setEditState }) {
    const { localData } = useContext(DataContext)
    const [deleteloading, setDeleteLoading] = useState("")

    async function deleteEvidence(e) {
        let target = e.target.dataset;
        if (Object.entries(target).length > 0) {
            let Eid = target.evidence_id;
            let Cid = target.case_id;

            if ((Eid !== "" && Eid !== undefined) && (Cid !== "" && Cid !== undefined)) {

                try {
                    let url = apiRoutes.deleteEvidence;
                    let options = {
                        method: "delete",
                        headers: {
                            "Authorization": `Bearer ${localData.refreshToken}`,
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            userId: localData.id,
                            evidenceId: Eid,
                            caseId: Cid
                        })
                    }
                    setDeleteLoading(true)
                    let res = await fetch(url, options);
                    let data = await res.json();
                    if (data && data.error === true) {
                        setDeleteLoading(false)
                        return notif.error(data.message)
                    }
                    setDeleteLoading(false);

                    notif.success(data.message);

                    setTimeout(() => {
                        window.location.reload(true)
                    }, 1000);

                } catch (err) {
                    setDeleteLoading(false);
                    notif.error(err.message)
                }
            }
        }
    }

    // delete all evidence
    async function clearAllEvidence() {
        const confirm = window.confirm("Are you sure you wanna clear all evidence?")

        if (confirm === false) return;

        try {
            let url = apiRoutes.clearAllEvidence;
            let options = {
                method: "delete",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: localData.id })
            }
            setDeleteLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();
            if (data && data.error === true) {
                setDeleteLoading(false)
                return notif.error(data.message)
            }
            setDeleteLoading(false);

            notif.success(data.message);

            setTimeout(() => {
                window.location.reload(true)
            }, 1000);

        } catch (err) {
            setDeleteLoading(false);
            notif.error(err.message)
        }
    }

    return (
        <div className="evidence-cont mt-5">
            <div className="head">
                <p>All Cases</p>
                <br />
                <div className="head-action">
                    clear all
                    <BsTrashFill className="icon" onClick={() => clearAllEvidence()} />
                </div>
            </div>
            <br />
            <div className="body">
                <table className="tbl-body table-hover table-striped">
                    <thead>
                        <th>Case Id</th>
                        <th>Evidence</th>
                        <th>Suspect Name</th>
                        <th>Relation</th>
                        <th>Note</th>
                        <th>Rank</th>
                        <th>Officer Id</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {loading === false ?
                            data && data.length > 0 ?
                                data.map((list, i) => {
                                    return (
                                        <tr className="mt-3" key={i}>
                                            <td>
                                                <small>{list.caseId}</small>
                                            </td>
                                            <td>
                                                <small>{list.evidence}</small>
                                            </td>
                                            <td>
                                                <small>{list.relation}</small>
                                            </td>
                                            <td>
                                                <small>{list.suspectName}</small>
                                            </td>
                                            <td className="status">
                                                <small>{list.note}</small>
                                            </td>
                                            <td>
                                                <small>{list.rank}</small>
                                            </td>
                                            <td>
                                                <small>{list.userId}</small>
                                            </td>
                                            {list.userId === localData.id ? <td className="action">
                                                {deleteloading ? "deleteing" : <BsTrashFill className="icon delete" data-evidence_id={list.id} data-case_id={list.caseId} onClick={(e) => {
                                                    deleteEvidence(e)
                                                }} />}
                                                <BsPencilFill className="icon edit" data-evidence_id={list.id} data-case_id={list.caseId}
                                                    data-suspect_id={list.suspectId}
                                                    onClick={(e) => {
                                                        let target = e.target.dataset;
                                                        if (Object.entries(target).length > 0) {
                                                            let Eid = target.evidence_id;
                                                            let Cid = target.case_id;
                                                            let Sid = target.suspect_id;

                                                            if ((Eid !== "" && Eid !== undefined) && (Cid !== "" && Cid !== undefined) && (Sid !== "" && Sid !== undefined)) {
                                                                setSelectedEvidenceId(Eid);
                                                                setSelectedCaseId(Cid)
                                                                setEditState(true)
                                                                setSelctedSuspectId()
                                                            }
                                                        }
                                                    }} />
                                            </td> : <td><kbd>none</kbd></td>}
                                        </tr>
                                    )
                                })
                                :
                                <small>Evidence is empty</small>
                            :
                            <tr>
                                <td>loading...</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function UpdateEvidence({ selectedevidenceid, selectedcaseid, setEditState, selectedsuspectid }) {
    const { localData } = useContext(DataContext)
    const [loadingCase, setCaseLoading] = useState(false);
    const [loadingEvidence, setEvidenceLoading] = useState(false);
    const [loadingsuspects, setSuspectLoading] = useState(false);
    const [fetchevidenceloading, setFetchEvidenceLoading] = useState(false);
    const [casesData, setCasesData] = useState([])
    const [suspectsdata, setSuspectsData] = useState([])
    const [evidencedata, setEvidenceData] = useState([])

    // form fields state
    const [caseId, setCaseId] = useState("");
    const [evidence, setEvidence] = useState("")
    const [suspectName, setSuspectName] = useState("")
    const [note, setNote] = useState("")
    const [suspectId, setSuspectId] = useState(selectedsuspectid !== "" ? selectedsuspectid : "")

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

    // get evidence
    useEffect(() => {
        (async () => {
            try {
                if (selectedevidenceid === "" && selectedcaseid === "") return

                let url = apiRoutes.getEvidenceById;
                let options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: localData.id,
                        caseId: selectedcaseid,
                        evidenceId: selectedevidenceid
                    })
                }
                setFetchEvidenceLoading(true)
                let res = await fetch(url, options);
                let data = await res.json();
                if (data && data.error === true) {
                    return notif.error(data.message)
                }
                setFetchEvidenceLoading(false);
                setEvidenceData(data.data)

            } catch (err) {
                setFetchEvidenceLoading(false);
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

    async function updateEvidence() {
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
            let url = apiRoutes.editEvidence;
            let options = {
                method: "put",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    userId: localData.id,
                    caseId,
                    suspectName,
                    evidence,
                    evidenceId: selectedevidenceid,
                    suspectId,
                    note
                })
            }
            setEvidenceLoading(true)
            let res = await fetch(url, options);
            let data = await res.json();
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
                <h3>Update Evidence</h3>
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
                    <input type="text" placeholder="Knife and bottle" defaultValue={fetchevidenceloading ? "loading" : evidencedata.length > 0 ? evidencedata[0].evidence : evidence} onChange={(e) => setEvidence(e.target.value)} className="input" />
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
                                            <option key={list.id} value={list.id}>{list.suspectName} C-ID: {list.caseId}</option>
                                        )
                                    })
                        }
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="2" defaultValue={fetchevidenceloading ? "loading" : evidencedata.length > 0 ? evidencedata[0].note : note} onChange={(e) => setNote(e.target.value)} className="note"></textarea>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn" onClick={() => setEditState(false)}>Cancel</button>
                    <button className="add btn" onClick={() => updateEvidence()}>
                        {loadingEvidence ? "Updating evidence..." : "Update Evidence"}
                    </button>
                </div>
            </div>
        </div>
    )
}