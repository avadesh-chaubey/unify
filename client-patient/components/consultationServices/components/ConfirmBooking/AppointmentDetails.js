import React from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { styleobj } from "./appointmentDetailsStyle";
import CMS from "../../cms";

const useStyles = makeStyles((theme) => styleobj);
function AppointmentDetails() {
  const classes = useStyles();
  const {
    appt_details_title,
    appt_details_physical_consultation,
    appt_details_date_time_lable,
    appt_details_doctor_maintitle,
    appt_details_doctor_name,
    appt_details_doctor_spec,
    appt_details_doctor_add,
    appt_details_patient_details,
    appt_details_patient_Name,
    appt_details_patient_relation,
    appt_details_apptid,
  } = CMS;
  return (
    <>
      <Grid xs={7} className={classes.Grid}>
        <Typography className={classes.mainHeading}>
          {appt_details_title}
        </Typography>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "15px" }}
        >
          <img src="/physical_icon.svg" />
          <Typography className={classes.consultText}>
            {appt_details_physical_consultation}
          </Typography>
        </div>
        <Typography className={classes.dateText}>
          {appt_details_date_time_lable}
        </Typography>
        <Divider />
        <div>
          <Typography className={classes.doctorHeading}>
            {appt_details_doctor_maintitle}
          </Typography>
        </div>
        <div>
          <img
            src="/PritiChopra.png"
            style={{
              width: "70px",
              borderRadius: "70px",
              alignItems: "center",
              float: "left",
              marginRight: "10px",
            }}
          />
          <div
            style={{
              float: "left",
              textAlign: "left",
              position: "relative",
              width: "250px",
            }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "10px" }}>
                <Typography className={classes.doctorName}>
                  {appt_details_doctor_name}
                </Typography>
                <Typography className={classes.doctorSpec}>
                  {appt_details_doctor_spec}
                </Typography>
                <Typography className={classes.add}>
                  {appt_details_doctor_add}
                </Typography>
              </div>
            </div>
          </div>
          <div
            style={{
              float: "left",
              textAlign: "left",
              position: "relative",
              width: "300px",
            }}
          >
            <div style={{ marginLeft: "50px" }}>
              <Typography className={classes.appointmentDetail}>
                {appt_details_patient_details}
              </Typography>
              <Typography className={classes.appointmentDetail2}>
                {appt_details_patient_Name}
              </Typography>
              <Typography className={classes.relation}>
                {appt_details_patient_relation}
              </Typography>
              <Typography className={classes.id}>
                {appt_details_apptid}
              </Typography>
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
}

export default AppointmentDetails;
