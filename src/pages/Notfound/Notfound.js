import React, { useContext } from 'react'
import "./style.css"
import img from "../../assets/img/angry.png"
import DataContext from '../../context/DataContext'

function Notfound() {
    const { localData } = useContext(DataContext)
    return (
        <div className="notfound">
            <img src={img} className="img" />
            <h4>You No See Road, Abi You Wan Collect <span className="tbt">2-by-2</span> .</h4>
            <p>Go back jor mumu</p>
            <br />
            <button className="home" onClick={() => {
                window.location = `http://localhost:3000/officer/dashboard/${localData.id}`
            }}>
                Go Home Jor.
            </button>
        </div>
    )
}

export default Notfound