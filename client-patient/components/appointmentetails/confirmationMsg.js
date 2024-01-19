import React, {useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import CircularProgress from "@material-ui/core/CircularProgress";

function ConfirmationMsg() {
  const [loader, setLoader] = useState(false);

  const submitConfirm = () =>{
    console.log("submitConfirm ");
    router.push("/myOrder");
    setLoader(true)
  }
  return (
    <div className="pageView confirmPage">
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <DialogTitle id="alert-dialog-title">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={(e)=>backBtnClick("3")}/>
        <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Booking Confirmed</div>
      </DialogTitle>
      
      <div>
        <img src="/confirm_Sign.svg" style={{marginLeft:"50%", transform: "translateX(-50%)", marginTop:"20%"}}/>
        <div style={{color : "#545454", fontSize:"20px", width:"70%", marginLeft:"25%", marginTop:"10%"}}> Your Order has been successfully placed. </div>
      </div>
      <div style={{textAlign:"center", marginTop:"100px"}}>
        <Button
          id="OTP Submit Btn"
          size="small"
          variant="contained"
          className="submitSlotBtn"
          onClick={submitConfirm}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

export default ConfirmationMsg
