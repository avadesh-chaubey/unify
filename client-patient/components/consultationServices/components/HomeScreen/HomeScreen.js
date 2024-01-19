import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Information from "./Information";
import NavigationCard from "./NavigationCard";
import UpcomingApptCard from "./UpcomingApptCard";
import { styleobj } from "./HomeScreenStyle";
import { useRouter } from "next/router";
import CMS from "../../cms";

const useStyles = makeStyles((theme) => styleobj);

export default function HomeScreen(props) {
  const classes = useStyles();
  const router = useRouter();
  const { homescreen_appt_title1, homescreen_appt_title2 } = CMS;
  const onAllAppointments = () => {
    router.push("/upcomingapt");
  };

  return (
    <>
      <Information />
      <Grid container style={{ marginTop: "30px", justifyContent: "center" }}>
        <NavigationCard />
      </Grid>
      <Grid container style={{ marginTop: "30px", justifyContent: "center" }}>
        <Grid
          item
          xs={11}
          style={{ display: "inline-flex", justifyContent: "space-around" }}
        >
          <Typography className={classes.appointmentHeading}>
            {homescreen_appt_title1}
          </Typography>
          <Typography
            className={classes.appointmentHeading2}
            onClick={onAllAppointments}
          >
            {homescreen_appt_title2}
          </Typography>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "30px", justifyContent: "center" }}>
        <UpcomingApptCard />
      </Grid>
      <br />
      <br />
    </>
  );
}
