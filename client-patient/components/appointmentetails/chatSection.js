import React,{useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import VideoCallUi from "./videoCallUi"
import { GiftedChat, Bubble, SystemMessage, Send } from "@unifycare/webchat";
import PreviewFileModal from "../appointmentetails/PreviewFileModal"
import {
  Paper,
  Tooltip,
  CircularProgress,
  IconButton,
  Chip,
  Link
} from "@material-ui/core";
import PdfPopOver from "../appointmentetails/PdfPopOver";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
      overflow: "hidden",
      position: "relative",
      // height: "calc(100vh - 35px)"
      height: "100vh",
      marginBottom:"20px"
   },
   videoSec: {
      width:"70%",
      float:"left",
      position: "relative"
   },
   mainImage: {
      width: "100%",
      padding: "10px 20px"
   },
   iconDiv: {
      position: "absolute",
      bottom: "40px",
      left: "35%",
   },
   timerDiv: {
      position:"absolute",
      bottom: "130px",
      left: "45%"
   },
   doctorVid:{
      position:"absolute",
      bottom: "130px",
      right:"35px",
      height:"125px"
   },
   videoIcon: {
      height: "35px",
      float:"left",
      margin: "0 10px",
      cursor:"pointer"
   },
   chatSec: {
      width:"30%",
      float:"left",
      padding: "10px 10px",
      color: ""
   },
   viewPresc: {
      height: "50px",
      boxShadow: "0px 2px 10px #888888",
      padding: "12px 5px",
      cursor: "pointer"
   },
   addFamilyDiv: {
      background: "#f9f5f5",
      height: "92vh",
   },
   title: {
      padding: "16px 14px",
      fontSize: "26px",
      fontFamily: "Avenir_heavy !important",
      color: "#424242"
   },
   memberDiv: {
      position: "relative",
      display: "block"
   },
   memberIcon: {
      position: "relative",
      display: "inline-flex",
      width:"calc(33% - 20px)",
      // height: "100px",
      // background: "#e1e7ed",
      // padding: "10px 10px",
      margin: "10px 10px",
   
   }
  }));
