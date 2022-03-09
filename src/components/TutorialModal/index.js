import React, { useState } from 'react'
import img from "../../assets/img/angry.png"
import "./style.css"

import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa"

function Tutorial() {
    const [steps, setSteps] = useState(1);

    let tutorialBox;

    // save state in localStorage
    let visibleTutorial = true;
    // get state from localStorage
    if (localStorage.getItem("visibleTutorial") === null) {
        localStorage.setItem("visibleTutorial", JSON.stringify({ visibility: visibleTutorial }));
    }

    let { visibility } = JSON.parse(localStorage.getItem("visibleTutorial"))

    if (steps === 1) {
        tutorialBox = <Intro setSteps={setSteps} />
    }
    if (steps === 2) {
        tutorialBox = <Dashboard setSteps={setSteps} />
    }
    if (steps === 3) {
        tutorialBox = <AssignRoles setSteps={setSteps} />
    }
    if (steps === 4) {
        tutorialBox = <ViewCases setSteps={setSteps} />
    }
    if (steps === 5) {
        tutorialBox = <Users setSteps={setSteps} />
    }
    if (steps === 6) {
        tutorialBox = <AddSuspects setSteps={setSteps} />
    }
    if (steps === 7) {
        tutorialBox = <Predict setSteps={setSteps} />
    }
    if (steps === 8) {
        tutorialBox = <AddEvidence setSteps={setSteps} />
    }
    if (steps === 9) {
        tutorialBox = <ViewSuspects setSteps={setSteps} />
    }
    if (steps === 10) {
        tutorialBox = <ViewEvidence setSteps={setSteps} />
    }
    if (steps === 11) {
        tutorialBox = <ProfileTab setSteps={setSteps} />
    }
    if (steps === 12) {
        tutorialBox = <EditProfileInfo setSteps={setSteps} />
    }
    if (steps === 13) {
        tutorialBox = <Logout setSteps={setSteps} />
    }
    if (steps === 14) {
        tutorialBox = <IncomingRequest setSteps={setSteps} />
    }
    if (steps === 15) {
        tutorialBox = <OutTro setSteps={setSteps} />
    }

    return (
        <>
            {visibility && <div className="tutorial-cont">
                {tutorialBox}
            </div>}
        </>

    )
}

export default Tutorial

function Intro({ setSteps }) {
    return (
        <div className="head">
            <img src={img} alt="" />
            <br />
            <h3>Welcome !!!</h3>
            <p>Follow the tutorials by clicking <span className="br">Next</span> </p>
            <br />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function Dashboard({ setSteps }) {

    return (
        <div className='box-cont dashboard'>
            <p>Access Your Dashboard from here..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function AssignRoles({ setSteps }) {

    return (
        <div className='box-cont assignRoles'>
            <p>Assign other officers cases from here..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function ViewCases({ setSteps }) {

    return (
        <div className='box-cont viewCases'>
            <p>Veiw Cases from here..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function Users({ setSteps }) {

    return (
        <div className='box-cont users'>
            <p>Veiw Users from here..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function Predict({ setSteps }) {

    return (
        <div className='box-cont predict'>
            <p>Add prediction for <kbd>SUSPECTS</kbd> added..</p>
            <small>This should be done when suspect has been added for a particular <kbd>case</kbd>.</small>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function AddSuspects({ setSteps }) {

    return (
        <div className='box-cont addSuspects'>
            <p>Add suspects for a case..</p>
            <small>This should be done next as soon as a case is created, before prediction take place.</small>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function ViewSuspects({ setSteps }) {

    return (
        <div className='box-cont viewSuspects'>
            <p>View added <kbd>suspects</kbd> for a particular case..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function AddEvidence({ setSteps }) {

    return (
        <div className='box-cont addEvidence'>
            <p>Add Evidence for both <kbd>suspects</kbd> & <kbd>prediction</kbd> ..</p>
            <small>This should be created as when both <kbd>Suspects</kbd> and <kbd>Prediction</kbd> has been taking place. </small>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function ViewEvidence({ setSteps }) {

    return (
        <div className='box-cont viewEvidence'>
            <p>Veiw all created <kbd>evidence</kbd> for a particular case ..</p>
            <br />
            <FaArrowLeft className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function ProfileTab({ setSteps }) {

    return (
        <div className='box-cont profiletab'>
            <p> View your <kbd>profile</kbd> info from here ..</p>
            <br />
            <FaArrowRight className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function EditProfileInfo({ setSteps }) {

    return (
        <div className='box-cont editProfile'>
            <p>Edit <kbd>profile</kbd> account informations. </p>
            <br />
            <FaArrowRight className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function Logout({ setSteps }) {

    return (
        <div className='box-cont logout'>
            <p>Logout from your account.</p>
            <br />
            <FaArrowRight className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function IncomingRequest({ setSteps }) {

    return (
        <div className='box-cont incomingRequest'>
            <p>Veiw all incoming <kbd>officer registeration</kbd> requests. </p>
            <br />
            <FaArrowUp className='icon' />
            <button className="next btn" onClick={() => {
                setSteps((prev) => prev += 1)
            }}>Next Step</button>
        </div>
    )
}

function OutTro({ setSteps }) {
    return (
        <div className="head">
            <img src={img} alt="" />
            <br />
            <h3>Good Bye</h3>
            <p>Start exploring by clicking <span className="br">Continue</span> </p>
            <br />
            <small>If you feel lost during exploration, simply logout and login baclk for this tutorial to show up.</small>
            <button className="next btn" onClick={() => {
                // update localStorageData
                localStorage.setItem("visibleTutorial", JSON.stringify({ visibility: false }));
                window.location.reload(true)
            }}>Continue</button>
        </div>
    )
}
