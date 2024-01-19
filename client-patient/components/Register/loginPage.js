// import style from "../styles/Home.module.css";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import {useState, useEffect} from "react";
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import OtpInput from 'react-otp-input';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import axios from "axios";
import MessagePrompt from "../../components/messagePrompt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LeftView from "./leftView";
import View1 from "./view1";
import View2 from "./view2";
import FamilyTree from "./familyTree";
import CreateAccountForm from "./createAccountForm";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "0",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function LoginPage({firebase,setPage}) {
  const router = useRouter();
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [view, setView] = useState(0);
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileError, setMobileError] = useState("");
  const [msgData, setMsgData] = useState({});
  const [loader, setLoader] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [token, setToken] = useState("");
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
    loginSubmit();
  }
  const loginSubmit = () =>{
    console.log("loginSubmit");
    // if (mobileNo.length !== 10) {
    //   setMobileError({ phone: "Phone number should be of ten digits" });
    //   return false;
    // } 
    console.log("isNaN(parseInt(mobileNo)): ",isNaN(parseInt(mobileNo)));
    if(isNaN(parseInt(mobileNo))){
      setMobileError({ phone: "Please enter only numbers" });
      setMsgData({ message: "Please enter only numbers", type: "error" });

      return false
    }
    let data = {
      // phoneNumber:mobileNo
      phoneNumber:`${countryCode}-${mobileNo}`
    }
    console.log("data: ",data);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/users/sendphoneotp", data)
      .then((res) => {
        let data = res.data.data;
        // if(data.isExistingUser === false){
        //   setMsgData({ message: "Not a registered user, please register.", type: "error" });
        //   // router.push("/createAccount");
        //   setLoader(false);
        // }
          console.log("data: ",data);
          setIsExistingUser(data.isExistingUser);
          if(data.rainbowExistingUserCount >0){
            setRainbowUser(true);
          }
          setView(1);
          setLoader(false);
      })
      .catch((err) => {
        console.log("err",err.response.data[0].message);
        setMsgData({ message: err.response.data[0].message, type: "error" });

        setLoader(false);
      });
    // setView(1);
  }

  const login = ()=>{
    if(otp.length != 4){
      setMsgData({ message: "Enter a 4 digit valid OTP", type: "error" });
      return false;
    }
    let data = {
      // phoneNumber:mobileNo,
      phoneNumber:`${countryCode}-${mobileNo}`,
      otp: otp,
      isMobileClient : true
    }
    setLoader(true);
    // router.push("/home")
    // return false;
    axios
      .post(config.API_URL + "/api/users/phoneotpsignin", data)
      .then((res) => {
        console.log("res: ",res);
        localStorage.setItem("userDetails",JSON.stringify(res.data.data));

        if (res.data.data.token) {
          if (process.browser) {
            console.log("res.data.token: ",res.data.data.token);
            setCookie("cookieVal", res.data.data.token, { path: "/" });
          }
          let response = res.data.data;
          firebase
          .auth()
          .signInWithEmailAndPassword(response.emailId, response.emailId)
          .then((user) => {

            if (firebase) {
              console.log('firebase authentication done');
              console.log("user.user.uid: ",user.user.uid)
              localStorage.setItem("UUID", JSON.stringify(user.user.uid));
              // Call api for uid while login
              const data = {
                userId: response.id,
                uid: user.user.uid,
              };

              const headers = {
                authtoken: response.token,
              };

              axios
                .post(config.API_URL + "/api/notification/uid/update", data, {
                  headers,
                })
                .then((res) => {
                  console.log('Updated UID successfully! and redirect to app list');
                  // router.push("/home");
                })
                .catch((err) => console.log("error occured while notifying to server (1) "));

              console.log('Create instance of firebase messaging!');
              const messaging = firebase.messaging();
              messaging
                .requestPermission()
                .then(() => {
                  console.log('firebase messaging request approved');
                  // return messaging.getToken()
                  return messaging.getToken({
                    vapidKey: process.env.vapidKey,
                  });
                })
                .then((token) => {
                  const headers = {
                    authtoken: response.token,
                  };
                  let data = {
                    uuid: user.user.uid,
                    token: token,
                    voiptoken: "",
                    deviceType: "chrome",
                  };

                  axios
                    .post(
                      config.API_URL + "/api/notification/token/update",
                      data,
                      {
                        headers,
                      }
                    )
                    .then((res) => {
                      console.log('notification token update');
                      console.log("test 2", res);
                    })
                    .catch((err) =>
                      console.log("error occured while notifying to server (2)")
                    );
                })
                .catch((err) => {
                  console.log('firebase messaging error occurred');
                  console.log("error: ", err);
                  console.log('--------------------');
                });
            }
            console.log('about to redirect you app list page');
            // On successful authetication redirect the user to appointment-list page
            // router.push("/home")
          })
          .catch((error) => {
            console.log('error occurred while sign-in');
            // let errorCode = error.code;

            // // Create account of user if the error message and code is email not found
            // if (errorCode === "auth/user-not-found") {
            //   newAccountFirebase(
            //     firebase,
            //     response.emailId,
            //     password,
            //     response,
            //     response.token
            //   );
            // }
          });


        }
      //   router.push("/home")
         setPage(3);
        // setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        console.log("err",err, err.response.data[0].message)
        setMsgData({ message: err.response.data[0].message, type: "error" });
        if(err.response.data[0].message == "Invalid OTP"){
          setOtp("");
        }
        setLoader(false);
      });
  }

  const register = ()=>{
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
  const otpSubmitBtn = () =>{
    console.log("otpSubmitBtn",isExistingUser)
    if(isExistingUser === true){
      login();
    }else{
      register();
    }
  }
  
  return (
    <div className="mainDiv">
      <MessagePrompt msgData={msgData} />
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {view != 2 && <img src="bg4.png" style={{height: "100%", width:"100%", position:"absolute"}}/>}
      <Grid container direction="column" className="innerDiv">

        {view === 0 && <div>
          <LeftView />
          <View1 mobileNo = {mobileNo} setMobileNo = {setMobileNo} countryCode = {countryCode} setCountryCode={setCountryCode} mobileSubmitBtn = {loginSubmit} setMsgData = {setMsgData} />
        </div>}
        {view === 1 && <Grid item xs={12}>
          <LeftView />
          <View2 otp = {otp} setOtp = {setOtp} resendOtp = {resendOtp} setView = {setView} countryCode = {countryCode} mobileNo = {mobileNo} otpSubmitBtn = {otpSubmitBtn} seconds = {seconds}/>
          </Grid>
        }
        {view === 2 && 
            <CreateAccountForm mobileNo = {mobileNo} token = {token} countryCode = {countryCode}  setPage = {setPage}/>
          }
          {view === 3 && <FamilyTree phoneNo = {`${countryCode}-${mobileNo}`} setPage = {setPage}/>}
        {/* {view === 2 && <FamilyTree />} */}
      </Grid>
    </div>
  )
}

export default LoginPage
