import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../app.constant";
import {
  Paper,
  Tooltip,
  CircularProgress,
  IconButton,
  Chip,
  Link
} from "@material-ui/core";
import { GiftedChat, Bubble, SystemMessage, Send } from "@unifycare/webchat";
import moment from "moment";
import Head from "next/head";
import ChatNavbar, { NavBar } from "../../components/doctor/NavBar";
import PreviewFileModal from "../../components/doctor/PreviewFileModal";
import { useRouter } from "next/router";
import AppointmentTabs from "../../components/doctor/AppointmentTabs";
import AppointmentList from "../../components/doctor/AppointmentList";
import Filter from "../../components/doctor/Filter";
import MessagePrompt from "../../components/messagePrompt";
import PatientDetails from "../../components/doctor/PatientDetails";
import DoctorHomePage from "../doctorHomePage";
import { getHexColor } from "../../utils/nameDP";
import _ from "lodash";
import DefaultChat from "../../components/doctor/DefaultChat";
import { compareAppointmentDate } from "../../utils/helpers";
import PdfPopOver from '../../components/doctor/PdfPopOver';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflowY: "hidden",
    marginTop: "2px",
  },
  chatList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "1px",
    width: "500px",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    overflowY: "hidden",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  appointmentList: {
    minHeight: "calc(100vh - 172px)",
    height: "100vh",
    overflowY: "auto",
    backgroundColor: "#eee",
  },
}));

const TITLE = "Unify Care";

