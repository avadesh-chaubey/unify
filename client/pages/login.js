import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import config from "../app.constant";
import UserType from "../types/user-type";
import { useRouter } from "next/router";
import useRequest from "../hooks/use-request";
import {
  Typography,
  Link,
  Paper,
  CircularProgress,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import MessagePrompt from "../components/messagePrompt";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: "100px 20px 20px 500px",
      width: "500px",
      height: "00px",
    },
  },
  textbox: {
    "& .MuiTextField-root": {
      margin: "20px 20px 1px 75px",
      width: "300px",
      height: "50px",
    },
  },
  button: {
    "& > *": {
      margin: "20px 20px 1px 150px",
      width: "150px",
    },
  },
  forgotBtn: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  forgotBtnLink: {
    left: 0,
    padding: "20px 5px 2px 10px",
    backgroundColor: "transparent",
    color: "#502E92",
    display: "flex",
    fontWeight: 600,
    textAlign: "left",
    fontSize: "0.81rem",
  },
}));

const TITLE = `Unify Care - Login to your account`;
const MIN_PASSWORD_LENGTH = 6;

const Signin = ({ firebase }) => {
  const Router = useRouter();
  const classes = useStyles();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [validationErr, setValidationErr] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState("");

  const newAccountFirebase = (
    firebase,
    email,
    password,
    response,
    cookie,
    type = ""
  ) => {
    console.log("About to create account in firebase for new user");

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, email)
      .then((firebaseRes) => {
        console.log("firebase account created successfully");
        const data = {
          userId: response.id,
          uid: firebaseRes.user.uid,
        };

        console.log("create new firebase user ids", data);
        const headers = {
          authtoken: cookie,
        };

        axios
          .post(config.API_URL + "/api/notification/uid/update", data, {
            headers,
          })
          .then((res) => {
            console.log("Firebase account creation response", res);
            console.log(
              "notificatino uid update done - ready to redirect to app list"
            );
            setLoader(false);
            if (type === "admin") {
              Router.push("/portals");
            } else {
              Router.push({
                pathname: "/doctor/appointmentListing",
                query: { firebase: firebase },
              });
            }
          })
          .catch((err) =>
            console.log("error occured while notifying to server")
          );
      })
      .catch((error) => {
        setLoader(false);
        console.log("firebase account creation error", error);
      });
  };

  const firebaseUserAuthentication = (response, emailId, type = "admin") => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, emailId)
      .then((user) => {
        console.log("Firebase - User Authenticated Successfully", user);

        if (firebase) {
          localStorage.setItem("UUID", JSON.stringify(user.user.uid));

          // Call api for uid while login
          const data = {
            userId: response.id,
            uid: user.user.uid,
          };

          const headers = {
            authtoken: response.token,
          };

          axios
            .post(`${config.API_URL}/api/notification/uid/update`, data, {
              headers,
            })
            .then((res) => console.log("redirect to listing page"))
            .catch((err) =>
              console.log("admin-error occured while notifying to server (1) ")
            );

          console.log("Create instance of firebase for admin-messaging!");
          const messaging = firebase.messaging();
          messaging
            .requestPermission()
            .then(() => {
              console.log("admin-firebase messaging request approved");
              return messaging.getToken({
                vapidKey:
                  "BECoxODkESJEptoMSBRg02WHjgcHkvom_qUQcYKpwJpdcpTBOAriNAcxlyn55xEFS89O-uSFf18_quZhJNBVhhw",
              });
            })
            .then((token) => {
              const headers = {
                authtoken: response.token,
              };
              let data = {
                uuid: user.user.uid,
                token: token,
                voiptoken: "",
                deviceType: "chrome",
              };

              axios
                .post(`${config.API_URL}/api/notification/token/update`, data, {
                  headers,
                })
                .then((res) => {
                  console.log("admin-notification token update");
                  console.log("admin-res", res);
                })
                .catch((err) => console.log("admin-error (2)"));
            })
            .catch((err) => console.log("firebase notification token", err));
        }

        console.log("redirect user to respective page");
        // On successful authetication, redirect user to respective page
        /* if (response.userType === UserType.Superadmin) {
          Router.push('portals');
        } else */
        if (type !== "admin") {
          Router.push("/doctor/appointmentListing");
        } else {
          Router.push("/portals");
        }
      })
      .catch((error) => {
        console.log("Firebase Admin: Error ", error);
        console.log("Firebase Admin: Error occurred", error.code);
        let errorCode = error.code;

        // Create account of user if the error message and code is email not found
        if (errorCode === "auth/user-not-found") {
          newAccountFirebase(
            firebase,
            emailId,
            password,
            response,
            response.token,
            "admin"
          );
        } else {
          setLoader(false);
          setMsgData({
            message: "Error occurred, Please try again later",
            type: "error",
          });
        }
      });
  };

  const { doRequest, errors } = useRequest({
    url: config.API_URL + "/api/users/employeesignin",
    method: "post",
    body: {
      emailId,
      password,
    },
    onSuccess: (response) => {
      const loginInfo = response.data;
      localStorage.setItem("userDetails", JSON.stringify(loginInfo));
      setUserDetails(loginInfo);

      if (loginInfo.token) {
        if (process.browser) {
          // Save the access token in local storage
          localStorage.setItem("token", JSON.stringify(loginInfo.token));
        }
      }

      if (
        loginInfo.userType === 'doctor' ||
        loginInfo.userType === UserType.Diabetologist ||
        loginInfo.userType === UserType.Assistant ||
        loginInfo.userType === UserType.Dietician ||
        loginInfo.userType === UserType.Educator
      ) {
        // Firebase sign-in authentication
        firebaseUserAuthentication(loginInfo, emailId, "doctor");
      } else if (
        loginInfo.userType === UserType.PartnerRosterManager ||
        loginInfo.userType === UserType.Administration ||
        loginInfo.userType === UserType.Staff ||
        loginInfo.userType === UserType.Employee
      ) {
        firebaseUserAuthentication(loginInfo, emailId);
      }
      // else if (response.userType === UserType.Superadmin) {
      //   firebaseUserAuthentication(response, emailId);
      // }
      else if (loginInfo.userType === UserType.CustomerSupport) {
        Router.push("/customerSupportHomePage");
      } else if (loginInfo.userType === UserType.PartnerSuperuser) {
        if (loginInfo.userStatus === "unverified") {
          return Router.push("/register?verifyAgency");
        } else {
          Router.push("/portals");
        }
      } else {
        console.log("Error occurred while login!");
      }
    },
    onError: (error) => {
      setLoader(false);
      setMsgData({
        message: !!error.data
          ? error.data[0].message
          : "Error occurred while Login. Please try again later!",
        type: "error",
      });
    },
  });

  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  const validateEmailId = (email) => {
    setEmailId(email);

    if (expression.test(String(email).toLowerCase())) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  const validatePassword = (pwd) => {
    setPassword(pwd);

    if (pwd.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const userSigninHandler = async (event) => {
    event.preventDefault();
    setValidationErr(false);
    if (emailId && password) {
      setLoader(true);
      await doRequest();
    } else {
      setValidationErr(true);
    }
  };

  const onClickRedirect = (e) => {
    e.preventDefault();
    Router.push("/forgotPassword");
  };

  return (
    <>
      {loader && !errors && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <Head>
        <title>{TITLE} </title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <MessagePrompt msgData={msgData} />
      <div className="mainDiv landing-page">
        <div>{errors}</div>
        <div className="leftSide">
          <div className="leftLogo">
            <img src="logo/unifycare_login_page_logo.png" className="logo" />
            {/* <img src="logo_unifycare.svg" className="logo" />
            <img src="unify_name.svg" className="name" />
            <img src="your-health-partner.svg" className="partner" /> */}
          </div>
        </div>
        <div className="vl"></div>
        <div className="rightSide">
          <Paper className="form">
            <form noValidate autoComplete="off" onSubmit={userSigninHandler}>
              <div className="mainForm">
                <Typography
                  component="h1"
                  variant="h5"
                  style={{
                    marginBottom: "15px",
                    color: "#502E92",
                    fontWeight: 600,
                  }}
                >
                  Login to Your Account
                </Typography>
                <TextField
                  id="emailid"
                  required
                  label="Email"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  fullWidth
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  autoComplete="off"
                  helperText={
                    emailError ? (
                      <span style={{ color: "red" }}>
                        Please Enter valid email address
                      </span>
                    ) : validationErr && emailId === "" ? (
                      <span style={{ color: "red" }}>Email is Required</span>
                    ) : (
                      ""
                    )
                  }
                  value={emailId}
                  onChange={(e) => validateEmailId(e.target.value.trim())}
                />

                <TextField
                  id="password"
                  required
                  label="Password"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  type="password"
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  fullWidth
                  // variant="outlined"
                  autoComplete="off"
                  helperText={
                    passwordError ? (
                      <span style={{ color: "red" }}>
                        Password must be 6 character or more
                      </span>
                    ) : validationErr && password === "" ? (
                      <span style={{ color: "red" }}>Password is Required</span>
                    ) : (
                      ""
                    )
                  }
                  value={password}
                  onChange={(e) => validatePassword(e.target.value.trim())}
                />

                <div className={classes.forgotBtn}>
                  <Typography>
                    <Link
                      id="forgot-password"
                      href="/forgotPassword"
                      className={classes.forgotBtnLink}
                      onClick={onClickRedirect}
                      underline="always"
                    >
                      Forgot Password?
                    </Link>
                  </Typography>
                </div>

                <Button
                  className="loginBtn primary-button"
                  variant="contained"
                  color="secondary"
                  type="submit"
                  id="login"
                  style={{
                    margin: "20px 20px 20px 0px",
                    color: "#fff",
                    width: "105px",
                    borderRadius: "20px",
                  }}
                >
                  LOGIN
                </Button>
              </div>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default Signin;
