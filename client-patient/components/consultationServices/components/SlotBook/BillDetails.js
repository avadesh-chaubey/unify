import React from "react";
import { Typography, Grid, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { doctorStyle } from "./DoctorDetailStyle";

const useStyles = makeStyles((theme) => doctorStyle);

export default function BillDetails() {
  const classes = useStyles();
  return (
    <Grid item xs={11} style={{ marginTop: "20px" }}>
      <div className={classes.billMainDiv}>
        <Typography className={classes.billMinHeading}>Bill Details</Typography>
        <div className={classes.billText1}>Consultation Fee</div>
        <div className={classes.billText2}>Rs.450</div>
        <div className={classes.billText3}>GST</div>
        <div className={classes.billText4}>Rs.50</div>
        <Divider style={{ width: "270px" }} />
        <div className={classes.totalBillText}>Total Payable</div>
        <div className={classes.totalbillRs}>Rs.500</div>
        <br />
      </div>
    </Grid>
  );
}
