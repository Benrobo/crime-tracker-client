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
            console.log(data);
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
                    <EvidenceTable data={evidenceData} loading={loadingEvidence} />
                </div>
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Evidence


function EvidenceTable({ data, loading }) {
    const { localData } = useContext(DataContext)

    return (
        <div className="evidence-cont mt-5">
            <div className="head">
                <p>All Cases</p>
                <br />
                <div className="head-action">
                    clear all
                    <BsTrashFill className="icon" />
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
                        <th>Officer Name</th>
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
                                                <small>{list.userName}</small>
                                            </td>
                                            {list.userId === localData.id ? <td className="action">
                                                <BsTrashFill className="icon delete" data-evidenceId={list.id} data-caseId={list.caseId} />
                                                <BsPencilFill className="icon edit" data-evidenceId={list.id} data-caseId={list.caseId} />
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