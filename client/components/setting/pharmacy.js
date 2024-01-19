import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../app.constant';
import { TextField, CircularProgress,  Button, MenuItem } from '@material-ui/core';

export default function Pharmacy(props) {
  const { pharmacyPerm } = props;
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [stateList, setStateList] = useState("");
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState("");
  const [country, setCountry] = useState('India');
  const [pin, setPin] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pinError, setPinError] = useState("");

  // Get state and city list from the api
  useEffect(() => {
    if (stateList === '') {
      axios
      .get(`${config.API_URL}/api/utility/state?countryName=${country}`)
      .then((response) => {
        setStateList(response.data.data);
      })
      .catch((error) => {
        console.log('State list api error (pharmacy)', error);
      });
    }

    if (state !== '') {
      axios
        .get(`${config.API_URL}/api/utility/city?countryName=${country}&stateName=${state}`)
        .then((res) => {
          setCityList(res.data.data);
        })
        .catch((error) => {
          console.log('Error occurred while fetching city list', error);
        });
    }
  }, [stateList, state]);

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
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    console.log("obj: ", obj, "header: ", headers);
    // return false
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
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        console.log(error);
      });
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
          <div className="section-header">Pharmacy</div>
          <div className="infoEle">
            <div style={{ float: "left", width: "45%" }}>
              <div className="infolabel">Name: </div>
              <TextField
                required
                margin="normal"
                variant="filled"
                className="firstField"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                disabled={!pharmacyPerm.editChecked}
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
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                disabled={!pharmacyPerm.editChecked}
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
                // onChange={(e)=>{
                //     setEmail(e.target.value);

                // }}
                onChange={validateEmail}
                error={Boolean(emailError?.email)}
                helperText={emailError?.email}
                disabled={!pharmacyPerm.editChecked}
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
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                disabled={!pharmacyPerm.editChecked}
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
                  setState(e.target.value);
                }}
                disabled={!pharmacyPerm.editChecked}
              >
                <MenuItem disabled value="">Select State</MenuItem>
                {
                  stateList.length && stateList.map((data, index) => (
                      <MenuItem key={index} value={data.stateName}> {data.stateName} </MenuItem>
                    )
                  )
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
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                disabled={!pharmacyPerm.editChecked}
              >
                <MenuItem disabled value="">Select City</MenuItem>
                {
                  cityList.length && cityList.map((data, index) => (
                      <MenuItem key={index} value={data.cityName}> {data.cityName} </MenuItem>
                    )
                  )
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
                disabled={!pharmacyPerm.editChecked}
              />
            </div>

            <div className="hospital-logo-upload">
              <div className="infolabel">Logo: </div>
              <div className="upload-option hospital-logo-field">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateTaxId"
                    disabled={!pharmacyPerm.editChecked}
                  />
                  <label
                    htmlFor="corporateId"
                    className="dragContent drag-content-box"
                    disabled={!pharmacyPerm.editChecked}
                  >
                    <div className="logo-label-field">
                      <div className="upload-icon-pos">
                        <img src="/logo/upload_icon.svg" />
                      </div>
                      <div className="upload-instruction">
                        <p> Drag and drop your Logo Here to Upload </p>
                      </div>
                      <div className="upload-instruction">
                        <Button
                          variant="contained"
                          className="upload-doc-1"
                          disabled={!pharmacyPerm.editChecked}
                        >
                          Or select files to upload
                        </Button>
                      </div>
                    </div>
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
            onClick={submitData}
            disabled={!pharmacyPerm.editChecked}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </>
  );
}
