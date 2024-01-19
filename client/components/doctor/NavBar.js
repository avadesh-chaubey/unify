import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useRouter } from "next/router";
import axios from "axios";
import config from "../../app.constant";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import DehazeIcon from "@material-ui/icons/Dehaze";
import IconButton from "@material-ui/core/IconButton";
import ConsultationListMenu from "./ConsultationListMenu";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import ChangeUserPassword from "./ChangeUserPassword";
import NewVideoCallUi from "./NewVideoCallUi";
import Button from "@material-ui/core/Button";
import { getHexColor } from '../../utils/nameDP';
import DocAutosuggest from './DocAutosuggest';
import moment from 'moment';
import UserType from "../../types/user-type";
import { getRandomColor } from '../../utils/nameDP';
import DoctorHomePage from "../../pages/doctorHomePage";
import { makeInitialCapital } from '../../utils/helpers';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Tooltip from '@material-ui/core/Tooltip';
function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
};

const useStyles = makeStyles({
  list: {
    width: 330,
  },
  fullList: {
    width: "auto",
  },
  header: {
    zIndex: 10,
  },
  headerDetails: {
    height: 50,
    backgroundColor: "#fff",
    // boxShadow: 'unset',
  },
  btnPostion: {
    position: "relative",
    bottom: 5,
  },
  moreIconBtn: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  profilePic: {
    position: "absolute",
    width: "210px",
    height: "235px",
    borderRadius: "2px",
    backgroundColor: "#ffffff",
    right: "-8px",
    top: "40px",
    textAlign: "center",
  },
  profilePicShape: {
    borderRadius: "50%",
    height: "75px",
    width: "75px",
    border: "solid 1px #9b9b9b",
  },
  uploadProfilePicIcon: {
    width: "35px",
    padding: "35px 0 0 0",
    height: "35px",
    overflow: "hidden",
    boxSizing: "border-box",
    background: "url(../changeProfile.svg) center center no-repeat",
    borderRadius: "20px",
    backgroundSize: "25px 25px",
    position: "absolute",
    top: "1px",
    right: "1px",
    cursor: "pointer",
    display: "none",
  },
  primary: {
    fontSize: "1.3rem",
    fontWeight: "600",
  },
  doctorQualification: {
    fontSize: "1.1rem",
    textTransform: "uppercase",
  },
  rating: {
    marginLeft: "15px",
  },
  avatar: {
    height: "150px",
    width: "150px",
    border: "1px solid black",
  },
  patientName: {
    fontSize: 14,
    width: "100%",
    position: "relative",
    bottom: 5,
  },
});

