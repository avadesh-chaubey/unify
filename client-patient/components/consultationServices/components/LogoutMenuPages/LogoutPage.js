import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import router from "next/router";
import { styleobj } from "./LogoutMenuPagesStyle";
import { useCookies } from "react-cookie";
import config from "../../../../app.constant";
import axios from "axios";

const login = [
  {
    title: "Profile",
    icon: "profile_icon.svg",
  },
  {
    title: "Contact Support",
    icon: "contact_icon.svg",
  },
  {
    title: "Settings",
    icon: "setting_icon.svg",
  },
  {
    title: "Privacy Policy",
    icon: "privacy_icon.svg",
  },
  {
    title: "Terms & Conditions",
    icon: "termco-icon.svg",
  },
  {
    title: "Logout",
    icon: "logout_icon.svg",
  },
];
const url = [
  "/patientProfile",
  "/contact-support",
  "/home",
  "/privacy-policy",
  "/home",
  "/",
];
export default function LogoutPage() {
  const [loginMenu, setLoginMenu] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['cookieVal']);

  const handleLoginMenue = (event) => {
    setLoginMenu(event.currentTarget);
  };
  const handleCloseLoginMenu = () => {
    setLoginMenu(null);
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
        left: "80%",
        marginLeft: "-21px",
        borderWidth: "21px",
        borderStyle: "solid",
        borderColor: "transparent transparent white transparent",
        top: "-42px",
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
  const handleSelect = (item,i) => {
    if(item.title == "Logout"){
      signout();
      // console.log("item",item);
      // removeCookie('cookieVal', { path: '/' });
      // localStorage.clear();
      // localStorage.removeItem("userDetails");
      return false;
    }
    router.push(url[i]);
    console.log("====>i", i);
  };

  const signout = async () => {
    await axios
      .post(config.API_URL + "/api/users/signout")
      .then((res) => {
        console.log("res: ",res)
        removeCookie('cookieVal', { path: '/' });
        localStorage.clear();
        router.push("/")
      })
      .catch((error) => {
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        // setMsgData({
        //   message: error.response.data.errors[0].message,
        //   type: "error",
        // });
      });
  };
  return (
    <>
      <div className="avatarDiv">
        <IconButton color="inherit" sx={{ p: 0.5 }} onClick={handleLoginMenue}>
          <Avatar src="Avatar_Login.png" alt="My Avatar" />
        </IconButton>
      </div>
      <div>
        <StyledMenu
          anchorEl={loginMenu}
          open={loginMenu}
          onClose={handleCloseLoginMenu}
          getContentAnchorEl={null}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {login.map((item, i) => (
            <div>
              <MenuItem onClick={() => handleSelect(item,i)}>
                <Avatar
                  src={item.icon}
                  style={{ width: "25px", height: "25px", marginRight: "20px" }}
                />
                {item.title}
              </MenuItem>
            </div>
          ))}
        </StyledMenu>
      </div>
    </>
  );
}
