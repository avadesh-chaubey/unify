import router from 'next/router';
import React,{useState, useEffect} from 'react';
import axios from "axios";
import config from "../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import BlogDetailsPage from "../components/blog/blogDetailsPage";

function blogDetails() {
  
  const backBtnClick = () =>{
    console.log("backBtnClick: ");
    router.push("/blogList");
  }
  return (
    <div>
      <div className="orderTitle">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", top:"17px", left:"10px"}} onClick={backBtnClick}/>
        {/* <div style={{marginLeft: "40px"}}>
          Blog List
        </div> */}
      </div>
      <div className="mainDiv2" style={{backgroundColor:"#ededed"}}>
        <BlogDetailsPage />
      </div>
    </div>
  )
}

export default blogDetails
