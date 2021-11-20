import React from "react";
import BarLoader from "react-spinners/BarLoader";
import { css } from "@emotion/react";


function Loader(props){
    const override = css
    `display:block;
    width:100%;
    margin: 0 auto;
    
    
    `;
    return(
        <BarLoader loading={props.loading}  css ={override}size={10}/>
    )


}
export default Loader;