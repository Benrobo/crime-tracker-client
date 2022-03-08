import React, { createContext, useState } from "react";

import { Util } from "../helpers/util";

const DataContext = createContext();

export default DataContext;

const util = new Util();

export function DataContextProvider(props) {
    const [authUserInfo, setAuthUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // localstorageData
    const decodedLocalData = util.getLocalstorageData();
    const localData = JSON.parse(localStorage.getItem("crime-tracker"))

    // validat5e userid
    if (util.isLoggedIn()) {
        if ((decodedLocalData.id !== localData.id) || (decodedLocalData.role !== localData.role)) {
            localStorage.clear()
            window.location.reload(true)
        }
    }

    //   togle profile edit container
    const [showeditprofile, setShowEditProfile] = useState(false)


    // log the user out
    function logout() {
        localStorage.clear();
        util.redirect("/signin", 100);
    }
    return (
        <DataContext.Provider value={{ logout, decodedLocalData, localData, showeditprofile, setShowEditProfile }}>
            {props.children}
        </DataContext.Provider>
    );
}
