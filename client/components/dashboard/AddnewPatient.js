import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Header from "../dashboard/Header";
import Sidenavbar from "../dashboard/Sidenavbar";
import { useAlert, types } from "react-alert";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  MainContainer: {
    height: "100vh",
    overflow: "hidden",
    overflowY: "scroll",
    "& h5, & h6": {
      color: "#000000A1",
      fontFamily: "Bahnschrift SemiBold",
    },
  },
  formsection: {
    minWidth: "50%",
    "& div": {
      marginTop: "3px",
      // marginRight: '35px',
      "& label": {
        fontFamily: "Bahnschrift SemiBold",
      },
      "& div": {
        width: "95%",
      },
    },
  },
  textArea: {
    "& div": {
      marginTop: "3px",
      width: "95%",
      // marginRight: '35px',
      "& label": {
        fontFamily: "Bahnschrift SemiBold",
        color: "#55555571",
      },
      "& div": {
        width: "100%",
      },
    },
  },
  textArea2: {
    "& div": {
      marginTop: "3px",
      width: "95%",
      // marginRight: '35px',
      "& label": {
        fontFamily: "Bahnschrift SemiBold",
      },
      "& div": {
        width: "100%",
        height: "100px",
      },
    },
  },
  button: {
    width: "100px",
    height: "40px",
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginLeft: "750px",
    marginTop: "30px",
    padding: "10px",
    color: "#555555",
    fontSize: "14px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
      color: "#000000",
    },
  },
  button2: {
    width: "100px",
    height: "40px",
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#152A75",
    opacity: "1",
    border: "1px solid #cccccc",
    marginLeft: "800px",
    marginTop: "30px",
    marginBottom: "15px",
    padding: "10px",
    fontSize: "14px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
      color: "#FFFFFF",
    },
  },
}));

