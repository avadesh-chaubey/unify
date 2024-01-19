import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router, { useRouter } from 'next/router';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import OtpInput from 'react-otp-input';
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from '@material-ui/icons/Check';
import config from "../../app.constant";
import axios from "axios";
import MessagePrompt from "../messagePrompt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCookies } from "react-cookie";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Header from "../consultationServices/Header";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  InputAdornment, SvgIcon
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: "0"
  },
  countryCode:{
    width: "70px",
    height: "40px",
    fontSize: "15px",
    color: "#6B6974",
    marginTop: "5px !important"
  },
  genderTitle: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4d4d4d"
  }
}));

function CreateAccountForm({mobileNo, token,countryCode,setPage}) {
  console.log("countryCode: ",countryCode)
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobile, setMobileNo] = useState(mobileNo);
  const [mobileError, setMobileError] = useState("");
  const [motherName,setMotherName]  = useState("");
  const [motherNameError,setMotherNameError]  = useState("");
  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState("Male");
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [countryIsdList,setCountryIsdList] = useState([]);
  const [hosUnitArr, setHosUnitArr] = useState([]);
  const [hosUID, setHosUID] = useState("");
  function CustomSvgIcon(props) {
    return (
      <SvgIcon {...props} style={{ display: "flex" }}>
        {/* <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /> */}
        <ExpandMoreIcon
          style={{
            top: "calc(50% - 12px)",
            color: "#555555",
            position: "absolute",
            pointerEvents: "none",
          }}
        />
      </SvgIcon>
    );
  }

  useEffect(()=>{
    axios
      .get(config.API_URL + "/api/utility/countryandisd")
      .then((res) => {
        console.log("res: ",res);
        let tempArr = res.data.data;
        tempArr.sort(function(a, b) {
          if(a.countryName < b.countryName) { return -1; }
          if(a.countryName > b.countryName) { return 1; }
          return 0;
          // return b.countryName - a.countryName ;
        });
        // setCountryIsdList(res.data.data);
        setCountryIsdList(tempArr);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });

  },[])
  function ValidateName(name) {
    const {
      target: { value },
    } = event;
    setNameError("");
    setName(value);
    let reg = new RegExp( /^[a-zA-Z ]{2,30}$/).test(value);
    if (!reg) {
      setNameError("Please Enter a Valid Name");
    }
  }
  function ValidateEmail(mail) {
    setEmail(mail.target.value);
    const {
      target: { value },
    } = event;
    setEmailError({ email: "" });
    setEmail(value);
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      setEmailError({ email: "Please enter valid email" });
    }
  }
  function ValidateMotherName(name) {
    const {
      target: { value },
    } = event;
    setMotherNameError("");
    setMotherName(value);
    let reg = new RegExp( /^[a-zA-Z ]{2,30}$/).test(value);
    if (!reg) {
      setMotherNameError("Please Enter a Valid Mother Name");
    }
  }
  function validateDate(date){
    console.log("date: ",date);
    setDobError("");
    setDob(date);
  }
  const handleDateChange = (date) => {
    setDob(date);
  };
  function validateAddress(mail) {
    setAddress(mail.target.value);
    const {
      target: { value },
    } = event;
    setAddressError("");
    setAddress(value);
    let reg = new RegExp( /^[a-zA-Z1-9{,-} ]{2,50}$/).test(value);
    if (!reg) {
      setAddressError("Please Enter a Valid Address");
    }
  }

  function validateZip(inputtxt) {
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only numbers" });
      return false;
    } else {
      setPin(value);
    }
    // if (value.length != 6) {
    //   setPinError({ pin: "It must be of six digits" });
    // }
  }
  useEffect(() => {
    
  }, [])
  const getStates = () => {
    let url = config.API_URL + "/api/utility/state?countryName=" + country;
    setLoader(true);
    axios
      .get(url)
      .then((response) => {
        console.log("state List: ",response.data);
        if (response.data) {
          setStateList(response.data.data);
        }
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  };

  useEffect(() => {
    let url =
      config.API_URL +
      "/api/utility/country";
    axios
      .get(url)
      .then((response) => {
       console.log("response country: ", response);
       console.log("countryCode: ",countryCode)
       let selectedCountry = response.data.data.filter((item)=>{
         return item.phoneCode === countryCode
       })
       console.log("selectedCountry: ",selectedCountry)
       setCountry(selectedCountry[0].countryName)
       setCountryList(response.data.data);
      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  }, [])
  useEffect(() => {
    if (country !== "") {
      getStates();
    }
  }, [country]);

  const [cityList, setCityList] = useState("");
  const getCities = () => {
   
    let url =
      config.API_URL +
      "/api/utility/city?countryName=" +
      country +
      "&stateName=" +
      state;
    axios
      .get(url)
      .then((response) => {
        console.log("city response: ",response)
        const showcity = [];
        if (response.data) {
          setCityList(response.data.data);
        }
      })
      .catch((err) =>{ 
        console.log("err",err)
        // setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  };

  useEffect(() => {
    if (state !== "") {
      getCities();
    }
  }, [state]);
  
  useEffect(()=>{
    axios
      .get(config.API_URL + "/api/patient/hospitalunit")
      .then((res) => {
        console.log("res hospitalunit: ",res);
        setHosUnitArr(res.data.data);
      })
      .catch((err) =>{ 
        console.log("err hospitalunit",err)
      });

  },[])
  const onHospitalChange = (value) =>{
    console.log("onHospitalChange: ",value);
    setHosUID(value)
  }
  const uploadProfile = (e) => {
    let imageUrl;
    e.preventDefault();
    // setUploading(true);
    let newVal = e.target.value.replace(/^.*[\\\/]/, "");
    // console.log("newVal: ", newVal);
    setProfileImage(
      URL.createObjectURL(document.getElementById("profilePic").files[0])
    );
    let file = document.getElementById("profilePic").files[0];
    let timestamp = new Date().getTime();
    let fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    let filename = "";
    filename = "docProfile/" + timestamp + "_" + fileRe;
    console.log(
      "sdjhf: ",
      URL.createObjectURL(document.getElementById("profilePic").files[0])
    );
    return false;
    setProfileImageFileName(filename);
    console.log("fileName", filename);
  };

  const uploadProfileImages = () => {
    
    console.log("object ", document.getElementById("profilePic").files[0]);
    if (document.getElementById("profilePic").files[0] === undefined) {
      submitEditDetails(profileImage);
    } else {
      let imageUrl = null;
      var model = {
        file: document.getElementById("profilePic").files[0],
      };
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "cookieVal") {
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
          imageUrl = response.data.fileName;
          submitEditDetails(imageUrl);
          setLoader(false);
        })
        .catch((err) => {
          console.log("err", err);
          props.setMsgData({
            message: err.response.data.errors[0].message,
            type: "error",
          });
          setLoader(false);
        });
    }
  };

  const registerBtn = () =>{
    console.log("##### ",name,mobile,email,language,gender,dob,"hosUID :",hosUID, "countryCode:",countryCode)
    if (
      name === "" ||
      hosUID === "" ||
      email === "" ||
      motherName === "" ||
      address === "" ||
      pin === "" ||
      city === "" ||
      state === "" 
    ) {
      console.log("All fields are required");
      setMsgData({ message: "All fields are required", type: "error" });
      return false;
    }
    if(name.length < 2){
      setNameError("Name must be more than two character");
      setMsgData({ message: "Name must be more than two character", type: "error" });
      return false;
    }
    if(motherName.length < 2){
      setMotherNameError("Name must be more than two character");
      setMsgData({ message: "Name must be more than two character", type: "error" });
      return false;
    }
    if(dob === ""){
      setDobError("Enter your DOB");
      setMsgData({ message: "All fields are required", type: "error" });
      return false
    }
    let data = {
      userFullName: name,
      phoneNumber: `${countryCode}-${mobile}`,
      age: dob,
      emailId: email,
      gender: gender,
      userMotherName: motherName,
      token: token,
      address: address,
      city:city,
      state:state,
      country: country,
      pin:pin,
      // organizationUID: 4,
      isMobileClient:true,
      ownerOrganisationUID: hosUID,

    }
    console.log("data: ", data);
    setLoader(true);
    // setLoader(false);
    // return false;
    axios
      .post(config.API_URL + "/api/users/patientsignup", data)
      .then((res) => {
        console.log("res: ",res)
        localStorage.setItem("userDetails",JSON.stringify(res.data.data));
        if (res.data.data.token) {
          if (process.browser) {
            setCookie("cookieVal", res.data.data.token, { path: "/" });
            // router.push("/home")
          }
        }
        // let response = res.data;
        //   firebase
        //   .auth()
        //   .signInWithEmailAndPassword(response.emailId, response.emailId)
        //   .then((user) => {

        //     if (firebase) {
        //       console.log('firebase authentication done');
        //       console.log("user.user.uid: ",user.user.uid)
        //       localStorage.setItem("UUID", JSON.stringify(user.user.uid));
        //       // Call api for uid while login
        //       const data = {
        //         userId: response.id,
        //         uid: user.user.uid,
        //       };

        //       const headers = {
        //         authtoken: response.token,
        //       };

        //       axios
        //         .post(config.API_URL + "/api/notification/uid/update", data, {
        //           headers,
        //         })
        //         .then((res) => {
        //           console.log('Updated UID successfully! and redirect to app list');
        //           router.push("/home");
        //         })
        //         .catch((err) => console.log("error occured while notifying to server (1) "));

        //       console.log('Create instance of firebase messaging!');
        //       const messaging = firebase.messaging();
        //       messaging
        //         .requestPermission()
        //         .then(() => {
        //           console.log('firebase messaging request approved');
        //           // return messaging.getToken()
        //           return messaging.getToken({
        //             vapidKey: process.env.vapidKey,
        //           });
        //         })
        //         .then((token) => {
        //           const headers = {
        //             authtoken: response.token,
        //           };
        //           let data = {
        //             uuid: user.user.uid,
        //             token: token,
        //             voiptoken: "",
        //             deviceType: "chrome",
        //           };

        //           axios
        //             .post(
        //               config.API_URL + "/api/notification/token/update",
        //               data,
        //               {
        //                 headers,
        //               }
        //             )
        //             .then((res) => {
        //               console.log('notification token update');
        //               console.log("test 2", res);
        //             })
        //             .catch((err) =>
        //               console.log("error occured while notifying to server (2)")
        //             );
        //         })
        //         .catch((err) => {
        //           console.log('firebase messaging error occurred');
        //           console.log("error: ", err);
        //           console.log('--------------------');
        //         });
        //     }
        //     console.log('about to redirect you app list page');
        //     // On successful authetication redirect the user to appointment-list page
        //     router.push("/home")
        //   })
        //   .catch((error) => {
        //     console.log('error occurred while create account');
        //   });
        // localStorage.removeItem("userMobile");
        // router.push("/home");
        setPage(3);
        // setLoader(false);

      })
      .catch((err) =>{ 
        console.log("err",err)
        setMsgData({ message: err.response.data[0].message, type: "error" });
        setLoader(false);
      });
  }
  const selectGender = (val) =>{
    console.log("selectGender ",val);
    setGender(val);
  }
  return (
    <Grid item xs={12} className="createAcount">
      <MessagePrompt msgData={msgData} />
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {/* <Header /> */}
      {/* <div className="createAcountText">
        Create Account
      </div> */}
      
      <HeadBreadcrumbs
        titleArr={["Login"]}
        lastTitle = {"Register"}
        mainTitle={"Register"}
        
      />
      <Grid
        container
        // spacing={0}
        spacing={3}
        // direction="column"
        // alignItems="center"
        // justify="center"
      >

        <Grid item xs={6} className="gridLeft">
          {/* <Paper className={classes.paper}>xs=6</Paper> */}
          <div style={{margin:"10px"}}>
            {/* <div className="fullDiv">
              <div className="profilePic">
                {profileImage=== "" ? <img src="userPatient.svg" style={{padding:"30%"}} /> 
                : 
                <img src={profileImage} className="profileImage" />
                }
                
                <label htmlFor="profilePic" style={{ cursor: "pointer" }}>
                <img src="camera.svg" className="cameraIcon"/>

                </label>
                <input
                  // required
                  accept="image/x-png,image/jpeg"
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={uploadProfile}
                  style={{ display: "none" }}
                />
              </div>

              <div className="image" id="image">
                
              </div>
            </div> */}
            <div className="fullDiv">
              <TextField 
                required
                id="Name" 
                label="Full Name" 
                value={name}
                className="fullDiv"
                onChange = {ValidateName}
                error={Boolean(nameError)}
                helperText={nameError}
                style={{background:"#F6F7FA"}}
              />
            </div>
            <div style={{padding:"10px"}}>
              <FormControl className={classes.formControl} style={{background:"#F6F7FA"}}>
                <Select
                  // select
                  value={countryCode}
                  // onChange={handleChange}
                  disabled
                  displayEmpty
                  className={classes.countryCode}
                  IconComponent={CustomSvgIcon}
                  renderValue={(value) => `${value}`}

                  // style={{width: "70px ", height:"40px", fontSize:"15px", color:"#6B6974",margin:"0px", marginTop:"5px !important"}}
                >
                  {countryIsdList.length > 0 &&
                    countryIsdList.map((item, i) => (
                      <MenuItem key={"code-" + i} value={item.phoneCode}>
                        {`${item.phoneCode}  ${item.countryName} `}
                      </MenuItem>
                    ))}
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
              </FormControl>
              <TextField 
                id="Mobile No" 
                // label="Mobile no"
                disabled
                variant="filled"
                value={mobile}
                style={{width: "calc(100% - 70px)", background:"#F6F7FA", height:"45px", fontSize:"15px", color:"#6B6974"}}
                // error={Boolean(mobileError?.phone)}
                // helperText={mobileError?.phone}
                // onChange = {handelPhoneNumber}
                inputProps={{ 'aria-label': 'Without label' }}
                className="mobileTextField"
              />
            </div>
            <div className="fullDiv">
              <TextField 
                required
                id="MotherName" 
                label="Mother's Name" 
                value={motherName}
                className="fullDiv"
                // type="date"
                onChange = {ValidateMotherName}
                error={Boolean(motherNameError)}
                helperText={motherNameError}
                style={{background:"#F6F7FA"}}
              />
            </div>
            <div className="fullDiv">
              <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
              <InputLabel id="unit">Hospital Unit*</InputLabel>
                <Select
                  required
                  // select
                  labelId= "unit"
                  id = "unit"
                  onChange={(e) => onHospitalChange(e.target.value)}
                  IconComponent={CustomSvgIcon}
                >
                  {hosUnitArr.map((item)=>(
                    <MenuItem value={item.ownerOrganisationUID}>{item.branch}</MenuItem>
                  ))}
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
              </FormControl>
            </div>
            <div className="fullDiv">
              <div className={classes.genderTitle} >Select Gender* </div>
              <div className= "genderDiv"> 
                <span className={gender === "Male" ? "gender selected" : "gender"} onClick={(e)=>setGender("Male")}>Male</span>
                <span className={gender === "Female" ? "gender selected" : "gender"} onClick={(e)=>setGender("Female")}>Female</span>
                <span className={gender === "Other" ? "gender selected" : "gender"} onClick={(e)=>setGender("Other")}>Other</span>
              </div>
            </div>
            
          </div>
        </Grid>

        <Grid item xs={6} className="gridRight">
          <div className="fullDiv">
            <TextField 
              required
              id="Email" 
              label="Email Id" 
              value={email}
              className="fullDiv"
              error={Boolean(emailError?.email)}
              helperText={emailError?.email}
              onChange={ValidateEmail}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              // disableToolbar
              // variant="inline"
              format="dd/MM/yyyy"
              // margin="normal"
              id="date-picker-inline"
              label="DOB"
              value={dob}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              className="fullDiv"
              style={{background:"#F6F7FA"}}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </MuiPickersUtilsProvider> */}
            <TextField 
              required
              id="DOB" 
              label="DOB" 
              value={dob}
              className="fullDiv"
              type="date"
              onChange = {(e)=>validateDate(e.target.value)}
              // onChange = {(e)=>{setDob(e.target.value)}}
              error={Boolean(dobError)}
              helperText={dobError}
              InputLabelProps={{
                shrink: true,
              }}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
            <TextField 
              required
              id="Address" 
              label="Address"
              value={address}
              className="fullDiv"
              error={Boolean(addressError)}
              helperText={addressError}
              onChange = {validateAddress}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
            <InputLabel id="State">State</InputLabel>
              <Select
                required
                // select
                labelId= "State"
                id = "State"
                value={state}
                // onChange={handleChange}
                onChange={(e) => setState(e.target.value)}
                // displayEmpty
                // 
                // inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={CustomSvgIcon}
                // className ="SpecialityWrapper"
              >
                {console.log("stateList: ",stateList)}
                {stateList.length > 0 &&
                  stateList.map((state, id) => (
                    <MenuItem key={"state-" + id} value={state.stateName}>
                      {state.stateName}
                    </MenuItem>
                  ))}
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </div>

          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
              <InputLabel id="city">City</InputLabel>
              <Select
                required
                labelId = "City"
                id = "City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                displayEmpty
                // 
                inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={CustomSvgIcon}
              >
                {cityList.length > 0 &&
                  cityList.map((cityItem, id) => (
                    <MenuItem key={"cityItem-" + id} value={cityItem.cityName}>
                      {cityItem.cityName}
                    </MenuItem>
                  ))}
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </div>
          
          <div className="fullDiv">
            <TextField 
              required
              id="Zip" 
              label="Zip"
              value={pin}
              className="fullDiv"
              error={Boolean(pinError?.pin)}
              helperText={pinError?.pin}
              onChange = {validateZip}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
              <InputLabel id="Country">Country</InputLabel>
              <Select
                required
                labelId = "Country"
                id = "Country"
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
              
                displayEmpty
                // 
                inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={CustomSvgIcon}

              >
                {countryList.length > 0 &&
                  countryList.map((countryItem, id) => (
                    <MenuItem key={"country-" + id} value={countryItem.countryName}>
                      {countryItem.countryName}
                    </MenuItem>
                  ))}
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </div>
        
          <div style={{textAlign:"center", margin:"20px 10px",float:"right"}}>
            <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="mainBtn"
                onClick={registerBtn}
                style={{width:"220px"}}
              >
                Register
              </Button>
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CreateAccountForm
