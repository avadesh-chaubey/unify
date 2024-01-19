import React, {useState, useEffect} from 'react';
import Header from "../../components/consultationServices/Header";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    position:"relative"
  },
  title: {
    color:"#00B5AF",
    fontSize:"30px",
    fontWeight:"500",
    position:"relative",
    textAlign:"center",
    margin:"30px 0",
    fontFamily: "'Avenir_heavy' !important"
  },
  imageDiv: {
    position:"relative",
    height:"300px",
    width:"400px",
    // textAlign:"center",
    transform: "translateX(-48%)",
    left: "58%",
  },
  image: {
    position:"absolute",
    height:"100%"
  },
  imageTop:{
    position:"absolute",
    height: "95%",
    margin: "2.5%",
  },
  text:{
    width: "165px",
    fontSize:"15px",
    color: "#4B2994",
    fontWeight: "500",
    // margin: "25% 18%",
    textAlign: "center",
  },
  imageSmily:{
    // position:"absolute",
    // bottom:"20px",
    // marginLeft:"35%",
    height:"35px",
    marginTop:"35px",
    marginLeft:"65px"
  },
  quoteMark: {
    // position: "absolute",
    // margin: "15% 35%",
    fontSize: "40px",
    marginTop:"30%",
    color: "#4B2994",
    textAlign:"center"
  },
  text2:{
    fontSize: "15px",
    position: "relative",
    color: "#595757",
    fontWeight: "500",
    width: "580px",
    textAlign: "center",
    margin:"20px 0"
  },
  leftArrow: {
    position: "absolute",
    left: "15px",
    height: "50px",
    top: "230px",
  },
  rightArrow:{
    position: "absolute",
    right: "15px",
    height: "50px",
    top: "230px",
  }
}));
function waitingScreen() {
  const classes = useStyles();
  
  return (
    <div className="feedbackForm mainDiv">
      <img src="../bg4.png" style={{height: "100%", width:"100%", position:"absolute"}}/>
      <Header />
      <HeadBreadcrumbs title1={"Consults"} title2 = {"Past Appointment"} title3 = {"Waiting Screen"} mainTitle = {"Waiting Screen"} />
      
      <Grid
        container
        // spacing={0}
        // spacing={3}
        direction="column"
        alignItems="center"
        // justify="center"
        className={classes.root}
      >
        <div style={{position:"relative"}}>
          <div className={classes.title}>
            DID YOU KNOW ?
          </div>
          <img src='../leftArrow.png' className={classes.leftArrow}/>
          <img src='../rightArrow.png' className={classes.rightArrow}/>
          <div className={classes.imageDiv}>
            <img src='../waitlayer2.svg' className={classes.image}/>
            <img src='../waitlayer1.svg' className={classes.image}/>
            <img src='../waitlayer3.svg' className={classes.imageTop}/>
            <div style={{position:"absolute", left:"17%"}}>
              <div className={classes.quoteMark}>❞</div>
              <div className={classes.text}>
                Laughing is good for the heart and can increase blood flow by 20 percent.
              </div>
              <img src='../smily.svg' className={classes.imageSmily}/>
            </div>
          </div>
          <div className={classes.text2}>
            Your Appointment is yet to start you can only start appointment just 5 mins before the appointment
          </div>
        </div>
      </Grid>
    </div>
  )
}

export default waitingScreen
