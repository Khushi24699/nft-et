import React, { useEffect, useState,useRef } from "react";
import Navbarr from "./Nav";
import {Button, Card, Form,Collapse,Alert} from "react-bootstrap";
import {useParams,Link} from "react-router-dom";
import axios from "axios";
import { CONTRACT_ADDRESS,ABI_ } from "../config/secondconfig";
import { CONTRACTADDRESS,ABI } from "../config/firstconfig";
import Web3 from "web3";

function User(props){
    const {id} = useParams();
    // const firstcontract = props.firstcontract;
    // const secondcontract = props.secondcontract;
    const[tokenlen,setTokenlen] = useState(0);
    const [tokens,setTokens] =useState();
    const[tokendetail,setToken] = useState([]);
    const[loading,setLoading] = useState(false);
    const valueref = useRef();
    const [price,setPrice] = useState([])
    const[tokenstate,setTokenstate] = useState([]);
    const web3 = new Web3(Web3.givenProvider)
    const firstcontract =  new web3.eth.Contract(ABI,CONTRACTADDRESS);
    const secondcontract  =  new web3.eth.Contract(ABI_,CONTRACT_ADDRESS);

    const gettokens = async(e)=>{
        try{
            console.log(firstcontract);
        //list the owned token
       var token = await firstcontract.methods.tokensofOwner(id).call();
        // console.log(token);
        const len = token.length;
        setTokenlen(len);
        console.log(len);
        // console.log(len,"length");
        var details =[];
        var states =[];
        setTokens(token);
            var prices =[];
        for (var i = 0;i< token.length;i++){
            const uri = await firstcontract.methods.tokenURI(token[i]).call();
            const url = `https://ipfs.io/ipfs/${uri}`;
            const detail = await axios.get(url).then(r=>r.data);
            details.push(detail);
            // console.log(token[i]);

            var price = await secondcontract.methods.tokenprice(token[i]).call();
            price  = web3.utils.fromWei(price,"ether");

            prices.push(price);

            const state = await secondcontract.methods.tokenstate(token[i]).call();
            console.log(state);
            states.push(state);
            // console.log(price);
        }
        setTokenstate(states);
        setPrice(prices);
        setToken(details);}
        catch(err){
            console.log(err);
        }
    }

    console.log(tokenlen,"Tokenlen");

useEffect(()=>{
    gettokens();
},[tokenlen]);



//place token for sale 
const handlesale = async(token_id,value)=>{
    try{
    const price  = web3.utils.toWei(value,"ether");
    //list the given token for sale by the owner
    console.log(price);
    const sellevent = await secondcontract.methods.listforsell(price,token_id).send({from:props.currentAccount});
    console.log(sellevent);
    //listen for sell event 
    const events = sellevent.events.listedforsale.returnValues[0];
    // alert("Token sold to "+ events)
    console.log(events);
    setLoading(false);
    }
    catch(err){
        console.log(err);
    }
}
//handle the approval of contract for selling your token 
const sale = async(token_id) =>{
try{
    const approvedaddress = await firstcontract.methods.getApproved(token_id).call();
    if (approvedaddress === CONTRACT_ADDRESS){
        console.log("Already approved")
    }
    else{
        alert("You nedd to approve contract to sale token on your behalf");
    const approve = await firstcontract.methods.approve(CONTRACT_ADDRESS,token_id).send({from:props.currentAccount});
    console.log(approve); }
}
catch(error){
    console.log(error);
}
}

//cancel the sale
const handlesalecancel = async(tokenid)=>{
    try{
        if(tokenstate[tokenid] ==0 ){
            alert("Token isnot for sale")

     }
        else {
            const sellcancel = await secondcontract.methods.cancelsell(tokenid).send({from:props.currentAccount});
            console.log(sellcancel);
        }
    
}
    catch(err){
        console.log(err);
    }

}

    return(
        <div className="userpage">
            <div className="nav-main">
                {gettokens}
            </div>
            
        <Navbarr
        currentAccount ={props.currentAccount}/>
        <div className="heading">
        <h3>Collectibles owned by you</h3>
        </div>
        <div className="display">
            {tokendetail.map((detail,key)=>(

            <Card  className="displaycard" key ={key}>
           <span> <img src={detail.image}
            height="100"
            width="100"/></span>
            <span>Name:{detail.name}</span>
            <span>Tokenid:{tokens[key]}</span>
            <span>Price:{price[key]}</span>
            < Link to ={`/details/${tokens[key]}`}> Details</Link>
            <Button onClick ={(event)=>
            {
                setLoading(!loading)
                sale(tokens[key]);
                //token ko state sanga check garnae tala loading pathako thau ma pathuanae 
                }}
                aria-controls ="example-collapse-text"
                aria-expanded={loading}> List for sell</Button>
                <br/>
                
                <Collapse in={loading}>
                    <div id="example-collapse-text">
                        <Form>
                            <Form.Control type="Number" placeholder="Enter the selling price in ether"
                            ref ={valueref}
                            />
                            <br/><Button onClick={(e)=>{
                                e.preventDefault();
                                const tokenid = tokens[key];//need to change 
                                const value = valueref.current.value;
                                handlesale(tokenid,value)
                            
                            }}
                            //onclick function modify garnu parnae xa 
                            >Submit</Button>
                        </Form>
                    </div>
                    </Collapse>
                    <br/>

                    <Button onClick ={(e)=>{
                        e.preventDefault();
                        const tokenid = tokens[key];
                        handlesalecancel(tokenid);
                    }}
                    disabled ={tokenstate[key] == 0}
                    
                    
                    >Cancel the sell</Button>
            </Card>           
              ))} 

            
    </div>
        </div>

    )

}
export default User;
