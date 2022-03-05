import React, { useState, useEffect, useContext } from "react";
import MainCont from "../../components/MainCont/MainCont";
import Profile from "../../components/ProfileBar/Profile";
import LeftNavbar from "../../components/LeftNavbar";

import "./style.css";
import Layout from "../../components/Layout/Layout";
import { FiRefreshCcw } from "react-icons/fi";
import { Util, Notification } from "../../helpers/util";
import apiRoutes from "../../api_routes";
import DataContext from "../../context/DataContext";

const notif = new Notification();
const util = new Util();

function Cases() {
    return (
        <Layout>
            <LeftNavbar active="cases" />
            <MainCont>
                <AddCases />
            </MainCont>
            <Profile />
        </Layout>
    );
}

export default Cases;

function AddCases() {
    const { localData } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [code, setCode] = useState("");
    const [casename, setCaseName] = useState("");
    const [officerid, setOfficerId] = useState("");
    const [officername, setOfficerName] = useState("");
    const [note, setNote] = useState("");
    // fetching loading state
    const [fetchloading, setFetchLoading] = useState(false)
    // adding case states
    const [caseloading, setCaseLoading] = useState(false);

    function generateCode() {
        let code = util.generateCaseId(5);
        setCode(code);
    }

    useEffect(() => {
        (async function getOfficers() {
            let options, url;
            try {
                url = apiRoutes.getOfficers;
                options = {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json",
                    },
                };
                setLoading(true);
                let res = await fetch(url, options);
                let data = await res.json();

                if (data && data.error === true) {
                    console.error(data.message);
                    setError(data.message);
                    return notif.error(data.message);
                }

                setLoading(false);
                setData(data.data);
            } catch (err) {
                setLoading(false);
                setError(err.message);
                notif.error(err.message);
            }
        })();
    }, []);

    async function getOfficers(officerid) {
        if (officerid === "" || officerid === undefined) {
            return notif.error("failed to get officer: officer id is empty");
        }
        let options, url;
        try {
            url = apiRoutes.getOfficersId;
            options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ userId: officerid }),
            };
            setFetchLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                setError(data.message);
                setOfficerId("");
                setFetchLoading(false);
                return notif.error(data.message);
            }

            setFetchLoading(false);
            setOfficerName(data.data[0].userName);
        } catch (err) {
            setFetchLoading(false);
            setError(err.message);
            setOfficerId("");
            notif.error(err.message);
        }
    }

    // add case
    async function addCase() {
        if (code === "") {
            return notif.error("case code cant be empty");
        }
        if (officerid === "") {
            return notif.error("case officerId cant be empty");
        }
        if (officername === "") {
            return notif.error("case officername cant be empty");
        }
        if (casename === "") {
            return notif.error("casename cant be empty");
        }
        if (note === "") {
            return notif.error("case note cant be empty");
        }

        let sendData = {
            userId: localData.id,
            caseId: code,
            caseName: casename,
            officerId: officerid,
            note,
        };

        let options, url;
        try {
            url = apiRoutes.addCase;
            options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(sendData),
            };
            setCaseLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                setCaseLoading(false);
                return notif.error(data.message);
            }

            setCaseLoading(false);
            return notif.success(data.message);
        } catch (err) {
            setCaseLoading(false);
            setOfficerId("");
            notif.error(err.message);
        }
    }

    return (
        <div className="cases-cont">
            <div className="head">
                <h3>Add Cases</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <div className="genid">
                        <input
                            type="text"
                            disabled
                            defaultValue={code === 0 ? "01010" : code}
                            className="input"
                        />
                        <FiRefreshCcw
                            className="icon"
                            onClick={async () => {
                                generateCode();
                            }}
                        />
                    </div>
                </div>
                <div className="box">
                    <label htmlFor="">Case Name</label>
                    <input
                        type="text"
                        placeholder="Murder"
                        defaultValue={casename}
                        onChange={(e) => setCaseName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Officer ID</label>
                    <select
                        className="select"
                        onChange={(e) => {
                            getOfficers(e.target.value);
                            setOfficerId(e.target.value);
                            console.log({ officerid: e.target.value });
                        }}
                    >
                        <option value="">
                            {loading === true ? "loading..." : "--- select officer id ---"}
                        </option>

                        {loading === true ? (
                            "Loading..."
                        ) : data && data.length === 0 ? (
                            <option value="">No officer found</option>
                        ) : (
                            data
                                .map((users) => {
                                    return (
                                        <>
                                            {users.userId === localData.id ? (
                                                <option value={users.userId}>
                                                    {users.userName}: You
                                                </option>
                                            ) : (
                                                <option value={users.userId}>{users.userName}</option>
                                            )}
                                        </>
                                    );
                                })
                        )}
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Officer Name</label>
                    <input
                        type="text"
                        defaultValue={fetchloading ? "loading..." : officername}
                        disabled
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea
                        cols="30"
                        onChange={(e) => setNote(e.target.value)}
                        rows="3"
                        defaultValue={note}
                        className="note"
                    ></textarea>
                </div>
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn" onClick={() => addCase()}>
                        {caseloading === true ? "Adding case ..." : "Add Case"}
                    </button>
                </div>
            </div>
        </div>
    );
}
