import React,{useEffect, useState} from 'react';
import axios from "axios";
import config from "../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import moment from 'moment';
import time from "../data/timeRoster.json";
import Button from "@material-ui/core/Button";
import PatientApptList from "../components/patientdetails/patientApptList";
import Vitals from "../components/patientdetails/vitals"
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddFamilyMember from "../components/home/addFamilyMember";
import PatientDoc from "../components/patientdetails/patientDoc";
import UploadDoc from "../components/patientdetails/uploadDoc";
import PastConsult from "../components/patientdetails/pastConsult";
import MessagePrompt from "../components/messagePrompt";
import AppoinmentDetails from "../components/home/appoinmentDetails"
import CircularProgress from "@material-ui/core/CircularProgress";

function patientDetails(props) {
  let timeData = time;
  const [cookies, getCookie] = useCookies(["name"]);
  const [patientData, setPatientData] = useState({});
  const [apptList, setApptList] = useState([]);
  const [caseSheetData, setCaseSheetData] = useState([]);
  const [patientDoc, setPatientDoc] =useState([]);
  const [open, setOpen] = React.useState(false);
  const [pastConsultData, setPastConsultData] = useState([]);
  const [update, setUpdate] = useState({});
  const [msgData, setMsgData] = useState({});
  const [showAppmtSec, setShowAppmtSec] = useState(false);
  const [apptData, setApptData] = useState({});
  const [loader, setLoader] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const backBtnClick = (val) =>{
    if(val === "0"){
      router.push("/home");
    }else if(val === "1"){
     setView(0);
    }else if(val === "2"){
     setView(1);
    }else if(val === "3"){
     setView(1);
    }else if(val === "4"){
      setView(3);
    }
  }
  useEffect(() => {
    let tempPatientData = localStorage.getItem("patientData");
    setPatientData(JSON.parse(tempPatientData));
    console.log("patientData @@@@: ", JSON.parse(tempPatientData));
  }, [update]);

  useEffect(() => {
   if(patientData.id){
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "cookieVal") {
            cookie = value;
        }
      }
      let headers = {
      authtoken: cookie,
      };
      setLoader(true);
      axios
        .get(config.API_URL + "/api/patient/showpatientdetails/"+patientData.id, {
          headers,
      })
      .then((res) => {
        console.log("res: ",res.data);
        let temp = {};
        let tempPastData = [];
        console.log("res: ",res);
        temp = res.data.appointments;
        temp.map((item)=>{
          console.log("appointmentStatus: ",item.appointmentStatus)
          if(item.appointmentStatus === "successfully:completed" || item.appointmentStatus === "completed:with:error"){
            tempPastData.push(item);
          }
          timeData.map((data)=>{
            if(item.appointmentSlotId === data.value){
              item.slotLabel = data.label
            }
          })
        });
        console.log("temp ",temp)
        console.log("tempPastData ",tempPastData)
        setPastConsultData(tempPastData);
        setApptList(temp);
        // setApptList(res.data.appointments);
        setCaseSheetData(res.data.casesheets);
        setPatientDoc(res.data.patientDocuments);
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
    }
  }, [patientData,update]);

  useEffect(() => {
    console.log("update: ",update);
  }, [update])
  const editProfile = () =>{
    console.log("editProfile");
    setOpenEdit(true);

  }
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClose = () => {
    setOpenEdit(false);
  };
  
  const [openDocUpload, setOpenDocUpload] = useState(false);
  const closeDocUpload = () =>{
    setOpenDocUpload(false);
  }
  const uploadDoc = () =>{
    console.log("uploadDoc")
    setOpenDocUpload(true);
  }

  const [pastConsult, setPastConsult] = useState(false);
  const closepastConsult = () =>{
    setPastConsult(false);
  }
  const viewPastConsult = () =>{
    console.log("viewPastConsult")
    setPastConsult(true);
  }
  
  return (
    <>
    {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
    {showAppmtSec === false && <div className="mainDiv" style={{background:"#cfcfcf"}}>
      <MessagePrompt msgData={msgData} />

      <div className="orderTitle">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", top:"17px", left:"10px"}} onClick={(e)=>backBtnClick("0")}/>
        <div style={{marginLeft: "40px"}}>
          {patientData.userFirstName + " " + patientData.userLastName}
        </div>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div style={{float:"right", padding:"0"}} >
            {/* <button type="button" onClick={handleClick}>
              Open menu dropdown
            </button> */}
            <MoreHorizIcon onClick={handleClick} style={{padding:"0px", float:"right", margin:"10px 15px", fontSize:"50px"}} />
            {open ? (
              <div className="editProfile" onClick={editProfile}>
                Edit Profile
              </div>
            ) : null}
          </div>
        </ClickAwayListener>
      </div>
      
      {/* PatientApptList */}
      <PatientApptList apptList = {apptList} setShowAppmtSec = {setShowAppmtSec} setApptData={setApptData} setMsgData = {setMsgData}/>

      {/* past Appointment */}
      <div className="details">
        <div style={{padding:"20px 10px"}} onClick={viewPastConsult}>
          <span>VIEW PAST CONSULTS</span>
          
          <ChevronRightIcon style={{float:"right"}} />
        </div>
      </div>

      {/* vitals */}
      <Vitals vitals = {caseSheetData} />
      <div className="secTitle">
        My document 
        <span style={{color:"#5b368c", float:"right"}} onClick={uploadDoc}>UPLOAD</span>
      </div>
      <div className="details" style={{overflow:"scroll"}}>
        <PatientDoc patientDoc = {patientDoc} />
      </div>


      <Dialog
        open={openEdit}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
        className="addNewFamMember"
        >
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={handleClose}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Edit profile</div>
          
        </DialogTitle>
        <DialogContent>
          <AddFamilyMember patientData = {patientData} setUpdate ={setUpdate} handleClose = {handleClose} setMsgData = {setMsgData}/>
        </DialogContent>
        </Dialog>

        <Dialog
          open={openDocUpload}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen
          className="addNewFamMember"
          >
          <DialogTitle id="alert-dialog-title">
            <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={closeDocUpload}/>
            <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Upload Document</div>
            
          </DialogTitle>
          <DialogContent>
              <UploadDoc 
                patientData = {patientData}
                closeDocUpload = {closeDocUpload}
                setUpdate = {setUpdate}
                setMsgData = {setMsgData}
              />
          </DialogContent>
        </Dialog>

        <Dialog
          open={pastConsult}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen
          className="addNewFamMember"
          >
          <DialogTitle id="alert-dialog-title">
            <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={closepastConsult}/>
            <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Past Consult of {patientData.userFirstName + " " + patientData.userLastName}</div>
            
          </DialogTitle>
          <DialogContent>
          
            <PastConsult pastConsultData={pastConsultData} />
          </DialogContent>
        </Dialog>

    </div>}

    {showAppmtSec === true && < AppoinmentDetails appointmentData = {apptData} from = {"patientDetails"} setShowAppmtSec = {setShowAppmtSec} firebase = {props.firebase}/>}

  </>
  )
}

export default patientDetails
