import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TodayIcon from "@material-ui/icons/Today";
import moment from "moment";
import time from "../../data/timeRoster.json";
import router from "next/router";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import VideoCallUi from "../appointmentetails/videoCallUi";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from "@material-ui/core/Avatar";
import CallEndIcon from "@material-ui/icons/CallEnd";
import CallIcon from "@material-ui/icons/Call";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import RescheduleAppointment from "./rescheduleAppointment";
import CircularProgress from "@material-ui/core/CircularProgress";

function UpComingApmt(props) {
  console.log("props in UpComingApmt: ", props);
  const [cookies, getCookie] = useCookies(["name"]);
  const [apmtList, setApmtList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [agoraTokenDetails, setAgoraTokenDetails] = useState({});
  // const [token, setToken] = useState('');
  const [openVideoPopUp, setOpenVideoPopUp] = useState(false);
  const [videoCallerName, setVideoCallerName] = useState("");
  const [videoCallerImg, setVideoCallerImg] = useState("");
  const [rejectUserId, setRejectUserId] = useState("");
  const [type, setType] = useState("");
  const [callType, setCallType] = useState("");

  const [urlApmtId, setUrlApmtId] = useState("");
  const [appointmentData, setAppointmentData] = useState({});
  const timeData = time;

  const [openCancelAppmt, setOpenCancelAppmt] = useState(false);
  const [openRescheduleAppmt, setOpenRescheduleAppmt] = useState(false);
  const [appmtIndex, setAppmtIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [slotSelected, setSlotSelected] = useState({});
  // const[refreshList, setRefreshList] = useState({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
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
      .get(config.API_URL + "/api/patient/all-family-appointments", {
        headers,
      })
      .then((res) => {
        let temp = {};
        console.log("res: ", res);
        temp = res.data;
        temp.map((item) => {
          timeData.map((data) => {
            if (item.appointmentSlotId === data.value) {
              item.slotLabel = data.label;
            }
          });
        });
        setApmtList(temp);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        props.setMsgData({
          message: err.response.data.errors[0].message,
          type: "error",
        });
        setLoader(false);
      });
  }, [props.refreshList]);
  const onAppointmentClick = (item) => {
    console.log("item: ", item);
    props.setApptData(item);
    props.setShowAppmtSec(true);

    // router.push("/appoinmentDetails")
    // localStorage.setItem("appointmentData",JSON.stringify(item));
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams: ", urlParams);
    console.log("mbdbvm:", router.query);
    const myParam = urlParams.get("type");
    let decodedToken = decodeURIComponent(urlParams.get("token"));
    console.log("token: ", urlParams.get("token"));
    console.log("decodedToken: ", decodedToken);
    let data = {
      appointment_id: urlParams.get("appointment_id"),
      callerName: urlParams.get("callerName"),
      token: decodedToken,
      uid: urlParams.get("uid"),
      callerProfile: urlParams.get("callerProfile"),
    };
    setUrlApmtId(data.appointment_id);
    setVideoCallerName(data.callerName);
    setVideoCallerImg(data.callerProfile);
    setRejectUserId(urlParams.get("callerId"));
    let agoraParams = {
      userName: data.callerName,
    };
    setAgoraTokenDetails({
      token: data.token,
      uid: data.uid,
      channelName: data.appointment_id,
      agoraParams,
    });
    console.log("from:", myParam);
    console.log("data: ", data);
    if (myParam === "call") {
      setType("call");
      showIncommingCall();
      // toggle();
      // setToken(data.token)
    }
    if (myParam === "text") {
      setType("text");
    }
  }, []);

  useEffect(() => {
    if (urlApmtId != "") {
      console.log("urlApmtId", urlApmtId);
      console.log("apmtList: ", apmtList);
      let temp = apmtList.filter((item) => {
        return item.id === urlApmtId;
      });
      console.log("temp: ", temp);
      if (temp.length > 0) {
        setAppointmentData(temp[0]);
      }
      if (type == "text") {
        if (temp.length > 0) {
          console.log("object temp:", temp);
          props.setApptData(temp[0]);
          props.setShowAppmtSec(true);
        }
      }
    }
  }, [urlApmtId, apmtList]);
  let paramsTosend = {};
  useEffect(() => {
    if (appointmentData.id) {
      console.log("appointmentData: ", appointmentData);
      paramsTosend = {
        userId: appointmentData.customerId,
        userName: appointmentData.customerName,
        userProfile: appointmentData.customerProfileImageName,
        // callerId: appointmentData.consultantId,
        // callerName: appointmentData.consultantName,
        // callerProfile: appointmentData.consultantProfileImageName,
        callerId: appointmentData.customerId,
        callerName: `${appointmentData.customerFirstName} ${appointmentData.customerLastName}`,
        callerProfile: `${appointmentData.customerProfileImageName}`,
        appointmentDate: appointmentData.appointmentDate,
        appointmentId: appointmentData.id,
        isVideo: true,
        messageType: "video",
        patientUid: appointmentData.agoraVideoCallStartUID,
        doctorUid: appointmentData.agoraVideoCallStartUID + 1,
        assistantUid: appointmentData.agoraVideoCallStartUID + 2,
        assistantName: appointmentData.assistantName,
        assistantProfile: appointmentData.assistantProfileImageName,
        patientID: appointmentData.customerId,
        patientName:
          appointmentData.customerName + " " + appointmentData.customerLastName,
        patientProfile: appointmentData.customerProfileImageName,
        doctorId: appointmentData.consultantId,
        doctorName: appointmentData.consultantName,
        doctorProfile: appointmentData.consultantProfileImageName,
      };
    }
  }, [appointmentData]);
  function showIncommingCall() {
    console.log("hello");
    handleOpenVideoPopUp();
  }
  const handleOpenVideoPopUp = () => {
    console.log("handleClickOpen");
    setOpenVideoPopUp(true);
  };
  const handleCloseVideoPopUp = () => {
    // toggle();
    setOpenVideoPopUp(false);
  };
  const acceptVideoCall = () => {
    handleClickOpen();
    setCallType("incoming");
    // toggle();
    handleCloseVideoPopUp();
    // setShowVideoSec(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    // setOpenVideoPopUp(false);
    // setShowVideoSec(false);
    if (type === "call") {
      showCloseWindows();
    }
  };
  const sendRejectNotification = () => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "cookieVal") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    paramsTosend.messageType = "rejected";
    paramsTosend.isVideo = false;
    axios
      .post(
        config.API_URL + "/api/notification/push",
        {
          userId: rejectUserId,
          appointmentId: appointmentData.id,
          title: "Call Rejected",
          body: paramsTosend,
        },
        { headers }
      )
      .then((response) => {
        console.log("response of reject notification: ", response);
      })
      .catch((error) => {
        console.log("Error occurred while logout", error);
        // alert.show(error.response.data.errors[0].message, { type: 'error' })
      });
    showCloseWindows();
  };
  const [openVideoEnded, setopenVideoEnded] = useState(false);
  function showCloseWindows() {
    setopenVideoEnded(true);
  }

  const closeRescheduleAppmt = () => {
    console.log("closeRescheduleAppmt");
    setOpenRescheduleAppmt(false);
    setSelectedDate(moment(new Date()).format("YYYY-MM-DD"));
    setSlotSelected({});
  };
  const closeCancelAppmt = () => {
    console.log("closeCancelAppmt");
    setOpenCancelAppmt(false);
  };
  useEffect(() => {
    console.log("appmtIndex: ", appmtIndex);
  }, [appmtIndex]);

  const submitReschedule = () => {
    console.log(
      "submitReschedule ",
      "selectedDate: ",
      selectedDate,
      " slotSelected: ",
      slotSelected,
      slotSelected.value
    );
    if (slotSelected == null || slotSelected.value == undefined) {
      console.log("please select a slot");
      props.setMsgData({ message: "please select a slot", type: "error" });
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
      appointmentSlotId: slotSelected.value,
    };
    console.log("obj: ", obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/reschedule", obj, {
        headers,
      })
      .then((res) => {
        let temp = {};
        console.log("res: ", res);
        props.setMsgData({
          message: "Appointment Rescheduled Successfully",
          type: "success",
        });
        props.setRefreshList(res.data);
        closeRescheduleAppmt();
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        props.setMsgData({
          message: err.response.data.errors[0].message,
          type: "error",
        });
        setLoader(false);
      });
  };
  const cancelAppointment = () => {
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
    };
    console.log("obj: ", obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/cancel", obj, {
        headers,
      })
      .then((res) => {
        console.log("res: ", res);
        props.setMsgData({
          message: "Appointment Cancelled Successfully",
          type: "success",
        });
        props.setRefreshList(res.data);
        closeCancelAppmt();
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        props.setMsgData({
          message: err.response.data.errors[0].message,
          type: "error",
        });
        setLoader(false);
      });
  };
  return (
    <div style={{ flexGrow: "1", margin: "15px" }}>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {apmtList.length > 0 && (
        <Grid container spacing={2}>
          {apmtList.map((item, index) => (
            <Grid item xs={12} sm={4} key={item.id}>
              <Paper
                className="apmtcardStyle"
                onClick={(e) => {
                  onAppointmentClick(item);
                }}
              >
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
                      <div style={{ fontWeight: "600" }}>
                        {item.consultantName}
                      </div>
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.consultantQualification}
                      </div>
                      <div>Experience: {item.consultantExperince}</div>
                      <div>
                        Patient:{" "}
                        {item.customerFirstName +
                          " " +
                          item.customerLastName +
                          "( " +
                          item.customerRelationship +
                          ")"}
                      </div>
                      <div className="apmtTimeDev">
                        <TodayIcon className="todayIcon" />
                        <div className="apmtTime">
                          {item.slotLabel}{" "}
                          {moment(item.appointmentDate).format("DD-MMM-YYYY")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cardBottomSec">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.appointmentRescheduleEnabled === true) {
                          setOpenRescheduleAppmt(true);
                          setAppmtIndex(index);
                        }
                      }}
                      className={
                        item.appointmentRescheduleEnabled != true
                          ? "disable"
                          : ""
                      }
                    >
                      Reschedule
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCancelAppmt(true);
                        setAppmtIndex(index);
                      }}
                    >
                      Cancel
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Mark Arrival
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        aria-labelledby="customized-dialog-title"
        open={openVideoPopUp}
        className="incomingCallDia"
      >
        {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
        <DialogContent
          style={{
            minWidth: "1020px",
            minHeight: "350px",
            padding: "0",
            margin: "0",
          }}
        >
          <div className="incomingTitle">Incoming Call</div>
          <div className="incomingImage">
            {videoCallerImg === "NA" ? (
              <Avatar
                src={
                  videoCallerImg === "" ||
                  videoCallerImg === "NA" ||
                  videoCallerImg === null
                    ? ""
                    : `${config.API_URL}/api/utility/download/` + videoCallerImg
                }
                style={{
                  position: "relative",
                  bottom: 5,
                  height: "70px",
                  width: "70px",
                  backgroundColor:
                    videoCallerName !== undefined &&
                    videoCallerName !== null &&
                    videoCallerName !== "" &&
                    getHexColor(videoCallerName),
                }}
              >
                {videoCallerName !== undefined &&
                  videoCallerName !== null &&
                  videoCallerName !== "" &&
                  getInitialsOfGender(videoCallerName)}
              </Avatar>
            ) : (
              <Avatar
                src={`${config.API_URL}/api/utility/download/` + videoCallerImg}
                style={{
                  position: "relative",
                  bottom: 5,
                  height: "130px",
                  width: "130px",
                }}
                className="pImage"
              />
            )}
          </div>
          <div className="incomingDetails">
            <div className="detailsName">{videoCallerName} </div>
            <div className="detailsQulification">
              {appointmentData.consultantQualification}
            </div>
          </div>
          <div className="action">
            <Button
              onClick={() => {
                handleCloseVideoPopUp();
                sendRejectNotification();
              }}
              size="small"
              variant="contained"
              // color="secondary"
              className="reject"
            >
              {/* REJECT */}
              <CallEndIcon />
            </Button>
            <Button
              onClick={acceptVideoCall}
              size="small"
              variant="contained"
              // color="secondary"
              className="accept"
            >
              {/* ACCEPT */}
              <CallIcon />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Modal
        style={{ backgroundColor: "#3b3b3c" }}
        disableEnforceFocus
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        BackdropComponent={Backdrop}
        BackdropProps={{
          width: 430,
        }}
        className={`${
          fullScreen ? "videoDialog fullScreen" : "videoDialog"
        } video-call-end-dialog`}
      >
        <VideoCallUi
          closeDiaglog={handleClose}
          connectionDetails={agoraTokenDetails}
          appointmentObj={appointmentData}
          setMsgData={props.setMsgData}
        />
      </Modal>

      <Dialog
        className="video-call-end-dialog"
        aria-labelledby="customized-dialog-title"
        open={openVideoEnded}
        fullScreen
      >
        <DialogContent
          style={{
            position: "absolute",
            textAlign: "center",
            top: "35%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "gray",
          }}
        >
          <div>
            <div>
              <img
                src="/diahome_closeWindow.svg"
                alt="diahome_closeWindow.png"
                height="80"
                width="80"
              />
            </div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              Your Video Consultation Ended
            </div>
            <div style={{ fontWeight: "14px" }}>Please close this tab</div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openRescheduleAppmt}
        // onClose={closeRescheduleAppmt}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rescheduleAppmt"
      >
        <DialogTitle id="alert-dialog-title">
          Reschedule Appointment
        </DialogTitle>
        <DialogContent>
          <RescheduleAppointment
            appointmentData={apmtList[appmtIndex]}
            setSelectedDate={setSelectedDate}
            setSlotSelected={setSlotSelected}
            selectedDate={selectedDate}
            slotSelected={slotSelected}
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
        {/* <DialogTitle id="alert-dialog-title">Do you want to cancel this appointment ? </DialogTitle> */}
        <DialogTitle id="alert-dialog-title" style={{ fontSize: "18px" }}>
          To cancel the appointment, please call to{" "}
          <a href="tel:+1800-xxxx-xxxx" style={{ textDecoration: "underline" }}>
            1800-xxxx-xxxx
          </a>{" "}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Cancel Appointment
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          {/* <Button onClick={cancelAppointment} color="primary">
            Yes
          </Button> */}
          <Button onClick={closeCancelAppmt} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UpComingApmt;
