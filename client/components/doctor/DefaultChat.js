import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ConsultationListMenu from './ConsultationListMenu';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles({
    list: {
      width: 330,
    },
    fullList: {
      width: "auto",
    },
    resetZindex: {
      zIndex: "unset",
    },
    header: {
      zIndex: 1,
    },
    headerDetails: {
      height: 50,
      backgroundColor: '#fff',
      // boxShadow: 'unset',
    },
    btnPostion: {
      position: 'relative',
      bottom: 5
    },
    moreIconBtn: {
      paddingLeft: 0,
      paddingRight: 0
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
      textTransform: 'uppercase'
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
      width: '80%',
      position: 'relative',
      bottom: 5,
    }
  });

export default function DefaultChat(params) {
    const classes = useStyles();
    const { listOfAppointment } = params;
    const [styleReset, setStyleReset] = useState(true);
  
    // useEffect(() => {
    // }, [appointmentObj]);
  
    return (
        <div
      style={{
        position: 'relative',
        top: '28%',
        marginLeft: '40%',
        display: (listOfAppointment.length) ? 'none' : 'block'
      }}
      className={
        `doctorcard`
      }
    >
      <Grid
        container
        wrap="nowrap"
        spacing={10}
      >
        <Grid item>
          <img
            src="../../chat@2x.png"
            height={150}
            width={150}
            alt="no messages"
            />
        </Grid>
      </Grid>
    </div>
    )
  }