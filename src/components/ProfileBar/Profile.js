import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import { HiOutlineCog } from 'react-icons/hi'
import { FiEdit } from 'react-icons/fi'
import DataContext from '../../context/DataContext'
import { Util } from '../../helpers/util'
import apiRoutes from '../../api_routes'
import "./style.css"

const util = new Util()

function Profile() {
    const { showeditprofile, setShowEditProfile, localData } = useContext(DataContext)
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { id, role, rank } = util.getLocalstorageData();


    useLayoutEffect(() => {
        (async () => {
            // fetch user based on userid
            let cache = {}
            let url, options;

            try {
                url = apiRoutes.getOfficersId;
                options = {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${localData.refreshToken}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ userId: id })
                }
                setLoading(true)

                let res = await fetch(url, options);
                let data = await res.json();
                if (data && data.error === true) {
                    setError(data.message)
                    setUserData({})
                    return
                }

                setLoading(false);
                cache = data.data[0];
                setUserData({ ...cache })
                setError("")


            } catch (err) {
                setLoading(false);
                setError(err.message)
                setUserData({})
            }
        })()
    }, [])


    return (
        <div className="profile-container">
            {loading === false && Object.entries(userData).length > 0 ?
                error === "" ?
                    <>
                        <div className="user-info">
                            <img src={`https://avatars.dicebear.com/api/micah/${userData.userName}.svg`} alt="" />
                            <h4>{userData.userName}</h4>
                            <small>{userData.mail}</small>
                            <br />
                            <br />
                            <p className="">{rank.toUpperCase()}</p>
                            <p><kbd>{role}</kbd></p>
                        </div>
                        <br />
                        <div className="action">
                            {/* <HiOutlineCog className="icon" /> */}
                            <FiEdit className="icon" onClick={() => setShowEditProfile(!showeditprofile)} />
                        </div>
                    </>
                    :
                    <p>{error}</p>
                :
                "Loading...."
            }
        </div>
    )
}

export default Profile