import React, { useEffect, useState } from"react";
import {Route,Link,BrowserRouter, Switch} from "react-router-dom";
import Explore from "./component/Explore";
import Home from "./component/Home";
import Details from "./component/Details";
import User from "./component/User";
import getWeb3 from "./getWeb3";
import Token from "./contracts/Token.json";
import Tokenmarket from "./contracts/Tokenmarket.json";
import { CONTRACTADDRESS,ABI } from "./config/firstconfig";
import { CONTRACT_ADDRESS,ABI_ } from "./config/secondconfig";
// import "bootstrap/dist/css/bootstrap.min.css";
 import "./App.css";
import axios from "axios";
function App(){
  const[currentAccount,setCurrentAccount]= useState('');
  const[firstcontract,setFirstContract] = useState({});
  const[secondcontract,setSecondContract] = useState({});
  const[owners,setOwners] = useState([]);
  const[tdetails,setTdetails] = useState([]);
  const[web3,setWeb3] = useState();
  const getweb3data = async()=>{
    try{
    const web3 = await getWeb3();
    setWeb3(web3);
    //get the address from metamask
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    
    //get the networkid 
    const networkid = await web3.eth.net.getId();
    console.log(networkid);

    const networkdeployed = Token.networks[networkid];
   
    //get the instance of first contract
    // const firstinstance = await new  web3.eth.Contract(Token.abi,networkdeployed&& networkdeployed.address);
    const firstinstance = await new web3.eth.Contract(ABI,CONTRACTADDRESS);
    console.log(firstinstance);

    //get the instance of second contract
    // const secondinstance = await new web3.eth.Contract(Tokenmarket.abi, networkdeployed && networkdeployed.address);
      const secondinstance = await new web3.eth.Contract(ABI_,CONTRACT_ADDRESS);
    console.log(secondinstance);

    //set the first contract
    setFirstContract({...firstinstance});

    //set the second contract 
    setSecondContract({...secondinstance});

    //set the currentAccount 
    setCurrentAccount(accounts[0]);
    //list the tokens owned by the owner
    let tokens = [];
    tokens = await firstinstance.methods.tokensofOwner(accounts[0]).call();
    console.log(tokens);
   
    let token ;
    //display the total token in the contract
    token = await firstinstance.methods.tokenIds().call();
    // console.log(token.outputs);
    console.log(token);
      const baseuri = `https://ipfs.io/ipfs/`;
    const uri=  await firstinstance.methods._setbaseURI(baseuri).call();
    console.log("uri", uri);
    var t_details = [];
    var owners = [];
    //get the token uri and retrieve metadata form the ipfs
    for (var i=0;i< token;i++){
      const owner = await firstinstance.methods.ownerOf(i).call();
      const uri = await firstinstance.methods.tokenURI(i).call();
      const url = `https://ipfs.io/ipfs/${uri}`;//get the uri where metadata is stored.
      const detail = await axios.get(url).then(r=>r.data);//get json data 
      owners.push(owner);
      t_details.push(detail);
      console.log(detail);
      console.log(i);
      console.log(uri);
      console.log(url);
      console.log(owner);
    }
    setOwners(owners);
    setTdetails(t_details);

    const price = await secondinstance.methods.tokenstate(0).call({from:currentAccount});
    console.log(price);

  }
  catch(error){
    alert("consult console");
    console.log(error);
  }
  }

  const tokendetails = async()=>{
    let tokens ;
    console.log(firstcontract)
    tokens = await firstcontract.methods.tokenIds.call();
    console.log(tokens);

    
  }
  useEffect(()=>{
    getweb3data();
  },[]);

  return(
    <BrowserRouter>
    <Switch>
        <Route path="/" exact >

   <Home 
   currentAccount ={currentAccount}
   firstcontract={firstcontract}/>
   </Route>
   <Route path ='/explore' exact>
    <Explore 
    currentAccount ={currentAccount}
    details ={tdetails}
    owners={owners}/>
    </Route>
    <Route path ="/details/:id" >
      <Details 
      currentAccount ={currentAccount}
      firstcontract ={firstcontract}
      secondcontract={secondcontract}
      web3 = {web3}/>
    </Route>
    <Route path ="/user/:id" >
      <User 
      currentAccount ={currentAccount}
      firstcontract ={firstcontract}
      secondcontract={secondcontract}
      web3 = {web3}
      />
    </Route>
    </Switch>
    </BrowserRouter>

  )
}
export default App;