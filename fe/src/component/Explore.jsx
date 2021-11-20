import React from "react";
import Navbarr from "./Nav";
import {Link} from "react-router-dom";
import {Card,Row,Col} from "react-bootstrap";
import logo from "../logo.svg";
function Explore(props){
    console.log(props.owners);
    console.log(props.details)
    
    return(
    <div className="explore">

    <Navbarr
    currentAccount ={props.currentAccount}/>
    <div className="heading">
        <h3>
            All the collectibles available in this contract
        </h3>
    </div>
    <div className="display">
        {props.details.map((details,key)=>(

        <Card  className="displaycard" key ={key}>
            <img src={details.image}
            height="200"
            width="200"/>
            <label>Name:{" "}<span>{details.name}</span></label>
            <label>Token Id:{" "}{key}</label>
            <Link to ={`/details/${key}`}
            > Details</Link>
            </Card>         ))}

            
    </div>
        </div>
        
    )
}
export default Explore;