import React from "react";
import {Container, Navbar,Nav} from 'react-bootstrap';

function Navbarr(props){
 
    return(
        <div className="nav_main">
            <Navbar bg ="light" expand="lg">
            <Container>
                <Navbar.Brand href ="/">nft-et</Navbar.Brand>
                </Container>
                <Navbar.Toggle  aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className ="me-auto">
                    <Nav.Link href ={`/user/${props.currentAccount}`}
                    // ="/user"
                    >{props.currentAccount}</Nav.Link>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/explore">Explore Market</Nav.Link>
                        
                    </Nav>
                </Navbar.Collapse>
           
            </Navbar>

        </div>
    )
}
export default Navbarr;