function ChatSection(props) {
	const {appointmentObj} = props;
  console.log("Props in ChatSection: ",props);
  let appointmentData = props.appointmentObj;
  let firebase = props.firebase;
  const classes = useStyles();
  const [cookies, getCookie] = useCookies(["name"]);
  const [open, setOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [agoraTokenDetails, setAgoraTokenDetails] = useState({});
  // const [token, setToken] = useState('');
  const [openVideoPopUp, setOpenVideoPopUp] = useState(false);
  // const router = useRouter();
  const [rejectUserId, setRejectUserId] = useState("");
  const [callType, setCallType] = useState("");


  const [messages, setMessages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [image, setImg] = useState("");
  const [fileDesc, setFileDesc] = useState({});
  const [fileLink, setFileLink] = useState('');
  const [docName, setDocName] = useState('');
  const [showPdf, setShowPdf] = useState(0);
  const [loader, setLoader] = useState(false);



  	const viewPrescription = () =>{
		router.push("/pastApmt/prescription")
	}
  // let paramsTosend = {
  //   userId: appointmentData.customerId,
  //   userName: appointmentData.customerName,
  //   userProfile: appointmentData.customerProfileImageName,
  //   // callerId: appointmentData.consultantId,
  //   // callerName: appointmentData.consultantName,
  //   // callerProfile: appointmentData.consultantProfileImageName,
  //   callerId: appointmentData.customerId,
  //   callerName: `${appointmentData.customerFirstName} ${appointmentData.customerLastName}`,
  //   callerProfile: `${appointmentData.customerProfileImageName}`,
  //   appointmentDate: appointmentData.appointmentDate,
  //   appointmentId: appointmentData.id,
  //   isVideo: true,
  //   messageType: 'video',
  //   patientUid: appointmentData.agoraVideoCallStartUID,
  //   doctorUid: appointmentData.agoraVideoCallStartUID + 1,
  //   assistantUid: appointmentData.agoraVideoCallStartUID + 2,
  //   assistantName: appointmentData.assistantName,
  //   assistantProfile:appointmentData.assistantProfileImageName,
  //   patientID: appointmentData.customerId,
  //   patientName: appointmentData.customerName +" "+ appointmentData.customerLastName,
  //   patientProfile: appointmentData.customerProfileImageName,
  //   doctorId: appointmentData.consultantId,
  //   doctorName: appointmentData.consultantName,
  //   doctorProfile: appointmentData.consultantProfileImageName
  // };
  function agoraAccessToken() {
    // Initiate video call when network is available
    if (navigator.onLine) {
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
      .post(
        config.API_URL + "/api/notification/startvideocall?callerName=" + appointmentData.customerName,
        {
          appointmentId: appointmentData.id,
          title: "Video call from " + appointmentData.customerName,
          body: paramsTosend,
        },
        { headers }
      )
      .then((response) => {
        console.log("response in agora access token: ", response);
        // setToken(response.data.token)
        setAgoraTokenDetails({
          token: response.data.token,
          uid: response.data.uid,
          channelName: appointmentData.id,
          paramsTosend,
        });
        handleClickOpen();
        setLoader(false);
        // handleSubmit(AgoraRTCTmp,response.data.uid,response.data.token);
      })
      .catch(function (error) {
        console.log("error: ",error)
        console.log("in error", JSON.stringify(error));
        // setShowVideoSec(false);
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: 'error'
        })
        setLoader(false);
      });
    } else {
      // setShowVideoSec(false);
      props.setMsgData({
        message: 'Network not available. Please try again later.',
        type: 'error'
      });
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  // const videoCall = () => {
  //   // handleClickOpen();
  //   // setShowVideoSec(true);
  //   // // return false
  //   agoraAccessToken();
  //   setCallType("outgoing");
  //   console.log("videocall");
  // };
  const handleClose = () => {
    setOpen(false);
    // setOpenVideoPopUp(false);
    // setShowVideoSec(false);
    // if (type === "call") {
    //   showCloseWindows();
    // }
  };
 
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const getUserDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log("getUserDetails: ",getUserDetails);
    setUserDetails(getUserDetails);

  }, [])

  useEffect(() => {
    // Fetch all conversation from firebase by appointmentId
    if (appointmentData && appointmentData.apmtypUID !== 0) {
      // setIsLoading(true);
      setLoader(true);
      
      // Load Message from Firebase Listener
      let chatId2 = appointmentData.apmtypUID;
      let messagesRef = firebase
        .database()
        .ref("conversations/" + chatId2 + "/messages");
      console.log("chatId2: ",chatId2);
      messagesRef.orderByChild("createdAt").on("value", function (snapshot) {
        let messagesData = [];

        snapshot.forEach((childSnapshot) => {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          let data = {
            id: childKey,
            ...childData,
          };

          // Add id property to render message properly
          if (!childData.system && data.user !== undefined) {
            data.user.id = data.user._id;
            delete data.user._id;

            const chatUserId = data.user.id;

            // chat user id should be always doctor / assistant
            if (chatUserId === userDetails.id) {
              data.sent = true;
              if (childData.status == "Read") {
                data.received = true;
              }
            }
          }

          messagesData.push(data);
        });
        console.log("messagesData: ",messagesData)
        messagesData.reverse();
        setMessages(messagesData);
        // setIsLoading(false);
        setLoader(false);
      });

      let messagesRef2 = firebase
        .database()
        .ref("conversations/" + chatId2 + "/messages");

      messagesRef2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          if (!childData.system && childData.user !== undefined) {
            // Chat User Id
            const userId = childData.user._id;

            // userId should not be same as user id (Doctor/ Assistant)
            if (childData.status == "Sent" && userId !== userDetails.id) {
              const path = "conversations/" + chatId2 + "/messages/" + childKey;
              firebase.database().ref(path).update({ status: "Read" });
            }
          }
        });
      });

      return () => {
        messagesRef.off();
        messagesRef2.off();
      };
    }
  }, [appointmentData]);
  const onSend = (newMsg = []) => {
    // Prevent updating the state there is no message or patient is not selected
    if (newMsg[0].text === "" || newMsg.length === 0) {
      return;
    }

    if (newMsg[0].hasOwnProperty("fileType")) {
      // Function to send attachment to user
      uploadDataToFirebase(newMsg[0]);
    } else {
      // Function to send text message
      sendMessageToFirebase(appointmentData, newMsg[0]);
    }
  };
  const sendMessageToFirebase = (appointmentObj, chatMessages) => {
	  console.log("appointmentObj:", appointmentObj);
	  console.log("chatMessages:", chatMessages);
    const chatDetails = chatMessages;
    let chatId2 = appointmentObj.apmtypUID;
    let msgType = { type: "text" };
    let messagedata = {
      id: chatDetails.id,
      type: "text",
      createdAt: new Date().getTime(),
      status: "Sent",
      user: {
        _id: userDetails.id,
        name: `${userDetails.userFirstName} ${userDetails.userLastName}`,
      },
    };

    messagedata.text = chatDetails.text;

    if (chatDetails.fileType == "file") {
      msgType.type = "file";
      messagedata.category = chatDetails.category;
      messagedata.file = chatDetails.downloadURL;
      messagedata.type = chatDetails.fileType;
    } else if (chatDetails.fileType == "image") {
      msgType.type = "photo";
      messagedata.category = chatDetails.category;
      messagedata.image = chatDetails.downloadURL;
      messagedata.type = chatDetails.fileType;
    }

    firebase
      .database()
      .ref("conversations/" + chatId2 + "/messages")
      .push()
      .set(messagedata, function (error) {
        if (error) {
          console.log(
            "Firebase error while storing message to db",
            JSON.stringify(error)
          );
          // alert.show("Error occcured while sending message", { type: "error" });
         //  props.setMsgData({
         //    message: "Error occcured while sending message",
         //    type: "error",
         //  });
        } else {
          // After successful Reset the state back to null
          setImg("");
          console.log("Data saved successfully");
          let cookie = "";
          for (const [key, value] of Object.entries(cookies)) {
          if (key === "cookieVal") {
              cookie = value;
          }
          }
          let headers = {
          authtoken: cookie,
          };
          let paramsTosend = {
            callerId: `${appointmentObj.customerId}`,
            callerName: `${appointmentObj.customerFirstName} ${appointmentObj.customerLastName}`,
            callerProfile: `${appointmentObj.customerProfileImageName}`,
            appointmentId: appointmentObj.id,
            appointmentDate: appointmentObj.appointmentDate,
            messageType: msgType.type,
          };
          axios
            .post(
              `${config.API_URL}/api/notification/push`,
              {
                userId: appointmentObj.consultantId,
                userId2: appointmentObj.assistantId,
                appointmentId: appointmentObj.id,
                title: chatDetails.text,
                body: paramsTosend,
              },
              { headers }
            )
            .then((res) => console.log("in push notification response", res))
            .catch((err) => console.log("in push notification erroe", err));
        }
      });
  };
  const uploadDataToFirebase = (chatData) => {
    // setIsLoading(true);
    const storageRef = firebase.storage().ref();
    const patientId = appointmentData.customerId;
    const currentTime = new Date().getTime();
    const fileName = chatData.file.name;
    const fileExt = fileName.split(".")[1];
    const filePath = "chatData/" + patientId + "/" + currentTime + "." + fileExt;

    let uploadTask = storageRef
      .child(filePath)
      .put(chatData.attachmentsData.blob, chatData.attachmentsData.metaData);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function (error) {
        setIsLoading(false);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      function () {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);
          // Upload file from here
          uploadDocToServer(downloadURL);
          // setIsLoading(false);
          let chatDetails = chatData;
          chatDetails.downloadURL = downloadURL;

          sendMessageToFirebase(appointmentData, chatDetails);
        });
      }
    );
  };
  const uploadDocToServer = (fileUrl) => {
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
      .post(
        `${config.API_URL}/api/patient/addpatientdocument`,
        {
          title: fileDesc.fileTitle,
          category: fileDesc.fileCategory,
          date: fileDesc.fileDate,
          url: fileUrl,
          patientId: appointmentData.customerId,
          fileType: fileDesc.fileType,
        },
        { headers }
      )
      .then((res) => {
        console.log("Uploaded document to server", res);
        setLoader(false);
      })
      .catch((err) =>{
        console.log("Error occurred while uploading doc to server", err);
        setLoader(false);}
      );
  };
  const uploadDocument = (e) => {
    const files = e.target.files[0];

    // Prevent further execution of file is undefined
    if (files === undefined) {
      return false;
    }
    files.fileType = "file";
    setOpenModal(true);
    setImg(files);
    
    // Reset the file parameter to null 
    //  after file details is passed to state
    e.target.value = null;
  };
  const uploadImage = (e) => {
    const files = e.target.files[0];

    // Prevent further execution of file is undefined
    if (files === undefined) {
      return false;
    }

    files.fileType = "image";
    setImg(files);
    setOpenModal(true);

    // Reset the file parameter to null 
    //  after file details is passed to state
    e.target.value = null;
  };
  const chatAccessories = () => (
    <div className="chat-accessories">
      <form>
        <input
          accept="application/pdf"
          style={{ display: "none" }}
          id="document"
          type="file"
          onChange={uploadDocument}
        />
        <label htmlFor="document">
          <Tooltip title="Document">
            <IconButton aria-label="document" component="span">
              <img
                src="../doctor/attach_doc.svg"
                alt="attach_doc"
                height={18}
                width={18}
              />
            </IconButton>
          </Tooltip>
        </label>

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="Image"
          type="file"
          onChange={uploadImage}
        />
        <label htmlFor="Image">
          <Tooltip title="Image">
            <IconButton
              color="default"
              aria-label="upload picture"
              component="span"
            >
              <img
                src="../doctor/attach_image.svg"
                alt="attach_image"
                height={18}
                width={18}
              />
            </IconButton>
          </Tooltip>
        </label>
      </form>
    </div>
  );

  const renderCustomView = ({ currentMessage }) => {
    return (
      <>
        {currentMessage.type == "file" && (
          <div style={{ minHeight: 20 }}>
            <Link
              href="#"
              variant="body2"
              underline="none"
              onClick={() => handlePopOver(currentMessage.file, currentMessage.text)}
            >
              <img
                style={{ height: 100, width: 155 }}
                src="../pdf-file-type.svg"
              />
            </Link>
          </div>
        )}
      </>
    );
  };
  const handlePopOver = (file, documentName) => {
    setShowPdf(!showPdf);
    setFileLink(file);
    setDocName(documentName);
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#007E7C",
            marginTop:"10px"
          },
          left: {
            backgroundColor: "#ffffff",
          },
        }}
      />
    );
  };
  const renderSystemMessage = (props) => (
    <div className="system-message-container">
      <SystemMessage
        {...props}
        textStyle={{
          textAlign: "center",
          fontSize: '11',
          fontWeight: '500',
          paddingHorizontal: '20',
        }}
      />
    </div>
  );

  return (
    <>
    {/* {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )} */}
      {/* <div className="orderTitle">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", top:"17px", left:"10px"}} onClick={(e)=>props.backBtnClick("0")}/>
        <div style={{marginLeft: "40px"}}>
          {"View Prescription"}
        </div>
        <div style={{float:"right", padding:"10px"}}>
          <label htmlFor="videocall-icon">
            <Tooltip title="Video Call">
              <IconButton
                id="video-call"
                // className={classes.btnPostion}
                onClick={(event) => videoCall(event)}
              >
                <img
                  src="./video.svg"
                  alt="video.png"
                  height="30"
                  width="30"
                />
              </IconButton>
            </Tooltip>
          </label>
        </div>
      </div> */}
      <div className={classes.viewPresc}>
			<img src="../videoIcon/prescription.png" style={{float:"left", height:"25px"}}/>
			<span style={{float:"left",fontSize:"14px", color: "#502e92", padding: "5px 10px"}} onClick={viewPrescription}>VIEW PRESCRIPTION</span>
			<img src="../videoIcon/rightArrow.png" style={{float:"right", height:"25px"}}/>
      </div>
      <div 
        style={{flex: "1",
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 212px)",
          overflowY: "hidden",
          marginTop: "2px",}}
      >
        {/* add new class "chatcontainer" when msg chat triggred while video call */}
          
        <div
          style={{ backgroundColor: "#eee", overflowY: "hidden",display: "flex",
          flex: "3",
          flexDirection: "column",
          borderWidth: "1px",
          borderColor: "#ccc",
          overflowY: "hidden",
          borderRightStyle: "solid",
          borderLeftStyle: "solid", }}
        >
          <React.Fragment>
              <GiftedChat
                alwaysShowSend
                user={{ id: userDetails.id }}
                messages={messages}
                onSend={onSend}
                renderAccessory={chatAccessories}
                renderCustomView={renderCustomView}
                // renderInputToolbar={true}
                // renderInputToolbar={
                //   // Hide message composer whose status is completed
                //   compareAppointmentDate(
                //     appointmentObj.appointmentDate,
                //     selectedDate
                //   ) &&
                //   (appointmentObj.appointmentStatus ===
                //     "completed:with:error" ||
                //     appointmentObj.appointmentStatus ===
                //       "successfully:completed")
                //     ? () => null
                //     : undefined
                // }
                renderBubble={renderBubble}
                renderAvatar={null}
                renderUsernameOnMessage={true}
                renderSystemMessage={renderSystemMessage}
                renderSend={(props) => (
                  <Send {...props}>
                    <div className="sendicon">
                      <img src="../sendIcon.svg" alt="arrow" />
                    </div>
                  </Send>
                )}
              />
            </React.Fragment>
            <div style={{ marginBottom: 40 }}></div>
      
        </div>
      </div>
        {image !== "" && (
          <PreviewFileModal
            file={image}
            openModal={openModal}
            modalFunc={setOpenModal}
            sendToUser={onSend}
            appointmentObj={appointmentData}
            setFileDesc={setFileDesc}
            // showVideoSec={showVideoSec}
          />
        )}

      {fileLink !== "" && (
        <PdfPopOver
          file={fileLink}
          docName={docName}
          openModal={showPdf}
          modalFunc={setShowPdf}
          // showVideoSec={showVideoSec}
          fileType="file"
        />
      )}
      <Modal
        style={{ backgroundColor: '#3b3b3c' }}
        disableEnforceFocus
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        BackdropComponent={Backdrop}
        BackdropProps={{
          width: 430,
        }}
        className={`${fullScreen ? 'videoDialog fullScreen' : 'videoDialog'} video-call-end-dialog`}
      >
        {/* <NewVideoCallUi
          callType={callType}
          connectionDetails={agoraTokenDetails}
          closeDiaglog={handleClose}
          setMsgData={setMsgData}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
          addDoctor={addDoctor}
          appointmentObj={appointmentObj}
        /> */}
        <VideoCallUi 
          closeDiaglog={handleClose}
          connectionDetails={agoraTokenDetails}
          appointmentObj={appointmentData}
          setMsgData = {props.setMsgData}
          callType = {callType}
        />
      </Modal>

      </>
  )
}

export default ChatSection
