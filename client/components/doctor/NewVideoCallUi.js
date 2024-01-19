import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Avatar from "@material-ui/core/Avatar";
import { getHexColor } from "../../utils/nameDP";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import axios from "axios";
import config from "../../app.constant";
import Button from "@material-ui/core/Button";

const rtc = {
  // For the local client
  client: null,
  // For the local audio and video tracks
  localAudioTrack: null,
  localVideoTrack: null,
};

// Pass your app ID here
const appId = "d289bd31e6c7430eba4a66ca5f68a79d";

function NewVideoCallUi(props) {
  const [cookies, setCookies] = useState("");
  let customerDetails = props.customerDetails;
  let connectionDetails = props.connectionDetails;
  let appointmentObj = props.appointmentObj;
  let callType = props.callType;

  useEffect(() => {
    if (cookies === "") {
      setCookies(JSON.parse(localStorage.getItem("token")));
    }
  }, [cookies]);
  // console.log("props: ",props);
  let params = {};
  if (connectionDetails.paramsTosend) {
    params = connectionDetails.paramsTosend;
  }
  if (connectionDetails.agoraParams) {
    params = connectionDetails.agoraParams;
  }
  useEffect(() => {
    dynamicallyImportPackage();
    // setCallType(props.callType);
  }, []);
  const [showUserType, setShowUserType] = useState("");
  const [patientName] = useState(appointmentObj.userFirstName);
  const [remoteUserName, setRemoteUserName] = useState("");
  const [showPatient, setShowPatient] = useState(false);
  const [showRemote, setShowRemote] = useState(false);
  const [selfImage, setSelfImage] = useState("");
  const [audioFlag, setAudioFlag] = useState(false);
  const [hideAddBtn, setHideAddBtn] = useState(false);
  const [remoteFlag, setRemoteFlag] = useState(false);
  const [timerFlag, setTimerFlag] = useState(false);
  const [audioNew] = useState(new Audio("/ringback.mp3"));
  const [playing, setPlaying] = useState(false);
  const [playInLoop, setPlayInLoop] = useState(true);

  // set the loop of audio tune
  useEffect(() => {
    audioNew.loop = playInLoop;
  }, [playInLoop]);

  useEffect(() => {
    if (callType === "outgoing") {
      playing ? audioNew.play() : audioNew.pause();
    }
  }, [playing]);

  useEffect(() => {
    audioNew.addEventListener("ended", () => setPlaying(false));
    return () => {
      audioNew.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);
  useEffect(() => {
    // if(timerFlag === true && remoteFlag === true){
    //   console.log("clg both true");
    // }
    if (timerFlag === true && remoteFlag === false) {
      handleLeave();
      props.setMsgData({ message: "User not available", type: "error" });
    }
  }, [remoteFlag, timerFlag]);
  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("userDetails"));
    const docUserDetails = JSON.parse(localStorage.getItem("docUserDetails"));

    setShowUserType("Assistant");
    setRemoteUserName(appointmentObj.userFirstName);
    setSelfImage(encodeURIComponent(docUserDetails.profileImageName));

    // if(temp.userType === 'diabetologist'){
    //   setShowUserType('Assistant');
    //   setRemoteUserName(appointmentObj.assistantName);
    //   setSelfImage(encodeURIComponent(appointmentObj.consultantProfileImageName));
    // }else if(temp.userType === 'physician:assistant'){
    //   setShowUserType('Doctor');
    //   setRemoteUserName(appointmentObj.consultantName);
    //   setSelfImage(encodeURIComponent(appointmentObj.assistantProfileImageName));
    // }else{
    //   setSelfImage(encodeURIComponent(appointmentObj.consultantProfileImageName));
    //   setHideAddBtn(true);
    // }
  }, []);

  let dynamicallyImportPackage = async () => {
    const AgoraRTCTmp = await import("agora-rtc-sdk-ng");
    // you can now use the package in here
    if (connectionDetails.token) {
      console.log("connectionDetails: ", connectionDetails);
      console.log(
        "object: ",
        connectionDetails.uid,
        connectionDetails.token,
        connectionDetails.channelName
      );

      const connectionToken =
        "00647db4bd2ef964fda97953d0db91e6082IAAX7PjLPEhwy+4v+PJp33qH6lLC4R3gOpvMijZv3a+gBXBQYQYAAAAAEADjTvSOdLIxYgEAAQB0sjFi";
      const connectionUID = 3;
      const connectionChannelName = "CHATDATA";

      /** Commenting the original function to initiate video call with real time data */
      // startBasicCall(AgoraRTCTmp, connectionDetails.uid, connectionDetails.token, connectionDetails.channelName)

      startBasicCall(
        AgoraRTCTmp,
        connectionUID,
        connectionToken,
        connectionChannelName
      ).catch((err) => {
        console.log("error ", err);
        // props.setMsgData({ message: err.message, type: "error" });
        handleLeave();
      });
    }
  };

  async function startBasicCall(AgoraRTC, userId, token, channelName) {
    //Create Local Client
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    rtc.client.on("connection-state-change", (curState, prevState) => {
      console.log("current", curState, "prev", prevState);
      if (curState === "DISCONNECTED") {
        console.log(" in side DISCONNECTED");
      }
    });
    setPlaying(true);
    setTimeout(() => {
      setTimerFlag(true);
    }, 45000);
    //listen for remote channels
    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      // getAppointmentData();
      setPlaying(false);
      setRemoteFlag(true);
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success", mediaType);
      console.log("user @@@@@@: ", user);
      // If the subscribed track is video.
      if (mediaType === "video") {
        console.log("inside mediatype");
        if (rtc.client !== null) {
          rtc.client.remoteUsers.forEach((user, index) => {
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            if (index == 0) {
              // if(user.uid == appointmentObj.agoraVideoCallStartUID){
              setShowPatient(true);

              const PlayerContainer = React.createElement("div", {
                id: user.uid,
                className: "stream",
              });
              ReactDOM.render(
                PlayerContainer,
                document.getElementById("remote-stream")
              );
              if (user.videoTrack !== undefined) {
                user.videoTrack.play(`${user.uid}`);
              }

              if (user.audioTrack !== undefined) {
                user.audioTrack.play();
              }
            }
            console.log("bgImg ", bgImg);
            // if(index == 1){
            if (user.uid == checkUid) {
              setShowRemote(true);
              setHideAddBtn(true);
              setHideRemote("");
              const PlayerContainer = React.createElement("div", {
                id: user.uid,
                className: "stream2",
                style: {
                  backgroundImage: bgImg,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                },
              });
              ReactDOM.render(
                PlayerContainer,
                document.getElementById("remote-stream2")
              );
              if (user.videoTrack !== undefined) {
                user.videoTrack.play(`${user.uid}`);
              }

              if (user.audioTrack !== undefined) {
                user.audioTrack.play();
              }
            }
          });
        }
      }
      // If the subscribed track is audio.
      if (mediaType === "audio") {
        console.log("in audio");
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });
    let tempUid;
    let checkUid;
    let bgImg;
    if (
      JSON.parse(localStorage.getItem("userDetails")).userType ===
      "physician:assistant"
    ) {
      tempUid = appointmentObj.agoraVideoCallStartUID + 2;
      checkUid = appointmentObj.agoraVideoCallStartUID + 1;
      bgImg = `url(${
        config.API_URL +
        "/api/utility/download/" +
        encodeURIComponent(appointmentObj.consultantProfileImageName)
      })`;
    } else {
      tempUid = appointmentObj.agoraVideoCallStartUID + 1;
      checkUid = appointmentObj.agoraVideoCallStartUID + 2;
      bgImg = `url(${
        config.API_URL +
        "/api/utility/download/" +
        encodeURIComponent(appointmentObj.assistantProfileImageName)
      })`;
    }
    //Join
    console.log("tempuid: ", tempUid);
    const uid = await rtc.client.join(appId, channelName, token, tempUid);
    console.log("rtc.client: ", rtc.client);
    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //Check If Audio track is Active
    AgoraRTC.checkAudioTrackIsActive(rtc.localAudioTrack)
      .then((result) => {
        console.log(`${result ? "available" : "unavailable"}`);
      })
      .catch((e) => {
        console.log("check audio track error!", e);
      });

    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    rtc.localVideoTrack.play("local-stream");
    //Check If Video track is Active
    // AgoraRTC.checkVideoTrackIsActive(rtc.localVideoTrack).then(result => {
    //   }).catch(e => {
    //   console.log("check video track error!", e);
    // });
    console.log("rtc.localAudioTrack: ", rtc.localAudioTrack);
    console.log("rtc.localVideoTrack: ", rtc.localVideoTrack);
    setAudioFlag(true);
    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    console.log("publish success!");

    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log("user-unpublished: ", user);
      if (user.uid === appointmentObj.agoraVideoCallStartUID) {
        setShowPatient(false);
      }
      if (user.uid === checkUid) {
        // setShowRemote(false);
      }
    });
    rtc.client.on("user-left", async (user, reason) => {
      console.log("user-left: ", user);
      // if(user.uid === appointmentObj.agoraVideoCallStartUID ){
      //   props.setMsgData({ message: "Patient has left the meeting", type: "error" });
      // }else{
      setShowRemote(false);
      setHideAddBtn(false);
      setHideRemote(" hide");
      handleLeave();
      const playerContainer = document.getElementById(user.uid);
      // playerContainer && playerContainer.remove();
      ReactDOM.unmountComponentAtNode(playerContainer);
      // if(JSON.parse(localStorage.getItem("userDetails")).userType === 'physician:assistant'){
      //   props.setMsgData({ message: "Doctor has left the meeting", type: "error" });
      // }else{
      //   props.setMsgData({ message: "Assistant has left the meeting", type: "error" });
      // }
      // }
    });
    // user-left(user: IAgoraRTCRemoteUser, reason: string)
  }

  let headers = {
    authtoken: cookies,
  };
  function stopVideoCallAPI() {
    // axios
    //   .get(config.API_URL + "/api/notification/stopvideocall/" + connectionDetails.channelName, { headers })
    //   .then((response) => {
    //     console.log("response: ",response)
    //   })
    //   .catch((error) => {
    //     props.setMsgData({
    //       message: error.response.data.errors[0].message,
    //       type: "error",
    //     });
    //     console.log("error", error);
    //   });
  }

  async function handleLeave() {
    // stopVideoCallAPI();
    setPlaying(false);

    try {
      const localContainer = document.getElementById("local-stream");
      if (rtc.localAudioTrack) {
        rtc.localAudioTrack.close();
      }
      if (rtc.localVideoTrack) {
        rtc.localVideoTrack.close();
      }
      // setJoined(false);
      localContainer.textContent = "";

      // Traverse all remote users
      if (rtc.client !== null) {
        rtc.client.remoteUsers.forEach((user) => {
          console.log("users in close: ", user);
          console.log("m,dnvdh");
          // Destroy the dynamically created DIV container
          const playerContainer = document.getElementById(user.uid);
          playerContainer && playerContainer.remove();
        });
      }
      // Leave the channel
      if (rtc.client !== null) {
        await rtc.client.leave();
      }
      props.closeDiaglog();
    } catch (err) {
      console.error(err);
    }
  }
  const [muteVid, setMuteVid] = useState(false);

  async function muteVideo() {
    console.log("muteVideo: ");
    console.log(
      "muteVid: ",
      muteVid,
      " :rtc.localVideoTrack",
      rtc.localVideoTrack
    );
    const localContainer = document.getElementById("local-stream");
    console.log("localContainer: ", localContainer);
    if (rtc.localVideoTrack !== null) {
      if (muteVid == true) {
        setMuteVid(false);
        rtc.localVideoTrack.setEnabled(true);
      } else {
        setMuteVid(true);
        rtc.localVideoTrack.setEnabled(false);
        localContainer.textContent = "";
      }
    }
  }
  const [muteAud, setMuteAud] = useState(false);

  async function muteAudio() {
    console.log("muteAudio: ");
    console.log("localAudioTrack: ", rtc.localAudioTrack, "muteAud: ", muteAud);
    if (audioFlag) {
      if (muteAud == true) {
        rtc.localAudioTrack.setEnabled(true);
        setMuteAud(false);
      } else {
        setMuteAud(true);
        if (rtc.localAudioTrack) {
          rtc.localAudioTrack.setEnabled(false);
        }
      }
    }
  }
  const getInitialsOfGender = (gender) => {
    let name = gender;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(rgx)] || [];

    initials = (initials.shift()?.[1] || "").toUpperCase();

    return initials;
  };
  const toggleFullScreen = () => {
    console.log("toggleFullScreen ", props.fullScreen);
    props.setFullScreen(!props.fullScreen);
  };
  const [hideRemote, setHideRemote] = useState("");
  return (
    <>
      <div className="videocall">
        {/* {joined ? ( */}
        <>
          {!hideAddBtn && (
            <div className="addDoctor">
              <Button onClick={props.addDoctor} style={{ padding: "0px" }}>
                <span>Add {showUserType}</span>
              </Button>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              right: "0",
              cursor: "pointer",
              zIndex: "9999",
            }}
            onClick={toggleFullScreen}
          >
            {/* <FullscreenIcon style={{color:'white',fontSize:'40px'}} /> */}
            <img
              src={props.fullScreen ? "/min.svg" : "/max.svg"}
              style={{ height: "30px", margin: "10px" }}
            />
          </div>
          <div
            id="local-stream"
            className="stream local-stream"
            style={{
              backgroundImage: `url(${
                config.API_URL + "/api/utility/download/" + selfImage
              })`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="namebadge self">You</span>
          </div>
          {showPatient && (
            <div className="namebadge patientName ">
              <span>{patientName}</span>
            </div>
          )}
          <div
            id="remote-stream"
            // ref={remoteRef}
            className="stream remote-stream"
          ></div>
          {showRemote && (
            <div className="remote2badge">
              <span className="namebadge">{remoteUserName}</span>
            </div>
          )}
          <div
            id="remote-stream2"
            className={"remote-stream2" + hideRemote}
          ></div>
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            {/* <img src='/callPlaceholder.svg' style={{width:'120px'}} /> */}
            {appointmentObj.customerProfileImageName === "NA" ? (
              <Avatar
                style={{
                  backgroundColor:
                    appointmentObj.customerName !== undefined &&
                    appointmentObj.customerName !== null &&
                    appointmentObj.customerName !== "" &&
                    getHexColor(appointmentObj.customerName),
                }}
              >
                {appointmentObj.customerName !== undefined &&
                  appointmentObj.customerName !== null &&
                  appointmentObj.customerName !== "" &&
                  getInitialsOfGender(appointmentObj.customerName)}
              </Avatar>
            ) : (
              <Avatar
                src={
                  `${config.API_URL}/api/utility/download/` +
                  appointmentObj.customerProfileImageName
                }
              />
            )}
            <div style={{ color: "#fff", marginTop: "15px" }}>
              <div style={{ fontSize: "22px" }}>
                {appointmentObj.customerName}
              </div>
              {/* <div style={{fontSize:'16px'}}><span>M,&nbsp;</span><span>10 Years</span> </div> */}
            </div>
          </div>
          <div className="iconBar">
            <img
              src={muteVid ? "/videoUnmute.svg" : "/videoMute.svg"}
              onClick={muteVideo}
            />
            <img src="/endCall.svg" onClick={handleLeave} />
            <img
              src={muteAud ? "/micUnmute.svg" : "/micMute.svg"}
              onClick={muteAudio}
            />
          </div>
        </>
        {/* ) : null} */}
      </div>
    </>
  );
}

export default NewVideoCallUi;
