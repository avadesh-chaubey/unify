import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import TextField from '@material-ui/core/TextField';

import CheckIcon from '@material-ui/icons/Check';
import config from "../app.constant";
import axios from "axios";
import MessagePrompt from "../components/messagePrompt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCookies } from "react-cookie";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CreateAccountForm from "../components/Register/createAccountForm";
import View1 from "../components/Register/view1";
import View2 from "../components/Register/view2";
import LeftView from "../components/Register/leftView";
import FamilyTree from "../components/Register/familyTree";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "0"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function createAccount({firebase}) {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [view, setView] = useState(0);
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNo, setMobileNo] = useState("");
  const [msgData, setMsgData] = useState({});
  const [loader, setLoader] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [rainbowUser, setRainbowUser] = useState(false);
  
  useEffect(() => {
    if(view === 1){
      if(seconds>0){
        setTimeout(() => setSeconds(seconds - 1), 1000);
      }
    }
  }, [view, seconds])
  const resendOtp = () =>{
    console.log("resendOtp");
    setSeconds(60);
    mobileSubmitBtn();
  }
  

  const mobileSubmitBtn = () =>{
    console.log("mobileSubmitBtn");
    let data = {
      phoneNumber:`${countryCode}-${mobileNo}`
    }
    console.log("data: ",data)
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/users/sendphoneotp", data)
      .then((res) => {
        console.log("res: ",res)
        let data = res.data.data;
        if(data.isExistingUser === true){
          setLoader(false);
          setMsgData({ message: "User already exists. Please login.", type: "error" });
          return false;
        }
        if(data.rainbowExistingUserCount >0){
          setRainbowUser(true);
        }
        setView(1);
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data[0].message, type: "error" });
        setLoader(false);
      });
  }
  const [token, setToken] = useState("");
  const otpSubmitBtn = () =>{
    console.log("otpSubmitBtn")
    if(otp.length != 4){
      setMsgData({ message: "Enter a 4 digit valid OTP", type: "error" });
      return false;
    }
    let data = {
      // phoneNumber:mobileNo,
      phoneNumber:`${countryCode}-${mobileNo}`,
      otp: otp,
      // isMobileClient:true
    }
    setLoader(true);
    axios
      .post(config.API_URL + "/api/users/phoneotpverify", data)
      .then((res) => {
        console.log("res: ",res)
        setToken(res.data.data.token);
        if(rainbowUser === true){
          setView(3);
          setLoader(false);
          return false;
        }
        setView(2);
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        if(err.response.data.errors[0].message == "Invalid OTP"){
          setOtp("");
        }
        setLoader(false);
      });
  }
  
  return (
    <div className="mainDiv">
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <MessagePrompt msgData={msgData} />
      {/* <Container maxWidth="sm"> */}
        {view != 2 && <img src="bg4.png" style={{height: "100%", width:"100%", position:"absolute"}}/>}
        <Grid container direction="column" className="innerDiv">
          {view === 0 && <div>
            <LeftView />
            
            <View1 title = {"Register"} mobileNo = {mobileNo} setMobileNo = {setMobileNo} countryCode = {countryCode} setCountryCode={setCountryCode} mobileSubmitBtn = {mobileSubmitBtn}/>
          </div>}
          {view === 1 && <Grid item xs={12}>
              <LeftView />
              
            <View2 otp = {otp} setOtp = {setOtp} resendOtp = {resendOtp} setView = {setView} countryCode = {countryCode} mobileNo = {mobileNo} otpSubmitBtn = {otpSubmitBtn} seconds = {seconds}/>
            </Grid>
          }
          {view === 2 && 
            <CreateAccountForm mobileNo = {mobileNo} token = {token} countryCode = {countryCode}  />
          }
          {view === 3 && <FamilyTree phoneNo = {`${countryCode}-${mobileNo}`}/>}
        </Grid>
      {/* </Container> */}
        
    </div>
  )
}

export default createAccount
