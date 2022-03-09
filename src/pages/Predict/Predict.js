import React, { useState, useRef, useContext, useEffect } from "react";
import MainCont from "../../components/MainCont/MainCont";
import Profile from "../../components/ProfileBar/Profile";
import LeftNavbar from "../../components/LeftNavbar";
import { Util, Notification } from "../../helpers/util";
import "./style.css";
import Layout from "../../components/Layout/Layout";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";

let util = new Util();
let notif = new Notification();

function Predict() {
    return (
        <Layout>
            <LeftNavbar active="predict" />
            <MainCont>
                <hr />
                <AddCases />
            </MainCont>
            <Profile />
        </Layout>
    );
}

export default Predict;

function AddCases() {
    const { localData } = useContext(DataContext);
    const [caseloading, setCaseLoading] = useState(false);
    const [suspectloading, setAddingSuspectLoading] = useState(false);
    const [predictionloading, setPredictionLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [suspects, setSuspects] = useState([]);
    const [suspectid, setSuspectId] = useState("")
    const [error, setError] = useState("");
    const [caseid, setCaseId] = useState("");
    const [rank, setRank] = useState("")

    // const refs
    let caseRef = useRef()
    let suspectRef = useRef()
    let relRef = useRef()

    // get all cases info on page load
    useEffect(() => {
        (async function () {
            try {
                let url = apiRoutes.getCases;
                let options = {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json",
                    },
                };
                setCaseLoading(true);
                let res = await fetch(url, options);
                let data = await res.json();
                if (data && data.error === true) {
                    return notif.error(data.message);
                }

                setCaseLoading(false);
                setCases(data.data);
            } catch (err) {
                setCaseLoading(false);
                setError(err.message);
                notif.error(err.message);
            }
        })();
    }, []);

    // get suspects details from cases id
    async function getSuspectInfo(caseId) {
        if (caseId === "") {
            return notif.error("case id is empty");
        }
        try {
            let url = apiRoutes.getSuspects;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ userId: localData.id, caseId }),
            };
            setAddingSuspectLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                setAddingSuspectLoading(false);
                return notif.error(data.message);
            }

            setAddingSuspectLoading(false);
            setSuspects(data.data.length > 0 ? data.data[0] : data.data);
            setSuspectId(data.data.length > 0 ? data.data[0].id : data.data)
        } catch (err) {
            setAddingSuspectLoading(false);
            setError(err.message);
            notif.error(err.message);
        }

    }

    // add predictions
    async function addPrediction() {
        let caseName = caseRef.current.value;
        let suspectName = suspectRef.current.value;
        let relation = relRef.current.value;

        if (caseName === "") {
            return notif.error("case name cant be empty")
        }
        if (suspectName === "") {
            return notif.error("suspectName cant be empty")
        }
        if (relation === "") {
            return notif.error("relation cant be empty")
        }
        if (suspectid === "") {
            return notif.error("suspect Id cant be empty")
        }
        if (rank === "") {
            return notif.error("rank cant be empty")
        }

        try {
            let url = apiRoutes.addPrediction;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    caseId: caseid,
                    caseName,
                    suspectId: suspectid,
                    rank
                }),
            };
            setPredictionLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                setPredictionLoading(false);
                return notif.error(data.message);
            }

            setPredictionLoading(false);
            return notif.success(data.message)
        } catch (err) {
            setPredictionLoading(false);
            setError(err.message);
            notif.error(err.message);
        }
    }

    const suspectDataLength = Object.entries(suspects);

    return (
        <div className="predict-cont">
            <div className="head">
                <h3>Make Prediction</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <select
                        className="select"
                        onChange={(e) => {
                            setCaseId(e.target.value);
                            getSuspectInfo(e.target.value);
                        }}
                    >
                        <option value="">
                            {caseloading ? "fetching cases..." : " --- case id ---"}
                        </option>
                        {caseloading ? (
                            <option value="">loading...</option>
                        ) : cases && cases.length === 0 ? (
                            <option value="">No case available, add case.</option>
                        ) : (
                            cases.map((list) => {
                                return <option value={list.id}>{list.id}</option>;
                            })
                        )}
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Case Name</label>
                    <input
                        type="text"
                        ref={caseRef}
                        disabled
                        defaultValue={suspectloading ? "loading..." : suspects.length === 0 ? "" : suspects && Object.entries(suspects).length === 0 ? "No suspect availabele for this case" : suspects.caseName}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <input
                        type="text"
                        ref={suspectRef}
                        defaultValue={suspectloading ? "loading..." : suspects.length === 0 ? "" : suspects && Object.entries(suspects).length === 0 ? "No suspect availabele for this case" : suspects.suspectName}
                        disabled
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Relation</label>
                    <input
                        type="text"
                        ref={relRef}
                        defaultValue={suspectloading ? "loading..." : suspects.length === 0 ? "" : suspects && Object.entries(suspects).length === 0 ? "No suspect availabele for this case" : suspects.relation}
                        disabled
                        className="input"
                    />
                </div>
                <div className="box">
                    <div className="media-cont">
                        <div className="left">
                            <div className="bx">
                                {/* <label htmlFor="">Suspect Image</label>
                                <button className="upload" onClick={() => {
                                    handlePreview()
                                }}>Upload</button>
                                <input type="file" accept="image/*" hidden className="file" ref={file} /> */}
                            </div>
                            <div className="bx">
                                <label htmlFor="">Rank</label>
                                <select className="select" onChange={(e) => {
                                    setRank(e.target.value)
                                }}>
                                    <option value={""}>1/10</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => {
                                        return (
                                            <option key={i} value={i}>
                                                {i}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="right">
                            <img
                                src={suspects.length === 0 ? "" : suspects && Object.entries(suspects).length === 0 ? "" : suspects.suspectImg}
                                alt=""
                                className="preview"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn" disabled={predictionloading ? true : false} onClick={() => addPrediction()}>{predictionloading ? "Adding Prediction...." : "Add Prediction"}</button>
                </div>
            </div>
        </div>
    );
}
