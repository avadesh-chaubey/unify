import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import config from "../../app.constant";

const useStyles = makeStyles((theme) => ({
  profileImage: {
    height: "110px",
    width: "110px",
    padding: "10px",
  },
  docName: {
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "Avenir_black !important",
  },
  podcastDiv: {
    position: "absolute",
    backgroundColor: "#818080",
    right: "15px",
    top: "30px",
    width: "100px",
    textAlign: "center",
    color: "#FFFFFF",
  },

  doctorCard: {
    backgroundColor: "#F8F6F6",
    padding: "10px 0",
    position: "relative",
  },
  socialLink: {
    position: "absolute",
    right: "15px",
    top: "85px",
  },
  socialLinkImg: {
    width: "40px",
    height: "40px",
    color: "#4267B2",
  },
}));

export default function DoctorProfileImgCard(props) {
  const classes = useStyles();
  const { showProfileData } = props;
  // console.log("======>showProfile", showProfileData);
  // const [showProfileData, setProfileData]= useState()
  const url = config.API_URL + "/api/utility/download/";
  return (
    <>
      <Grid container alignItems="center" className={classes.doctorCard}>
        <Grid item>
          <img
            src="/PritiChopra.png" //{`${url}${showProfileData && showProfileData.profileImageName}`}
            className={classes.profileImage}
          />
        </Grid>
        <Grid item style={{ marginLeft: "20px" }}>
          <Typography className={classes.docName}>
            {/* {showProfileData && showProfileData.doctorFullName} */}
            Dr. Priti Chopra
          </Typography>
          <Typography style={{ color: "#343434", fontSize: "12px" }}>
            {/* {showProfileData &&
              showProfileData.specializationList &&
              showProfileData.specializationList.length > 0 &&
              showProfileData.specializationList.map((item, index) => (
                <span className="specialization">
                  {item}
                  <span>&nbsp;&nbsp;</span>
                </span>
              ))} */}
            Pediatrician, 10 Years Exp.
          </Typography>
          <Typography style={{ color: "#343434", fontSize: "12px" }}>
            {/* {showProfileData &&
              showProfileData.qualificationList &&
              showProfileData.qualificationList.length > 0 &&
              showProfileData.qualificationList.map((item, index) => (
                <span className="qualification">
                  {item}
                  <span>&nbsp;&nbsp;</span>
                </span>
              ))} */}
            MBBS
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.podcastDiv}>
        <img src="/Podcast.svg" style={{ width: "100px" }} />
        {/* <Typography className={classes.docNamesec}>PodCast</Typography> */}
      </div>
      <div className={classes.socialLink}>
        <FacebookIcon className={classes.socialLinkImg} />
        <LinkedInIcon className={classes.socialLinkImg} />
      </div>
    </>
  );
}
