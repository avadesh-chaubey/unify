import React, { useState, useEffect } from "react";
import config from "../../app.constant";
import axios from "axios";
import decimalFormatter from "../../utils/decimalFormatter";
import dollarCurrencyFormatter from "../../utils/dollarCurrencyFormatter";
import indianCurrenctyField from "../../utils/indianCurrencyField";
import axiosInstance from "../../utils/apiInstance";
import QualificationCollections from "../../types/qualification";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Avatar,
  Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import router from "next/router";

export default function AddNewDoctor(props) {
  const { userData, type, setMsgData, employeeType, setLoader } = props;
  const [phoneNum, setPhoneNum] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [referal, setReferal] = useState("");
  const [remarks, setRemarks] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [pinError, setPinError] = useState("");
  const [dobError, setDobError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    if (!countryList.length) {
      getCountryList();
    }
  }, [employeeType]);

  const getCountryList = () => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/flag/images")
      .then((res) => setCountryList(res.data.data))
      .catch((err) => console.log("Country Error Log", err));
  };

  const handlePhoneNum = (e) => {
    e.preventDefault();
    const number = e.target.value;
    let reg = new RegExp(/^-?\d*$/).test(number);
    if (!reg && number.length <= 10) {
      setPhoneError("Please enter valid phone number");
    } else {
      setPhoneNum(number);
    }
    if (number.length > 10) {
      setPhoneError("Phone number cannot exceed ten digits");
    } else if (number.length < 10) {
      setPhoneError("Phone number should be of ten digits");
    } else {
      setPhoneError("");
    }
  };

  const handleStrings = (e, name) => {
    e.preventDefault();
    const char = e.target.value;
    if (name == "fname") {
      setFirstName(char);
    } else if (name == "lname") {
      setLastName(char);
    } else if (name == "city") {
      setCity(char);
    } else if (name == "state") {
      setState(char);
    } else if (name == "refer") {
      setReferal(char);
    }
  };

  const handleDOB = (e) => {
    const DOB = e.target.value;
    const date_now = new Date();
    const date_input = new Date(DOB);
    if (date_now.getTime() <= date_input.getTime()) {
      setDobError("DOB cannot be future date");
    } else {
      setDob(DOB);
      setDobError("");
    }
  };

  const handlePinCode = (e) => {
    e.preventDefault();
    const pinNumber = e.target.value;
    let reg = new RegExp(/^-?\d*$/).test(pinNumber);
    if (!reg && pinNumber.length <= 6) {
      setPinError("Please enter valid pin number");
    } else {
      setPinCode(pinNumber);
      setPinError("");
    }
    if (pinNumber.length > 6) {
      setPinError("Pin number cannot exceed six digits");
    } else if (pinNumber.length < 6) {
      setPinError("Pin number should be of six digits");
    } else {
      setPinError("");
    }
  };
  const handleAadhar = (e) => {
    e.preventDefault();
    const aadharNumber = e.target.value;
    let reg = new RegExp(/^-?\d*$/).test(aadharNumber);
    if (!reg && aadharNumber.length <= 12) {
      setAadharError("Please enter valid Aadhar Number");
    } else {
      setAadhar(aadharNumber);
      setAadharError("");
    }
    if (aadharNumber.length > 12) {
      setAadharError("Aadhar Number cannot exceed 12 digits");
    } else if (aadharNumber.length < 12) {
      setAadharError("Aadhar Number should be of 12 digits");
    } else {
      setAadharError("");
    }
  };

  const handleEmpEmail = (value) => {
    const emailInput = value;
    const validationEmailInput = new RegExp(/\S+@\S+\.\S+/).test(emailInput);
    if (!validationEmailInput) {
      setEmailErr("Please enter valid work email");
    } else {
      setEmailErr("");
    }
    setEmail(emailInput);
  };

  const cancelDetails = () => {
    router.push("/employee/employeeOnboarding");
  };

  //   const submitDetails = () => {
  //     setLoader(true);
  //     const empDetails = {
  //       userType: "doctor",
  //       isConsultant: true,
  //       userId: userId,
  //       password: password,
  //       userFirstName: firstName,
  //       userLastName: lastName,
  //       profileImageName: uploadImgUrl,
  //       dateOfBirth: dob,
  //       gender: gender,
  //       employeeId: empId,
  //       uniqueId: uniqueId,
  //       organization: organization,
  //       doctorRegistrationNumber: licenceNum,
  //       about: about,
  //       specialization: speciality,
  //       superSpeciality: superSpeciality,
  //       designation: designation,
  //       phoneNumber: phoneNum,
  //       emailId: email,
  //       address: address,
  //       city: city,
  //       state: state,
  //       pin: pincode,
  //       country: country,
  //       qualificationList: qualification,
  //       experinceInYears: experience,
  //       avaiability: availability,
  //       // consultationCharges: consultationCharges
  //       activeFrom: availableFrom,
  //       activeTill: availableTill,
  //       department: "",
  //       feeDetails: {
  //         domesticPhysicalConsultationCharges: domesticConsultation,
  //         domesticVideoConsultationCharges: domesticVideoConsultaion,
  //         domesticFollowUpCharges: followUpDomestic,
  //         internationalPhysicalConsultationCharges: "",
  //         internationalVideoConsultationCharges: internationalVideoConsultation,
  //         internationalFollowUpCharges: followUpInternational,
  //       },
  //     };
  //     if (
  //       userId &&
  //       password &&
  //       firstName &&
  //       lastName &&
  //       dob &&
  //       gender &&
  //       empId &&
  //       uniqueId &&
  //       organization &&
  //       licenceNum &&
  //       about &&
  //       speciality &&
  //       superSpeciality &&
  //       designation &&
  //       phoneNum &&
  //       email &&
  //       address &&
  //       city &&
  //       state &&
  //       pincode &&
  //       country &&
  //       qualification &&
  //       experience &&
  //       availability &&
  //       availableFrom &&
  //       availableTill &&
  //       domesticVideoConsultaion &&
  //       domesticConsultation &&
  //       followUpDomestic &&
  //       followUpInternational
  //     ) {
  //       const headers = {
  //         authtoken: JSON.parse(localStorage.getItem("token")),
  //       };

  //       console.log("api data", empDetails);

  //       axios
  //         .post(`${config.API_URL}/api/partner/employee`, empDetails, { headers })
  //         .then((res) => {
  //           setLoader(false);
  //           console.log("employee registration response", res.data);
  //           setMsgData({
  //             message: "New Doctor Successfully Registered",
  //             type: "success",
  //           });
  //           setInterval(function () {
  //             router.push("/profileManagement/listing");
  //           }, 1000);
  //         })
  //         .catch((err) => {
  //           if (err.response) {
  //             setMsgData({
  //               message: err.response.data.errors[0].message,
  //               type: "error",
  //             });
  //           } else {
  //             setMsgData({
  //               message: "Error occurred to add new employee",
  //               type: "error",
  //             });
  //           }
  //           setLoader(false);
  //         });
  //     } else {
  //       setLoader(false);
  //       setMsgData({
  //         message: "All fields are Required",
  //         type: "error",
  //       });
  //     }
  //   };

  return (
    <>
      <hr />
      <div className="doctor-onboarding-main">
        <Typography variant="h6">Patient Details</Typography>
        <Grid container spacing={2} style={{ paddingBottom: "20px" }}>
          <Grid item xs={11}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="First Name"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          value={firstName}
                          onChange={(e) => handleStrings(e, "fname")}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Last Name"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={lastName}
                          onChange={(e) => handleStrings(e, "lname")}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          type="date"
                          label="Date of Birth"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={dob}
                          onChange={handleDOB}
                          error={Boolean(dobError)}
                          helperText={dobError !== "" ? dobError : ""}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          select
                          label="Gender"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <MenuItem disabled value="">
                            Select Gender
                          </MenuItem>
                          <MenuItem value="M">Male</MenuItem>
                          <MenuItem value="F">Female</MenuItem>
                        </TextField>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          label="Phone"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          placeholder="##########"
                          value={phoneNum}
                          onChange={handlePhoneNum}
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(phoneError)}
                          helperText={phoneError !== "" ? phoneError : ""}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          label="Email"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={email}
                          onChange={(e) =>
                            handleEmpEmail(e.target.value)
                          }
                          error={Boolean(emailErr)}
                          helperText={emailErr !== "" ? emailErr : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="es-unit-field">
                      <div
                        className="half-div onboarding-half-div"
                        style={{ width: "100%" }}
                      >
                        <TextField
                          required
                          label="Address"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          multiline
                          maxrows={3}
                          required
                          label="City"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto address-field hospital-unit-label"
                          value={city}
                          onChange={(e) => handleStrings(e, "city")}
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="State"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={state}
                          onChange={(e) => handleStrings(e, "state")}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          multiline
                          maxrows={3}
                          required
                          label="Postal / PIN Code"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto address-field hospital-unit-label"
                          value={pincode}
                          onChange={handlePinCode}
                          error={Boolean(pinError)}
                          helperText={pinError !== "" ? pinError : ""}
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          select
                          required
                          label="Country"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <MenuItem value="">Select Country</MenuItem>
                          {countryList.length > 0 &&
                            countryList.map((data, index) => (
                              <MenuItem key={index} value={data.name}>
                                {data.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Referal"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          value={referal}
                          onChange={(e) => handleStrings(e, "refer")}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Aadhar Number"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={aadhar}
                          onChange={handleAadhar}
                          error={Boolean(aadharError)}
                          helperText={aadharError !== "" ? aadharError : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="es-unit-field">
                    <div className="half-div onboarding-full-div">
                      <TextField
                        multiline
                        rows={3}
                        required
                        label="Remarks"
                        margin="normal"
                        variant="filled"
                        InputLabelProps={{ shrink: true }}
                        className="form-auto address-field hospital-unit-label full-width-textarea"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="action onboarding-action-buttons">
          <Button
            variant="contained"
            className="doctor-onboarding-cancel-btn"
            onClick={cancelDetails}
          >
            Cancel
          </Button>

          <Button
            id="submit"
            size="small"
            variant="contained"
            // onClick={submitDetails}
            className="primary-button forward doctor-save-btn"
            type="button"
          >
            ADD
          </Button>
        </div>
      </div>
    </>
  );
}
