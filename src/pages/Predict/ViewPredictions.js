import React, { useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import Profile from '../../components/ProfileBar/Profile'
import LeftNavbar from '../../components/LeftNavbar'

import "./style.css"
import Layout from '../../components/Layout/Layout'
import { SuspectCards } from '../../components/Cards'


function ViewPredictions() {
    const [toggleAction, setToggleAction] = useState(false)

    return (
        <Layout>
            <LeftNavbar active="viewPredictions" />
            <MainCont>
                <h4>View Predictions</h4>
                <hr />
                <br />
                <SuspectCards setToggleAction={setToggleAction} toggleAction={toggleAction} />
            </MainCont>
            <Profile />
        </Layout>
    )
}

export default ViewPredictions