import React,{useEffect, useState} from 'react';
import axios from "axios";
import config from "../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import BlogListing from "../components/blog/blogListing"
function blogList() {
  const backBtnClick = () =>{
    router.push("/home");
  }
  return (
    <div>
      <div className="orderTitle">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", top:"17px", left:"10px"}} onClick={backBtnClick}/>
        <div style={{marginLeft: "40px"}}>
          Blog List
        </div>
      </div>

      <div className="mainDiv2">
        <BlogListing />
      </div>
    </div>
  )
}

export default blogList
