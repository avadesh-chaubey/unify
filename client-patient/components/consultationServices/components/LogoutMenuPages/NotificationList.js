import React, { useState } from "react";
import CMS from "../../cms";
// import { Grid } from "@material-ui/core/Grid";
import {
  makeStyles,
  Typography,
  Grid,
  IconButton,
  Popover,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  maindiv: { display: "-webkit-inline-box", cursor: "pointer" },
  maindivActive: {
    display: "-webkit-inline-box",
    cursor: "pointer",
    backgroundColor: "#b9dff0",
  },
  typoTitle: {
    marginRight: "250px",
    fontSize: "15px",
    marginTop: "20px",
    marginLeft: "10px",
  },
  typoTime: { fontSize: "15px", textAlign: "center" },
  typography: {
    padding: theme.spacing(1),
    fontSize: "13px",
  },
  // button: {
  //   "&.MuiPopover-paper": {
  //     // outline: "0",
  //     // position: "absolute",
  //     // maxWidth: "calc(100% - 32px)",
  //     // minWidth: "16px",
  //     // maxHeight: "calc(100% - 32px)",
  //     // minHeight: "16px",
  //     // overflowX: "hidden",
  //     // overflowY: "auto",
  //     // boxShadow: "none",
  //     backgroundColor: "red",
  //   },
  // },
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
    time: "1h",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "1d",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "1d",
  },
  {
    title:
      "Your appointment is fixed with Dr. Priti Chopra on 26 March 2022 at 9:00 AM",
    time: "1h",
  },
];
export default function NotificationList() {
  const classes = useStyles();
  const { notification_title, notification_time } = CMS;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNoti, setSelectedNoti] = useState(0);
  const handleNoti = (i) => {
    setSelectedNoti(i);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Grid container spacing={1} justifyContent="center">
        {notificationList.map((item, i) => {
          return (
            <Grid
              item
              xs={11}
              onClick={() => handleNoti(i)}
              className={
                selectedNoti == i ? classes.maindivActive : classes.maindiv
              }
            >
              <Typography className={classes.typoTitle}>
                {item.title}
              </Typography>
              <div style={{ marginLeft: "250px", justifyContent: "center" }}>
                <Typography className={classes.typoTime}>
                  {item.time}
                </Typography>
                {/* {
                    <IconButton aria-label="settings" aria-haspopup="true">
                      <MoreVertIcon />
                    </IconButton>
                  } */}
                <div>
                  <IconButton
                    aria-describedby={id}
                    // variant="contained"
                    // color="primary"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    // className={classes.button}
                  >
                    <Typography className={classes.typography}>
                      Delete
                    </Typography>
                  </Popover>
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
