import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import DataContext from "../../context/DataContext";
import { Util, Notification } from "../../helpers/util"
import apiRoutes from "../../api_routes";

const util = new Util()
const notif = new Notification(4000)


function EditProfile() {
    const { showeditprofile, setShowEditProfile, localData } = useContext(DataContext);
    const [userData, setUserData] = useState([])
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [type, setType] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [showpwd, setShowPwd] = useState(false);
    const [password, setPassword] = useState("");
    const [updateloading, setUpdateLoading] = useState(false)
    const [fetchloading, setFetchLoading] = useState(false)

    //   fetch user info

    useEffect(() => {
        (async () => {
            // fetch user based on userid
            try {
                let url = apiRoutes.getOfficersId;
                let options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ userId: localData.id })
                }
                setFetchLoading(true)

                let res = await fetch(url, options);
                let data = await res.json();
                if (data && data.error === true) {
                    notif.error(data.message)
                    setUserData([])
                    return
                }
                setFetchLoading(false);
                let rs = data.data[0];
                setName(rs.userName)
                setMail(rs.mail)
                setType(rs.userRank)
                setPhoneNumber(rs.phoneNumber)

            } catch (err) {
                setFetchLoading(false);
                notif.error(err.message)
                setUserData([])
            }
        })()
    }, [])

    async function UpdateProfile() {
        try {
            let url = apiRoutes.editOfficer;
            let options = {
                method: "put",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    userId: localData.id,
                    userName: name,
                    email: mail,
                    phoneNumber,
                    password,
                    passwordState: showpwd,
                    rank: type
                })
            }
            setUpdateLoading(true)

            let res = await fetch(url, options);
            let data = await res.json();
            if (data && data.error === true) {
                setUpdateLoading(false);
                notif.error(data.message)
                setUserData([])
                return
            }
            setUpdateLoading(false);

            notif.success(data.message)
            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setUpdateLoading(false);
            notif.error(err.message)
        }
    }

    return (
        <div className="edit-container">
            <div className="head">
                <h3>Edit Profile</h3>
            </div>
            <div className="bx">
                <label htmlFor="">Full Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    defaultValue={fetchloading ? "loading.." : name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                />
            </div>
            <div className="bx">
                <label htmlFor="">Mail</label>
                <input
                    type="text"
                    placeholder="john@mail.com"
                    defaultValue={fetchloading ? "loading.." : mail}
                    onChange={(e) => setMail(e.target.value)}
                    className="input"
                />
            </div>
            <div className="bx">
                <label htmlFor="">Phonenumber</label>
                <input
                    type="number"
                    placeholder="john@mail.com"
                    defaultValue={fetchloading ? "loading.." : phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input"
                />
            </div>
            <div className="bx">
                <label htmlFor="">Type</label>
                <input
                    type="text"
                    placeholder="Inpector General"
                    defaultValue={fetchloading ? "loading.." : type}
                    onChange={(e) => setType(e.target.value)}
                    className="input"
                />
            </div>
            <div className="bx">
                <small>
                    edit password{" "}
                    <input
                        type="checkbox"
                        className="check"
                        onChange={(e) => {
                            if (e.target.checked === true) {
                                return setShowPwd(true);
                            }
                            return setShowPwd(false);
                        }}
                    />{" "}
                </small>
                {showpwd && (
                    <>
                        <label htmlFor="">Password</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            defaultValue={fetchloading ? "loading.." : password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </>
                )}
            </div>
            <div className="action">
                <button
                    className="cancel btn"
                    onClick={() => setShowEditProfile(!showeditprofile)}
                >
                    Cancel
                </button>
                <button className="save btn" disabled={updateloading ? true : false} onClick={() => UpdateProfile()}>
                    {updateloading ? "Updating Account" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

export default EditProfile;
