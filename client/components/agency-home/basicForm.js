import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext } from "react";
import axios from "axios";
import { StepUpdateContext } from "../../context/registerStep";
import { UserUpdateContext } from "../../context/basiciSignup";
import { useRouter } from "next/router";
import Icon from "@material-ui/core/Icon";
import UserType from "../../types/user-type";
import { useAlert, types } from "react-alert";
import useRequest from "../../hooks/use-request";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Link from "next/link";
import config from "../../app.constant";
function BasicForm({ type }) {
  const router = useRouter();
  const alert = useAlert();

  const { step, newStep } = useContext(StepUpdateContext);
  const { user, newUser } = useContext(UserUpdateContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [tncCheck, setTncCheck] = useState(false);
  const [btnEnable, setBtnEnable] = useState(true);

  const { doRequest, errors } = useRequest({
    url: config.API_URL + "/api/users/sendemailotp",
    method: "post",
    body: {
      emailId: email,
    },
    onSuccess: (response) => {
      console.log("in dorequest: ", response);
      setLoader(false);
      router.push("/otpverification");
      // router.push('/register?verifyAgency')
      console.log(response);
    },
  });
  const goBackVerifyPage = (e) => {
    e.preventDefault();
    router.push("/");
  };
  const handleTncChange = (e) => {
    if (e.target.checked == true) {
      setTncCheck(true);
      setBtnEnable(false);
    } else {
      setTncCheck(false);
      setBtnEnable(true);
    }
  };
  const submitBasic = async (e) => {
    e.preventDefault();
    setErrMsg(false);

    if (
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setErrMsg(true);
      alert.show("All fields are required", { type: "error" });
      return false;
    }

    if (password !== confirmPassword) {
      setErrMsg(true);
      alert.show("Password not matching ! ", { type: "error" });
      return false;
    }

    setLoader(true);
    await axios
      .post(config.API_URL + "/api/users/partnersignup", {
        userFirstName: firstName,
        userLastName: lastName,
        emailId: email,
        phoneNumber: phone,
        password: password,
      })
      .then(() => {
        setLoader(false);

        if (process.browser) {
          localStorage.setItem(
            "agencyinfo",
            JSON.stringify({
              userFirstName: firstName,
              userLastName: lastName,
              emailId: email,
              phoneNumber: phone,
              userType: UserType.PartnerSuperuser,
            })
          );
        }
        doRequest();
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        alert.show("API error", { type: "error" });
      });
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text">Uploading Primary Contact</div>
        </div>
      )}
      <div
        className="container registration landing-page"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "#fff",
          top: "-2%",
        }}
      >
        <Container maxWidth="xl" style={{ width: "80%" }}>
          <div style={{ paddingTop: "5%" }}>
            <Card
              style={{
                width: "25%",
                height: "100%",
                float: "left",
                boxShadow: "none",
                marginTop: "-32px",
              }}
            >
              <CardActionArea className="area">
                <CardMedia
                  component="img"
                  // className="sec-img"
                  alt="Logo"
                  image="/logo/home_page_logo.png"
                  title="Logo"
                  style={{ width: "80%", height: "80%" }}
                />
              </CardActionArea>
            </Card>

            <div style={{ textAlign: "end" }}>
              <img
                style={{ height: "25px", cursor: "pointer" }}
                src="crossIcon.png"
                onClick={goBackVerifyPage}
              />
            </div>
          </div>
        </Container>

        <Container
          component="main"
          maxWidth="sm"
          className="mainContainer"
          style={{ paddingTop: "4%" }}
        >
          <CssBaseline />
          <div
            style={{ display: "flex", textAlign: "center", marginLeft: "-5%" }}
          >
            {/* , flexDirection: 'column', alignItems: 'center' */}
            <Typography
              component="h1"
              variant="h5"
              style={{ position: "relative", left: "47%" }}
            >
              Registration
            </Typography>

            <form
              noValidate
              autoComplete="off"
              onSubmit={submitBasic}
              style={{ width: "70%" }}
            >
              <div className="break"></div>
              <TextField
                required
                fullWidth
                label="First Name"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  "half-div " + (errMsg && firstName === "" ? "err" : "")
                }
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  "half-div " + (errMsg && lastName === "" ? "err" : "")
                }
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Phone"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={"half-div " + (errMsg && phone === "" ? "err" : "")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Work Email"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={"half-div " + (errMsg && email === "" ? "err" : "")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  "half-div " + (errMsg && password === "" ? "err" : "")
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type="password"
                style={{ margin: 8 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  "half-div " + (errMsg && confirmPassword === "" ? "err" : "")
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    // value="tnc"
                    color="primary"
                    checked={tncCheck}
                    onChange={handleTncChange}
                  />
                }
                label="I accept all terms and condition"
                style={{ float: "left", marginLeft: "0px", width: "100%" }}
              />

              <div className="action">
                <Button
                  disabled={btnEnable}
                  size="small"
                  variant="contained"
                  color="secondary"
                  className="primary-button forward"
                  type="submit"
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "125px",
                    padding: "8px",
                    borderRadius: '20px',
                  }}
                >
                  SUBMIT
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}

export default BasicForm;
