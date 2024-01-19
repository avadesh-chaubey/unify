import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  MenuItem,
  Grow,
  Button,
  Grid,
  Popper,
  IconButton,
  Badge,
  Link,
  makeStyles,
  Typography,
  Paper,
  MenuList,
  ClickAwayListener,
} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SettingsIcon from "@material-ui/icons/Settings";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import Mycalendar from "../dashboard/Mycalendar";
import { CSVLink } from "react-csv";
import axios from "axios";
import config from "../../app.constant";
import Router from "next/router";
import { createImageFromInitials } from "../../utils/nameDP";
import { ListAltTwoTone } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  "& .MuiSvgIcon-root": {
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(4),
  },
  selectWrapper: {
    borderRadius: "36px",
    display: "inline-flex",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #cccccc",
    paddingLeft: "20px",
    paddingRight: "10px",
    fontSize: "12px",
    fontFamily: "Bahnschrift SemiBold",
    marginRight: "10px",
  },
  selectBox: {
    width: "190px",
    height: "45px",
    border: "0px",
    outline: "none",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "14px",
    "& span": {
      backgroundColor: "red",
    },
  },
  IconButton: {
    padding: "3px",
    paddingRight: "10px",
    overflow: "hidden",
    textAlign: "center",
  },
  Avatar: {
    padding: "3px",
    overflow: "hidden",
    textAlign: "center",
    border: "1px ",
  },
  userName: {
    fontSize: "15px",
    fontWeight: "bold",
    margin: "10px",
    marginTop: "15px",
    color: "#535353",
  },
  signOutBtn: {
    color: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
    width: "40%",
    margin: "6px 2px",
    borderRadius: "10px",
    backgroundColor: "#452D7B",
    border: "solid 1px #452D7B",
    padding: "6px 6px",
    textTransform: "unset",
  },
  userEmail: {
    fontSize: "12px",
    margin: "10px",
    color: "#898989",
  },
}));

