import React from 'react'
import { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { getHexColor } from '../../utils/nameDP';
import Avatar from '@material-ui/core/Avatar';
import config from "../../app.constant";
import axios from "axios";
import { useCookies } from "react-cookie";


const rtc = {
  // For the local client
  client: null,
  // For the local audio and video tracks
  localAudioTrack: null,
  localVideoTrack: null,
};

// Pass your app ID here
const appId = process.env.agoraAppId;


function VideoCallUi(props) {
	const {setShowVid,showChat, setShowChat} = props;
  console.log("props VideoCallUi: ",props);
  const [cookies, SetCookies] = useCookies(["name"]);
  const [audioFlag, setAudioFlag] = useState(false);
  const [remoteFlag, setRemoteFlag] = useState(false);
  const [timerFlag, setTimerFlag] = useState(false);
  const [audioNew] = useState(new Audio("/ringback.mp3"));
  const [playing, setPlaying] = useState(false);
  const [playInLoop, setPlayInLoop] = useState(true);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  let callType = props.callType;
 
  // set the loop of audio tune
  useEffect(() => {
    audioNew.loop = playInLoop;
  }, [playInLoop])

  useEffect(() => {
    if(callType === "outgoing"){
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
    // if(timerFlag === true && remoteFlag === false){
    //   handleLeave();
    //   props.setMsgData({ message: "User not available", type: "error" });
    // }
  }, [remoteFlag, timerFlag])

  let connectionDetails = props.connectionDetails;
  let appointmentObj = props.appointmentObj;
  console.log("appointmentObj: ",appointmentObj);
  // console.log("props: ",props);
  let params = {};
  // if(connectionDetails.paramsTosend){
  //   params = connectionDetails.paramsTosend;
  // }
  // if(connectionDetails.agoraParams){
  //   params = connectionDetails.agoraParams;
  // }
  useEffect(() => {
    dynamicallyImportPackage()
    // setCallType(props.callType);
  }, [])
let dynamicallyImportPackage = async () => {
  const AgoraRTCTmp = await import('agora-rtc-sdk-ng');
  // you can now use the package in here
  // if(connectionDetails.token){
    
    startBasicCall(AgoraRTCTmp,0,"0062f6e7256b18e433aa2483ef381d3ab0aIACOWiMxyoOW0C4Wn0qQYeQpBCXwkiW+UII8Yfg2wuYLhq56GhIAAAAAEAAD1/lOSXsgYgEAAQBKeyBi","channel8")
    .catch(err=>{
        console.log("error ",err);
        // props.setMsgData({ message: err.message, type: "error" });
        handleLeave();
    })
    // }
  } 
// let dynamicallyImportPackage = async () => {
//   const AgoraRTCTmp = await import('agora-rtc-sdk-ng');
//   // you can now use the package in here
//   if(connectionDetails.token){
//     console.log("connectionDetails: ",connectionDetails)
//     console.log("object: ",connectionDetails.uid,connectionDetails.token,connectionDetails.channelName);
//     startBasicCall(AgoraRTCTmp,connectionDetails.uid,connectionDetails.token,connectionDetails.channelName)
//     .catch(err=>{
//         console.log("error ",err);
//         props.setMsgData({ message: err.message, type: "error" });
//         handleLeave();
//     })
//   }
// } 
  		const userTimer = () =>{
			  console.log("userTimer")
			  let sec = 0;
			  let min = 0;
			  setInterval(()=>{
				sec = sec + 1;
				console.log("second: ",sec)
				console.log("minute: ",min)
				if(sec > 59){
					sec = 0;
					min = min+1;
				}
				setSecond(sec);
			  	setMinute(min);
			  },1000)
			  
		  }
    async function startBasicCall(AgoraRTC,userId,token,channelName) {
      //Create Local Client
      rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      setPlaying(true);
      setTimeout(() => {
        setTimerFlag(true);
      }, 45000);
      //listen for remote channels 
      rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
        setPlaying(false);
        setRemoteFlag(true);
        userTimer();
        await rtc.client.subscribe(user, mediaType);
            console.log("subscribe success", mediaType);
            console.log("user @@@@@@: ",user);
          // If the subscribed track is video.
            if (mediaType === "video") {
                console.log("inside mediatype")
                if(rtc.client !== null){
                  rtc.client.remoteUsers.forEach((user,index) => {
                  // Dynamically create a container in the form of a DIV element for playing the remote video track.
                  if(index == 0){
                  // if(user.uid === appointmentObj.agoraVideoCallStartUID+1){
                    // setShowPatient(true);

                    const PlayerContainer = React.createElement("div", {
                      id: user.uid,
                      className: "stream",
                    });
                    ReactDOM.render(
                      PlayerContainer,
                      document.getElementById("remote-stream")
                    );
                    if(user.videoTrack !== undefined){
                        user.videoTrack.play(`${user.uid}`);
                    }

                    if(user.audioTrack !== undefined){
                        user.audioTrack.play();
                    }
                  }
                  // console.log("bgImg ",bgImg)
                  // if(index == 1){
                  // if(user.uid == appointmentObj.agoraVideoCallStartUID+2){
                    
                  //   const PlayerContainer = React.createElement("div", {
                  //     id: user.uid,
                  //     className: "stream2",
                  //     style: {backgroundImage: `url(${config.API_URL + "/api/utility/download/" + appointmentObj.assistantProfileImageName})`, backgroundRepeat: "no-repeat", backgroundSize:"cover", backgroundPosition:"center"},
                  //   });
                  //   ReactDOM.render(
                  //       PlayerContainer,
                  //   document.getElementById("remote-stream2")
                  //   );
                  //   if(user.videoTrack !== undefined){
                  //       user.videoTrack.play(`${user.uid}`);
                  //   }

                  //   if(user.audioTrack !== undefined){
                  //       user.audioTrack.play();
                  //   }
                  // }
                  });
                }
            }
      // If the subscribed track is audio.
      if (mediaType === "audio") {
          console.log("in audio")
          // Get `RemoteAudioTrack` in the `user` object.
          const remoteAudioTrack = user.audioTrack;
          // Play the audio track. No need to pass any DOM element.
          remoteAudioTrack.play();
      }
      });

      //Join 
      const uid = await rtc.client.join(
        appId,
        channelName,
        token,
        0
      )
      console.log("rtc.client: ",rtc.client);
      // Create an audio track from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      //Check If Audio track is Active
      // AgoraRTC.checkAudioTrackIsActive(rtc.localAudioTrack).then(result => {
      //   console.log(`${microphoneLabel} is ${result ? "available" : "unavailable"}`);
      //   }).catch(e => {
      //   console.log("check audio track error!", e);
      // });

      // Create a video track from the video captured by a camera.
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      rtc.localVideoTrack.play("local-stream");
      //Check If Video track is Active
      // AgoraRTC.checkVideoTrackIsActive(rtc.localVideoTrack).then(result => {
      //   console.log(`${result ? "available" : "unavailable"}`);
      //   }).catch(e => {
      //   console.log("check video track error!", e);
      // });
      console.log("rtc.localAudioTrack: ",rtc.localAudioTrack);
      console.log("rtc.localVideoTrack: ",rtc.localVideoTrack);
      setAudioFlag(true);
      // Publish the local audio and video tracks to the channel.
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      console.log("publish success!");

      rtc.client.on("user-unpublished", async (user, mediaType) => {
        console.log("user-unpublished: ", user);
        
      })
      rtc.client.on("user-left", async (user, reason) => {
        console.log("user-left: ", user);
        handleLeave();
        // if(user.uid === appointmentObj.agoraVideoCallStartUID + 1){
        //   props.setMsgData({ message: "Doctor has left the meeting", type: "error" });
        // }else{
        //   const playerContainer = document.getElementById(user.uid);
        //   // playerContainer && playerContainer.remove();
        //   ReactDOM.unmountComponentAtNode(playerContainer);
        //   props.setMsgData({ message: "Assistant has left the meeting", type: "error" });
        // }
      })
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
    function stopVideoCallAPI(){
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
      stopVideoCallAPI();
      setPlaying(false);
		setShowVid("no");
      try {
        const localContainer = document.getElementById("local-stream");
        if(rtc.localAudioTrack){
            rtc.localAudioTrack.close();
        }
        if(rtc.localVideoTrack){
            rtc.localVideoTrack.close();
        }
        // setJoined(false);
        localContainer.textContent = "";
    
        // Traverse all remote users
        if(rtc.client !== null){
          rtc.client.remoteUsers.forEach((user) => {
            console.log("users in close: ",user)
              console.log("m,dnvdh")
              // Destroy the dynamically created DIV container
              const playerContainer = document.getElementById(user.uid);
              playerContainer && playerContainer.remove();
          });
        }
        // Leave the channel
        if(rtc.client !== null){
          await rtc.client.leave();
        }
        // props.closeDiaglog();
        
      } catch (err) {
        console.error(err);
      }
    }

  const [muteVid, setMuteVid] = useState(false);

    async function muteVideo (){
        console.log("muteVideo: ");
        console.log("muteVid: ",muteVid," :rtc.localVideoTrack",rtc.localVideoTrack);
        const localContainer = document.getElementById("local-stream");
        console.log("localContainer: ",localContainer)
        if(rtc.localVideoTrack !== null){
          if(muteVid == true){
            setMuteVid(false);
              rtc.localVideoTrack.setEnabled(true);
          }else{
            setMuteVid(true);
            rtc.localVideoTrack.setEnabled(false);
            localContainer.textContent = "";
          }
        }
        
    }
    const [muteAud, setMuteAud] =useState(false);

    async function muteAudio (){
      console.log("muteAudio: ");
      console.log("localAudioTrack: ",rtc.localAudioTrack,"muteAud: ",muteAud);
      if(audioFlag){
        if(muteAud == true){
          rtc.localAudioTrack.setEnabled(true);
          setMuteAud(false);
        }else{
          setMuteAud(true);
          if(rtc.localAudioTrack){
            rtc.localAudioTrack.setEnabled(false);
          }
        }
      }
        
    }
	const onMsgClick = ()=>{
		console.log("onMsgClick",showChat)
		setShowChat(!showChat);
	}
  return (
    <div className='videocall'>
      {/*  */}
      <div id="local-stream" className="stream local-stream">
        {/* <span className="namebadge self">You</span> */}
      </div>

      <div
        id="remote-stream"
        className="stream remote-stream"
      ></div>
      {/* <div
        id="remote-stream2"
        className={"remote-stream2"}
      >
      </div> */}
      <img src="../videoIcon/messageIcon.svg" style={{position:"absolute", right:"30px", top:"20px", height:"30px",cursor:"pointer", zIndex:"9999"}}  onClick={onMsgClick}/>
		<div className='timer'>
			 {`${minute > 9 ? minute : "0" + minute}:${second > 9 ? second : "0" + second}`}
		</div>
		<div className='iconBarOuter'>
			<div className='iconBar'>
			<img src={muteVid?'/videoUnmute.svg':'/videoMute.svg'} onClick={muteVideo}/>
			<img src='/endCall.svg' onClick={handleLeave}/>
			<img src={muteAud?'/micUnmute.svg':'/micMute.svg'} onClick={muteAudio} />
			</div>
		</div>
      
    </div>
  )
}

export default VideoCallUi
