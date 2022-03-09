import React, { useState, useRef, useEffect, useContext } from "react";
import MainCont from "../../components/MainCont/MainCont";
import Profile from "../../components/ProfileBar/Profile";
import LeftNavbar from "../../components/LeftNavbar";

import "./style.css";
import Layout from "../../components/Layout/Layout";
import { Notification, Util } from "../../helpers/util";
import apiRoutes from "../../api_routes";

import DataContext from "../../context/DataContext";

let notif = new Notification();
let util = new Util();

function AddSuspects() {
    return (
        <Layout>
            <LeftNavbar active="addSuspects" />
            <MainCont>
                <AddSuspect />
                <br />
            </MainCont>
            <Profile />
        </Layout>
    );
}

export default AddSuspects;

function AddSuspect() {
    const { localData } = useContext(DataContext);
    const [caseloading, setCaseLoading] = useState(false);
    const [suspectloading, setAddingSuspectLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [error, setError] = useState("");
    const [caseid, setCaseId] = useState("");
    const [suspectname, setSuspectName] = useState("")
    const [mobnumber, setMobNumber] = useState("");
    const [addr, setAddr] = useState("")
    const [relation, setRelation] = useState("")
    const [note, setNote] = useState("");
    const [imageData, setImageData] = useState("");
    const file = useRef();

    function handlePreview() {
        file.current.click();

        file.current.addEventListener("change", (e) => {
            let fileData = file.current.files[0];
            let type = fileData.type.split("/")[1];
            let validType = ["png", "PNG", "JPEG", "JPG", "jpg", "jpeg"];

            if (!validType.includes(type)) {
                return notif.error("file isnt a valid type");
            }
            let reader = new FileReader();
            reader.readAsDataURL(fileData);
            reader.onload = () => {
                setImageData(reader.result);
            };

            reader.onerror = function () {
                return notif.error(reader.error);
            };
        });
    }

    useEffect(() => {
        (async function () {
            let options, url;
            try {
                url = apiRoutes.getCases;
                options = {
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

    async function addSuspect() {
        // validate input
        if (caseid === "") {
            return notif.error("case id is empty")
        }
        if (suspectname === "") {
            return notif.error("suspectname is empty")
        }
        if (mobnumber === "") {
            return notif.error("mobnumber is empty")
        }
        if (addr === "") {
            return notif.error("addr is empty")
        }
        if (relation === "") {
            return notif.error("relation is empty")
        }
        if (note === "") {
            return notif.error("note is empty")
        }
        if (imageData === "") {
            return notif.error("suspect image is empty")
        }

        let sendData = {
            userId: localData.id,
            caseId: caseid,
            suspectName: suspectname,
            phoneNumber: mobnumber,
            address: addr,
            relation,
            note,
            suspectImg: imageData
        }

        try {
            let url = apiRoutes.addSuspects;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(sendData)
            };
            setAddingSuspectLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            if (data && data.error === true) {
                setAddingSuspectLoading(false)
                return notif.error(data.message);
            }

            setAddingSuspectLoading(false);
            notif.success(data.message)
            setTimeout(() => {
                window.location.reload()
            }, 1200);
        } catch (err) {
            setAddingSuspectLoading(false);
            setError(err.message);
            notif.error(err.message);
        }
    }

    return (
        <div className="predict-cont">
            <div className="head">
                <h3>Add Suspects</h3>
            </div>
            <br />
            <div className="form-cont">
                <div className="box">
                    <label htmlFor="">Case ID</label>
                    <select className="select" onChange={(e) => setCaseId(e.target.value)}>
                        <option value="">
                            {caseloading ? "fetching cases..." : " --- case id ---"}
                        </option>
                        {caseloading ? (
                            <option value="">loading...</option>
                        ) : cases && cases.length === 0 ? (
                            <option value="">No case available, add case.</option>
                        ) : (
                            cases.map((list) => {
                                return (
                                    <option key={list.id} value={list.id}>{list.id}</option>
                                )
                            })
                        )}
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <input
                        type="text"
                        placeholder="Brad Frost"
                        defaultValue={suspectname}
                        onChange={(e) => setSuspectName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Mobile Number</label>
                    <input
                        type="number"
                        placeholder="Mobile Number"
                        defaultValue={mobnumber}
                        onChange={(e) => setMobNumber(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Address</label>
                    <input
                        type="text"
                        placeholder="Address"
                        defaultValue={addr}
                        onChange={(e) => setAddr(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Relation</label>
                    <input
                        type="text"
                        placeholder="Husband"
                        defaultValue={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="3" className="input" defaultValue={note}
                        onChange={(e) => setNote(e.target.value)}></textarea>
                </div>
                <div className="box">
                    <div className="media-cont">
                        <div className="left">
                            <div className="bx">
                                <label htmlFor="">Suspect Image</label>
                                <button
                                    className="upload"
                                    onClick={() => {
                                        handlePreview();
                                    }}
                                >
                                    Upload
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    className="file"
                                    ref={file}
                                />
                            </div>
                        </div>
                        <div className="right">
                            <img
                                src={imageData !== "" ? imageData : ""}
                                alt=""
                                className="preview"
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn" onClick={() => addSuspect()}>
                        {suspectloading ? "Adding suspect..." : "Add Suspect"}
                    </button>
                </div>
            </div>
        </div>
    );
}