export function NavBar(props) {
  const { countRecords,
    setUpcomingDate,
    setSelectedDate,
    setAppointmentObj,
    setCountRecords,
    searchMode,
    setSearchMode,
    setPatientName,
    setAppointId,
    setListFilterStatus
  } = props;

  const classes = useStyles();
  const [state, setState] = useState({
    left: false,
  });
  const Router = useRouter();
  const [cookies, setCookies,] = useState('');
  const [styleReset, setStyleReset] = useState(true);
  const [profilePic, setProfilePic] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [loader, setLoader] = useState(false);
  const [openPasswordModal, setPasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [uuidVal, setUuidVal] = useState("");

  useEffect(() => {
    // Reset the search term when search mode is false in case of notification refresh
    if (!searchMode) {
      setSearchTerm('');
    }

    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }

    if (uuidVal === '') {
      let temp = JSON.parse(localStorage.getItem('UUID'));
      setUuidVal(temp);
    }

    if (userDetails === '') {
      fetcUserData();
    }
  }, [searchMode, cookies, uuidVal, userDetails]);

  const sideMenu = [
    'MY APPOINTMENTS',
    'CHANGE PASSWORD',
    'LOGOUT',
  ];

  // Cookie Settings
  let cookie = cookies;

  let headers = {
    authtoken: cookie,
  };

  const fetcUserData = () => {
    if (cookies !== '') {
      setLoader(true);
      axios
        .get(config.API_URL + "/api/partner/employeeselfinfo", { headers })
        .then((response) => {
          localStorage.setItem("docUserDetails", JSON.stringify(response.data.data));
          setUserDetails(response.data.data);
          setProfilePic(response.data.profileImageName);
          setLoader(false);
        })
        .catch((error) => {
          // Logout User when error is Unauthorised
          if (error.hasOwnProperty('response') && error.response.data.errors[0].message === 'Not authorized') {
            localStorage.clear();
            Router.push('/login');
          } else if (error.response.data.errors[0].message === 'Not Found') {
            localStorage.clear();
            Router.push('/login');
          } else {
            props.setMsgData({
              message: "Error occurred while fetching user details",
              type: "error",
            });
            setLoader(false);
          }
        });
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event & (event.type === "keydown") &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    setStyleReset(!styleReset);
  };

  const signout = async () => {

    await axios.post(config.API_URL + "/api/notification/token/remove", {
      uuid: uuidVal,
    },{ headers }).then((res)=>{
      console.log("res in remove token: ",res);
      axios
      .post(config.API_URL + "/api/users/signout")
      .then(() => {
        // Clear cookies
        // removeCookie("express:sess");
        Router.push("/doctor/logoutUser");
      })
      .catch((error) => {
        console.log("Error occurred while logout", error);
      });
    })
    .catch((error) => {
      console.log("Error occurred while removing token", error);
    });
  };

  const uploadProfileImages = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    let imageUrl = null;
    var model = {
      file: file,
    };

    const configs = {
      headers: {
        authtoken: cookie,
      },
      transformRequest: function (obj) {
        let formData = new FormData();
        for (let prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
    };
    // setLoader(true)
    axios
      .post(config.API_URL + "/api/utility/upload", model, configs)
      .then((response) => {
        console.log(response.data);
        imageUrl = response.data.fileName;
        saveProfileImage(imageUrl);
        // setLoader(false)
      })
      .catch((error) => {
        console.log(error);
        // setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  const saveProfileImage = (imageUrl) => {
    axios
      .put(
        config.API_URL + "/api/partner/image",
        { profileImageName: imageUrl },
        { headers }
      )
      .then((response) => {
        console.log("profile pic upload", response);
        // Update the profilePic for showing new profile pic
        profilePic = response.data.displayProfileImageName;
        // setShowSignout('hide');
        // fetcUserData();
        // setLoader(false)
      })
      .catch((error) => {
        console.log(error);
        // setShowSignout('hide');
        // setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  const getUserRole = (role) => {
    let userRole = '';
    if (userDetails.userType === UserType.Assistant) {
      userRole = 'Physician Assistant';
    } else if (userDetails.userType === UserType.Dietician) {
      userRole = 'Dietitian';
    } else {
      userRole = role;
    }

    return userRole;
  };

  const fontColorText = () => 'side-menu-font-color';

  const getInitialsOfGender = (name) => {
    if (name === undefined || name === null) {
      return ;
    }
    let reg = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(reg)] || [];

    initials = (initials.shift()?.[1] || "").toUpperCase();

    return initials;
  };

  const list = (anchor) => (
    <React.Fragment>
    <div
      className={clsx(classes.list, 'doctor-side-menu', {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem className="left-nav-profile-pic">
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          // badgeContent={
          //   <span>
          //     <input
          //       type="file"
          //       className={classes.uploadProfilePicIcon}
          //       onClick={toggleDrawer(anchor, true)}
          //       onChange={uploadProfileImages}
          //     />
          //   </span>
          // }
          >
            <Avatar
              alt={`${userDetails.userFirstName} ${userDetails.userLastName}`}
              className="side-menu-avatar"
              style={{
                backgroundColor: getHexColor(
                  `${userDetails.userFirstName} ${userDetails.userLastName}`
                ),
              }}
              // src={
              //   profilePic != "undenied"
              //     ? `${config.API_URL}/api/utility/download/` + profilePic
              //     : "/user.svg"
              // }
            >
              { getInitialsOfGender(userDetails.userFirstName) }
            </Avatar>
          </Badge>
        </ListItem>

        <ListItem>
          <ListItemText>
            <div className="user-title">
              <Typography className={`${classes.primary} ${fontColorText()}`} variant="h5">
                {`${userDetails.userFirstName} ${userDetails.userLastName}`}
              </Typography>
            </div>
            <div className="user-title">
              <span className={`${classes.doctorQualification} ${fontColorText()}`}>
                { getUserRole(userDetails.userType) }
              </span>
            </div>
          </ListItemText>
        </ListItem>

        <div className="side-nav-menu">
          {sideMenu.map((text, index) => (
            <ListItem
              className="side-nav-menu-font"
              button
              key={index}
              onClick={(e) => {
                if (text === "LOGOUT") {
                  signout();
                } else if (text === "CHANGE PASSWORD") {
                  handlePassDialog(e);
                } else {
                  toggleDrawer(anchor, false);
                }
              }}
            >
              <ListItemText className="side-menu-item-font"
                primary={text}
              />
            </ListItem>
          ))}
        </div>
      </List>
    </div>
    <div className="side-nav-fixed-footer">
      <Typography className={`${fontColorText()}`}>
        VERSION: { process.env.buildId }
      </Typography>
    </div>
    </React.Fragment>
  );

  const handlePassDialog = (e) => {
    e.preventDefault();
    setState((prevState) => ({
      ...prevState,
      left: false,
    }));
    setPasswordModal(!openPasswordModal);
  };

  const onChange = (id, newValue) => {
    setSearchTerm(newValue);
    console.log(`${id} changed to ${newValue}`);
  }
  const resetSearchTerm = (e) => {
    e.preventDefault();
    const currDate = moment(new Date()).format('YYYY-MM-DD');

    setSearchMode(false);
    setSearchTerm('');
    setSelectedDate(currDate);
    setUpcomingDate(moment(new Date()).format('MMM DD'));
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ChangeUserPassword
        open={openPasswordModal}
        closeDialog={handlePassDialog}
        props={props}
      />

      <AppBar
        position="absolute"
        color="default"
        className={`${styleReset && 'app-bar-zIndex'} appbar doctor-appbar`}
      >
        <Toolbar>
          <label htmlFor="side-menu-icon">
            <IconButton className={`${fontColorText()}`} onClick={toggleDrawer("left", true)}>
              <DehazeIcon />
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
              onOpen={toggleDrawer("left", true)}
            >
              {list("left")}
            </SwipeableDrawer>
          </label>

          <Typography variant="h6" className={`my-appointment-title ${fontColorText()} ${!showSearchBar && 'navbar-default-width'}`}>
            {`${searchMode
              ? 'Search Results'
              : `${userDetails.userFirstName !== undefined
                ? userDetails.userFirstName + '\'s'
                : ''
              } Appointments`
              } (${countRecords})`
            }
          </Typography>

          <IconButton
            className={showSearchBar ? "search-icon" : "default-search-icon"}
            onClick={(e) => setShowSearchBar(!showSearchBar)}
          >
            <img
              src={showSearchBar ? "../doctor/search_small.svg" : "../search.svg"}
              alt="search"
              height="18"
              width="18"
            />
          </IconButton>

          {
            showSearchBar
              ? (
                <React.Fragment>
                  <ClickAwayListener onClickAway={(e) => setShowSearchBar(false)}>
                    <DocAutosuggest
                      id="type-c"
                      placeholder="Search patient by name"
                      onChange={onChange}
                      value={searchTerm}
                      headers={headers}
                      setList={props.setList}
                      addAgeOfPatient={props.addAgeOfPatient}
                      setUpcomingDate={setUpcomingDate}
                      setCountRecords={setCountRecords}
                      setSearchMode={setSearchMode}
                      setAppointmentObj={setAppointmentObj}
                      setPatientName={setPatientName}
                      setAppointId={setAppointId}
                      setListFilterStatus={setListFilterStatus}
                    />
                  </ClickAwayListener>
                  <IconButton
                    style={{ visibility: searchTerm.length ? 'visible' : 'hidden' }}
                    className="close-search-icon"
                    onClick={resetSearchTerm}
                  >
                    <img src="../doctor/close_search.svg" alt="close_search" height="18" width="18" />
                  </IconButton>
                </React.Fragment>
              )
              : ''
          }
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}

export default function ChatNavbar(params) {
  const classes = useStyles();
  const {
    patientName,
    appointmentObj,
    setMsgData,
    viewPatientDetails,
    updateList,
    handleCaseSheet,
    setShowVideoSec,
    showVideoSec,
    handleMsgClick,
    userDetails,
    setIsFullScreen,
    isFullScreen
  } = params;
  const [styleReset, setStyleReset] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [callType, setCallType] = useState("");
  const [chatUserName, setChatUserName] = useState("");
  const [cookies, setCookies] = useState('');
  const [agoraTokenDetails, setAgoraTokenDetails] = useState({});
  const [openVideoPopUp, setOpenVideoPopUp] = useState(false);
  const router = useRouter();
  const [videoCallerName, setVideoCallerName] = useState('');
  const [videoCallerImg, setVideoCallerImg] = useState('');
  const [getAvatarColor, setAvatarColor] = useState('');
  const [fullScreen, setFullScreen] = useState(false);
  const [token, setToken] = useState('');
  const [rejectUserId, setRejectUserId] = useState("");
  const [type, setType] = useState("");

  let cookie = cookies;
  let headers = {
    authtoken: cookie,
  };

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  useEffect(() => {
    setIsFullScreen(fullScreen);
  }, [fullScreen]);

  useEffect(() => {
    if (localStorage.getItem('avatarColor') === null) {
      const randomColor = getRandomColor();
      localStorage.setItem('avatarColor', randomColor);
      setAvatarColor(randomColor);
    } else {
      setAvatarColor(localStorage.getItem('avatarColor'));
    }
  }, [])

  useEffect(() => {
    if (!_.isEmpty(appointmentObj)) {
      // const parent = appointmentObj.parentName.split(" ")[0];
      // const relation = appointmentObj.customerRelationship;
      const patientName = makeInitialCapital(appointmentObj.userFirstName);
      // const phNo = appointmentObj.parentPhoneNumber;

      setChatUserName(patientName);
      // relation === 'self'
      //   ? setChatUserName(`${patientName} [${phNo}]`)
      //   : setChatUserName(`${parent} for ${relation} ${patientName} [${phNo}]`);
    } else {
      setChatUserName("");
    }
  }, [appointmentObj]);

  const [audioNew] = useState(new Audio("/htc_mega_basic.mp3"));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audioNew.play() : audioNew.pause();
  }, [playing]);

  useEffect(() => {
    audioNew.addEventListener("ended", () => setPlaying(false));
    return () => {
      audioNew.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setOpenVideoPopUp(false);
    setShowVideoSec(false);
    if (type === "call") {
      showCloseWindows();
    }
  };

  const handleOpenVideoPopUp = () => {
    console.log("handleClickOpen");
    setOpenVideoPopUp(true);
  };
  const handleCloseVideoPopUp = () => {
    toggle();
    setOpenVideoPopUp(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("type");
    let decodedToken = decodeURIComponent(urlParams.get("token"));
    
    let data = {
      appointment_id: urlParams.get("appointment_id"),
      callerName: urlParams.get("callerName"),
      token: decodedToken,
      uid: urlParams.get("uid"),
      callerProfile: urlParams.get("callerProfile"),
    };
    setVideoCallerName(data.callerName);
    setVideoCallerImg(data.callerProfile);
    setRejectUserId(urlParams.get("callerId"))

    let agoraParams = {
      userName: data.callerName,
    };

    setAgoraTokenDetails({
      token: data.token,
      uid: data.uid,
      channelName: data.appointment_id,
      agoraParams,
    });

    if (myParam === "call") {
      setType("call");
      showIncommingCall();
      toggle();
      setToken(data.token)
    }
    // firebase.messaging().onMessage((payload) => {
    //   console.log('Message received. ', payload);
    //   // ...
    // });
  }, []);
  function showIncommingCall() {
    console.log("hello");
    handleOpenVideoPopUp();
  }
  const [docUserDetails, setDocUserDetails] = useState({});
  useEffect(() => {
    const getDocUserDetails = JSON.parse(localStorage.getItem('docUserDetails'));
    if (getDocUserDetails && getDocUserDetails.data){
      setDocUserDetails(getDocUserDetails.data);
    }
  }, [])
  let paramsTosend = {
    userId: appointmentObj.careproviderUid,
    userName: appointmentObj.userFirstName,
    // userProfile: appointmentObj.customerProfileImageName,
    // callerId: appointmentObj.consultantId,
    // callerName: appointmentObj.consultantName,
    // callerProfile: appointmentObj.consultantProfileImageName,
    callerId: `${userDetails.data.id}`,
    callerName: `${userDetails.data.userFirstName}`,
    callerProfile: `${userDetails.data.profileImageName}`,
    appointmentDate: moment(appointmentObj.slotStartDttm).format('YYYY-MM-DD'),
    appointmentId: appointmentObj.careproviderUid,
    isVideo: true,
    messageType: 'video',
    patientUid: appointmentObj.agoraVideoCallStartUID,
    doctorUid: appointmentObj.agoraVideoCallStartUID + 1,
    // assistantUid: appointmentObj.agoraVideoCallStartUID + 2,
    // assistantName: appointmentObj.assistantName,
    // assistantProfile:appointmentObj.assistantProfileImageName,
    patientID: appointmentObj.customerId,
    patientName: appointmentObj.customerName +" "+ appointmentObj.customerLastName,
    patientProfile: appointmentObj.customerProfileImageName,
    doctorId: appointmentObj.consultantId,
    doctorName: appointmentObj.consultantName,
    doctorProfile: appointmentObj.consultantProfileImageName
  };

  function agoraAccessToken() {
    // Initiate video call when network is available
    if (navigator.onLine && cookies !== '') {
      axios
      .post(
        config.API_URL + "/api/notification/startvideocall?callerName=" + userDetails.data.userFirstName,
        {
          appointmentId: appointmentObj.careproviderUid,
          title: "Video call from " + userDetails.data.userFirstName,
          body: paramsTosend,
        },
        { headers }
      )
      .then((response) => {
        console.log("response in agora access token: ", response);
        setToken(response.data.token)
        setAgoraTokenDetails({
          token: response.data.token,
          uid: response.data.uid,
          channelName: appointmentObj.id,
          paramsTosend,
        });
        handleClickOpen();

        // handleSubmit(AgoraRTCTmp,response.data.uid,response.data.token);
      })
      .catch(function (error) {
        console.log("in error", JSON.stringify(error));
        setShowVideoSec(false);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: 'error'
        })
      });
    } else {
      setShowVideoSec(false);
      setMsgData({
        message: 'Network not available. Please try again later.',
        type: 'error'
      });
    }
  }

  const addDoctor = () => {
    if (cookies === '') {
      return ;
    }
    axios
      .post(
        config.API_URL + "/api/notification/invitedoctorinactivecall",
        {
          appointmentId: appointmentObj.id,
          title: "Video call from " + userDetails.userFirstName,
          body: paramsTosend,
          token: token
        },
        { headers }
      )
      .then((response) => {
        console.log("response in agora access token: ", response);

      })
      .catch((error) => {
        console.log("Error occurred in agora access token:", error);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });

  }
  const acceptVideoCall = () => {
    handleClickOpen();
    setCallType("incoming");
    toggle();
    handleCloseVideoPopUp();
    setShowVideoSec(true);
  };
  const videoCall = () => {
    handleClickOpen();
    setShowVideoSec(true);
    // return false
    // agoraAccessToken();
    setCallType("outgoing");
    console.log("videocall");
  };
  const audioCall = () => {
    // handleClickOpen();
    setCallType("audio");
    console.log("audioCall");
  };
  const getInitialsOfGender = (gender) => {
    let name = gender;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(rgx)] || [];

    initials = (initials.shift()?.[1] || "").toUpperCase();

    return initials;
  };
  const sendRejectNotification = () => {
    if (cookies === '') {
      return ;
    }
    paramsTosend.messageType = "rejected";
    paramsTosend.isVideo = false;
    axios
      .post(config.API_URL + "/api/notification/push", {
        userId: rejectUserId,
        appointmentId: appointmentObj.id,
        title: "Call Rejected",
        body: paramsTosend
      },
        { headers })
      .then((response) => {
        console.log("response of reject notification: ", response)
      })
      .catch((error) => {
        console.log("Error occurred while logout", error);
        // alert.show(error.response.data.errors[0].message, { type: 'error' })
      });
    showCloseWindows();
  }
  const [openVideoEnded, setopenVideoEnded] = useState(false);
  function showCloseWindows() {
    setopenVideoEnded(true);
  }

  return (
    <AppBar
      position="relative"
      color="default"
      className={` ${styleReset && 'chat-reset-zIndex'} headerDetails`}
    >
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.patientName}
        >
          {chatUserName}
        </Typography>
        {patientName && (
          <div style={{ whiteSpace: "nowrap" }}>
            <label htmlFor="view-msg">
              <Tooltip title="Chat">
                <IconButton
                  id="show-chat"
                  className={classes.btnPostion}
                  onClick={handleMsgClick}
                >
                  <img
                    src="../doctor/chat.svg"
                    alt="chat"
                    height="18"
                    width="18"
                  />
                </IconButton>
              </Tooltip>
            </label>

            <label htmlFor="view-casesheet">
              <Tooltip title="CaseSheet">
                <IconButton
                  id="show-casesheet"
                  className={classes.btnPostion}
                  onClick={handleCaseSheet}
                >
                  <img
                    src="../doctor/case_sheet.svg"
                    alt="show-casesheet"
                    height="18"
                    width="18"
                  />
                </IconButton>
              </Tooltip>
            </label>
            {showVideoSec === false ?
              <>
                <label htmlFor="videocall-icon">
                  <Tooltip title="Video Call">
                    <IconButton
                      id="video-call"
                      className={classes.btnPostion}
                      onClick={(event) => videoCall(event)}
                    >
                      <img
                        src="../doctor/video.svg"
                        alt="video.png"
                        height="18"
                        width="18"
                      />
                    </IconButton>
                  </Tooltip>
                </label>
              </>
              : ''
            }
            <label htmlFor="more-icon">
              <IconButton
                id="more-icon"
                className={`${classes.btnPostion} ${classes.moreIconBtn} hide-child-btn-effect`}
                onClick={() => setStyleReset(!styleReset)}
              >
                <ConsultationListMenu
                  viewPatientDetails={viewPatientDetails}
                  appointment={appointmentObj}
                  updateList={updateList}
                  setMsgData={setMsgData}
                  showVideoSec={showVideoSec}
                  isFullScreen={isFullScreen}
                />
              </IconButton>
            </label>
          </div>
        )}
      </Toolbar>

      <Modal
        style={{ backgroundColor: '#3b3b3c' }}
        disableEnforceFocus
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        BackdropComponent={Backdrop}
        BackdropProps={{
          width: 430,
        }}
        className={`${fullScreen ? 'videoDialog fullScreen' : 'videoDialog'} video-call-end-dialog`}
      >
        <NewVideoCallUi
          callType={callType}
          connectionDetails={agoraTokenDetails}
          closeDiaglog={handleClose}
          setMsgData={setMsgData}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
          addDoctor={addDoctor}
          appointmentObj={appointmentObj}
        />
      </Modal>

      {/* onClose={handleCloseVideoPopUp} */}
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
            {videoCallerImg ==="NA" ?<Avatar
              src={
                videoCallerImg === "" || videoCallerImg === "NA" || videoCallerImg === null
                  ? ""
                  : `${config.API_URL}/api/utility/download/` +
                  videoCallerImg
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
            :<Avatar src={
              `${config.API_URL}/api/utility/download/` +
              videoCallerImg} 
              style={{
                position: "relative",
                bottom: 5,
                height: "70px",
                width: "70px",}}
                className="pImage"
              />}
          </div>
          <div className="incomingDetails">
            <div className="detailsName">{videoCallerName} </div>
            {/* <div className="details">3 Years, Female</div> */}
          </div>
          <div className="action">
            <Button
              onClick={() => { handleCloseVideoPopUp(); sendRejectNotification(); }}
              size="small"
              variant="contained"
              // color="secondary"
              className="reject"
            >
              REJECT
            </Button>
            <Button
              onClick={acceptVideoCall}
              size="small"
              variant="contained"
              // color="secondary"
              className="accept"
            >
              ACCEPT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        className="video-call-end-dialog"
        aria-labelledby="customized-dialog-title"
        open={openVideoEnded}
        fullScreen
      >
        <DialogContent
          style={{ position: 'absolute', textAlign: 'center', top: '35%', left: '50%', transform: 'translateX(-50%)', color: 'gray' }}
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
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Your Video Consultation Ended
            </div>
            <div style={{ fontWeight: '14px' }}>
              Please close this tab
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}
