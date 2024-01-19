import React, { useState, useEffect, useMemo } from 'react';
import config from "../../app.constant";
import axios from 'axios';
import axiosInstance from '../../utils/apiInstance';
import QualificationCollections from '../../types/qualification';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Grid, Typography, TextField, MenuItem, Button, Avatar } from '@material-ui/core';
import decimalFormatter from "../../utils/decimalFormatter";

export default function AddNewEmployee (props) {
  const {setMsgData, setLoader} = props;
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneNumErr, setPhoneNumErr] = useState('');
  const [selectEmp, setSelectEmp] = useState('employee');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [dob, setDob] = useState('');
  const [dobErr, setDobErr] = useState('');
  const [gender, setGender] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [pincode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [country, setCountry] = useState('India');
  const [countryList, setCountryList] = useState([]);
  const [qualification, setQualification] = useState(0);
  const [experience, setExperience] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [uploadImgUrl, setUploadedImgUrl] = useState('');
  const [displayErrMsg, setDisplayErrMsg] = useState(false);
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [organization, setOrganization] = useState('0');
  const [organizationList, setOrganizationList] = useState([]);

  useEffect(() => {
    if (!countryList.length) {
      getCountryList();
    }

    // Fetch all the hospital unit list
    if (!organizationList.length) {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem('token'))
      };

      axios
        .get(`${config.API_URL}/api/partner/allpartner`, { headers })
        .then((res) => {
          const listOfUnit = res.data.data;
          setOrganizationList(listOfUnit);
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
    }

    // Fetch all the state of the selected country
    if (stateList.length === 0) {
      axios.get(`${config.API_URL}/api/utility/state?countryName=${country}`)
        .then(res => setStateList(res.data.data))
        .catch(err => setMsgData({
          message: !!err.response
            ? err.response.data.errors[0].message
            : 'Error occurred while fetching state url',
          type: 'error'
        }));
    }

    if (state !== '') {
      setLoader(true);
      axios.get(`${config.API_URL}/api/utility/city?countryName=${country}&stateName=${state}`)
        .then(res => {
          setCityList(res.data.data);
          setLoader(false);
        })
        .catch(err => {
          setMsgData({
            message: `Error occurred while getting city list of state ${state}`,
            type: 'error'
          });
          setLoader(false);
        });
    }
  }, [countryList, stateList, state, organizationList]);

  // On changing country refresh the state list
  useEffect(() => {
    if (country !== '') {
      axios.get(`${config.API_URL}/api/utility/state?countryName=${country}`)
        .then(res => setStateList(res.data.data))
        .catch(err => setMsgData({
          message: 'Error occurred while fetching state url',
          type: 'error'
        }));
    }
  }, [country]);

  const empFieldValidation = useMemo(() => {    
    const valdiateAllFields = (
      userId !== '' &&
      password !== '' &&
      firstName !== '' &&
      lastName !== '' &&
      dob !== '' &&
      gender !== '' &&
      firstNameErr === '' &&
      lastNameErr === '' &&
      pinError === '' &&
      address !== '' &&
      state !== '' &&
      city !== '' &&
      country !== '' &&
      phoneNum !== '' &&
      email !== '' &&
      experience !== '' &&
      qualification !== 0 &&
      profilePic !== '' &&
      phoneNumErr === '' &&
      organization !== ''
    );

    return valdiateAllFields;
  }, [
    userId,
    password,
    firstName,
    lastName,
    dob,
    gender,
    firstNameErr,
    lastNameErr,
    pinError,
    address,
    state,
    city,
    country,
    phoneNum,
    email,
    experience,
    qualification,
    profilePic,
    phoneNumErr,
    organization
  ]);

  const getCountryList = () => {
    axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
      .then(res => {
        setCountryList(res.data.data);
        // After setting country list, set default country name 'India'
        setCountry('India');
      })
      .catch(err => console.log('Country Error Log', err));
  };

  const handlePhoneNum = (e) => {
    e.preventDefault();

    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumErr(onlyNums.length > 10 ? 'Only 10 digit phone number is allower' : '');
    setPhoneNum(onlyNums);
  };

  const handlePinCode = (e) => {
    e.preventDefault();
    
    const enteredPinNum = e.target.value;
    let pinRegex = new RegExp(/^-?\d*$/).test(enteredPinNum);

    if (!pinRegex && enteredPinNum.length <= 6) {
      setPinError('Please enter valid pin number');
      return;
    } else if (enteredPinNum.length > 6) {
      setPinError('Pin number cannot exceed six digits');
    } else {
      setPinError('');
    }
    setPinCode(enteredPinNum);
  };

  const handleEmpExperience = (e) => setExperience(e.target.value);

  const handleEmpEmail = (e, name='') => {
    e.preventDefault();
    const emailInput = e.target.value;
    const validationEmailInput = new RegExp(/\S+@\S+\.\S+/).test(emailInput);

    if (name == "userId") {
      setUserIdError(!validationEmailInput ? "Please enter valid user Id" : "");
      setUserId(emailInput);
    } else if (name === "workMail") {
      setEmailErr(!validationEmailInput ? "Please enter valid work email" : "");
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
    uploadPicToServer(picFile)
    e.target.value = null;
  };
  
  const uploadPicToServer = (imgFile) => {
    const imageHeaderConfig = {
      headers: { authtoken: JSON.parse(localStorage.getItem('token')) },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      }
    };

    const data = {
      file: imgFile
    }

    axiosInstance
      .post(`${config.API_URL}/api/utility/upload`, data, imageHeaderConfig)
      .then(res => setUploadedImgUrl(res.data.data.fileName))
      .catch(err => setMsgData({
        message: "Error occurred while uploading image",
        type: "error"
      }));
  };

  // Function to reset the Employee Registration Form
  const resetFormFields = () => {
    setSelectEmp('employee');
    setUserId('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setUploadedImgUrl('');
    setDob('');
    setGender('');
    setAbout('');
    setPhoneNum('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('');
    setPinCode('');
    setQualification('');
    setExperience('');
    setProfilePic('');
  };

  const removeProfilePic = (e) => {
    e.preventDefault();
    setProfilePic('');
  };

  const employeeIdGenerator = Math.floor(Math.random() * 10000);

  const submitDetails = () => {
    const empDetails = {
      userType: selectEmp,
      userId: userId,
      password: password,
      userFirstName: firstName,
      userLastName: lastName,
      profileImageName: uploadImgUrl,
      dateOfBirth: dob,
      gender: gender,
      about: about,
      phoneNumber: phoneNum,
      emailId: email,
      address: address,
      city: city,
      state: state,
      pin: pincode,
      country: country,
      qualificationList: qualification,
      experinceInYears: experience,
      isConsultant: false, // Send true in case true
      employeeId: employeeIdGenerator,
      uniqueId: `RAIN-${employeeIdGenerator}`,
      newArticleList: [''],
      department: "",
      organization: organization,
    };

    if (!empFieldValidation) {
      setDisplayErrMsg(true);
      setMsgData({
        message: 'Please provide the necessary details',
        type: 'error'
      });
      return ;
    }

    setDisplayErrMsg(false);
    const headers = {
      authtoken: JSON.parse(localStorage.getItem('token'))
    };

    setLoader(true);
    axios
      .post(`${config.API_URL}/api/partner/employee`, empDetails, { headers })
      .then(res => {
        setLoader(false);
        setMsgData({
          message: "Employee Created Successfully !!!"
        });

        // Reset the form fields
        resetFormFields();
      })
      .catch(err => {
        setLoader(false);
        setMsgData({
          message: !!err.response
            ? err.response.data[0].message
            : 'Error occurred while creating employee',
          type: 'error'
        })
      });
  };

  const handleEmpDob = (e) => {
    e.preventDefault();
    const userEnteredDob = e.target.value;
    const currentDate = new Date();
    const dateInserted = new Date(userEnteredDob);
    if (currentDate.getTime() <= dateInserted.getTime()) {
      setDobErr('DOB cannot be future date');
    } else {
      setDob(userEnteredDob);
      setDobErr('');
    }
  };

  const handleFirstName = (e) => {
    const userInputName = e.target.value;
    const nameRegex = new RegExp('^[a-zA-Z]+$');

    setFirstNameErr(
      (userInputName.length && !nameRegex.test(userInputName))
        ? 'Name alphabet only allowed'
        : ''
    );
    setFirstName(userInputName);
  };

  const handleLastName = (e) => {
    const userInputName = e.target.value;
    const nameRegex = new RegExp('^[a-zA-Z]+$');

    setLastName(userInputName);
    setLastNameErr(
      (userInputName.length &&  !nameRegex.test(userInputName))
        ? 'Name alphabet only allowed'
        : ''
    );
  };

  const handleOrganization = (e) => {
    setOrganization(e.target.value);
  };
 
  return (
    <>
      <hr />
      <div className="doctor-onboarding-main">
        <TextField
          select
          label="Employee Type"
          className="form-auto hospital-unit-label"
          style={{ margin: 4, width: '18%', paddingBottom: 30 }}
          margin="normal"
          variant="filled"
          InputLabelProps={{ shrink: true }}
          value={selectEmp}
          onChange={(e) => setSelectEmp(e.target.value)}
        >
          <MenuItem value="administration"> Administration </MenuItem>
          <MenuItem value="staff"> Staff </MenuItem>
          <MenuItem value="employee"> Employee </MenuItem>
        </TextField>

        <Typography variant="h6">Login Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={7}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          label="User ID"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          placeholder="xyz@gmail.com"
                          value={userId}
                          onChange={(e) => handleEmpEmail(e, "userId")}
                          error={(Boolean(userIdError) || (displayErrMsg && userId === ''))}
                          helperText={userIdError !== ''
                            ? userIdError
                            : (
                                (displayErrMsg && userId === '')
                                  ? 'Please enter User ID'
                                  : ''
                              )
                          }
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          id="title"
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
                          error={(Boolean(passwordError) || (displayErrMsg && password === ''))}
                          helperText={passwordError !== ''
                            ? passwordError
                            : (
                                (displayErrMsg && password === '')
                                  ? 'Please enter Password'
                                  : ''
                              )
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

        <hr />
        <Typography variant="h6">Personal Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div>
              <div className="image profic-pic-emp" id="image">
                <label htmlFor="profilePic" style={{ cursor: "pointer" }}>
                  {profilePic === "" ? (
                    <img src="/icon_feather_camera.svg" className="upload-emp-pic" />
                  ) : (
                      <div style={{ display: 'flex'}}>
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
                <sub
                  style={{ visibility: (displayErrMsg && profilePic === '') ? 'visible' : 'hidden' }}
                  className="profile-pic-validation-message"
                >
                  Please upload the photo
                </sub>
              </div>
              <p
                className={`upload-pic-caption ${(displayErrMsg && profilePic === '') ? 'title-validationerr' : ''}`}
              >
                Upload Photo
              </p>
            </div>
          </Grid>
          <Grid item xs={7}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          label="First Name"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          value={firstName}
                          onChange={handleFirstName}
                          InputLabelProps={{ shrink: true }}
                          error={((displayErrMsg && firstName === '') || Boolean(firstNameErr))}
                          helperText={
                            (displayErrMsg && firstName === '')
                              ? 'Please provide First Name'
                              : Boolean(firstNameErr) ? firstNameErr : ''
                          }
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          label="Last Name"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={lastName}
                          onChange={handleLastName}
                          error={((displayErrMsg && lastName === '') || Boolean(lastNameErr))}
                          helperText={
                            (displayErrMsg && lastName === '')
                              ? 'Please provide Last Name'
                              : Boolean(lastNameErr) ? lastNameErr : ''
                          }
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          required
                          type="date"
                          label="Date of Birth"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={dob}
                          onChange={handleEmpDob}
                          error={(displayErrMsg && dob === '' )|| Boolean(dobErr)}
                          helperText={Boolean(dobErr) ? dobErr : (
                            (displayErrMsg && dob === '')
                              ? 'Please provide Date of Birth'
                              : ''
                          )}
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
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
                          error={displayErrMsg && gender === ''}
                          helperText={
                            (displayErrMsg && gender === '')
                              ? 'Please select Gender'
                              : ''
                          }
                        >
                          <MenuItem disabled value=''>Select Gender</MenuItem>
                          <MenuItem value='M'>Male</MenuItem>
                          <MenuItem value='F'>Female</MenuItem>
                        </TextField>
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          select
                          required
                          label="Organization"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={organization}
                          onChange={handleOrganization}
                          InputLabelProps={{ shrink: true }}
                          error={((displayErrMsg && firstName === '') || Boolean(firstNameErr))}
                          helperText={
                            (displayErrMsg && organization === '')
                              ? 'Please select Organization for the Employee'
                              : ''
                          }
                        >
                          <MenuItem value="0" disabled>Select Hospital Unit</MenuItem>
                          {organizationList.length > 0 &&
                            organizationList.map((data, index) => (
                              <MenuItem key={index} value={data.legalName}>
                                {data.legalName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-full-div">
                        <TextField
                          multiline
                          rows={3}
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
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <hr />

        <Typography variant="h6">Contact Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={7}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          id="title"
                          error={(Boolean(phoneNumErr) || (displayErrMsg && phoneNum === ''))}
                          label="Phone"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label"
                          placeholder="##########"
                          value={phoneNum}
                          onChange={handlePhoneNum}
                          InputLabelProps={{ shrink: true }}
                          helperText={phoneNumErr !== ''
                            ? phoneNumErr
                            : (
                                (displayErrMsg && phoneNum === '')
                                  ? 'Please enter the Phone Number'
                                  : ''
                              )
                          }
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          id="title"
                          error={(Boolean(emailErr) || (displayErrMsg && email === ''))}
                          label="Email"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={email}
                          onChange={(e) => handleEmpEmail(e, 'workMail')}
                          helperText={emailErr !== '' ? emailErr : (
                            (displayErrMsg && email === '')
                              ? 'Please enter the email id'
                              : ''
                          )}
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div" style={{ width: '100%'}}>
                        <TextField
                          required
                          id="title"
                          label="Address"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          error={displayErrMsg && address === ''}
                          helperText={
                            (displayErrMsg && address === '')
                              ? 'Please enter the Address'
                              : ''
                          }
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          select
                          label="State"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type select-field"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          error={(displayErrMsg && state === '')}
                          helperText={
                            (displayErrMsg && state === '')
                              ? 'Please select the State'
                              : ''
                          }
                          >
                            <MenuItem value="">Select State</MenuItem>
                            {
                              stateList.length > 0 && stateList.map((data, index) => (
                                <MenuItem key={index} value={data.stateName}>{data.stateName}</MenuItem>
                              ))
                            }
                        </TextField>
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          select
                          label="City"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type select-field"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          defaultValue="0"
                          error={displayErrMsg && city === ''}
                          helperText={
                            (displayErrMsg && city === '')
                              ? 'Please select the City'
                              : ''
                          }
                        >
                          <MenuItem value="0">Select City</MenuItem>
                          {
                            cityList.length > 0 && cityList.map((data, index) => (
                              <MenuItem key={index} value={data.cityName}>{data.cityName}</MenuItem>
                            ))
                          }
                        </TextField>
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          id="title"
                          label="Postal / PIN Code"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto address-field hospital-unit-label"
                          value={pincode}
                          onChange={handlePinCode}
                          error={Boolean(pinError) || (displayErrMsg && pincode === '')}
                          helperText={pinError !== '' ? pinError : (
                            (displayErrMsg && pincode === '')
                              ? 'Please enter the Pincode'
                              : ''
                          )}
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          select
                          label="Country"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          error={displayErrMsg && country === ''}
                          helperText={
                            (displayErrMsg && country === '')
                              ? 'Please select the Country'
                              : ''
                          }
                        >
                          <MenuItem value="" disabled>Select Country</MenuItem>
                          {
                            countryList.length > 0 && countryList.map((data, index) => (
                              <MenuItem key={index} value={data.name}>{data.name}</MenuItem>
                            ))
                          }
                        </TextField>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <hr />
        <Typography variant="h6">Other Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={3} />
          <Grid item xs={7}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          id="title"
                          select
                          required
                          label="Qualification"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type select-field"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          error={displayErrMsg && qualification === 0}
                          helperText={
                            (displayErrMsg && qualification === 0)
                              ? 'Please select the Qualification'
                              : ''
                          }
                        >
                          <MenuItem disabled value="0">Select Qualification</MenuItem>
                          { 
                            QualificationCollections.map((data, index) => (
                              <MenuItem key={index} value={data}> { data } </MenuItem>
                            ))
                          }
                        </TextField>
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          id="title"
                          label="Experience"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          placeholder="Example: 5.5 years"
                          value={experience}
                          onChange={handleEmpExperience}
                          InputProps={{
                            inputComponent: decimalFormatter,
                          }}
                          error={displayErrMsg && experience === ''}
                          helperText={
                            (displayErrMsg && experience === '')
                              ? 'Please enter the experience'
                              : ''
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
                          
        <div className="action onboarding-action-buttons">
          <Button
            variant="contained"
            className="doctor-onboarding-cancel-btn"
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>

          <Button
            id="submit"
            style={{ color: "#000" }}
            size="small"
            variant="contained"
            onClick={submitDetails}
            className="primary-button forward doctor-save-btn"
            type="button"
          >
            SAVE
          </Button>
        </div>
      </div>
    </>
  )
}
