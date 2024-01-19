import React, {useState, useEffect, useReducer} from 'react';
import axios from 'axios';
import config from '../../app.constant';
import { TextField, CircularProgress, Button, Grid, MenuItem } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

export default function HospitalInfoTab(props) {
  const { hospitalInfoPerm } = props;
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("select");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pinError, setPinError] = useState("");
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [country, setCountry] = useState('India');
  

  const [registerOffice, setRegisterOffice] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      name: '',
      phoneNum: '',
      email: '',
      address: '',
      state: '',
      stateList: '',
      city: '',
      cityList: '',
      pinNum: '',
      officialLogo: ''
    }
  );

  // Get state and city list from the api

  useEffect(() => {
    setLoader(true);
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    axios
      .get(`${config.API_URL}/api/utility/state?countryName=${country}`)
      .then((response) => {
        setStateList(response.data.data);
        setRegisterOffice({ stateList: response.data.data });
      })
      .catch((error) => {
        console.log('State list api error', error);
      });

    axios
      .get(config.API_URL + `/api/patient/fixedprices`, {
        headers,
      })
      .then((res) => {
        setLoader(false);

        const resData = res.data.data;
        setName(resData.hospitalName);
        setPhone(resData.hospitalPhoneNumber);
        setEmail(resData.hospitalEmail);
        setAddress(resData.hospitalAddress);
        setState(resData.hospitalState);
        setCity(resData.hospitalCity);
        setPin(resData.hospitalPincode);
      })
      .catch((error) => {
        setLoader(false);
        props.setMsgData({
          message: error.response.data[0].data.message,
          type: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (state !== 'select') {
      // Fetch all cities based on state
      axios
        .get(`${config.API_URL}/api/utility/city?countryName=${country}&stateName=${state}`)
        .then((res) => {
          setCityList(res.data.data);
        })
        .catch((error) => {
          console.log('Error occurred while fetching city list', error);
        });
    }
    
    if (registerOffice.state !== '') {
      axios
        .get(`${config.API_URL}/api/utility/cities?countryName=${country}&stateName=${registerOffice.state}`)
        .then((res) => {
          console.log('reg city list', res.data);
          const showcity = [];
          res.data.map((city) => showcity.push(city.name));
          
          setRegisterOffice({ cityList: showcity });
        })
        .catch((error) => {
          console.log('Error occurred while fetching register office city list', error);
        });
    }
  }, [state, registerOffice.state]);

  const validateEmail = (e, mail) => {
    setEmail(mail.target.value);
    const {
      target: { value },
    } = e;
    setEmailError({ email: "" });
    setEmail(value);
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      setEmailError({ email: "Please enter valid email" });
    }
  };

  const validateRegisterOffEmail = (e, mail) => {
    const {
      target: { value },
    } = e;
    // setEmailError({ email: "" });

    setRegisterOffice({ email: value });
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      // setEmailError({ email: "Please enter valid email" });
    }
  };

  const pinValidate = (e, inputtxt) => {
    const {
      target: { value },
    } = e;
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
  };

  const pinValidateRegOff = (e, inputtxt) => {
    const {
      target: { value },
    } = e;
    // setPinError({ pin: "" });

    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      // setPinError({ pin: "Please enter only numbers" });
    } else {
      setRegisterOffice({ pin: value });
    }
    if (value.length > 6) {
      // setPinError({ pin: "It must be of six digits" });
    }
  };

  const submitData = () => {
    let obj = {
      hospitalName: name,
      hospitalPhoneNumber: phone,
      hospitalEmail: email,
      hospitalAddress: address,
      hospitalState: state,
      hospitalCity: city,
      hospitalPincode: pin,
    };

    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };

    setLoader(true);
    axios
      .post(config.API_URL + "/api/patient/fixedprices", obj, {
        headers,
      })
      .then((response) => {
        setLoader(false);
        console.log(response.data);
        // alert.show("Roster Updated", { type: "success" });
        props.setMsgData({ message: "Setting Updated", type: "success" });
      })
      .catch((error) => {
        setLoader(false);
        console.log('error while saving', error.response);
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        console.log(error);
      });
  };

  const [hospitalLogo, setHospitalLogo] = useState('');
  const [hospitalLogoName, setHospitalLogoName] = useState('');
  const [regOffLogo, setRegOffLogo] = useState('');
  const [regOffLogoName, setRegOffLogoName] = useState('');

  const handleLogoChanges = (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('userDetails')).id;
    const file = e.target.files[0];
    const fileRe = file.hasOwnProperty('name') ? file.name.replace(/[^a-zA-Z.]/g, "") : 'default';
    const timestamp = new Date().getTime();
    const filename = "agency/" + userId + "/" + timestamp + "_" + fileRe;

    setHospitalLogoName(filename);
    setHospitalLogo(URL.createObjectURL(file));
  };

  const deleteHospitalLogo = (e) => {
    e.preventDefault();
    setHospitalLogoName('');
    setHospitalLogo('');
  };

  const handleRegLogoChanges = (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('userDetails')).id;
    const file = e.target.files[0];
    const fileRe = file.hasOwnProperty('name') ? file.name.replace(/[^a-zA-Z.]/g, "") : 'default';
    const timestamp = new Date().getTime();
    const filename = "agency/" + userId + "/" + timestamp + "_" + fileRe;

    setHospitalLogoName(filename);
    setHospitalLogo(URL.createObjectURL(file));
  };

  const deleteRegLogo = (e) => {
    e.preventDefault();
    setHospitalLogoName('');
    setHospitalLogo('');
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <div className="setting">
        {/* style={{borderRight:'1px solid #ccc'}} */}
        <div className="hospitalInfo">
          <div className="section-header">Hospital Information</div>
          <div className="infoEle">
            <div style={{ float: "left", width: "45%" }}>
              <div className="infolabel">Name: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">Phone: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "30%" }}>
              <div className="infolabel">Email: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={email}
                onChange={validateEmail}
                error={Boolean(emailError?.email)}
                helperText={emailError?.email}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
          </div>

          <div className="infoEle">
            <div style={{ float: "left", width: "45%" }}>
              <div className="infolabel">Address: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">State: </div>
              <TextField
                select
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={state}
                onChange={(e) => {
                  // Reset the value of city while changing the state
                  setCity('');
                  setState(e.target.value);
                }}
                disabled={!hospitalInfoPerm.editChecked}
              >
                <MenuItem disabled value="select"> Select State </MenuItem>
                {
                  stateList.length && stateList.map((data, index) => (
                    <MenuItem key={index} value={data.stateName}>{data.stateName}</MenuItem>
                  ))
                }
              </TextField>
            </div>
            <div style={{ float: "left", width: "30%" }}>
              <div className="infolabel">City: </div>
              <TextField
                select
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!hospitalInfoPerm.editChecked}
              >
                {
                  !cityList.length && (
                    <MenuItem disabled value={city}> {city} </MenuItem>
                  )
                }
                
                {
                  cityList.length && cityList.map((data, index) => (
                    <MenuItem key={index} value={data.cityName}> {data.cityName} </MenuItem>
                  ))
                }
              </TextField>
            </div>
          </div>
          <div className="infoEle">
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">Pin: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={pin}
                // onChange={(e)=>{
                //     setPin(e.target.value);

                // }}
                onChange={pinValidate}
                error={Boolean(pinError?.pin)}
                helperText={pinError?.pin}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>

            <div className="hospital-logo-upload">
              <div className="infolabel">Logo: </div>
              <div className="upload-option hospital-logo-field">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateId"
                    onChange={handleLogoChanges}
                    disabled={!hospitalInfoPerm.editChecked}
                  />
                  <label
                    htmlFor="corporateId"
                    className={`dragContent drag-content-box ${hospitalLogo !== ''? 'hide-upload-logo-label': ''}`}
                  >
                    {
                      !!(hospitalLogo === '') && (
                        <div className="logo-label-field">
                          <div className="upload-icon-pos">
                            <img src="/logo/upload_icon.svg" />
                          </div>
                          <div className="upload-instruction">
                            <p> Drag and drop your Logo Here to Upload </p>
                          </div>
                          <div className="upload-instruction">
                            <Button
                              disabled
                              variant="contained"
                              className="upload-doc-1 upload-logo-btn"
                              disabled={!hospitalInfoPerm.editChecked}
                            >
                              Or select files to upload
                            </Button>
                          </div>
                        </div>
                      )
                    }
                  </label>
                  {
                    !!(hospitalLogo !== '') && (
                      // <div className="change-file label-img-div">
                      //   <img
                      //     src={hospitalLogo}
                      //     className="label-upload-img logo-img-upload"
                      //   />
                      //   <div
                      //     className="delete-opt"
                      //     onClick={deleteHospitalLogo}
                      //   >
                      //     <Grid item xs={8}>
                      //       <DeleteOutlinedIcon />
                      //     </Grid>
                      //   </div>
                      // </div>
                      <div className="img-preview-div">
                        <img id="ImgPreview" src={hospitalLogo} className="preview1 img-spec" />
                        <div
                          id="removeImage1"
                          className="rmv"
                          onClick={deleteHospitalLogo}
                          disabled={!hospitalInfoPerm.editChecked}
                        >
                          <Grid item xs={8}>
                            <DeleteOutlinedIcon className="del-icon" />
                          </Grid>
                        </div>
                      </div>
                    )
                  }
                </div>
            </div>
          </div>
        </div>

        <div className="hospitalInfo">
          <div className="section-header">Register Office</div>
          <div className="infoEle">
            <div style={{ float: "left", width: "45%" }}>
              <div className="infolabel">Name: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.name}
                onChange={(e) => {
                  setRegisterOffice({name: e.target.value});
                }}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">Phone: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.phoneNume}
                onChange={(e) => {
                  setRegisterOffice({phoneNum: e.target.value});
                }}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "30%" }}>
              <div className="infolabel">Email: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.email}
                // onChange={(e)=>{
                //     setEmail(e.target.value);

                // }}
                onChange={validateRegisterOffEmail}
                error={Boolean(emailError?.email)}
                helperText={emailError?.email}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
          </div>

          <div className="infoEle">
            <div style={{ float: "left", width: "45%" }}>
              <div className="infolabel">Address: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.address}
                onChange={(e) => setRegisterOffice({ address: e.target.value })}
                disabled={!hospitalInfoPerm.editChecked}
              />
            </div>
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">State: </div>
              <TextField
                select
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.state}
                defaultValue="select"
                onChange={(e) => setRegisterOffice({ state: e.target.value })}
                disabled={!hospitalInfoPerm.editChecked}
              >
                <MenuItem disabled value="select"> Select State </MenuItem>
                {
                  stateList.length && stateList.map((data, index) => (
                    <MenuItem key={index} value={data.stateName}>{data.stateName}</MenuItem>
                  ))
                }
              </TextField>
            </div>
            <div style={{ float: "left", width: "30%" }}>
              <div className="infolabel">City: </div>
              <TextField
                select
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.city}
                defaultValue="select"
                onChange={(e) => setRegisterOffice({ city: e.target.value })}
                disabled={!hospitalInfoPerm.editChecked}
              >
                <MenuItem disabled value="select"> Select City </MenuItem>
                {
                  registerOffice.cityList.length && registerOffice.cityList.map((data, index) => (
                    <MenuItem key={index} value={data.cityName}> {data.cityName} </MenuItem>
                  ))
                }
              </TextField>
            </div>
          </div>
          <div className="infoEle">
            <div style={{ float: "left", width: "25%" }}>
              <div className="infolabel">Pin: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={registerOffice.pin}
                onChange={pinValidateRegOff}
                disabled={!hospitalInfoPerm.editChecked}
                // error={Boolean(pinError?.pin)}
                // helperText={pinError?.pin}
              />
            </div>

            <div className="hospital-logo-upload">
              <div className="infolabel">Logo: </div>
              <div className="upload-option hospital-logo-field">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateId"
                    onChange={handleRegLogoChanges}
                    disabled={!hospitalInfoPerm.editChecked}
                  />
                  <label
                    htmlFor="corporateId"
                    className="dragContent drag-content-box"
                    disabled={!hospitalInfoPerm.editChecked}
                  >
                    {
                      regOffLogoName === '' ? (
                        <div className="logo-label-field">
                          <div className="upload-icon-pos">
                            <img src="/logo/upload_icon.svg" />
                          </div>
                          <div className="upload-instruction">
                            <p> Drag and drop your Logo Here to Upload </p>
                          </div>
                          <div className="upload-instruction">
                            <Button disabled variant="contained" className="upload-doc-1 upload-logo-btn">
                              Or select files to upload
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="change-file label-img-div">
                          <img
                            src={hospitalLogo}
                            className="label-upload-img logo-img-upload"
                          />
                          <div
                            className="delete-opt"
                            onClick={deleteRegLogo}
                          >
                            <Grid item xs={8}>
                              <DeleteOutlinedIcon />
                            </Grid>
                          </div>
                        </div>
                      )
                    }
                  </label>
                </div>
            </div>
          </div>
        </div>

        <div className="action">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button forward settingBtn"
            // type="submit"
            onClick={submitData}
            disabled={!hospitalInfoPerm.editChecked}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </>
  );
}
