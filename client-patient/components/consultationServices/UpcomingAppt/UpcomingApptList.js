import {
  Typography,
  Card,
  CardActionArea,
  Grid,
  CardContent,
  IconButton,
  Button,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import router from "next/router";
import { useCookies } from "react-cookie";
import config from "../../../app.constant";
import axios from "axios";
import { upcomingapptStyle } from "./upcomingApptStyle";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
const useStyles = makeStyles((theme) => upcomingapptStyle);

export default function upcomingApptList(props) {
  const router = useRouter();
  const classes = useStyles();
  const { upComingAptList,setShowVid, setAppointment} = props;
  console.log("======>upComing1", upComingAptList);

  const appointmentList = [
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "video_icon.svg",
      videoText: "Video",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      img: "Aryapic.png",
      callstart: "Call will start 5 mins before",
      buttion1: "Reschedule Appointment",
      buttion2: "Join Call",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "physical_icon.svg",
      videoText: "Physical",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      img: "Aryapic.png",
      callstart: "Please reach 5 mins before",
      buttion1: "Reschedule Appointment",
      buttion2: "Mark Arrival",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "physical_icon.svg",
      videoText: "Physical",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      img: "Aryapic.png",
      callstart: "Please reach 5 mins before",
      buttion1: "Reschedule Appointment",
      buttion2: "Mark Arrival",
    },
  ];

  const getFormateDate = (value) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let newdate = new Date(value);
    // newdate.setDate(newdate.getDate() + value);
    const dd = newdate.getDate();
    const mm = monthNames[newdate.getMonth()];
    const y = newdate.getFullYear();
    const formattedDate = dd + " " + mm + " " + y;
    console.log("======>time", hh);
    const hh = newdate.getHours();
    const min = newdate.getMinutes();
    const time = getTime(hh, min);
    return formattedDate + ", " + time;
  };

  const getTime = (hh, mm) => {
    let z = hh < 12 ? "AM" : "PM";
    let h = hh > 12 ? hh - 12 : hh;
    let hours = h < 10 ? "0" + h : h;
    let min = mm == 0 ? "00" : mm;
    return hours + ":" + min + " " + z;
  };

  const userDetail = (ele) => {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <Typography className={classes.nameTypo}>
            {ele.patientName}
            {","}&nbsp;3M
          </Typography>
          <Typography
            style={{
              color: "#818080",
              fontSize: "11px",
              textTransform: "capitalize",
              marginLeft: "15px",
              marginTop: "-15px",
            }}
          >
            Relation&nbsp;
            {ele.relationShip}
          </Typography>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="video_icon.svg"
              style={{
                width: "25px",
                height: "25px",
                opacity: "1",
              }}
            />
            <Typography
              style={{ marginLeft: "5px", color: "#595757", fontSize: "12px" }}
            >
              Video
            </Typography>
          </div>
        </div>
      </div>
    );
  };
  const actionBtn = (ele) => {
    return (
      <>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <div className={classes.btnDiv} onClick={openEditAppointment}>
            Reschedule Appointment
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <div className={classes.btnDiv} onClick={()=>onVideoCall(ele)}>
            Mark Arrival
          </div>
        </div>
        <Typography
          style={{
            fontSize: "10px",
            marginTop: "15px",
            textAlign: "center",
            marginRight: "25px",
            color: "#555555",
          }}
        >
          Call will start 5 mins before
        </Typography>
      </>
    );
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const openEditAppointment = () => {
    console.log("openEditAppointment");
    handleClickOpen();
  };
  const openWatingScreen = () => {
    router.push("/pastApmt/waitingScreen");
  };
  const onRescheduleClick = () => {
    console.log("onRescheduleClick");
    router.push("/bookslot");
  };
  const onCancelClick = () => {
    console.log("onCancelClick");
    router.push("/cancelApmt");
  };
  const reportUploadHandler = () => {
    router.push("/view-report");
  };
  const onVideoCall = (ele) =>{
    console.log("onVideoCall");
    setAppointment(ele);
    setShowVid("yes");
  }
  return (
    <>
      <Grid container justifyContent="center">
        {upComingAptList &&
          upComingAptList.map((ele, i) => {
            return (
              <Grid
                item
                xs={11}
                style={{ marginTop: "10px", marginLeft: "20px" }}
              >
                <Card
                  style={{
                    backgroundColor: "#F8F6F6",
                    boxShadow: "none",
                    marginTop: "10px",
                  }}
                >
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <img
                          src="Aryapic.png"
                          style={{
                            width: "120px",
                            alignItems: "center",
                            float: "left",
                          }}
                        />
                        <div
                          style={{
                            float: "left",
                            textAlign: "left",
                            position: "relative",
                            width: "450px",
                          }}
                        >
                          {userDetail(ele)}

                          <Typography className={classes.nameDoctor}>
                            {ele.careproviderName}
                          </Typography>
                          <Typography
                            style={{
                              color: "#818080",
                              fontSize: "11px",
                              textTransform: "capitalize",
                              display: "inline",
                              marginTop: "5px",
                            }}
                          >
                            ({ele.careproviderSpeciality})
                          </Typography>
                          <Typography
                            style={{
                              color: "#818080",
                              fontSize: "11px",
                              textTransform: "capitalize",
                              marginLeft: "15px",
                              marginTop: "5px",
                            }}
                          >
                            {ele.careproviderQualification}
                            {","}&nbsp;
                            {ele.experience}&nbsp;Years
                          </Typography>
                          <Typography
                            style={{
                              display: "flex",
                              fontSize: "12px",
                              alignItems: "center",
                              color: "#818080",
                              marginTop: "5px",
                            }}
                          >
                            <img
                              src="/clock_icon.svg"
                              style={{
                                marginRight: "7px",
                                width: "25px",
                                marginLeft: "7px",
                              }}
                            />
                            {getFormateDate(ele.slotStartDttm)}
                            <img
                              src="/upload_icon.svg"
                              style={{
                                marginLeft: "40px",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                            <Typography
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                                cursor: "pointer",
                                color: "#502E92",
                              }}
                              onClick={reportUploadHandler}
                            >
                              Upload Doc
                            </Typography>
                          </Typography>
                        </div>
                      </div>
                      <div>{actionBtn(ele)}</div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="editApmt"
      >
        <DialogContent style={{ width: "350px", height: "400px" }}>
          <div className={classes.editApmtText1}>Edit Appointment</div>
          <div className={classes.editApmtText2}>Please select the option</div>
          <TextField
            id="standard-basic"
            label=""
            style={{ width: "96%", margin: "0 2%" }}
          />
          <div className={classes.editApmtBtn} onClick={onRescheduleClick}>
            <img src="../rescheduleApmt.svg" className={classes.editApmtIcon} />
            <span className={classes.editApmtBtnText}>
              Reschedule Appointment
            </span>
          </div>

          <div className={classes.editApmtBtn} onClick={onCancelClick}>
            <img src="../cancelApmt.svg" className={classes.editApmtIcon} />
            <span className={classes.editApmtBtnText}>Cancel Appointment</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
