import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import config from "../../app.constant";
import axios from "axios";
import MessagePrompt from "../messagePrompt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCookies } from "react-cookie";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Header from "../consultationServices/Header";
import 'date-fns';
import { SvgIcon} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HeadBreadcrumbs from "../common/headBreadcrumbs";
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
  },
  head: {
    backgroundColor:"#f6f7fa",
    padding:" 15px 60px"
  },
  title: {
    color:"#4B2994",
    fontSize:"16px",
    fontWeight:"bold"
  },
  breadCrum: {
    color:"#4B2994",
    
  }
}));

function PatientProfile({mobileNo, token}) {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [name, setName] = useState("Geeta Sharma");
  const [nameError, setNameError] = useState("");
  const [mobile, setMobileNo] = useState("9876543210");
  // const [mobile, setMobileNo] = useState(mobileNo);
  const [mobileError, setMobileError] = useState("");
  const [motherName,setMotherName]  = useState("Ratna Sharma");
  const [motherNameError,setMotherNameError]  = useState("");
  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState("Male");
  const [dob, setDob] = useState("10/10/1980");
  const [dobError, setDobError] = useState("");
  const [address, setAddress] = useState("House no - 1435, sector 31, Gurugram, Haryana, - 12302");
  const [addressError, setAddressError] = useState("");
  const [country, setCountry] = useState("India");
  const [countryError, setCountryError] = useState("");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("Haryana");
  const [stateError, setStateError] = useState("");
  const [city, setCity] = useState("Gurugram");
  const [cityError, setCityError] = useState("");
  const [pin, setPin] = useState("123021");
  const [pinError, setPinError] = useState("");
  
  const [email, setEmail] = useState("Geeta.sharma@gmail.com");
  const [emailError, setEmailError] = useState("");
  const [profileImage, setProfileImage] = useState("");

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

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }
  // const getStates = () => {
  //   let url = config.API_URL + "/api/utility/cities?countryName=" + country;
  //   setLoader(true);
  //   axios
  //     .get(url)
  //     .then((response) => {
  //       if (response.data) {
  //         setStateList(response.data);
  //       }
  //       setLoader(false);
  //     })
  //     .catch((err) =>{ 
  //       console.log("err",err)
  //       setMsgData({ message: err.response.data.errors[0].message, type: "error" });
  //       setLoader(false);
  //     });
  // };

  // useEffect(() => {
  //   getStates();
  // }, []);

  const [cityList, setCityList] = useState("");
  // const getCities = () => {
   
  //   let url =
  //     config.API_URL +
  //     "/api/utility/cities?countryName=" +
  //     country +
  //     "&stateName=" +
  //     state;
  //   axios
  //     .get(url)
  //     .then((response) => {
  //       const showcity = [];
  //       if (response.data) {
  //         response.data.map((city) => {
  //           showcity.push(city.name);
  //         });
  //         setCityList(showcity);
  //       }
  //     })
  //     .catch((err) =>{ 
  //       console.log("err",err)
  //       setMsgData({ message: err.response.data.errors[0].message, type: "error" });
  //     });
  // };

  // useEffect(() => {
  //   if (state !== "") {
  //     getCities();
  //   }
  // }, [state]);

  return (
    // createAcount
    <Grid item xs={12} className="showPatientDetails">
      <MessagePrompt msgData={msgData} />
      {/* {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )} */}
      <Header />
      <HeadBreadcrumbs title1={"Profile"} title2 = {""} title3 = {"MyProfile"} mainTitle = {"My Profile"} />
      {/* <div className="createAcountText">
        Create Account
      </div> */}
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
            <div className="fullDiv">
              {/* <div className="profilePic">
                <img src="userPatient.svg" style={{padding:"30%"}} />
              </div> */}
                <img src="face.png" style={{height:"80px"}} />
            </div>
            <div className="fullDiv">
              <TextField
                disabled
                id="Name" 
                // label="Full Name" 
                value={name}
                className="fullDiv"
                error={Boolean(nameError)}
                helperText={nameError}
                style={{background:"#F6F7FA"}}
              />
            </div>
            <div style={{padding:"10px"}}>
              <FormControl className={classes.formControl} style={{background:"#E9EAED"}}>
                <Select
                  // select
                  value="+91"
                  disabled
                  displayEmpty
                  className={classes.countryCode}
                  IconComponent={CustomSvgIcon}
                  style={{background:"#E9EAED"}}
                >
                  <MenuItem value="+91">+91</MenuItem>
                  {/* <MenuItem value="+92">+92</MenuItem>
                  <MenuItem value="+94">+93</MenuItem> */}
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
              </FormControl>
              <TextField
                disabled 
                id="Mobile No" 
                // label="Mobile no"
                disabled
                variant="filled"
                value={mobile}
                style={{width: "calc(100% - 70px)", background:"#F6F7FA", height:"45px", fontSize:"15px", color:"#6B6974"}}
                inputProps={{ 'aria-label': 'Without label' }}
                className="mobileTextField"
              />
            </div>
            <div className="fullDiv">
              <TextField
                disabled 
                id="MotherName" 
                value={motherName}
                className="fullDiv"
                error={Boolean(motherNameError)}
                helperText={motherNameError}
                style={{background:"#F6F7FA"}}
              />
            </div>
            <div className="fullDiv">
              <div className={classes.genderTitle} >Select Gender* </div>
              <div className= "genderDiv"> 
                {/* <span className={gender === "Male" ? "gender selected" : "gender"} onClick={(e)=>setGender("Male")}>Male</span> */}
                <span className={gender === "Female" ? "gender selected" : "gender"} onClick={(e)=>setGender("Female")} style={{color:"#000", fontWeight:"normal", fontSize:"15px"}}>Female</span>
                {/* <span className={gender === "Other" ? "gender selected" : "gender"} onClick={(e)=>setGender("Other")}>Other</span> */}
              </div>
            </div>
            
          </div>
        </Grid>

        <Grid item xs={6} className="gridRight">
          <div className="fullDiv">
            <TextField
              disabled
              id="Email" 
              // label="Email Id" 
              value={email}
              className="fullDiv"
              error={Boolean(emailError?.email)}
              helperText={emailError?.email}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
            <TextField
              disabled
              id="DOB" 
              // label="DOB" 
              value={dob}
              className="fullDiv"
              // type="date"
              error={Boolean(dobError)}
              helperText={dobError}
              InputLabelProps={{
                shrink: true,
              }}
              style={{background:"#F6F7FA"}}
            />
            <img src='calander.svg' style={{position:"absolute", top:"18px", right:"15px"}} />
          </div>
          <div className="fullDiv">
            <TextField
              disabled
              id="Address" 
              // label="Address"
              value={address}
              className="fullDiv"
              error={Boolean(addressError)}
              helperText={addressError}
              style={{background:"#F6F7FA"}}
            />
          </div>

          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
              {/* <InputLabel id="city">City</InputLabel> */}
              <Select
                disabled
                // labelId = "City"
                id = "City"
                value={city}
                displayEmpty
                // 
                inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={CustomSvgIcon}
              >
                <MenuItem value="Gurugram">Gurugram </MenuItem>
                {/* {cityList.length > 0 &&
                  cityList.map((city, id) => (
                    <MenuItem key={"city-" + id} value={city}>
                      {city}
                    </MenuItem>
                  ))} */}
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </div>

          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
            {/* <InputLabel id="State">State</InputLabel> */}
              <Select
                disabled
                // labelId= "State"
                id = "State"
                value={state}
                IconComponent={CustomSvgIcon}
                // className ="SpecialityWrapper"
              >
                <MenuItem value="Haryana">Haryana </MenuItem>
              </Select>
            </FormControl>
          </div>
          
          <div className="fullDiv">
            <TextField
              disabled
              id="Zip" 
              value={pin}
              className="fullDiv"
              error={Boolean(pinError?.pin)}
              helperText={pinError?.pin}
              style={{background:"#F6F7FA"}}
            />
          </div>
          <div className="fullDiv">
            <FormControl className={classes.formControl} style={{background:"#F6F7FA", width:"100%"}}>
              {/* <InputLabel id="Country">Country</InputLabel> */}
              <Select
                disabled
                // labelId = "Country"
                id = "Country"
                value="India"
                // 
                inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={CustomSvgIcon}
              >
                <MenuItem value="India">India</MenuItem>
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PatientProfile
