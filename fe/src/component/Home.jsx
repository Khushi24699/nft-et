import React, { useRef, useState } from "react";
import Navbarr from "./Nav";
import {Form,Button,Card} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../utils/Loader"
import ipfs from "../utils/ipfs";
import history from "../utils/history";
function Home(props){
    const nameref = useRef();
    const artistref = useRef();
    const [name,setName] = useState('');
    const[artist,setArtist] = useState('');
    const [loading,setLoading] = useState(false);
    const[buffer,setBuffer] = useState();
    const[ipfsHash,setIpfsHash] = useState();
    const[dataHash,setDataHash] = useState();
    
    
    // handle the NFT mint
    const minthandle = async (name,artist)=>{
        try{
       console.log(name);
       console.log(artist);
       console.log(buffer);
    setName(name);
    setArtist(artist);

    const metadata ={
        name:name ,
        image:`https://ipfs.io/ipfs/${ipfsHash}`,
        properties:{
            artist:artist ,
            timestamp: new Date()
        }
    }
    uploadmetadata(metadata);
    }
       catch(error){
           console.log(error);
       }

    }
    //upload data to blockchain
    const mintNft = async(tokenuri)=>{
        // const tokenuri = dataHash;
        const event =   await props.firstcontract.methods.mintNft(props.currentAccount,tokenuri).send({from:props.currentAccount});
       handlemint(event);

       console.log(tokenuri);

    }

    //to listen nftminted event
    const handlemint = (event)=>{
        setLoading(!loading);
        const result = event.events.NFTminted.returnValues[0];
        console.log(result); 
        history.push('/explore')

    }
    
   //upload metadata to ipfs
    const uploadmetadata = async(metadata )=>{
        const dataStr = JSON.stringify(metadata);
        var m_buffer = Buffer.from(dataStr);
        console.log("meta buffer", m_buffer);
        console.log(metadata);
        try{
            const d_hash = await ipfs.add (m_buffer);
            console.log(d_hash);
            setDataHash(d_hash[0].hash);
            console.log(d_hash[0].hash);
            await mintNft(d_hash[0].hash);
        }
        catch(err){
            console.log(err);
        }

    }
    //read the input file ,convert it into the buffer and upload to ipfs 
    const handlechange =async (event)=>{
        event.preventDefault();
        //capture the user file 
        const file = event.target.files[0];
        //Read the file
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend =()=>{
            let buffer = Buffer(reader.result);
            console.log("buffer", buffer);
            setBuffer(buffer);
        }
    }
    //upload the image to ipfs
    const uploadimage = async()=>{
        console.log(buffer);
        const ipfshash = await ipfs.add(buffer);
        setIpfsHash(ipfshash[0].hash);
        console.log(ipfshash[0].hash);
        console.log(ipfshash);

    }




    return(
        <div className="home_page">
            <Navbarr
            currentAccount ={props.currentAccount}/>
            <Loader 
            loading={loading}/>
            <div className="heading">
            <h3>
            Welcome to the nft-et 
         </h3>
         </div>
            <div className ="upload">
            <Card className="smallcard">
            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>
                        Upload your NFT
                    </Form.Label>
                    <Form.Control type ="File"  onChange={handlechange}/>
                </Form.Group>
            </Form>
            <Button onClick ={(event)=>{
                event.preventDefault();
                uploadimage();
            }}>Upload image </Button>
            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>
                       Name
                    </Form.Label>
                    <Form.Control type ="Text" ref={nameref}/>
                    <Form.Label>
                       owner
                    </Form.Label>
                    <Form.Control type ="Text"  ref ={artistref}/>
                </Form.Group>
            </Form>
            <Button onClick={(event)=>{ 
                // {setLoading(true);}  
                event.preventDefault();
                const name = nameref.current.value;
                const artist = artistref.current.value;
                minthandle(name,artist);  
            }}>Mint</Button>
            </Card>
            
            </div>
        </div>
    )
}
export default Home;