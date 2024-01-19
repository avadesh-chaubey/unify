import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  MenuItem,
  FormControl,
  Select,
  Grid,
  CardContent,
  Card,
  Button,
  Badge,
  makeStyles,
  Typography,
} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SettingsIcon from "@material-ui/icons/Settings";
import Avatar from "@material-ui/core/Avatar";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DateRangeIcon from "@material-ui/icons/DateRange";
import axios from "axios";
import config from "../../app.constant";
import Mycalendar from "./Mycalendar";
import { createImageFromInitials } from "../../utils/nameDP";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  Card: {
    borderRadius: "15px",
    border: "none",
    fontFamily: "Bahnschrift SemiBold",
    paddingLeft: "15px",
    boxShadow: "none",
    height: "80px",
    marginRight: "20px",
  },
  button: {
    border: "1px ",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#452D7B",
    opacity: "1",
    border: "1px solid #DBDBDB",
    marginLeft: "10px",
    padding: "21px",
    height: "10px",
    color: "#fff",
    fontFamily: "Bahnschrift SemiBold",
    fontWeight: "bold",
    fontSize: "14px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  svgIcon: {
    width: "20px",
    height: "20px",
    color: "#646D82E5",
    //paddingTop:'5px',
    marginTop: "5px",
  },
  cardText2: {
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "18px",
    color: "#161616",
  },
  cardText: {
    fontFamily: "Bahnschrift SemiBold",
    paddingLeft: "40px",
    marginTop: "-25px",
    color: "#646D82",
    fontSize: "15px",
  },
  Avatar: {
    width: "40px",
    height: "40px",
  },
  profileText: {
    fontSize: "18px",
    fontFamily: "Bahnschrift SemiBold",
    color: "#646D82",
  },
  profileText2: {
    fontSize: "12px",
    fontFamily: "Bahnschrift SemiBold",
    color: "#A6B1C2",
  },
}));

export default function Header(props) {
  const { title } = props;

  const classes = useStyles();
  const [appointmentData, setAppointmentData] = useState();
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const getTime = (slotId) => {
    let hours = Math.floor(slotId / 4);
    let min = (slotId % 4) * 15;
    return getTime2(hours, min);
  };
  const getTime2 = (hh, mm) => {
    let z = hh < 12 ? "AM" : "PM";
    let h = hh > 12 ? hh - 12 : hh;
    let hours = h < 10 ? "0" + h : h;
    let min = mm == 0 ? "00" : mm;
    return hours + ":" + min + " " + z;
}
  const fetcUserData = () => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/employeeselfinfo", { headers })
      .then((response) => {
        // console.log(response.data);
        setUserDetails(response.data);
        setLoader(false);
      })
      .catch((error) => {
        if (
          error.response.hasOwnProperty("data") &&
          error.response.data.errors[0].message === "Not authorized"
        ) {
          Router.push("/login");
        } else {
          setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
          setLoader(false);
        }
      });
  };
  useEffect(() => {
    fetcUserData();
  }, []);

  const getAppointmentData = () => {
    if (!appointmentData) return;

    return (
      <>
        <Typography
          style={{
            fontFamily: "Bahnschrift SemiBold",
            fontSize: "20px",
            paddingLeft: "10px",
            paddingBottom: "5px",
          }}
        >
          {" "}
          Appointments ({appointmentData.details.length}) {appointmentData.date}
        </Typography>
        {appointmentData.details.map((item) => {
          const startDate = getTime(item.slotId);
          const endSlotId = Number(item.slotId + 1);
          const endTime2 = getTime(endSlotId);
          console.log("==========>time2", startDate, endTime2);
          console.log("============>slotId", item.slotId);

          return (
            <>
              <Card className={classes.Card}>
                <CardContent>
                  <div>
                    <Typography className={classes.cardText2}>
                      {item.patientName}
                    </Typography>
                    <img
                      src="Icon feather-clock.svg"
                      className={classes.svgIcon}
                    />
                    <Typography className={classes.cardText}>
                      {startDate}-{endTime2}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
              <br />
            </>
          );
        })}
      </>
    );
  };
  return (
    <div>
      <Grid container>
        <Grid
          item
          sm={8}
          style={{
            paddingTop: "15px",
            paddingLeft: "15px",
            paddingRight: "10px",
          }}
        >
          <Grid
            container
            style={{
              backgroundColor: "#F5FDFF",
              paddingLeft: "10px",
              paddingTop: "10px",
            }}
          >
            <Avatar
              src={
                userDetails.profileImageName &&
                userDetails.profileImageName != "NA"
                  ? `${config.API_URL}/api/utility/download/` +
                    userDetails.profileImageName
                  : userDetails.userFirstName != undefined
                  ? createImageFromInitials(
                      100,
                      `${
                        userDetails.userFirstName +
                        " " +
                        userDetails.userLastName
                      }`,
                      "#00888a"
                    )
                  : "/user.svg"
              }
              className={classes.Avatar}
            />
            <div
              style={{
                textAlign: "left",
                paddingLeft: "10px",
                paddingBottom: "5px",
              }}
            >
              <Typography className={classes.profileText}>
                {" "}
                Dr {userDetails && userDetails.userFirstName}{" "}
                {userDetails && userDetails.userLastName}{" "}
              </Typography>
              <Typography className={classes.profileText2}>
                {userDetails && userDetails.designation}
              </Typography>
            </div>
          </Grid>
          <br />
          <Grid container style={{ backgroundColor: "#fff" }}>
            <CardContent>
              <Mycalendar
                appointmentData={appointmentData}
                setAppointmentData={setAppointmentData}
              />
            </CardContent>
          </Grid>
        </Grid>
        <Grid
          item
          sm={4}
          style={{
            backgroundColor: "#F5FDFF",
            paddingRight: "10px",
            paddingTop: "25px",
            paddingLeft: "10px",
          }}
        >
          {appointmentData && getAppointmentData()}
          <br />
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<DateRangeIcon />}
          >
            Mark Leave
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
