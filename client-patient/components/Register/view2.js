import React, {useState, useEffect} from 'react'

import Button from "@material-ui/core/Button";
import OtpInput from 'react-otp-input';
function View2(props) {
  const {otp, setOtp, resendOtp, countryCode, mobileNo, seconds, otpSubmitBtn} = props;
  const handleChange = (val) =>{
    setOtp(val)
  }
  
    return (
      <div className="rightSec" style={{margin:"11% 0px"}}>
        <div style={{textAlign:"center", marginBottom:"20px"}}>
          <img src="otp_mobile_screen.svg" style={{height: "14vh"}}/>
        </div>
        <div style={{textAlign:"center", fontSize:"20px", fontWeight:"bold", color:"#4B2994"}}>
          Verification Code 
        </div>
        <div className="mobileText">
          <div style={{color:"#6B6974", marginTop:"20px", textAlign:"center"}}>Enter OTP code sent to your mobile {countryCode} {mobileNo} </div>
          <div className="otpDiv">
            <OtpInput
              value={otp}
              onChange={(e)=>{handleChange(e)}}
              numInputs={4}
              separator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
              isInputNum = {true}
              inputStyle={{width:'35px', height:"35px"}}
              containerStyle={{border:"none"}}
              shouldAutoFocus = {true}
            />
          </div>
        </div>
        <div className="resend timer">
          <span>00:{seconds > 9 ? seconds : "0"+ seconds}</span>
        </div>
        {/* {seconds >0 ?  */}
        <div className="resend">Didn't get OTP ? {seconds > 0 ? <span className = "link"> RESEND </span> : <span className = "active" onClick={resendOtp}> RESEND </span>}</div>
        {/* : */}
        {/* <div className="resend link" onClick={resendOtp}>RESEND</div> */}
        {/* } */}
        <div style={{textAlign:"center"}}>
          <Button
              id="OTP Submit Btn"
              size="small"
              variant="contained"
              className="mainBtn"
              onClick={otpSubmitBtn}
              style={{width:"200px", marginTop:"10px"}}
            >
              Continue
            </Button>
        </div>
      </div>
    )
}

export default View2
