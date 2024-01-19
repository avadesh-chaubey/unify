import React, { useState, useEffect } from "react";
import router from "next/router";
import {
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Menu from "@material-ui/core/Menu";
import LogoutPage from "./components/LogoutMenuPages/LogoutPage";
import Notification from "./components/LogoutMenuPages/Notification";

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
}));

const home = [
  "Find a Doctor",
  "Book Appointment",
  "24/7 Consultation",
  "View Reports",
];
const url2 = ["/upcomingapt", "pastapt"];
const url = [
  "/doctorresult",
  "/bookAppointment",
  "/consult247",
  "/view-report",
];
const consults = ["Upcoming Appointments", "Past Appointment"];
const orders = ["Pharmacy Orders", "Diagnostic Orders"];
export default function Header() {
  const classes = useStyles();
  const [homeMenu, setHomeMenu] = useState(null);
  const [consultsMenu, setConsultsMenu] = useState(null);
  const [ordersMenu, setOrdersMenu] = useState(null);
  const [selectedIndex, setselectedIndex] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState("home");
  const [selectedBtnConsults, setSelectedBtnConsults] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  const handleHomeMenue = (event) => {
    setHomeMenu(event.currentTarget);
    // setSelectedBtn();
  };

  const handleConsultsMenu = (event) => {
    setConsultsMenu(event.currentTarget);
    // setSelectedBtnConsults();
  };
  const handleOrderMenu = (event) => {
    setOrdersMenu(event.currentTarget);
    // setSelectedBtnConsults();
  };

  const handleClose = () => {
    setHomeMenu(null);
    setConsultsMenu(null);
    setOrdersMenu(null);
  };

  const handleSelect = (i) => {
    router.push(url[i]);
  };
  const handleSelecturl = (i) => {
    router.push(url2[i]);
  };
  const handleSelectConsults = (i) => {
    console.log("handleSelectConsults: ", i);
  };
  useEffect(() => {
    console.log("router asPath: ", router.asPath);
    if (router.asPath == "/patientProfile") {
      setShowMenu(false);
    }
    if (
      router.asPath == "/tempLinks/caseSheet" ||
      router.asPath == "/tempLinks/feedbackForm" ||
      router.asPath == "/tempLinks/waitingScreen" ||
      router.asPath == "/upcomingapt" ||
      router.asPath == "/pastapt" ||
      router.asPath == "/cancelApmt" ||
      router.asPath == "/videoCall"
    ) {
      setSelectedBtn("consults");
    }
  }, []);
  const imgClick = () => {
    router.push("/home");
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
        left: "28%",
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
      <AppBar position="sticky" className="main-nav">
        <Toolbar disableGutters>
          <div className="logo">
            <img
              src="/home_page_logo.png"
              style={{
                width: "150px",
                height: "50px",
                marginRight: "40px",
                cursor: "pointer",
              }}
              onClick={imgClick}
            />
          </div>
          {showMenu && (
            <>
              <Button
                variant="contained"
                disableElevation
                aria-haspopup="true"
                onClick={handleHomeMenue}
                className={
                  selectedBtn == "home"
                    ? classes.homeBtnActive
                    : classes.homeBtn
                }
              >
                {home[selectedIndex] || "Home"}
                <ExpandMore
                  style={
                    homeMenu
                      ? { transform: "rotate(180deg)" }
                      : { transform: "rotate(0deg)" }
                  }
                />
              </Button>
              <div>
                <StyledMenu
                  anchorEl={homeMenu}
                  open={homeMenu}
                  onClose={handleClose}
                  getContentAnchorEl={null}
                  // onClick={handleExpendable}
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                >
                  {home.map((item, i) => (
                    <div>
                      <MenuItem onClick={() => handleSelect(i)} disableRipple>
                        {item}
                      </MenuItem>
                      <Divider />
                    </div>
                  ))}
                </StyledMenu>
              </div>

              <Button
                variant="contained"
                disableElevation
                aria-haspopup="true"
                onClick={handleConsultsMenu}
                className={
                  selectedBtn == "consults"
                    ? classes.homeBtnActive
                    : classes.homeBtn
                }
              >
                {consults[selectedIndex] || "Consults"}
                <ExpandMore
                  style={
                    consultsMenu
                      ? { transform: "rotate(180deg)" }
                      : { transform: "rotate(0deg)" }
                  }
                />
              </Button>
              <Menu
                anchorEl={consultsMenu}
                open={consultsMenu}
                onClose={handleClose}
                getContentAnchorEl={null}
                // onClick={handleExpendable}
                transformOrigin={{
                  horiConsultszontal: "left",
                  vertical: "top",
                }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                {consults.map((item, i) => (
                  <div>
                    <MenuItem onClick={() => handleSelecturl(i)} disableRipple>
                      {item}
                    </MenuItem>
                    <Divider />
                  </div>
                ))}
              </Menu>
              <Button
                variant="contained"
                disableElevation
                aria-haspopup="true"
                onClick={handleOrderMenu}
                className={
                  selectedBtnConsults == orders
                    ? classes.homeBtnActive
                    : classes.homeBtn
                }
              >
                {orders[selectedIndex] || "Orders"}
                <ExpandMore
                  style={
                    ordersMenu
                      ? { transform: "rotate(180deg)" }
                      : { transform: "rotate(0deg)" }
                  }
                />
              </Button>
              <Menu
                anchorEl={ordersMenu}
                open={ordersMenu}
                onClose={handleClose}
                getContentAnchorEl={null}
                // onClick={handleExpendable}
                transformOrigin={{
                  horiConsultszontal: "left",
                  vertical: "top",
                }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                {orders.map((item, i) => (
                  <div>
                    <MenuItem
                      onClick={() => handleSelectConsults(i)}
                      disableRipple
                    >
                      {item}
                    </MenuItem>
                    <Divider />
                  </div>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
        <Notification />
        <LogoutPage />
      </AppBar>
    </>
  );
}
