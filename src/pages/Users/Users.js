import React, { useState, useContext, useEffect } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { UserCards } from '../../components/Cards'
import DataContext from '../../context/DataContext'
import apiRoutes from '../../api_routes'
import { Util, Notification } from '../../helpers/util'

const util = new Util();
const notif = new Notification();

function Users() {
    const { localData } = useContext(DataContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState([]);

    const [toggleAction, setToggleAction] = useState(false)

    // fetch all users
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

    return (
        <Layout>
            <LeftNavbar active="users" />
            <MainCont>
                <div className="head">
                    <h5>Registered Users</h5>
                </div>
                <hr />
                <br />

                <div className="users-cards-cont">
                    {
                        loading ?
                            <p>fetching users....</p>
                            :
                            error !== "" ?
                                <p>{error}</p>
                                :
                                data && data.length === 0 ?
                                    <p>No officers were found</p>
                                    :
                                    data.map((users, i) => {
                                        return (

                                            <UserCards setToggleAction={setToggleAction} toggleAction={toggleAction}
                                                key={i}
                                                id={users.userId}
                                                name={users.userName}
                                                mail={users.mail}
                                                rank={users.userRank}
                                                role={users.userRole}
                                                date={users.joined}
                                            />
                                        )
                                    })
                    }
                </div>
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default Users
