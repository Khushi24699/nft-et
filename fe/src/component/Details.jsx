import React, { useEffect, useRef, useState } from "react";
import {Card ,Col,Row,Image,Button,Collapse,Form} from "react-bootstrap";
import Navbarr from "./Nav";
import Loader from "../utils/Loader"
import {useHistory,useParams} from "react-router-dom";
import axios from "axios";

function Details(props){
    const {id} = useParams();
    const [owner,setOwner] = useState('');
    const[Loading,setLoading] = useState(false);
    const priceref = useRef();
    const secondcontract = props.secondcontract;
    const firstcontract = props.firstcontract;
    const[data,setData] = useState({});
    const[artist,setArtist] = useState();
    const[timestamp,setTimestamp] = useState();
    const[forsale,setForsale] = useState(true);
    const[price,setPrice] = useState();
    // console.log(contract);
    const getdetails = async()=>{
        try{
            //identitfy the owner of the token 
        const owner = await firstcontract.methods.ownerOf(id).call();
        setOwner(owner);
        //obtain the URI of the token
        const uri = await firstcontract.methods.tokenURI(id).call();
        console.log(uri);
        const url = `https://ipfs.io/ipfs/${uri}`;
        console.log(url);
        const detail = await axios.get(url).then(r=>r.data);
        console.log(detail);
        setData({...detail});
        // console.log(firstcontract.address);
        setArtist(detail.properties.artist);
        setTimestamp(detail.properties.timestamp);

        //get whether the token is listed for sale or not
        const state = await secondcontract.methods.tokenstate(id).call();
        console.log(state);
        if(state ==0){
            setForsale(false);
        }

        var price = await secondcontract.methods.tokenprice(id).call();
        price = props.web3.utils.fromWei(price,"ether")
        console.log(price);
        // price =props.web3.utils.toWei(price,"ether");
        setPrice(price);
        // const timestamp = Date.now();
        // console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(timestamp));

    }
    catch(err){
    console.log(err);
}}

const handlebuy = async(value)=>{
    if(owner === props.currentAccount){
        alert("Owner cannot buy it's own token")
    }
    else{
    try{
        value =props.web3.utils.toWei(value,"ether");
        const buyevent = await secondcontract.methods.buytoken(id).send({from:props.currentAccount,value:value});
        console.log(buyevent);
        setLoading(!Loading);
    }
    catch(err){
        console.log(err);
    }}
}
    useEffect(()=>{
        getdetails();
    },[])

    const[loading,setloading] = useState(false)
    return(
        <div className="detailspage">
            <Navbarr
            currentAccount ={props.currentAccount}/>
            <Loader
            loading={loading}/>
            <div className="heading">

            <h3>  about the token number {id}</h3>
            </div>
            <div className ="details">
            <Card>
                <Row>
                <Col  xs ={5} md ={3}className="image">
                <span><Image src={data.image}
                 style={{maxWidth:'10rem'}}
                 rounded
                 /></span>
                 <br/>
                 <a href={data.image} target="_blank">View the art </a>
                </Col>
                {/* <div className="imagedetails"> */}
                <Col  xs={6} md ={9} className="artdetails">
                    <span>Name:{" "}{data.name}</span>
                    <br/>
                    Owner:<span>{" "}{owner}</span>                   
                    <br/>
                    <span>Token Id:{" "}{id}</span>
                    <br/>
                    <span>Artist:{" "}{artist}</span>
                    <br/>
                    <span>Uploaded Timestamp:{" "}{timestamp}
                        </span>
                    <br/>
                    <span>Price:{" "}{price} Ether</span>
                    <br/>
                    
                    <Button onClick={(event)=> 
                    setLoading(!Loading)
                    }
                        aria-controls ="example-collapse-text"
                        aria-expanded ={Loading}
                        disabled={!forsale || props.currentAccount === owner}
                        >Buy Token</Button>
                        <Collapse in={Loading}>
                    <div id="example-collapse-text">
                        <Form>
                            <Form.Control type="Number" placeholder="Enter the price in ether"
                            ref ={priceref}/>
                            <br/><Button onClick={()=>{
                            const price = priceref.current.value;
                                handlebuy(price)}}
                            >Submit</Button>
                        </Form>
                    </div>
                    </Collapse>
                </Col>
                </Row>
            </Card>
        </div>
        </div>
    )
}
export default Details;