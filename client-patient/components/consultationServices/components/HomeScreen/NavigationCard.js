import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Grid,
  CardActions,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { styleobj } from "../HomeScreen/HomeScreenStyle";
import router from "next/router";
import CMS from "../../cms";

const useStyles = makeStyles((theme) => styleobj);

export default function NavigationCard() {
  const classes = useStyles();
  const doctorHandler = () => {
    localStorage.setItem("showFamList",false)
    router.push("/doctorresult");
  };
  const bookAppointmentHandler = () => {
    router.push("/familyList");
  };
  const reportHandler = () => {
    router.push("/view-report");
  };
  const consult247Handler = () => {
    router.push("/consult247");
  };
  const {
    homescreen_navi_card1,
    homescreen_navi_card2,
    homescreen_navi_card3,
    homescreen_navi_card4,
  } = CMS;
  return (
    <>
      <Grid item sm={2} style={{ marginRight: "30px" }}>
        <Card className={classes.Card} onClick={doctorHandler}>
          <CardContent>
            <IconButton
              style={{
                color: "#9E2D6B",
                width: "40px",
                height: "40px",
              }}
            >
              <img src="/findDoctor.png" className={classes.icon} />
            </IconButton>
            <Typography className={classes.typotext}>
              {homescreen_navi_card1}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              style={{
                marginLeft: "152px",
                marginTop: "-67px",
                color: "#502E92",
                fontWeight: "bold",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item sm={2} style={{ textAlign: "left", marginRight: "30px" }}>
        <Card className={classes.Card} onClick={bookAppointmentHandler}>
          <CardContent>
            <IconButton
              style={{
                color: "#9E2D6B",
                width: "40px",
                height: "40px",
              }}
            >
              <img src="/bookAppointment.png" className={classes.icon} />
            </IconButton>
            <Typography className={classes.typotext2}>
              {homescreen_navi_card2}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              style={{
                marginLeft: "152px",
                marginTop: "-67px",
                color: "#502E92",
                fontWeight: "bold",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item sm={2} style={{ textAlign: "left", marginRight: "30px" }}>
        <Card className={classes.Card} onClick={consult247Handler}>
          <CardContent>
            <IconButton
              style={{
                color: "#9E2D6B",
                width: "40px",
                height: "40px",
              }}
            >
              <img src="/clock.png" className={classes.icon} />
            </IconButton>
            <Typography className={classes.typotext}>
              {homescreen_navi_card3}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              style={{
                marginLeft: "152px",
                marginTop: "-67px",
                color: "#502E92",
                fontWeight: "bold",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Grid item sm={2} style={{ textAlign: "left", marginRight: "30px" }}>
        <Card className={classes.Card} onClick={reportHandler}>
          <CardContent>
            <IconButton
              style={{
                color: "#9E2D6B",
                width: "40px",
                height: "40px",
              }}
            >
              <img src="/textRepot.png" className={classes.icon} />
            </IconButton>
            <Typography className={classes.typotext}>
              {homescreen_navi_card4}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              style={{
                marginLeft: "152px",
                marginTop: "-67px",
                color: "#502E92",
                fontWeight: "bold",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
