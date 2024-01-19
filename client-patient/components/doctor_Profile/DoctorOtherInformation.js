import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";
import CastForEducationOutlinedIcon from "@material-ui/icons/CastForEducationOutlined";
import LanguageOutlinedIcon from "@material-ui/icons/LanguageOutlined";
const useStyles = makeStyles((theme) => ({
  typoInfor: {
    marginTop: "20px",
    marginBottom: "20px",
    fontWeight: "bold",
    fontFamily: "Avenir_black !important",
    fontSize: "18px",
  },
  typoInforImg: {
    width: "35px",
    height: "35px",
    marginTop: "5px",
  },
  typoSpecilization: {
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "Avenir_black !important",
    color: "#555555",
  },
  typoSpecilizationSec: {
    fontSize: "12px",
    color: "#9A9898",
    // fontWeight: "bold",
    marginTop: "5px",
    wordBreak: "break-word",
    width: "calc(100% - 0px)",
    display: "flex",
  },
  typoSpecilizationSecText: {
    fontSize: "12px",
    color: "#9A9898",
    // fontWeight: "bold",
    marginTop: "5px",
    wordBreak: "break-word",
    width: "calc(70% - 8px)",
    display: "flex",
  },
  typoSpecilizationSecLang: {
    fontSize: "12px",
    color: "#9A9898",
    //fontWeight: "bold",
    marginTop: "5px",
    wordBreak: "break-word",
    width: "calc(50% - 1px)",
    display: "flex",
  },
  typoSpecilizationEdu: {
    fontSize: "12px",
    color: "#9A9898",
    //fontWeight: "bold",
    marginTop: "5px",
    // wordBreak: "break-word",
    // width: "calc(90% - 100px)",
    display: "flex",
  },
  abouttex: {
    fontSize: "14px",
    color: "#343434",
  },
  speciliDiv: {
    display: "flex",
    position: "relative",
    marginBottom: "40px",
  },
  typoSpecilizationDiv: {
    paddingLeft: "30px",
  },
}));

export default function DoctorOtherInformation(props) {
  const classes = useStyles();
  const { showProfileData } = props;
  console.log("======>data4", showProfileData);
  return (
    <>
      <Grid container>
        <Grid item xs={11}>
          <Typography className={classes.typoInfor}>
            Other Informations
          </Typography>
        </Grid>
        <Grid item className={classes.speciliDiv}>
          <PermIdentityOutlinedIcon className={classes.typoInforImg} />
          <div className={classes.typoSpecilizationDiv}>
            <Typography className={classes.typoSpecilization}>
              Speciality
            </Typography>
            <Typography className={classes.typoSpecilizationSec}>
              {/* {showProfileData &&
                showProfileData.specializationList &&
                showProfileData.specializationList.length > 0 &&
                showProfileData.specializationList.map((item, index) => (
                  <span>
                    {item}
                    <span>&nbsp;&nbsp;</span>
                  </span>
                ))} */}
              Paediatrician
            </Typography>
          </div>
        </Grid>
        <Grid item xs={11} className={classes.speciliDiv}>
          <PermIdentityOutlinedIcon className={classes.typoInforImg} />
          <div className={classes.typoSpecilizationDiv}>
            <Typography className={classes.typoSpecilization}>
              Other Specialities
            </Typography>
            <Typography className={classes.typoSpecilizationSecText}>
              {/* {showProfileData &&
                showProfileData.qualificationList &&
                showProfileData.qualificationList.length > 0 &&
                showProfileData.qualificationList.map((item, index) => (
                  <span>
                    {item}
                    <span>,&nbsp;&nbsp;</span>
                  </span>
                ))} */}
              Paediatrician
            </Typography>
          </div>
        </Grid>
        <Grid item xs={11} className={classes.speciliDiv}>
          <CastForEducationOutlinedIcon className={classes.typoInforImg} />
          <div className={classes.typoSpecilizationDiv}>
            <Typography className={classes.typoSpecilization}>
              Education
            </Typography>
            <Typography className={classes.typoSpecilizationEdu}>
              {/* {showProfileData &&
                showProfileData.qualificationList &&
                showProfileData.qualificationList.length > 0 &&
                showProfileData.qualificationList.map((item, index) => (
                  <span>
                    {item}
                    <span>&nbsp;&nbsp;</span>
                  </span>
                ))} */}
              MBBS- University of Punjab-1983
            </Typography>
          </div>
        </Grid>
        <Grid item xs={11} className={classes.speciliDiv}>
          <LanguageOutlinedIcon className={classes.typoInforImg} />
          <div className={classes.typoSpecilizationDiv}>
            <Typography className={classes.typoSpecilization}>
              Languages Spoken
            </Typography>
            <Typography className={classes.typoSpecilizationSecLang}>
              English Hindi
            </Typography>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
