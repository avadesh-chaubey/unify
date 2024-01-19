import React, { useState, useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import { Typography, MenuItem, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  homeBtn: {
    backgroundColor: "#fff",
    color: "#6E6E6E",
    width: "50%",
    minWidth: "50%",
    textTransform: "capitalize",
  },
  homeBtnActive: {
    backgroundColor: "#fff",
    color: "#00B5AF",
    width: "50%",
    minWidth: "50%",
    textTransform: "capitalize",
    "& Span": {
      fontSize: "14px",
    },
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  menuDiv: {
    "&::before": {
      content: " ",
      position: "absolute",
      /* bottom: 100%; At the top of the tooltip */
      left: "50%",
      marginLeft: "-5px",
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: "transparent transparent black transparent",
      backgroundColor: "red",
    },
  },
  notificationMenuItemActive: {
    backgroundColor: "#b9dff0",
  },
  notificationMenuItem: {},
}));

const notificationList = [
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "45m",
  },
];
export default function Notification() {
  const classes = useStyles();
  const [notification, setNotification] = useState(null);
  const [selectedNoti, setSelectedNoti] = useState(0);
  const router = useRouter();

  const handleSelect = (i) => {
    setSelectedNoti(i);
    console.log("====>selected", selectedNoti);
  };

  const handleNotification = (event) => {
    setNotification(event.currentTarget);
  };
  const handleClose = () => {
    setNotification(null);
  };
  const allNotifications = () => {
    router.push("/notification");
  };
  const StyledMenu = withStyles({
    paper: {
      // border: "1px solid red",
      filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, .5))",
      overflow: "visible",
      top: "80px !important",
      "&:before": {
        content: "''",
        position: "absolute",
        /* bottom: 100%; At the top of the tooltip */
        left: "90%",
        marginLeft: "-25px",
        borderWidth: "25px",
        borderStyle: "solid",
        borderColor: "transparent transparent white transparent",
        // backgroundColor: "red",
        top: "-47px",
      },

      "&.MuiMenu-paper": {
        backgroundColor: "",
      },
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ));
  return (
    <>
      <div className="notificationDiv">
        <Tooltip title=" • No Notifications">
          <IconButton color="inherit" onClick={handleNotification}>
            <img
              src="/Notification_Icon.svg"
              style={{ width: "40px", height: "40px" }}
            />
          </IconButton>
        </Tooltip>
        {/* <Button
          variant="contained"
          disableElevation
          aria-haspopup="true"
          onClick={handleNotification}
          // className={
          //   selectedBtn == "home" ? classes.homeBtnActive : classes.homeBtn
          // }
        >
          {/* {home[selectedIndex] || "Home"} */}
        {/* </Button> */}
        <div>
          <StyledMenu
            anchorEl={notification}
            open={notification}
            onClose={handleClose}
            getContentAnchorEl={null}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {notificationList.map((item, i) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MenuItem
                  className={
                    selectedNoti == i
                      ? classes.notificationMenuItemActive
                      : classes.notificationMenuItem
                  }
                  // onClick={() => handleSelect(i)}
                  onClick={() => handleSelect(i)}
                >
                  <div
                    style={{
                      // display: "flex",

                      width: "270px",
                      // overflow: "hidden",
                      // display: "-webkit-box",
                      // "-webkit-line-clamp": "2!important",
                      // "-webkit-box-orient": "vertical",
                      whiteSpace: "break-spaces",
                      fontSize: "12px",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      width: "90px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    {item.time}
                  </div>
                </MenuItem>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <Typography
                style={{
                  color: "#3dd4c5",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                onClick={allNotifications}
              >
                View all notifications
              </Typography>
            </div>
          </StyledMenu>
        </div>
      </div>
    </>
  );
}
