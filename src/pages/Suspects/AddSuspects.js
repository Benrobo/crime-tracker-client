import React, { useState, useRef, useEffect } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { Notification, Util } from "../../helpers/util"

let notif = new Notification()
let util = new Util()

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
    )
}

export default AddSuspects

function AddSuspect() {

    const [imageData, setImageData] = useState("")
    const file = useRef()

    function handlePreview() {
        file.current.click()

        file.current.addEventListener("change", (e) => {
            let fileData = file.current.files[0]
            let type = fileData.type.split("/")[1];
            let validType = ["png", "PNG", "JPEG", "JPG", "jpg", "jpeg"]

            if (!validType.includes(type)) {
                return notif.error("file isnt a valid type")
            }
            let reader = new FileReader()
            reader.readAsDataURL(fileData)
            reader.onload = () => {
                setImageData(reader.result)
            }

            reader.onerror = function () {
                return notif.error(reader.error);
            };

        })
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
                    <select className="select">
                        <option value=""> --- case id ---</option>
                    </select>
                </div>
                <div className="box">
                    <label htmlFor="">Suspect Name</label>
                    <input type="text" placeholder="Brad Frost" defaultValue={"Brad Frost"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Mobile Number</label>
                    <input type="number" placeholder="Mobile Number" defaultValue={"07084486449"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Address</label>
                    <input type="number" placeholder="Address" defaultValue={"2, Penni street"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Relation</label>
                    <input type="number" placeholder="Husband" defaultValue={"Husband"} className="input" />
                </div>
                <div className="box">
                    <label htmlFor="">Note</label>
                    <textarea cols="30" rows="3" className="input"></textarea>
                </div>
                <div className="box">
                    <div className="media-cont">
                        <div className="left">
                            <div className="bx">
                                <label htmlFor="">Suspect Image</label>
                                <button className="upload" onClick={() => {
                                    handlePreview()
                                }}>Upload</button>
                                <input type="file" accept="image/*" hidden className="file" ref={file} />
                            </div>
                        </div>
                        <div className="right">
                            <img src={imageData !== "" ? imageData : ""} alt="" className="preview" />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="action">
                    <button className="cancel btn">Cancel</button>
                    <button className="add btn">Add Suspect</button>
                </div>
            </div>
        </div>
    )
}