const appointmentListing = ({ firebase }) => {
  const Router = useRouter();
  const [msgData, setMsgData] = useState({});
  const classes = useStyles();
  const [viewPatientDetails, setViewPatientDetails] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [cookies, setCookies] = useState('');
  const [listOfAppointment, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [appointmentObj, setAppointmentObj] = useState({});
  const [doctorId, setDoctorID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImg] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    Router.query?.date ?? moment(new Date()).format("YYYY-MM-DD")
  );
  const [buttoncs, setButtonCS] = useState("");
  const [appointId, setAppointId] = useState(0);
  const [countRecords, setCountRecords] = useState('');
  const [enableSort, setEnableSort] = useState(false);
  const [patientDetails, setPatient] = useState([]);
  const [listFilterStatus, setListFilterStatus] = useState("");
  const [upcomingDate, setUpcomingDate] = useState("");
  const [showVideoSec, setShowVideoSec] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [fileDesc, setFileDesc] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [docUserDetails, setDocUserDetails] = useState({});
  const [appointmentTimeMode, setAppointTimeMode] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [newRec, setNewRec] = useState(0);
  const [showPdf, setShowPdf] = useState(0);
  const [fileLink, setFileLink] = useState('');
  const [docName, setDocName] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const cookie = cookies;
  const headers = {
    authtoken: cookie,
    "Content-type": "application/json",
  };

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  const handleOnClickList = (event, index, d) => {
    setSelectedIndex(index);
    setPatientName(d.userFirstName);
    // setDoctorID(d.consultantId);
    setViewPatientDetails(0);
    setAppointmentObj(d);
    setAppointId(d.patientUid);
    setButtonCS("");
  };

  const handleCaseSheet = (event) => {
    setButtonCS("Clicked");
    event.preventDefault();
    setViewPatientDetails(0);
    console.info("You clicked a breadcrumb.");
  };

  const handleMsgClick = (event) => {
    event.preventDefault();
    setButtonCS("");
    setViewPatientDetails(0);
  };

  const refreshAppList = () => {
    // Always reset the date to today's date while tab refresh
    const latestDate = moment(new Date()).format("YYYY-MM-DD");
    const getUserRole = !appointmentTimeMode ? "consultant" : "assistant";
    const nextDate = moment(latestDate).add(1, "day").format("YYYY-MM-DD");
    setIsLoading(true);
    setUpcomingDate(latestDate);
    setSearchMode(false); // Reset search mode in case of new appointment
    setListFilterStatus(''); // Reset filter in case of new appointment
    setIsRefresh(true);
    setAppointTimeMode(false);

    axios
        .get(
          `${config.API_URL}/api/patient/${getUserRole}/appointments?date=${latestDate}&nextDate=${nextDate}`,
          { headers }
        )
        .then((res) => {
          userDetails.userType === "physician:assistant"
            ? setBadgeCount(res.data.nextDayCount)
            : "";
          setIsRefresh(false);

          if (
            (res.data.hasOwnProperty("appointments") &&
              res.data.appointments.length) ||
            res.data.length
          ) {
            let list = [];
            if (res.data.hasOwnProperty("appointments")) {
              list = addAgeOfPatient(res.data.appointments);
            } else {
              list = addAgeOfPatient(res.data);
            }

            // Sort appointment list by slot id in descending order
            list = list.sort(
              (a, b) => a.appointmentSlotId - b.appointmentSlotId
            );

            setList(list);
            setOriginalList(list);
            setCountRecords(list.length);
            setIsLoading(false);
          } else {
            setList([]);
            setOriginalList([]);
            setCountRecords(0);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log('Refresh App List', err);
          setIsRefresh(false);
          setIsLoading(false);
          setMsgData({
            message: "Unable to refresh appointment list",
            type: "error",
          });
        });
  };

  useEffect(() => {
    // Check the device type and orientation
    const detectMob = () => {
      const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /BlackBerry/i,
          /Windows Phone/i
      ];

      return toMatch.some((toMatchItem) => {
          return window.navigator.userAgent.match(toMatchItem);
      });
    };

    if (detectMob()) {
      // Alert user to use application landscape mode
      if (!window.matchMedia("(orientation: landscape)").matches) {
        // Keep the pop-up on to use application in portrait mode
        setMsgData({
          message: 'Please switch to Landscape mode for better experience!',
          type: 'error'
        });
      }
    }

    setButtonCS("");
    setViewPatientDetails(0);
    setIsLoading(true);
    const getUserDetails = JSON.parse(localStorage.getItem("userDetails"));
    setUserDetails(getUserDetails);

    // getUserDetails.userType === UserType.Diabetologist
    const getUserRole = !appointmentTimeMode ? "consultant" : "assistant";
    const nextDate = moment(selectedDate).add(1, "day").format("YYYY-MM-DD");

    if (!searchMode && cookies !== '') {
      axios
        .get(config.API_URL + "/api/partner/employeeselfinfo", { headers })
        .then((response) => {
          setDocUserDetails(response.data);
        })
        .catch(err => {
          setMsgData({
            message: 'Error occurred while fetching user data',
            type: 'error'
          });
        });

      // `${config.API_URL}/api/patient/${getUserRole}/appointments?date=${selectedDate}&nextDate=${nextDate}`

      // careprovider - employee id
      // opdSelecton - physical / video
      axios
        .get(
          `${config.API_URL}/api/partner/v1/opdpatients?startdate=2021-12-16&careprovider=12248&opdSelection=physical`,
          { headers }
        )
        .then((res) => {
          const appointmentList = res.data.data;
          // Remove all the null records based on userFirstName
          const updatedAppList = appointmentList.filter(i => i.userFirstName !== null);

          // Add age property to appointment list
          const listWithAge = addAgeOfPatient(updatedAppList);

          handleOnClickList("", 0, updatedAppList[0]);
          setList(updatedAppList);
          setOriginalList(updatedAppList);
          setCountRecords(updatedAppList.length);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setMsgData({
            message: "Unable to fetch appointment list",
            type: "error",
          });
        });
    } else {
      setIsLoading(false);
    }
  }, [selectedDate, appointmentTimeMode, searchMode, cookies]);

  useEffect(() => {
    // Trigger notification countRecords is updated to Zero
    if (countRecords === '') {
      return ;
    }

    const currDate = moment(new Date()).format("YYYY-MM-DD");

    // Trigger notification only for current date
    if (currDate === selectedDate) {
      const AppointDbRef = firebase.database().ref('appointments/' + userDetails.id + '/messages');
    
      // Traverse the records to get the last key of record
      AppointDbRef.orderByKey().limitToLast(1).on('value', (snapshot) => {

        // Traverse the record to get the value
        snapshot.forEach((childSnapshot) => {
          const result =  childSnapshot.val();
          const {count, date} = result;

          if (date === selectedDate && !searchMode && !appointmentTimeMode) {
            // Storing the test appointment
            setNewRec(count - countRecords);
          }
        });
      });
    }
  }, [countRecords, searchMode, appointmentTimeMode]);

  useEffect(() => {
    // Fetch all conversation from firebase by appointmentId
    if (appointId !== 0 && appointId === appointmentObj.id) {
      setIsLoading(true);
      
      // Load Message from Firebase Listener
      let chatId2 = appointmentObj.id;
      let messagesRef = firebase
        .database()
        .ref("conversations/" + chatId2 + "/messages");
      const doctorID = appointmentObj.consultantId;

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

            if (appointmentObj.id === userDetails.id) {
              data.sent = true;
              if (childData.status == "Read") {
                data.received = true;
              }
            }
          }

          messagesData.push(data);
        });

        messagesData.reverse();
        setMessages(messagesData);
        setIsLoading(false);
      });

      let messagesRef2 = firebase
        .database()
        .ref("conversations/" + chatId2 + "/messages");

      messagesRef2.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let childKey = childSnapshot.key;
          let childData = childSnapshot.val();

          if (!childData.system && childData.user !== undefined) {
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
  }, [appointId]);

  const onSend = (newMsg = []) => {
    // Prevent updating the state there is no message or patient is not selected
    if (patientName === "" || newMsg[0].text === "" || newMsg.length === 0) {
      return;
    }

    // Update message object
    const updateMsgObj = newMsg.map(msgObj => {
      msgObj.user._id = msgObj.user.id;
      msgObj.user.name = userDetails.userFirstName;
      return msgObj;
    });
    messages.push(updateMsgObj[0]);
    setMessages(messages.reverse());
    // let messagedata = {
    //   id: newMsg[0].id,
    //   type: "text",
    //   createdAt: new Date().getTime(),
    //   status: "Sent",
    //   user: {
    //     _id: userDetails.id,
    //     name: `${userDetails.userFirstName}`,
    //   },
    // };

    // if (newMsg[0].hasOwnProperty("fileType")) {
    //   // Function to send attachment to user
    //   uploadDataToFirebase(newMsg[0]);
    // } else {
    //   // Function to send text message
    //   sendMessageToFirebase(appointmentObj, newMsg[0]);
    // }
  };

  const uploadDocToServer = (fileUrl) => {
    axios
      .post(
        `${config.API_URL}/api/patient/addpatientdocument`,
        {
          title: fileDesc.fileTitle,
          category: fileDesc.fileCategory,
          date: fileDesc.fileDate,
          url: fileUrl,
          patientId: appointmentObj.customerId,
          fileType: fileDesc.fileType,
        },
        { headers }
      )
      .then((res) => console.log("Uploaded document to server", res))
      .catch((err) =>
        console.log("Error occurred while uploading doc to server", err)
      );
  };

  const uploadDataToFirebase = (chatData) => {
    setIsLoading(true);
    const storageRef = firebase.storage().ref();
    const doctorId = appointmentObj.consultantId;
    const currentTime = new Date().getTime();
    const fileName = chatData.file.name;
    const fileExt = fileName.split(".")[1];
    const filePath = "chatData/" + doctorId + "/" + currentTime + "." + fileExt;

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
          setIsLoading(false);
          let chatDetails = chatData;
          chatDetails.downloadURL = downloadURL;

          sendMessageToFirebase(appointmentObj, chatDetails);
        });
      }
    );
  };

  const sendMessageToFirebase = (appointmentObj, chatMessages) => {
    const chatDetails = chatMessages;
    let chatId2 = appointId;
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
          setMsgData({
            message: "Error occcured while sending message",
            type: "error",
          });
        } else {
          // After successful Reset the state back to null
          setImg("");
          console.log("Data saved successfully");
          let paramsTosend = {
            callerId: `${docUserDetails.id}`,
            callerName: `${docUserDetails.userFirstName} ${docUserDetails.userLastName}`,
            callerProfile: `${docUserDetails.profileImageName}`,
            appointmentId: appointmentObj.id,
            appointmentDate: appointmentObj.appointmentDate,
            messageType: msgType.type,
          };
          axios
            .post(
              `${config.API_URL}/api/notification/push`,
              {
                userId: appointmentObj.parentId,
                userId2: userDetails.userType === "physician:assistant" ? appointmentObj.consultantId : appointmentObj.assistantId,
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

  const addAgeOfPatient = (listOfAppointments) => {
    const momentObj = moment();
    let patientBirthYear = 0;

    if (listOfAppointments.length) {
      listOfAppointments.map((d) => {
        patientBirthYear = moment(new Date(d.userBirthDttm), "YYYY");
        let ageDifference = momentObj.diff(patientBirthYear, "years");
        d.patientAge = ageDifference;
        return d;
      });

      // listOfAppointments.map((a) => {
      //   if ( a.appointmentStatus === "successfully:completed" ) {
      //     a.status = "completed";
      //   } else if(  a.appointmentStatus === "completed:with:error" ) {
      //     a.status = "error";
      //   } else {
      //     a.status = a.appointmentStatus;
      //   }

      //   return a;
      // });
    }

    return listOfAppointments.reverse();
  };

  // Update the batch of the appointment status
  const updateList = (appointment, otherTask = "") => {
    const newList = listOfAppointment.map((d) => {
      if (d.arhOrderId === appointment.arhOrderId && otherTask === "") {
        d.appointmentStatus = appointment.appointmentStatus;
        d.status = "completed";
      } else if (otherTask === "reschedule" && appointment.id === d.id) {
        d.appointmentRescheduleEnabled =
          appointment.appointmentRescheduleEnabled;
      } else if (
        otherTask === "ready:for:doctor:consultation" &&
        appointment.id === d.id
      ) {
        console.log("Update List obj", d);
        // Update the appointment status of specfic appointment id
        d.appointmentStatus = otherTask;
        d.status = "ready:for:doctor:consultation";
      }
      return d;
    });

    setList(newList);
  };

  // Update the batch of the appointment status
  const updateCallTimeList = (appointment) => {
    const newList = listOfAppointment.map((d) => {
      if (d.id === appointment.id) {
        return { ...d, ...appointment };
      }

      return d;
    });

    setList(newList);
  };

  const makeInitialCapital = (str) => {
    const inputStr = str !== null ? str : 'Alpha';
    let word = inputStr.toLowerCase().split(" ");
    for (let i = 0; i < word.length; i++) {
      word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
    }
    return word.join(" ");
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

  const handlePopOver = (file, documentName) => {
    setShowPdf(!showPdf);
    setFileLink(file);
    setDocName(documentName);
  };

  useEffect(() => {
    if (isFullScreen) {
      // Close the dialog when call screen is full screen
      setShowPdf(false);
      // On fullscreen close the preview popup
      setOpenModal(false);
    }
  }, [isFullScreen]);

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

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#007E7C",
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

  console.log('listOfAppointment', listOfAppointment);
  return (
    <>
      {isLoading && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <Head>
        <title>{ TITLE }</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta name="viewport" content="width=1024" />
      </Head>
      <MessagePrompt msgData={msgData} />
      <React.Fragment>
        <style global jsx>{`
          body {
            overflow-y: hidden;
          }
        `}</style>
        {showVideoSec === false && (
          <div>
            {/* display none when showChat is true */}
            <NavBar
              doctorDetails={appointmentObj}
              msgData={msgData}
              setMsgData={setMsgData}
              countRecords={countRecords}
              listOfAppointment={listOfAppointment}
              setList={setList}
              addAgeOfPatient={addAgeOfPatient}
              setUpcomingDate={setUpcomingDate}
              setSelectedDate={setSelectedDate}
              setCountRecords={setCountRecords}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              setAppointmentObj={setAppointmentObj}
              setPatientName={setPatientName}
              setAppointId={setAppointId}
              setListFilterStatus={setListFilterStatus}
              setLoader={setIsLoading}
            />
          </div>
        )}
      </React.Fragment>
      <div className={classes.container}>
        {/* add new class "chatcontainer" when msg chat triggred while video call */}
          <div
            className={classes.chatList}
            style={{ minHeight: showVideoSec ? '100vh' : '' }}
          >
            {/* Unset width when there is no appointment */}
            <Paper
              sqaure="true"
              className="appoint-list-details"
              style={{ borderRadius: "unset !important" }}
            >
              <AppointmentTabs
                setSelectedDate={setSelectedDate}
                upcomingDate={upcomingDate}
                setUpcomingDate={setUpcomingDate}
                selectedDate={selectedDate}
                setSearchMode={setSearchMode}
                badgeCount={badgeCount}
                userDetails={userDetails}
              />
              <Filter
                listOfAppointment={listOfAppointment}
                originalList={originalList}
                setList={setList}
                setEnableSort={setEnableSort}
                enableSort={enableSort}
                setListFilterStatus={setListFilterStatus}
                appointmentTimeMode={appointmentTimeMode}
                setAppointTimeMode={setAppointTimeMode}
                setViewPatientDetails={setViewPatientDetails}
                setAppointmentObj={setAppointmentObj}
                setSelectedIndex={setSelectedIndex}
                isRefresh={isRefresh}
                listFilterStatus={listFilterStatus}
              />
            </Paper>

            {
              newRec > 0 && (
                <Alert variant="filled" severity="success" className="new-app-notification">
                  <Link
                    className="refresh-app-list"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      refreshAppList();
                    }}
                  >
                    {newRec} New Appointments available for today
                  </Link>
                </Alert>
              )
            }

            <Paper
              sqaure="true"
              className={`${
                listOfAppointment.length
                  ? classes.appointmentList
                  : "appointment-default-list"
              } appoint-list-details`}
            >
              <AppointmentList
                appointmentObj={appointmentObj}
                selectedIndex={selectedIndex}
                handleOnClickList={handleOnClickList}
                makeInitialCapital={makeInitialCapital}
                listOfAppointment={listOfAppointment}
                setMsgData={setMsgData}
                enableSort={enableSort}
                updateCallTimeList={updateCallTimeList}
                appointmentTimeMode={appointmentTimeMode}
              />
            </Paper>
          </div>
        <div
          className={classes.chat}
          style={{ backgroundColor: "#eee", overflowY: "hidden" }}
        >
          {listOfAppointment.length ? (
            <ChatNavbar
              appointmentObj={appointmentObj}
              patientName={patientName}
              makeInitialCapital={makeInitialCapital}
              setMsgData={setMsgData}
              viewPatientDetails={setViewPatientDetails}
              updateList={updateList}
              patientDetails={patientDetails}
              handleCaseSheet={handleCaseSheet}
              setShowVideoSec={setShowVideoSec}
              showVideoSec={showVideoSec}
              setAppointmentObj={setAppointmentObj}
              handleMsgClick={handleMsgClick}
              userDetails={docUserDetails}
              setIsFullScreen={setIsFullScreen}
              isFullScreen={isFullScreen}
            />
          ) : (
            <DefaultChat listOfAppointment={listOfAppointment} />
          )}

          {image !== "" && (
            <PreviewFileModal
              file={image}
              openModal={openModal}
              modalFunc={setOpenModal}
              sendToUser={onSend}
              appointmentObj={appointmentObj}
              setFileDesc={setFileDesc}
              showVideoSec={showVideoSec}
            />
          )}

          {fileLink !== "" && (
            <PdfPopOver
              file={fileLink}
              docName={docName}
              openModal={showPdf}
              modalFunc={setShowPdf}
              showVideoSec={showVideoSec}
              fileType="file"
            />
          )}

          {/* Case Sheet Prescription */}
          {/* {buttoncs !== "" &&
            listOfAppointment.length !== 0 &&
            !viewPatientDetails && (
              <DoctorHomePage
                appointmentObj={appointmentObj}
                setMsgData={setMsgData}
                getAvatarColor={getHexColor}
                firebase={firebase}
                userDetails = {JSON.parse(localStorage.getItem("userDetails"))}
                showVideoSec={showVideoSec}
                isFullScreen={isFullScreen}
              />
            )} */}

          {!viewPatientDetails &&
          buttoncs === "" &&
          listOfAppointment.length ? (
            <React.Fragment>
              <GiftedChat
                alwaysShowSend
                user={{ id: userDetails.id }}
                messages={messages}
                onSend={onSend}
                renderAccessory={chatAccessories}
                renderCustomView={renderCustomView}
                renderInputToolbar={
                  // Hide message composer whose status is completed
                  compareAppointmentDate(
                    appointmentObj.appointmentDate,
                    selectedDate
                  ) &&
                  (appointmentObj.appointmentStatus ===
                    "completed:with:error" ||
                    appointmentObj.appointmentStatus ===
                      "successfully:completed")
                    ? () => null
                    : undefined
                }
                renderBubble={renderBubble}
                renderAvatar={null}
                renderUsernameOnMessage={true}
                renderSystemMessage={renderSystemMessage}
                renderSend={(props) => (
                  <Send {...props}>
                    <div className="sendicon">
                      <img src="../doctor/chat_arrow.png" alt="arrow" />
                    </div>
                  </Send>
                )}
              />

              {compareAppointmentDate(
                appointmentObj.appointmentDate,
                selectedDate
              ) &&
              (appointmentObj.appointmentStatus === "completed:with:error" ||
                appointmentObj.appointmentStatus ===
                  "successfully:completed") ? (
                <div style={{ marginBottom: 25 }}></div>
              ) : (
                <div className={`${showVideoSec ? 'chat-margin-bottom45' : 'chat-margin-bottom110'}`}></div>
              )}
            </React.Fragment>
          ) : (
            ""
          )}

          {/* {!!viewPatientDetails && (
            <React.Fragment>
              <PatientDetails details={appointmentObj} />
              <div style={{ marginBottom: "40px" }}></div>
            </React.Fragment>
          )} */}
        </div>
      </div>
    </>
  );
};

export default appointmentListing;
