import React, { useState, useEffect } from "react";
import { Typography, Grid, Radio, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { doctorStyle } from "./DoctorDetailStyle";

const useStyles = makeStyles((theme) => doctorStyle);
export default function ConsultationType() {
  const classes = useStyles();
  const [selectAppointmentType, setSelectAppointmentType] = useState("");

  const appointmentTypeHandle = (event) => {
    setSelectAppointmentType(event.target.value);
    console.log("========>typeValue", event.target.value);
  };
  return (
    <>
      <Typography className={classes.mainHeading}>Consultation Type</Typography>
      <Radio
        style={{ marginBottom: "15px", color: "#818080" }}
        value="Physical"
        checked={selectAppointmentType === "Physical"}
        onClick={appointmentTypeHandle}
        inputProps={{ "aria-label": "Physical" }}
      />
      <Typography className={classes.physicalRadioText}>
        <img src="/RadioHome_Icon.svg" className={classes.radioPhysicalImg} />
        Physical
      </Typography>
      <Radio
        style={{ marginBottom: "15px", color: "#818080" }}
        value="Video"
        checked={selectAppointmentType === "Video"}
        onClick={appointmentTypeHandle}
        inputProps={{ "aria-label": "Video" }}
      />
      <Typography className={classes.videoRadioText}>
        <img src="/RadioVideo_Icon.svg" className={classes.radioVideoImg} />
        Video
      </Typography>
      <Divider />
    </>
  );
}
