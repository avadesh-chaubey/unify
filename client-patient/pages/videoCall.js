import React, { useState } from 'react';
import Header from "../components/consultationServices/Header";
import HeadBreadcrumbs from "../components/common/headBreadcrumbs";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import router from 'next/router';
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
function videoCall() {
   const classes = useStyles();
   const [showFamily, setShowFamily] = useState(false);
   const viewPrescription = () =>{
      router.push("/pastApmt/prescription")
   }
   const addFamily = () =>{
      console.log("addFamily");
      setShowFamily(!showFamily)
   }
  return <>
    <Header />
    <HeadBreadcrumbs
        titleArr={["Consults","Past Appointments","Upcoming Appointments","Waiting Screen"]}
        mainTitle={"Video Call"}
    />
    <div className={classes.root}>
      <div className={classes.videoSec}>
         <img src="../videoIcon/mainImage.png" className={classes.mainImage}/>
         <img src="../videoIcon/waveIcon.svg" style={{position:"absolute", left:"30px", top:"20px", height:"30px", cursor:"pointer"}}/>
         <img src="../videoIcon/messageIcon.svg" style={{position:"absolute", right:"30px", top:"20px", height:"30px",cursor:"pointer"}}/>
         <img src="../videoIcon/addIcon.svg" style={{position:"absolute", right:"30px", top:"70px", height:"30px",cursor:"pointer"}} onClick={addFamily}/>
         <img src="../videoIcon/callTimer.svg" className={classes.timerDiv}/>
         <img src="../videoIcon/doctorIcon.png" className={classes.doctorVid}/>
         <div className={classes.iconDiv}>
            <img src="../videoIcon/sharescreenIcon.svg" className={classes.videoIcon}/>
            <img src="../videoIcon/micIcon.svg" className={classes.videoIcon}/>
            <img src="../videoIcon/callIconRed.svg" className={classes.videoIcon} style={{height:"40px", marginTop:"-5px"}}/>
            <img src="../videoIcon/videoIcon.svg" className={classes.videoIcon}/>
            <img src="../videoIcon/cameraSwitch.svg" className={classes.videoIcon}/>
         </div>
      </div>
      <div className={classes.chatSec}>
         {!showFamily && <div>
            <div className={classes.viewPresc}>
               <img src="../videoIcon/prescription.png" style={{float:"left", height:"25px"}}/>
               <span style={{float:"left",fontSize:"14px", color: "#502e92", padding: "5px 10px"}} onClick={viewPrescription}>VIEW PRESCRIPTION</span>
               <img src="../videoIcon/rightArrow.png" style={{float:"right", height:"25px"}}/>
            </div>
            <img src="../videoIcon/chatImage.PNG" style={{height: "calc(100vh - 100px)"}}/>
         </div>}
         {showFamily && <div className={classes.addFamilyDiv}>
            <div className={classes.title}>
               Add family member
            </div>
            <div className={classes.memberDiv}>
               <img src="../videoIcon/geeta.png" className={classes.memberIcon}/>
               <img src="../videoIcon/aryan.png" className={classes.memberIcon}/>
               <img src="../videoIcon/rahul.png" className={classes.memberIcon}/>
               <img src="../videoIcon/ria.png" className={classes.memberIcon}/>
               <img src="../videoIcon/roshan.png" className={classes.memberIcon}/>
               <img src="../videoIcon/aryan.png" className={classes.memberIcon}/>

               {/* <div className={classes.memberIcon}>
                  patient
               </div>
               <div className={classes.memberIcon}>
                  patient
               </div>

               <div className={classes.memberIcon}>
                  patient
               </div>
               <div className={classes.memberIcon}>
                  patient
               </div>
               <div className={classes.memberIcon}>
                  patient
               </div> */}
            </div>
         </div>}
      </div>
    </div>
  </>;
}

export default videoCall;