function useOutsideAlerter(ref, setShowSignout) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSignout("hide");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function Header(props) {
  const { title, rows, columns } = props;

  const header =
    columns &&
    columns.map((item) => ({ label: item.headerName, key: item.field }));
  // const Header = [
  //   {label: "SNO", key: 'id'},
  //   {label: "Title", key: 'title'},
  //   {label: "Publisher", key: 'publisher'},
  //   {label: "Published Date & Time", key: 'publishedData'},
  //   {label: "Sorting", key: 'sorting'},
  //   {label: "Status", key: 'status'}
  // ];
  // console.log("==========>Rows", rows)

  const classes = useStyles();
  const [userDetails, setUserDetails] = useState({});
  const [showSignout, setShowSignout] = useState("hide");
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [download, setDownload] = useState(null);

  console.log("=====>userDetails", userDetails);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const signout = async () => {
    setShowSignout("hide");
    await axios
      .post(config.API_URL + "/api/users/signout")
      .then(() => {
        // Clear local storage
        localStorage.clear();
        Router.push("/");
      })
      .catch((error) => {
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  function signOutBtn() {
    setShowSignout("");
    if (showSignout === "") {
      setShowSignout("hide");
    }
  }

  const fetcUserData = () => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/employeeselfinfo", { headers })
      .then((response) => {
        console.log("=======>employeeselfinfo", response.data);
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

  const userProfileImg = (e) => {
    e.preventDefault();
    let newVal = e.target.value.replace(/^.*[\\\/]/, "");
    let file = document.getElementById("UserprofilePic").files[0];
    let timestamp = new Date().getTime();
    let fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    let filename = "";
    filename = "empProfile/" + timestamp + "_" + fileRe;
    uploadProfileImages();
  };
  const uploadProfileImages = () => {
    let imageUrl = null;
    var model = {
      file: document.getElementById("UserprofilePic").files[0],
    };
    var configs = {
      headers: { authtoken: JSON.parse(localStorage.getItem("token")) },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
    };
    setLoader(true);
    axios
      .post(config.API_URL + "/api/utility/upload", model, configs)
      .then((response) => {
        console.log(response.data);
        imageUrl = response.data.fileName;
        saveProfileImage(imageUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  const saveProfileImage = (imageUrl) => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    console.log("imageUrl: ", imageUrl);
    axios
      .put(
        config.API_URL + "/api/partner/image",
        { profileImageName: imageUrl },
        { headers }
      )
      .then((response) => {
        console.log(response);
        setShowSignout("hide");
        fetcUserData();
        // setLoader(false)
      })
      .catch((error) => {
        console.log(error);
        setShowSignout("hide");
        // setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  const [openDownloadOption, setOpenDownloadOption] = useState(false);
  const downloadAchorRef = useRef(null);

  const handleDownloadOption = (e) => {
    e.preventDefault();
    setOpenDownloadOption(!openDownloadOption);
  };

  const handleCloseOption = (e) => {
    if (
      downloadAchorRef.current &&
      downloadAchorRef.current.contains(e.target)
    ) {
      return;
    }

    setOpenDownloadOption(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenDownloadOption(false);
    }
  };
  const prevOpen = useRef(openDownloadOption);

  useEffect(() => {
    if (prevOpen.current === true && openDownloadOption === false) {
      downloadAchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [openDownloadOption]);
  return (
    <AppBar position="sticky" className={classes.root}>
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h5"
              style={{
                fontFamily: "Bahnschrift",
                color: "#000000",
                fontWeight: "900",
              }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item style={{ paddingRight: "15px" }}>
            <Link
              ref={downloadAchorRef}
              href="#"
              onClick={handleDownloadOption}
            >
              <Badge>
                <img
                  src="/download_file_icon.svg"
                  className="righticon settings-icon"
                  style={{ height: 25, marginRight: "5px" }}
                />
              </Badge>
            </Link>

            <Popper
              open={openDownloadOption}
              anchorEl={downloadAchorRef.current}
              role={undefined}
              transition
              disablePortal
              className="print-option-popper"
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: "center bottom" }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCloseOption}>
                      <MenuList
                        id="menu-list"
                        style={{ fontSize: "12px", marginTop: "10px" }}
                        autoFocusItem={openDownloadOption}
                        onKeyDown={handleKeyDown}
                      >
                        <MenuItem
                          style={{ zIndex: 100000, fontSize: "12px" }}
                          onClick={handleCloseOption}
                        >
                          CSV
                        </MenuItem>
                        <MenuItem
                          style={{ zIndex: 100000, fontSize: "12px" }}
                          onClick={handleCloseOption}
                        >
                          PDF
                        </MenuItem>
                        <MenuItem
                          style={{ zIndex: 100000, fontSize: "12px" }}
                          onClick={handleCloseOption}
                        >
                          Summary
                        </MenuItem>
                        <MenuItem
                          style={{ zIndex: 100000, fontSize: "12px" }}
                          onClick={handleCloseOption}
                        >
                          Preview
                        </MenuItem>
                        <MenuItem
                          style={{ zIndex: 100000, fontSize: "12px" }}
                          onClick={handleCloseOption}
                        >
                          Print
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {/* <IconButton className={classes.IconButton}>
              <Badge color="primary" style={{ width: "25px", height: "25px" }}>
                <img src="/Setting icon.svg" />
              </Badge>
            </IconButton> */}
            {userDetails && userDetails.data && (
              <>
                <IconButton className={classes.Avatar} onClick={signOutBtn}>
                  <Avatar
                    src={
                      userDetails.data.profileImageName &&
                      userDetails.data.profileImageName != "NA"
                        ? `${config.API_URL}/api/utility/download/${userDetails.data.profileImageName}`
                        : userDetails.data.userFirstName != undefined
                        ? createImageFromInitials(
                            100,
                            `${userDetails.data.userFirstName} ${userDetails.data.userLastName}`,
                            "#00888a"
                          )
                        : "/user.svg"
                    }
                    className="righticon profile-icon"
                    style={{ width: "30px", height: "30px" }}
                  />
                </IconButton>

                <div
                  className={
                    "signOutDiag dashboard-signout-dialog " + showSignout
                  }
                >
                  <div style={{ margin: "10px" }}>
                    <img
                      src={
                        userDetails.data.profileImageName &&
                        userDetails.data.profileImageName != "NA"
                          ? `${config.API_URL}/api/utility/download/${userDetails.data.profileImageName}`
                          : userDetails.data.userFirstName != undefined
                          ? createImageFromInitials(
                              100,
                              `${userDetails.data.userFirstName} ${userDetails.data.userLastName}`,
                              "#00888a"
                            )
                          : "/user.svg"
                      }
                    />
                    <span>
                      <input
                        type="file"
                        id="UserprofilePic"
                        onChange={userProfileImg}
                      />
                    </span>
                  </div>
                  <div
                    className={classes.userName}
                    style={{ textTransform: "capitalize" }}
                  >
                    {userDetails.data.userFirstName +
                      " " +
                      userDetails.data.userLastName}
                  </div>
                  <div className={classes.userEmail}>
                    {userDetails.data.emailId}
                  </div>
                  <Button
                    id="logout-admin"
                    onClick={signout}
                    className={classes.signOutBtn}
                  >
                    Sign Out
                  </Button>

                  <div className="signOutDiagBottomLink">
                    <span style={{ fontSize: 10, color: "#000" }}>
                      <Link
                        color="textPrimary"
                        underline="none"
                        href="https://www.rainbowhospitals.in/other/terms-conditions"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                    <span
                      style={{ fontSize: 10, color: "#000", paddingLeft: 4 }}
                    >
                      <Link
                        color="textPrimary"
                        underline="none"
                        href="https://www.rainbowhospitals.in/other/terms-conditions"
                      >
                        . Terms &amp; Service
                      </Link>
                    </span>
                  </div>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
