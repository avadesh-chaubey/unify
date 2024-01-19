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
  const { userData, type, setMsgData, setLoader } = props;
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneNumErr, setPhoneNumErr] = useState("");
  const [selectEmp, setSelectEmp] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [empId, setEmpId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [organization, setOrganization] = useState("0");
  const [organizationUID, setOrganizationUID] = useState("");
  const [specialityUID, setSpecialityUID] = useState("");
  const [licenceNum, setLicenceNum] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [superSpeciality, setSuperSpeciality] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [experience, setExperience] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTill, setAvailableTill] = useState("");
  const [availability, setAvailability] = useState([]);
  const [domesticConsultation, setDomesticConsultation] = useState("");
  const [internationalVideoConsultation, setInternationalVideoConsultation] =
    useState("");
  const [domesticVideoConsultaion, setDomesticVideoConsultaion] = useState("");
  const [followUpDomestic, setFollowUpDomestic] = useState("");
  const [followUpInternational, setFollowUpInternational] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [uploadImgUrl, setUploadedImgUrl] = useState("");
  const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const SpecializationType = [
    "Medicine",
    "Surgery",
    "Gynaecology",
    "Obstetrics",
    "Paediatrics",
    "Eye",
    "ENT",
    "Dental",
    "Orthopaedics",
    "Neurology",
    "Cardiology",
    "Psychiatry",
    "Skin",
    "VD",
    "PlasticSurgery",
    "NuclearMedicine",
    "InfectiousDisease",
    "Diabetic",
    "Physiotherapy",
    "HealthEducation",
    "Counseling",
    "Nutritionist",
  ];
  const [hospitalUnitList, setHospitalUnitList] = useState([]);
  const [superSpecialityList, setSuperSpecialityList] = useState([]);

  useEffect(() => {
    // Fetch the list of hospital unit
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    axios
      .get(`${config.API_URL}/api/partner/allpartner`, { headers })
      .then((res) => {
        const listOfUnit = res.data.data;
        console.log(res.data.data);
        setHospitalUnitList(listOfUnit);
      })
      .catch((err) => {
        if (
          err.response !== undefined &&
          err.response.data[0].message === "No Partner found"
        ) {
          setMsgData({
            message: "No Added Hospital Units",
            type: "error",
          });
        } else {
          setMsgData({
            message: "Error occured while fetching Hospital Units",
            type: "error",
          });
        }
      });

    if (!countryList.length) {
      getCountryList();
    }
  }, []);

  console.log(organizationUID);
  console.log(specialityUID);

  useEffect(() => {
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    // API to get the specialities
    axios
      .get(
        `${config.API_URL}/api/partner/speciality?ownerOrganisationUID=${organizationUID}`,
        { headers }
      )
      .then((res) => {
        setSuperSpecialityList(res.data.data);
      })
      .catch((err) => {
        setMsgData({
          message: err.response
            ? err.response.data[0].message
            : "Error Occurred while getting Super Specialities List",
          type: "error",
        });
      });
  }, [organizationUID]);

  const getCountryList = () => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/flag/images")
      .then((res) => setCountryList(res.data.data))
      .catch((err) => console.log("Country Error Log", err));
  };

  useEffect(() => {
    if (!countryList.length) {
      getCountryList();
    }
    // Fetch all the state of the selected country
    if (stateList.length === 0) {
      axios
        .get(`${config.API_URL}/api/utility/state?countryName=${country}`)
        .then((res) => setStateList(res.data.data))
        .catch((err) =>
          setMsgData({
            message: "Error occurred while fetching state url",
            type: "error",
          })
        );
    }

    if (state !== "") {
      setLoader(true);
      axios
        .get(
          `${config.API_URL}/api/utility/city?countryName=${country}&stateName=${state}`
        )
        .then((res) => {
          setCityList(res.data.data);
          setLoader(false);
        })
        .catch((err) => {
          setMsgData({
            message: `Error occurred while getting city list of state ${state}`,
            type: "error",
          });
          setLoader(false);
        });
    }
  }, [countryList, stateList, state]);

  const [phoneError, setPhoneError] = useState("");
  const [pinError, setPinError] = useState("");
  const [dobError, setDobError] = useState("");
  const [avaiableTillError, setAvaiableTillError] = useState("");
  const [avaiableFromError, setAvaiableFromError] = useState("");
  const [specialError, setSpecialError] = useState("");

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
    } else if (name == "empId") {
      setEmpId(char);
    } else if (name == "unId") {
      setUniqueId(char);
    } else if (name == "org") {
      setOrganization(char);
    } else if (name == "lice") {
      setLicenceNum(char);
    } else if (name == "super") {
      setSuperSpeciality(char);
    } else if (name == "desg") {
      setDesignation(char);
    } else if (name == "city") {
      setCity(char);
    } else if (name == "state") {
      setState(char);
    }
  };

  const handleDOB = (e) => {
    const DOB = e.target.value;
    const dateNow = new Date();
    const dateInput = new Date(DOB);
    if (dateNow.getTime() <= dateInput.getTime()) {
      // setDob("");
      setDobError("DOB cannot be future date");
    } else {
      setDob(DOB);
      setDobError("");
    }
  };

  const handleAvailableFrom = (e) => {
    const DOB = e.target.value;
    const dateNow = new Date();
    const dateInput = new Date(DOB);
    if (dateNow.getDate() > dateInput.getDate()) {
      setAvaiableFromError("Available From cannot be past date");
    } else {
      setAvailableFrom(DOB);
      setAvaiableFromError("");
    }
  };

  const handleAvailableTill = (e) => {
    const DOB = e.target.value;
    const dateNow = new Date();
    const dateInput = new Date(DOB);
    if (dateNow.getDate() > dateInput.getDate()) {
      setAvaiableTillError("Available Till cannot be past date");
    } else {
      setAvailableTill(DOB);
      setAvaiableTillError("");
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

  const handleEmpExperience = (e) => setExperience(e.target.value);

  const handleDomesticCharges = (e) => setDomesticConsultation(e.target.value);

  const handleDomesticVCcharges = (e) =>
    setDomesticVideoConsultaion(e.target.value);

  const handleInternationalVCcharges = (e) =>
    setInternationalVideoConsultation(e.target.value);

  const handleFollowUpDomestic = (e) => setFollowUpDomestic(e.target.value);

  const handleFollowUpInternational = (e) =>
    setFollowUpInternational(e.target.value);

  const handleEmpEmail = (value, name) => {
    const emailInput = value;
    const validationEmailInput = new RegExp(/\S+@\S+\.\S+/).test(emailInput);
    if (name == "userId") {
      if (!validationEmailInput) {
        setUserIdError("Please enter valid user Id");
      } else {
        setUserIdError("");
      }
      setUserId(emailInput);
    } else if (name === "workMail") {
      if (!validationEmailInput) {
        setEmailErr("Please enter valid work email");
      } else {
        setEmailErr("");
      }
      setEmail(emailInput);
    }
  };

  const validatePassword = (e) => {
    e.preventDefault();
    const pwd = e.target.value.trim();
    if (pwd.length < 6) {
      setPasswordError("Password must be 6 character or more");
    } else {
      setPasswordError("");
    }
    setPassword(pwd);
  };

  const uploadProfilePic = (e) => {
    const picFile = e.target.files[0];
    setProfilePic(URL.createObjectURL(e.target.files[0]));
    uploadPicToServer(picFile);
    e.target.value = null;
  };

  const uploadPicToServer = (imgFile) => {
    setLoader(true);
    const imageHeaderConfig = {
      headers: { authtoken: JSON.parse(localStorage.getItem("token")) },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
    };

    const data = {
      file: imgFile,
    };

    axiosInstance
      .post(`${config.API_URL}/api/utility/upload`, data, imageHeaderConfig)
      .then((res) => {
        setUploadedImgUrl(res.data.data.fileName);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setMsgData({
          message: "Error occurred while uploading image",
          type: "error",
        });
        setProfilePic("");
        setLoader(false);
      });
  };

  const removeProfilePic = (e) => {
    e.preventDefault();
    setProfilePic("");
  };

  const cancelDetails = () => {
    router.push("/employee/employeeOnboarding");
  };

  const submitDetails = () => {
    setLoader(true);
    const empDetails = {
      userType: "doctor",
      isConsultant: true,
      userId: userId,
      password: password,
      userFirstName: firstName,
      userLastName: lastName,
      profileImageName: uploadImgUrl,
      dateOfBirth: dob,
      gender: gender,
      employeeId: empId,
      uniqueId: uniqueId,
      organization: organization,
      organizationUID: organizationUID,
      doctorRegistrationNumber: licenceNum,
      about: about,
      specialization: speciality,
      specialityUID: specialityUID,
      superSpeciality: superSpeciality,
      designation: designation,
      phoneNumber: phoneNum,
      emailId: email,
      address: address,
      city: city,
      state: state,
      pin: pincode,
      country: country,
      qualificationList: qualification,
      experinceInYears: experience,
      avaiability: availability,
      // consultationCharges: consultationCharges
      activeFrom: availableFrom,
      activeTill: availableTill,
      department: "",
      feeDetails: {
        domesticPhysicalConsultationCharges: domesticConsultation,
        domesticVideoConsultationCharges: domesticVideoConsultaion,
        domesticFollowUpCharges: followUpDomestic,
        internationalPhysicalConsultationCharges: "",
        internationalVideoConsultationCharges: internationalVideoConsultation,
        internationalFollowUpCharges: followUpInternational,
      },
    };
    if (
      userId &&
      password &&
      firstName &&
      lastName &&
      dob &&
      gender &&
      empId &&
      uniqueId &&
      organization &&
      licenceNum &&
      about &&
      speciality &&
      superSpeciality &&
      designation &&
      phoneNum &&
      email &&
      address &&
      city &&
      state &&
      pincode &&
      country &&
      qualification &&
      experience &&
      availability &&
      availableFrom &&
      availableTill &&
      domesticVideoConsultaion &&
      domesticConsultation &&
      followUpDomestic &&
      followUpInternational
    ) {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      console.log("api data", empDetails);

      axios
        .post(`${config.API_URL}/api/partner/employee`, empDetails, { headers })
        .then((res) => {
          setLoader(false);
          console.log("employee registration response", res.data);
          setMsgData({
            message: "New Doctor Successfully Registered",
            type: "success",
          });

          setInterval(function () {
            router.push("/frontDesk/roasterManagement");
          }, 1000);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
            setMsgData({
              message: err.response
                ? err.response.data[0].message
                : "Error Occurred. Please try again later",
              type: "error",
            });
          } else {
            setMsgData({
              message: "Error occurred to add new employee",
              type: "error",
            });
          }
          setLoader(false);
        });
    } else {
      setLoader(false);
      setMsgData({
        message: "All fields are Required",
        type: "error",
      });
    }
  };

  const handleAvailability = (e, availableDays) => {
    e.preventDefault();
    setAvailability(availableDays);
  };

  const handleSpeciality = (e) => {
    e.preventDefault();
    setSpeciality(e.target.value);
  };

  const handleHospital = (e) => {
    e.preventDefault();
    setOrganization(e.target.value);
  };

  const handleQualification = (e, qualification) => {
    e.preventDefault();
    setQualification(qualification);
  };

  return (
    <>
      <hr />
      <div className="doctor-onboarding-main">
        <Typography variant="h6">Login Details</Typography>
        <Grid container spacing={2} style={{ paddingBottom: "20px" }}>
          <Grid item xs={3} />
          <Grid item xs={8}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="User ID"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          placeholder="xyz@gmail.com"
                          value={userId}
                          onChange={(e) =>
                            handleEmpEmail(e.target.value, "userId")
                          }
                          error={Boolean(userIdError)}
                          helperText={userIdError !== "" ? userIdError : ""}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          type="password"
                          label="Create Password"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          placeholder="Password"
                          value={password}
                          onChange={validatePassword}
                          error={Boolean(passwordError)}
                          helperText={passwordError !== "" ? passwordError : ""}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
        <hr align="left" style={{ width: "91%" }} />

        <Typography variant="h6">Personal Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3} style={{ paddingBottom: "20px" }}>
            <div>
              <div className="image profic-pic-emp" id="image">
                <label htmlFor="profilePic" style={{ cursor: "pointer" }}>
                  {profilePic === "" ? (
                    <img
                      src="/icon_feather_camera.svg"
                      className="upload-emp-pic"
                    />
                  ) : (
                    <div style={{ display: "flex" }}>
                      <div
                        id="removeImage1"
                        className="rmv remove-profile-pic-btn"
                        onClick={removeProfilePic}
                      >
                        <Grid item xs={8}>
                          <DeleteOutlinedIcon className="del-icon" />
                        </Grid>
                      </div>
                      <Avatar
                        // src={
                        //   uploading !== true
                        //     ? `${config.API_URL}/api/utility/download/profileImage` +
                        //     profileImage
                        //     : profileImage
                        // }
                        className="preview-profile-pic"
                        src={profilePic}
                        alt="profile pic"
                      />
                    </div>
                  )}
                </label>
                <input
                  // required
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={uploadProfilePic}
                  style={{ display: "none" }}
                />
              </div>
              <p className="upload-pic-caption">Upload Photo</p>
            </div>
          </Grid>
          <Grid item xs={8} style={{ paddingBottom: "20px" }}>
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

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Employee ID"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          value={empId}
                          onChange={(e) => handleStrings(e, "empId")}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Unique ID"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={uniqueId}
                          onChange={(e) => handleStrings(e, "unId")}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          select
                          required
                          label="Organization"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={organization}
                          onChange={handleHospital}
                          InputLabelProps={{ shrink: true }}
                        >
                          <MenuItem value="0" disabled>
                            Select Hospital Unit
                          </MenuItem>
                          {hospitalUnitList.length > 0 &&
                            hospitalUnitList.map((data, index) => (
                              <MenuItem
                                key={index}
                                value={data.legalName}
                                onClick={(e) => setOrganizationUID(data.id)}
                              >
                                {data.legalName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Licence Number"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={licenceNum}
                          onChange={(e) => handleStrings(e, "lice")}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-full-div">
                        <TextField
                          multiline
                          rows={3}
                          required
                          label="About"
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto address-field hospital-unit-label full-width-textarea"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        {/* <TextField
                          required
                          label="Speciality"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          value={speciality}
                          onChange={(e) => setSpeciality(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        /> */}
                        {/* <Autocomplete
                          // multiple
                          id="tags-filled"
                          className="available-days-autocomplete"
                          options={SpecializationType.map((option) => option)}
                          value={speciality}
                          onChange={handleSpeciality}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              label="Speciality"
                              id="title"
                              required
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        /> */}
                        <TextField
                          required
                          select
                          label="Speciality"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={speciality}
                          onChange={handleSpeciality}
                        >
                          <MenuItem value="0" disabled>
                            Select Speciality
                          </MenuItem>
                          {superSpecialityList.length > 0 &&
                            superSpecialityList.map((data, index) => (
                              <MenuItem
                                key={index}
                                value={data.specialityName}
                                onClick={(e) => setSpecialityUID(data.id)}
                              >
                                {data.specialityName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          select
                          label="Super Speciality"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={superSpeciality}
                          onChange={(e) => handleStrings(e, "super")}
                        >
                          <MenuItem value="0" disabled>
                            Select Super Speciality
                          </MenuItem>
                          {superSpecialityList.length > 0 &&
                            superSpecialityList.map((data, index) => (
                              <MenuItem key={index} value={data.specialityName}>
                                {data.specialityName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div ptax-div onboarding-half-div">
                        <TextField
                          required
                          label="Designation"
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label ptax-field"
                          value={designation}
                          onChange={(e) => handleStrings(e, "desg")}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <hr align="left" style={{ width: "91%" }} />

        <Typography variant="h6">Contact Details</Typography>
        <Grid container spacing={2} style={{ paddingBottom: "20px" }}>
          <Grid item xs={3} />
          <Grid item xs={8}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
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
                          label="Work Email"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={email}
                          onChange={(e) =>
                            handleEmpEmail(e.target.value, "workMail")
                          }
                          error={Boolean(emailErr)}
                          helperText={emailErr !== "" ? emailErr : ""}
                        />
                      </div>
                    </div>

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

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          select
                          label="State"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          <MenuItem value="">Select State</MenuItem>
                          {stateList.length > 0 &&
                            stateList.map((data, index) => (
                              <MenuItem key={index} value={data.stateName}>
                                {data.stateName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          select
                          label="City"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          defaultValue="0"
                        >
                          <MenuItem value="0">Select City</MenuItem>
                          {cityList.length > 0 &&
                            cityList.map((data, index) => (
                              <MenuItem key={index} value={data.cityName}>
                                {data.cityName}
                              </MenuItem>
                            ))}
                        </TextField>
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
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <hr align="left" style={{ width: "91%" }} />
        <Typography variant="h6">Other Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={3} />
          <Grid item xs={8}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        {/* <TextField
                          required
                          select
                          label="Qualification"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        >
                          <MenuItem disabled value="0">
                            Select Qualification
                          </MenuItem>
                          {QualificationCollections.map((data, index) => (
                            <MenuItem key={index} value={data}>
                              {" "}
                              {data}{" "}
                            </MenuItem>
                          ))}
                        </TextField> */}
                        <Autocomplete
                          multiple
                          id="tags-filled"
                          className="available-days-autocomplete"
                          options={QualificationCollections.map(
                            (option) => option
                          )}
                          value={qualification}
                          onChange={handleQualification}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              required
                              label="Qualification"
                              id="title"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Experience"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={experience}
                          onChange={handleEmpExperience}
                          placeholder="Example: 5.5 years"
                          InputProps={{
                            inputComponent: decimalFormatter,
                          }}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <Autocomplete
                          multiple
                          id="tags-filled"
                          className="available-days-autocomplete"
                          options={availableDays.map((option) => option)}
                          value={availability}
                          onChange={handleAvailability}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              required
                              label="Availability"
                              id="title"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          type="date"
                          label="Available From"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto address-field hospital-unit-label"
                          value={availableFrom}
                          onChange={handleAvailableFrom}
                          error={Boolean(avaiableFromError)}
                          helperText={
                            avaiableFromError !== "" ? avaiableFromError : ""
                          }
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          type="date"
                          label="Available Till"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={availableTill}
                          onChange={handleAvailableTill}
                          error={Boolean(avaiableTillError)}
                          helperText={
                            avaiableTillError !== "" ? avaiableTillError : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <hr align="left" style={{ width: "91%" }} />
        <Typography variant="h6">Fee Details</Typography>
        <Grid container spacing={2} style={{ paddingBottom: "20px" }}>
          <Grid item xs={3} />
          <Grid item xs={8}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Domestic Physical Consultation"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={domesticConsultation}
                          onChange={handleDomesticCharges}
                          InputProps={{
                            inputComponent: indianCurrenctyField,
                          }}
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="International Video Consultation"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={internationalVideoConsultation}
                          onChange={handleInternationalVCcharges}
                          InputProps={{
                            inputComponent: dollarCurrencyFormatter,
                          }}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Domestic Video Consultation"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={domesticVideoConsultaion}
                          onChange={handleDomesticVCcharges}
                          InputProps={{
                            inputComponent: indianCurrenctyField,
                          }}
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Follow Up Charges (International)"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={followUpInternational}
                          onChange={handleFollowUpInternational}
                          InputProps={{
                            inputComponent: dollarCurrencyFormatter,
                          }}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Follow Up Charges (Domestic)"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label ptax-field"
                          value={followUpDomestic}
                          onChange={handleFollowUpDomestic}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            inputComponent: indianCurrenctyField,
                          }}
                        />
                      </div>
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
            onClick={submitDetails}
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
