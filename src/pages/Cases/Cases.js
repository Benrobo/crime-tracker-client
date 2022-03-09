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
import { BsPencilFill, BsTrashFill } from "react-icons/bs";

const notif = new Notification();
const util = new Util();

function Cases() {
    return (
        <Layout>
            <LeftNavbar active="assignCase" />
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
    const [fetchloading, setFetchLoading] = useState(false);
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
                <h3>Assign Cases</h3>
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
                            data.map((users) => {
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

export function ViewAllCases() {
    const { localData, decodedLocalData } = useContext(DataContext);
    const [loadingCase, setCaseLoading] = useState(false);
    const [deleteloading, setDeleteLoading] = useState(false);
    const [error, setError] = useState("");
    const [casesData, setCasesData] = useState([]);
    const [caseid, setCaseId] = useState("");
    const [editstate, setEditState] = useState(false);
    const [casetargetid, setCaseTargetId] = useState("");
    const [officertargetid, setOfficerTargetId] = useState("");

    // get all cases
    async function getAllCases() {
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
                console.error(data.message);
                return notif.error(data.message);
            }
            setCaseLoading(false);
            setCasesData(data.data);
        } catch (err) {
            setCaseLoading(false);
            notif.error(err.message);
        }
    }

    useEffect(() => {
        getAllCases();
    }, []);

    async function clearAllCases() {
        alert("feature isnt available now!!")
    }

    async function deleteCase(caseId, officerId) {
        try {
            let url = apiRoutes.deleteCase;
            let options = {
                method: "delete",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    caseId,
                    officerId
                })
            };
            setDeleteLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();
            if (data && data.error === true) {
                setDeleteLoading(false)
                return notif.error(data.message);
            }
            setDeleteLoading(false);
            notif.success(data.message)
            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setDeleteLoading(false);
            notif.error(err.message);
        }
    }

    return (
        <Layout>
            <LeftNavbar active="viewCase" />
            <MainCont>
                {editstate === false ? (
                    <div className="view-cases">
                        <div className="head">
                            <h4>View Cases</h4>
                            <br />
                            <div className="head-action">
                                clear all
                                <BsTrashFill className="icon" onClick={() => clearAllCases()} />
                            </div>
                        </div>
                        <br />
                        <div className="body">
                            <table className="tbl-body table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>Case Id</th>
                                        <th>Case Name</th>
                                        <th>Officer Id</th>
                                        <th>Officer Name</th>
                                        <th>Owner</th>
                                        <th>Note</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingCase ? (
                                        <tr>
                                            <td>Loading...</td>
                                        </tr>
                                    ) : casesData && casesData.length === 0 ? (
                                        <tr>
                                            <td>No cases assigned yet.</td>
                                        </tr>
                                    ) : (
                                        casesData.map((list) => {
                                            return (
                                                <tr>
                                                    <td>{list.id}</td>
                                                    <td>{list.caseName}</td>
                                                    <td>{list.officerId}</td>
                                                    <td>{list.userName}</td>
                                                    <td>
                                                        <span className="bdg">
                                                            {list.officerId === localData.id &&
                                                                list.officerId === decodedLocalData.id
                                                                ? "You"
                                                                : "Others"}
                                                        </span>
                                                    </td>
                                                    <td>{list.note}</td>
                                                    <td>{list.created_at}</td>
                                                    {list.userId === localData.id &&
                                                        list.userId === decodedLocalData.id ? (
                                                        <td className="action">
                                                            {deleteloading ? "deleting" : <BsTrashFill
                                                                className="icon delete"
                                                                data-case_id={list.id}
                                                                data-officer_id={list.officerId}
                                                                onClick={(e) => {
                                                                    let target = e.target.dataset;

                                                                    if (target.case_id !== undefined && target.officer_id !== undefined) {
                                                                        let Cid = target.case_id;
                                                                        let Oid = target.officer_id;

                                                                        setCaseTargetId(Cid);
                                                                        setOfficerTargetId(Oid);
                                                                        deleteCase(Cid, Oid)
                                                                        return;
                                                                    }
                                                                }}
                                                            />}
                                                            <BsPencilFill
                                                                className="icon edit"
                                                                data-case_id={list.id}
                                                                data-officer_id={list.officerId}
                                                                onClick={(e) => {
                                                                    let target = e.target.dataset;
                                                                    if (target.case_id !== undefined && target.officer_id !== undefined) {
                                                                        let Cid = target.case_id;
                                                                        let Oid = target.officer_id;
                                                                        setCaseTargetId(Cid);
                                                                        setOfficerTargetId(Oid);
                                                                        setEditState(true);
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                    ) : (
                                                        <td></td>
                                                    )}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <UpdateCases caseId={casetargetid} officerId={officertargetid} setEditState={setEditState} />
                )}
            </MainCont>
            <Profile />
        </Layout>
    );
}

function UpdateCases({ caseId, officerId, setEditState }) {
    const { localData } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [casesData, setCasesData] = useState([]);
    const [data, setData] = useState([]);
    const [code, setCode] = useState("");
    const [casename, setCaseName] = useState("");
    const [officerid, setOfficerId] = useState(
        officerId === "" || officerId === undefined ? "" : officerId
    );
    const [officername, setOfficerName] = useState("");
    const [note, setNote] = useState("");
    // fetching loading state
    const [fetchloading, setFetchLoading] = useState(false);
    // adding case states
    const [caseloading, setCaseLoading] = useState(false);

    function generateCode() {
        let Gcode = util.generateCaseId(5);
        setCode(Gcode);
    }

    // get all cases
    async function getAllCases() {
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
                console.error(data.message);
                return notif.error(data.message);
            }
            setCaseLoading(false);
            setCasesData(data.data);
            if (data && data.data.length > 0) {
                let fCase = data.data.filter((list) => {
                    return list.id === caseId;
                })[0];

                setCaseName(fCase.caseName)
                setOfficerId(fCase.officerId)
                setOfficerName(fCase.userName)
                setNote(fCase.note)
                setCode(fCase.id)
                return
            }
        } catch (err) {
            setCaseLoading(false);
            notif.error(err.message);
        }
    }

    useEffect(() => {
        getAllCases();
    }, []);

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

    // update case
    async function updateCase() {
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
            url = apiRoutes.editCase;
            options = {
                method: "put",
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
            notif.success(data.message);
            setEditState(false)
            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setCaseLoading(false);
            setOfficerId("");
            notif.error(err.message);
        }
    }

    return (
        <div className="cases-cont">
            <div className="head">
                <h3>Update Case</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <select
                        className="select"
                        onChange={(e) => {
                            setCode(e.target.value);
                        }}
                    >
                        <option value="">
                            {loading === true ? "loading..." : "--- select case id ---"}
                        </option>

                        {loading === true ? (
                            "Loading..."
                        ) : casesData && casesData.length === 0 ? (
                            <option value="">No Cases found</option>
                        ) : (
                            casesData.map((list) => {
                                return (
                                    <option value={list.id}>{list.caseName} ( {list.id} )</option>
                                );
                            })
                        )}
                    </select>
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
                            data.map((users) => {
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
                    <button className="cancel btn" onClick={() => setEditState(false)}>
                        Cancel
                    </button>
                    <button className="add btn" onClick={() => updateCase()}>
                        {caseloading === true ? "Updating case ..." : "Update Case"}
                    </button>
                </div>
            </div>
        </div>
    );
}
