import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import config from "../../app.constant";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCookies } from "react-cookie";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router';
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: "0"
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function View1(props) {
    const {mobileNo, setMobileNo, countryCode, setCountryCode,mobileSubmitBtn,setMsgData} = props;
    const classes = useStyles();
    const router = useRouter();
    const [cookies, setCookie] = useCookies(["name"]);
    const [mobileError, setMobileError] = useState("");
    const [title, setTitle] = useState("Login");
    const [countryIsdList,setCountryIsdList] = useState([]);

    const gotoLogin = () =>{
        // console.log("gotoLogin");
        // router.push("/");
        setTitle("Login");
    }
    const gotoCreateAccount = () =>{
      // console.log("gotoCreateAccount:")
      // router.push("/createAccount");
      setTitle("Register");    }
    useEffect(()=>{
        axios
          .get(config.API_URL + "/api/utility/countryandisd")
          .then((res) => {
            console.log("res: ",res);
            let tempArr = res.data.data;
            tempArr.sort(function(a, b) {
              if(a.countryName < b.countryName) { return -1; }
              if(a.countryName > b.countryName) { return 1; }
              return 0;
              // return b.countryName - a.countryName ;
            });
            // setCountryIsdList(res.data.data);
            setCountryIsdList(tempArr);
          })
          .catch((err) =>{ 
            console.log("err",err)
            setMsgData({ message: err.response.data.errors[0].message, type: "error" });
          });
    
    },[])
      function handelPhoneNumber(inputtxt) {
        // setPhone(inputtxt.target.value);
        const {
          target: { value },
        } = event;
        setMobileError({ phone: "" });
        // setPhone(value);
        // let reg = new RegExp(/^\d*$/).test(value);
        // if (!reg && value.length === 10) {
        //   setMobileError({ phone: "Please enter valid phone number" });
        // }
    
        let reg = new RegExp(/^-?\d*$/).test(value);
        if (!reg) {
          setMobileError({ phone: "Please enter only numbers" });
        }else{
          setMobileNo(value);
        }
        // if(value.length > 10){
        //   setMobileError({ phone: "Phone number should be of ten digits" });
        // }
    
      }
    return (
        <div className="rightSec">
        <div style={{textAlign:"center", fontSize:"20px", fontWeight:"bold", color:"#4B2994"}}>
          {title} 
        </div>
        <div style={{textAlign:"center", fontSize:"15px",padding:"10px 20%", color:"#6B6974"}}>
          Enter your mobile number, we will send you an OTP to verify
        </div>
        <div style={{textAlign:"center", marginTop:"40px"}} className="mobileText">
          <FormControl className={classes.formControl} style={{background:"#E9EAED"}}>
            <Select
              // defaultValue={"+91"}
              value={`${countryCode}`}
              onChange={(e)=>setCountryCode(e.target.value)}
              displayEmpty
              className={classes.selectEmpty}
              inputProps={{ 'aria-label': 'Without label' }}
              renderValue={(value) => `${value}`}
              style={{width: "70px", marginTop:"0", height:"45px", fontSize:"15px", color:"#6B6974",margin:"0px !important"}}
            >
              {countryIsdList.length > 0 &&
                countryIsdList.map((item, i) => (
                  <MenuItem key={"code-" + i} value={item.phoneCode}>
                    {`${item.phoneCode}  ${item.countryName} `}
                  </MenuItem>
                ))}
            </Select>
            {/* <FormHelperText>Without label</FormHelperText> */}
          </FormControl>
          <TextField 
            id="Mobile No" 
            // label="Mobile no"
            variant="filled"
            style={{width:"50%", background:"#F6F7FA", height:"45px", fontSize:"15px", color:"#6B6974"}}
            error={Boolean(mobileError?.phone)}
            helperText={mobileError?.phone}
            onChange = {handelPhoneNumber}
            inputProps={{ 'aria-label': 'Without label' }}
            className="mobileTextField"
          />
        </div>
        <div style={{textAlign:"center", marginTop:"30px"}}>
          <Button
              id="go-login"
              size="small"
              variant="contained"
              // color="secondary"
              className="mainBtn"
              onClick={mobileSubmitBtn}
              style={{width:"200px"}}
            >
              Continue
            </Button>
        </div>
        {title === "Register" && <div style={{textAlign:"center", fontSize:"14px",marginTop:"20px"}}>
          Already have an Account? <span style={{fontWeight:"bold", cursor:"pointer", color:"#4B2994"}} onClick={gotoLogin}>Login</span>
        </div>}
        {title === "Login" && <div style={{textAlign:"center", fontSize:"14px",marginTop:"20px"}}>
          Don't have an Account? <span style={{fontWeight:"bold", cursor:"pointer", color:"#4B2994"}} onClick={gotoCreateAccount}>Register</span>
        </div>}
      </div>
    )
}

export default View1
