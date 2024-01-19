import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../app.constant";
import Router from "next/router";
import { useCookies } from "react-cookie";
import { useAlert, types } from "react-alert";
import MessagePrompt from "../messagePrompt";
import { createImageFromInitials } from "../../utils/nameDP";
import {
  Link,
  Button,
  IconButton,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Popper,
  Grow,
  Paper,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CmsDownload from "../blog/CmsDownload";

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

function Header(props) {
  // console.log("props: ",props)
  // let userDetails = props.userDetails;
  const alert = useAlert();
  const [showSignout, setShowSignout] = useState("hide");
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [msgData, setMsgData] = useState({});
  const wrapperRef = useRef(null);

  useOutsideAlerter(wrapperRef, setShowSignout);

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
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/employeeselfinfo", { headers })
      .then((response) => {
        // console.log(response.data.data);
        setUserDetails(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        if (
          !error.response &&
          error.response.data[0].message === "Not authorized"
        ) {
          Router.push("/login");
        } else {
          setMsgData({
            message: !error.response
              ? error.response.data[0].message
              : "Error Occurred. Please try again later",
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
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    var configs = {
      headers: { authtoken: cookie },
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
        imageUrl = response.data.data.fileName;
        saveProfileImage(imageUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        setMsgData({
          message: error.response.data[0].message,
          type: "error",
        });
      });
  };
  const saveProfileImage = (imageUrl) => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
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

  return (
    <>
      {/* <p>this is header{props.name}</p> */}
      {/* <div className="heading">{props.name}</div> */}
      <MessagePrompt msgData={msgData} />
      <div className="header-area">
        <div className="heading headers-pos">
          {/* Commented out the back button link of dashboard as per the design */}
          {/* {
            props.name === "Settings" && (
              <IconButton className="back-btn-icon" href='/admin/dashboard'>
                <ArrowBackIosIcon className="back-icon-alignment" />
              </IconButton>
            )
          } */}
          {props.name === "Blog Management" && (
            <IconButton
              className="back-btn-icon"
              href="/cms/contentManagementList"
            >
              <ArrowBackIosIcon className="back-icon-alignment" />
            </IconButton>
          )}
          {props.name}
        </div>
        <div className="headright" ref={wrapperRef}>
          {!!(
            props.name === "Content Management List" ||
            props.name === "Banner Management List" ||
            props.name === "Notification Management List"
          ) && (
            <CmsDownload
              name={props.name}
              setMsgData={setMsgData}
              blogRow={props.blogRow}
              allblog={props.allblog}
              filterData={props.filterData}
              startSearch={props.startSearch}
              startDateFilter={props.startDateFilter}
            />
          )}

          {/* <Link href="/setting" style={{ textDecoration: "none" }}>
            <img src="/settings.svg" className="righticon settings-icon" />
          </Link> */}
          {/* <img src="notifications.svg" className="righticon" style={{cursor:'not-allowed'}} /> */}
          <img
            src={
              userDetails.profileImageName &&
              userDetails.profileImageName != "NA"
                ? `${config.API_URL}/api/utility/download/` +
                  userDetails.profileImageName
                : // : "user.svg"
                userDetails.userFirstName != undefined
                ? createImageFromInitials(
                    100,
                    `${
                      userDetails.userFirstName + " " + userDetails.userLastName
                    }`,
                    "#00888a"
                  )
                : "/user.svg"
            }
            className="righticon profile-icon"
            style={{ borderRadius: "50%" }}
            onClick={signOutBtn}
          />
          <div className={"signOutDiag " + showSignout}>
            <div style={{ margin: "10px" }}>
              <img
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
              />
              <span>
                <input
                  type="file"
                  id="UserprofilePic"
                  onChange={userProfileImg}
                />
              </span>
            </div>
            <div className="userName" style={{ textTransform: "capitalize" }}>
              {userDetails.userFirstName + " " + userDetails.userLastName}
            </div>
            <div className="userEmail">{userDetails.emailId}</div>
            <Button id="logout-admin" onClick={signout} className="signOutBtn">
              Sign Out
            </Button>

            <div className="signOutDiagBottomLink">
              <span style={{ fontSize: 10 }}>
                <Link
                  color="textPrimary"
                  underline="none"
                  href="https://www.rainbowhospitals.in/other/terms-conditions"
                >
                  Privacy Policy
                </Link>
              </span>
              <span style={{ fontSize: 10, paddingLeft: 4 }}>
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
        </div>
      </div>
    </>
  );
}
export default Header;