export default function AddnewPatient(props) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [addPatient, setAddPatient] = useState([]);
  const [address1, setAddress1] = useState("");
  const [remarks, setRemarks] = useState("");
  const [referral, setReferral] = useState("");
  const [addPatientDialogOpen, setAddPatientDialogOpen] = useState(false);
  const [cookies] = useCookies(["name"]);
  const classes = useStyles();

  const getFormateDate = (value) => {
    const monthNames = [
      "JAN.",
      "FEB.",
      "MAR.",
      "APR.",
      "May",
      "June",
      "July",
      "AUG.",
      "SEP.",
      "OCT.",
      "NOV.",
      "DEC.",
    ];
    let newdate = new Date(value);
    const dd = newdate.getDate();
    const mm = newdate.getMonth();
    const month = parseInt(mm) + 1;
    const monthNum = month < 10 ? "0" + month : month;

    const y = newdate.getFullYear();
    const formattedDate = y + "-" + monthNum + "-" + dd;
    return formattedDate;
  };

  const handleAddPatient = () => {
    console.log("===========>firstName", firstName);
    console.log("===========>lastName", lastName);
    console.log("=====================>dateOfBirth", dateOfBirth);
    console.log("==========>gender", gender);
    console.log("===========>email", email);
    console.log("=============>country", country);
    console.log("===========>state ", state);
    console.log("===========>city ", city);
    console.log("===========>pin ", pin);
    console.log("===========>phone ", phone);
    console.log("==========>address", address1);
    let obj = {
      userFirstName: firstName,
      userLastName: lastName,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phoneNumber: phone,
      emailId: email,
      address: address1,
      country: country,
      city: city,
      state: state,
      pin: pin,
      aadharNumber: aadhar,
      referral: referral,
      remarks: remarks,
    };
    getAddPatient(obj);
    setAddPatientDialogOpen(true);
  };

  const addPatientHandleClose = () => {
    setAddPatientDialogOpen(false);
    location.reload();
  };

  const getStates = () => {
    if ("") {
      setState("");
      setCity("");
    }
    let url = config.API_URL + "/api/utility/cities?countryName=" + country;
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          console.log("states", response.data);
          setStateList(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStates();
  }, [country]);

  const [cityList, setCityList] = useState("");
  const getCities = () => {
    // if (empId === "") {
    //     setCity("");
    // }
    let url =
      config.API_URL +
      "/api/utility/cities?countryName=" +
      country +
      "&stateName=" +
      state;
    axios
      .get(url)
      .then((response) => {
        const showcity = [];
        if (response.data) {
          console.log("cities", response.data);
          response.data.map((city) => {
            showcity.push(city.name);
          });
          console.log("mycity", showcity);
          setCityList(showcity);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (state !== "") {
      getCities();
    }
  }, [state]);

  const getAddPatient = async (obj) => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }

      let headers = {
        authtoken: cookie,
      };
      const url = config.API_URL + "/api/users/userpatientsignup";
      await axios.post(url, obj, { headers });
      setAddPatient(data);
    } catch (err) {
      console.log("============>", err);
    }
  };
  useEffect(() => {
    getAddPatient();
  }, []);

  function ValidateEmail(mail) {
    setEmail(mail.target.value);
    const {
      target: { value },
    } = event;
    setEmailError({ email: "" });
    setEmail(value);
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      setEmailError({ email: "Please enter valid email (xyz@xyz.com)" });
    }
  }

  function phonenumber(inputtxt) {
    // setPhone(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setPhoneError({ phone: "" });
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPhoneError({ phone: "Please enter only numbers" });
    } else {
      setPhone(value);
    }
    if (value.length > 10) {
      setPhoneError({ phone: "Phone number should be of ten digits" });
    }
    if (value.length < 10) {
      setPhoneError({ phone: "Phone number should be of only ten digits " });
    }
  }
  function pinValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only numbers" });
    } else {
      setPin(value);
    }
    if (value.length > 6) {
      setPinError({ pin: "It must be of six digits" });
    }
    if (value.length < 6) {
      setPinError({ pin: "It must be of six digits" });
    }
  }

  function firstNameValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setFirstName({ firstName: "" });
    let reg = new RegExp(/^[a-zA-Z]+ [a-zA-Z]+$/).test(value);
    if (!reg) {
      setFirstNameError({ firstName: "" });
    } else {
      setFirstName(value);
    }
    if (value.length < 4) {
      setFirstNameError({ firstName: "It must be of 4 Character" });
    }
  }

  function lastNameValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setLastName({ lastName: "" });
    let reg = new RegExp(/^[a-zA-Z]+ [a-zA-Z]+$/).test(value);
    if (!reg) {
      setLastNameError({ lastName: "" });
    } else {
      setLastName(value);
    }
    if (value.length < 4) {
      setLastNameError({ lastName: "It must be of 4 Character" });
    }
  }

  function AadharValidate(inputtxt) {
    // setPhone(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setAadharError({ aadhar: "" });
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setAadharError({ aadhar: "Please enter only numbers" });
    } else {
      setAadhar(value);
    }
    if (value.length > 12) {
      setAadharError({ aadhar: "Phone number should be of 12 digits" });
    }
    if (value.length < 12) {
      setAadharError({ aadhar: "Phone number should be of only 12 digits " });
    }
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={1}>
          <Sidenavbar />
        </Grid>
        <Grid item xs={11} className={classes.MainContainer}>
          <Typography variant="h5" style={{ color: "black" }}>
            Add New Patient
          </Typography>
          <Typography variant="h6">New Patient</Typography>
          <Grid container justify="space-between">
            <Grid item sm={1} className={classes.formsection}>
              <div>
                <TextField
                  // error={(firstNameError?.firstName)}
                  // helperText={firstNameError?.firstName}
                  label="First Name*"
                  id="standard-size-small"
                  placeholder=""
                  size="small"
                  variant="filled"
                  // onChange={firstNameValidate}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div>
                <TextField
                  label="Date Of Birth*"
                  placeholder="DD/MM/YYYY"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
              </div>
              <div>
                <TextField
                  error={Boolean(phoneError?.phone)}
                  helperText={phoneError?.phone}
                  label="Phone"
                  placeholder="9999999999"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  className={" " + (errMsg && phone === "" ? "err" : "")}
                  value={phone}
                  onChange={phonenumber}
                />
              </div>
              <div>
                <TextField
                  label="Address1"
                  placeholder="Address"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  onChange={(event) => setAddress1(event.target.value)}
                />
              </div>
            </Grid>
            <Grid item sm={1} className={classes.formsection}>
              <div>
                <TextField
                  // error={Boolean(lastNameError?.lastName)}
                  // helperText={lastNameError?.lastName}
                  label="Last Name*"
                  placeholder=""
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  // className={" " + (errMsg && lastName === "" ? "err" : "")}
                  // onChange={lastNameValidate}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
              <div>
                <TextField
                  select
                  label="Gender*"
                  id="standard-size-small"
                  size="small"
                  value={gender}
                  variant="filled"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="" disabled></MenuItem>
                  {["Male", "Female"].map((gender, id) => (
                    <MenuItem key={"gender-" + id} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div>
                <TextField
                  label="Email"
                  placeholder="xyz@xyz.com"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  error={Boolean(emailError?.email)}
                  helperText={emailError?.email}
                  className={" " + (errMsg && email === "" ? "err" : "")}
                  value={email}
                  onChange={ValidateEmail}
                />
              </div>
              <div>
                <TextField
                  label="Address2"
                  placeholder="Address"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container justify="space-between">
            <Grid item sm={1} className={classes.formsection}>
              <div>
                <TextField
                  select
                  label="Country"
                  id="standard-size-small"
                  size="small"
                  value={country}
                  variant="filled"
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <MenuItem value="" disabled></MenuItem>
                  {["India"].map((country, id) => (
                    <MenuItem key={"country-" + id} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div>
                <TextField
                  select
                  label="City"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  value={city}
                  className={" " + (errMsg && city === "" ? "err" : "")}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <MenuItem value="" disabled></MenuItem>
                  {cityList.length > 0 &&
                    cityList.map((city, id) => (
                      <MenuItem key={"city-" + id} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                </TextField>
              </div>
              <div>
                <TextField
                  label="Referral"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  onChange={(event) => setReferral(event.target.value)}
                />
              </div>
            </Grid>
            <Grid item sm={1} className={classes.formsection}>
              <div>
                <TextField
                  select
                  label="State"
                  id="standard-size-small"
                  size="small"
                  value={state}
                  variant="filled"
                  className={" " + (errMsg && state === "" ? "err" : "")}
                  onChange={(e) => setState(e.target.value)}
                >
                  <MenuItem value="" disabled></MenuItem>
                  {stateList.length > 0 &&
                    stateList.map((state, id) => (
                      <MenuItem key={"state-" + id} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                </TextField>
              </div>
              <div>
                <TextField
                  label="Postal / PIN Code"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                  error={Boolean(pinError?.pin)}
                  helperText={pinError?.pin}
                  className={" " + (errMsg && pin === "" ? "err" : "")}
                  value={pin}
                  onChange={pinValidate}
                />
              </div>
              <div>
                <TextField
                  error={Boolean(aadharError?.aadhar)}
                  helperText={aadharError?.aadhar}
                  label="Aadhar"
                  placeholder="0123-3456-0987"
                  id="standard-size-small"
                  size="small"
                  value={aadhar}
                  variant="filled"
                  className={" " + (errMsg && state === "" ? "err" : "")}
                  onChange={AadharValidate}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container className={classes.textArea2}>
            <div>
              <TextField
                label="Remarks"
                placeholder="write anything about yourself"
                id="standard-size-small"
                size="small"
                variant="filled"
                onChange={(event) => setRemarks(event.target.value)}
              />
            </div>
            <div
              style={{
                marginTop: "15px",
                marginLeft: "810px",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="contained"
                style={{ width: "140px", borderRadius: "30px" }}
              >
                CANCEL
              </Button>
              <Button
                onClick={handleAddPatient}
                variant="contained"
                color="primary"
                style={{
                  width: "140px",
                  borderRadius: "30px",
                  marginLeft: "10px",
                }}
              >
                ADD
              </Button>
              <Dialog
                open={addPatientDialogOpen}
                onClose={addPatientHandleClose}
                maxWidth="sm"
              >
                {/* <DialogTitle id="form-dialog-title">Add New Family Member</DialogTitle> */}
                <DialogContent>
                  <Grid container justify="space-between">
                    <DialogContentText
                      style={{
                        marginTop: "20px",
                        fontFamily: "Bahnschrift SemiBold",
                        color: "#000000",
                      }}
                    >
                      Patient successfully added.
                    </DialogContentText>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={addPatientHandleClose}
                    className={classes.appointmentDialogButton}
                    color="primary"
                    variant="contained"
                    style={{
                      width: "90px",
                      borderRadius: "30px",
                      marginLeft: "10px",
                    }}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
