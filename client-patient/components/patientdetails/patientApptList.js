import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TodayIcon from '@material-ui/icons/Today';
import moment from 'moment';
import time from "../../data/timeRoster.json";
import router from 'next/router';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from "@material-ui/core/Avatar";
import CallEndIcon from '@material-ui/icons/CallEnd';
import CallIcon from '@material-ui/icons/Call';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import RescheduleAppointment from "../home/rescheduleAppointment";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

function PatientApptList(props) {
  console.log("props:",props);
  const [cookies, getCookie] = useCookies(["name"]);

  const [apmtList, setApmtList] = useState([]);
  const [openCancelAppmt,setOpenCancelAppmt] = useState(false);
  const [openRescheduleAppmt, setOpenRescheduleAppmt] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [slotSelected, setSlotSelected] = useState({});
  const [refreshList, setRefreshList] = useState({});
  const [appmtIndex, setAppmtIndex] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setApmtList(props.apptList)
  }, [props.apptList])
  const onAppointmentClick = (item) => {
    console.log("item: ",item)
    setLoader(true);
    props.setApptData(item);
    props.setShowAppmtSec(true);
    // router.push("/appoinmentDetails")
    // localStorage.setItem("appointmentData",JSON.stringify(item));
  }

  const closeRescheduleAppmt = () =>{
    console.log("closeRescheduleAppmt");
    setOpenRescheduleAppmt(false);
    setSelectedDate(moment(new Date()).format('YYYY-MM-DD'));
    setSlotSelected({});
  }
  const closeCancelAppmt = () =>{
    console.log("closeCancelAppmt");
    setOpenCancelAppmt(false);
  }
  const submitReschedule = ()=>{
    console.log("submitReschedule ","selectedDate: ",selectedDate, " slotSelected: ",slotSelected);
    if(slotSelected == null || slotSelected == undefined){
      console.log("please select a slot");
      return false;
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    let obj = {
      appointmentId: apmtList[appmtIndex].id,
      consultantId: apmtList[appmtIndex].consultantId,
      customerId: apmtList[appmtIndex].customerId,
      appointmentDate: selectedDate,
      consultationType: apmtList[appmtIndex].consultationType,
      appointmentSlotId: slotSelected.value
    }
    console.log("obj: ",obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/reschedule", obj,{
        headers,
    })
      .then((res) => {
        let temp = {};
        console.log("res: ",res);
        props.setMsgData({ message: "Appointment Rescheduled Successfully", type: "success" });
        setRefreshList(res.data);
        closeRescheduleAppmt();
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  }
  const cancelAppointment = ()=>{
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    let obj = {
      appointmentId: apmtList[appmtIndex].id,
    }
    console.log("obj: ",obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/cancel", obj,{
        headers,
    })
      .then((res) => {
        console.log("res: ",res);
        props.setMsgData({ message: "Appointment Cancelled Successfully", type: "success" });
        setRefreshList(res.data);
        closeCancelAppmt();
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  }
  return (
    <div style={{flexGrow:"1", margin:"15px", overflow:"scroll"}} >
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {apmtList.length>0 &&
        <Grid container spacing={2} style={{display:"flex", flexDirection:"row", flexWrap:"nowrap"}}>
          {apmtList.map((item, index)=>(
            <Grid item xs={12} sm={4} key={item.id}>
              <Paper className="apmtcardStyle patientApmtList" onClick={(e)=>{onAppointmentClick(item)}}>
                <div>
                  <div className="cardTopSec">
                      <div className="imageSec">
                        <img
                            src={
                              `${config.API_URL}/api/utility/download/` +
                              item.consultantProfileImageName
                            }
                            // src={
                            //   doct.profileImageName &&
                            //     doct.profileImageName != "NA"
                            //     ? `${config.API_URL}/api/utility/download/` +
                            //     doct.profileImageName
                            //     : createImageFromInitials(
                            //       100,
                            //       `${doct.userFirstName + " " + doct.userLastName
                            //       }`,
                            //       "#00888a"
                            //     )
                            // }
                        />
                      </div>
                    <div className="detailSec">
                      <div>{item.consultantName}</div>
                      <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} >{item.consultantQualification}</div>
                      <div>Experience: {item.consultantExperince}</div>
                      <div>Patient: {item.customerFirstName + " " + item.customerLastName + "( "+ item.customerRelationship + ")"}</div>
                      <div className="apmtTimeDev" >
                        <TodayIcon className="todayIcon" />
                        <div className="apmtTime">
                          {item.slotLabel} {moment(item.appointmentDate).format('DD-MMM-YYYY')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cardBottomSec">
                    <div onClick={(e)=>{
                        e.stopPropagation();
                        if(item.appointmentRescheduleEnabled === true){
                          setOpenRescheduleAppmt(true);
                          setAppmtIndex(index);
                        }
                      }}
                      className={item.appointmentRescheduleEnabled != true ? "disable" :""}
                      >
                      Reschedule
                    </div>
                    <div onClick={(e)=>{
                        e.stopPropagation();
                        setOpenCancelAppmt(true);
                        setAppmtIndex(index);
                      }}>
                      Cancel
                    </div>
                    <div onClick={(e)=>{
                        e.stopPropagation();
                      }}>
                      Mark Arrival
                    </div>
                  
                  </div>
                </div>
                
              </Paper>
            </Grid>
          ))}
          </Grid>
    }
      <Dialog
        open={openRescheduleAppmt}
        // onClose={closeRescheduleAppmt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rescheduleAppmt"
      >
        <DialogTitle id="alert-dialog-title">Reschedule Appointment</DialogTitle>
        <DialogContent>
          <RescheduleAppointment 
            appointmentData={apmtList[appmtIndex]} 
            setSelectedDate={setSelectedDate} 
            setSlotSelected ={setSlotSelected}
            selectedDate = {selectedDate}
            slotSelected = {slotSelected}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitReschedule} color="primary">
            Submit
          </Button>
          <Button onClick={closeRescheduleAppmt} color="primary" autoFocus>
            close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCancelAppmt}
        // onClose={closeCancelAppmt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="cancelAppmt"
      >
        <DialogTitle id="alert-dialog-title">Do you want to cancel this appointment ? </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Cancel Appointment
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={cancelAppointment} color="primary">
            Yes
          </Button>
          <Button onClick={closeCancelAppmt} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    
    </div>
  )
}

export default PatientApptList
