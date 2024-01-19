import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from "@material-ui/icons/Check";
import relationArr from "../../data/relation.json";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 650,
    // float: "left",
    width: "100%",
    // margin: "0 14px",
    // textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  label: {
    margin: 6,
  },
}));

function AddFamilyMember(props) {
  // console.log("props in add family:",props);
  const classes = useStyles();
  const [cookies, getCookie] = useCookies(["name"]);
  const [famList, setFamList] = useState([]);
  const [fName, setFName] = useState("");
  const [fNameError, setfNameError] = useState("");
  const [lName, setLName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [language, setLanguage] = useState([]);
  const [gender, setGender] = useState("male");
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFileName, setProfileImageFileName] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [relationList, setRelationList] = useState([]);
  const [relation, setRelation] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getLanguages();
  }, []);
  let patientData = props.patientData;
  useEffect(() => {
    if (props.patientData && props.patientData.id) {
      setFName(patientData.userFirstName);
      setLName(patientData.userLastName);
      setDob(patientData.dateOfBirth);
      setEmail(patientData.emailId);
      setLanguage(patientData.languages);
      setGender(patientData.gender);
      // setCountry(patientData.userFirstName);
      // setStateList(patientData.userFirstName);
      setState(patientData.state);
      setCity(patientData.city);
      setRelation(patientData.relationship);
      setPin(patientData.pin);
      setAddress(patientData.address);
      setProfileImage(patientData.profileImageName);
    }
  }, [props.patientData]);
  useEffect(() => {
    // if(gender ==="male"){
    //   setRelationList(relationArr.relaton_male)
    // }
    if (gender === "female") {
      setRelationList(relationArr.relaton_female);
    } else {
      setRelationList(relationArr.relaton_male);
    }
  }, [gender]);

  const getStates = () => {
    let url = config.API_URL + "/api/utility/cities?countryName=" + country;
    setLoader(true);
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setStateList(response.data);
        }
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
  };

  useEffect(() => {
    getStates();
  }, []);

  const [cityList, setCityList] = useState("");
  const getCities = () => {
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
          response.data.map((city) => {
            showcity.push(city.name);
          });
          setCityList(showcity);
        }
      })
      .catch((err) => {
        console.log("err", err);
        props.setMsgData({
          message: err.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  useEffect(() => {
    if (state !== "") {
      getCities();
    }
  }, [state]);

  const [lang, setLang] = useState([]);
  const getLanguages = () => {
    let url = config.API_URL + "/api/utility/languages";
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          const langnames = [];
          response.data.forEach((element) => {
            langnames.push(element.name);
          });
          setLang(langnames);
        }
      })
      .catch((err) => {
        console.log("err", err);
        props.setMsgData({
          message: err.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  const handleLanguage = (value) => {
    if (value.length < 4) {
      setLanguage(value);
    } else {
      // props.setMsgData({ message: "You can select maximum 3 languages", type: "error" });
      console.log("You can select maximum 3 languages");
    }
  };
  function fNameValidate(inputText) {
    setFName(inputText.target.value);
    const {
      target: { value },
    } = event;
    setfNameError({ fName: "" });
    setFName(value);
    // let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    // if (!reg) {
    //   setfNameError({ email: "Please enter valid Name" });
    // }
    if (value.length < 2) {
      setfNameError({ fName: "Name must be more than two character" });
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
  }
  const uploadProfile = (e) => {
    let imageUrl;
    e.preventDefault();
    setUploading(true);
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
    setProfileImageFileName(filename);
    console.log("fileName", filename);
  };

  const uploadProfileImages = () => {
    if (patientData.relationship != "self") {
      submitEditDetails("");
      return false;
    }
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

  const submitFamilyDetails = () => {
    console.log("submitFamilyDetails");
    if (fName.length < 2) {
      setfNameError({ fName: "Name must be more than two character" });
      props.setMsgData({
        message: "Name must be more than two character",
        type: "error",
      });
      return false;
    }
    if (
      fName == "" ||
      address == "" ||
      city == "" ||
      state == "" ||
      dob == "" ||
      email == "" ||
      language == "" ||
      relation == "" ||
      pin == ""
    ) {
      props.setMsgData({ message: "All fields are required", type: "error" });
      return false;
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "cookieVal") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    let obj = {
      address: address,
      city: city,
      dateOfBirth: dob,
      emailId: email,
      gender: gender,
      languages: language,
      pin: pin,
      relationship: relation,
      state: state,
      userFirstName: fName,
      userLastName: lName,
    };
    console.log("obj: ", obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/patient/addfamilymember", obj, {
        headers,
      })
      .then((res) => {
        console.log("res: ", res);
        props.handleClose();
        props.setResetList(res.data);
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
  };
  const submitEditDetails = (imageUrl) => {
    console.log("submitEditDetails");
    if (fName.length < 2) {
      setfNameError({ fName: "Name must be more than two character" });
      props.setMsgData({
        message: "Name must be more than two character",
        type: "error",
      });
      return false;
    }
    if (
      fName == "" ||
      address == "" ||
      city == "" ||
      state == "" ||
      dob == "" ||
      email == "" ||
      language == "" ||
      relation == "" ||
      pin == ""
    ) {
      props.setMsgData({ message: "All fields are required", type: "error" });
      return false;
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "cookieVal") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    let obj = {
      address: address,
      city: city,
      dateOfBirth: dob,
      emailId: email,
      gender: gender,
      languages: language,
      pin: pin,
      relationship: relation,
      state: state,
      userFirstName: fName,
      userLastName: lName,
      memberId: patientData.relationship === "self" ? "" : patientData.id,
      profileImageName: imageUrl,
    };
    console.log("obj: ", obj);

    let url =
      patientData.relationship === "self"
        ? "/api/patient/selfprofiledata"
        : "/api/patient/familymemberprofiledata";
    console.log("url: ", url);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + url, obj, {
        headers,
      })
      .then((res) => {
        console.log("res: ", res);
        localStorage.setItem("patientData", JSON.stringify(res.data));
        props.setUpdate(res.data);
        props.handleClose();
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
  };
  const findFirstLetter = (name1, name2) => {
    var str = name1 + " " + name2;
    var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
    var acronym = matches.join(""); // JSON
    return acronym;
  };
  return (
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {props.patientData && props.patientData.relationship === "self" && (
        <div className="avtar">
          {/* <FormLabel
              component="legend"
              className={
                "dragImage" +
                (errMsg && profileImage === "" ? "err" : "")
              }
            >
              Photo *
            </FormLabel> */}
          <div className="image" id="image">
            <label htmlFor="profilePic" style={{ cursor: "pointer" }}>
              <Avatar
                alt="Remy Sharp"
                src="/broken-image.jpg"
                style={{
                  backgroundImage: "linear-gradient(-40deg, #7f368c, #c6141d)",
                  height: "150px",
                  width: "150px",
                  fontSize: "50px",
                  marginLeft: "30%",
                }}
              >
                {Image === "" || profileImage === "NA" ? (
                  <span>
                    {findFirstLetter(
                      patientData.userFirstName,
                      patientData.userLastName
                    )}
                  </span>
                ) : (
                  // <img src={profileImage} />
                  <img
                    src={
                      uploading !== true
                        ? `${config.API_URL}/api/utility/download/` +
                          profileImage
                        : profileImage
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Avatar>
              <img className="small-icon" src="editImage.svg" />
            </label>
            <input
              // required
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={uploadProfile}
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}

      <Grid container style={{ marginTop: "15px", padding: "15px 10px" }}>
        <Grid item xs={12}>
          <div className="fullDiv">
            <TextField
              required
              id="FirstName"
              label="First Name"
              value={fName}
              className="fullDiv"
              error={Boolean(fNameError?.fName)}
              helperText={fNameError?.fName}
              onChange={fNameValidate}
              // onChange = {(e)=>{setFName(e.target.value)}}
            />
          </div>
          <div className="fullDiv">
            <TextField
              // required
              id="LastName"
              label="Last Name"
              value={lName}
              className="fullDiv"
              onChange={(e) => {
                setLName(e.target.value);
              }}
            />
          </div>
          <div className="fullDiv">
            <TextField
              required
              id="DOB"
              label="Date of birth"
              value={dob}
              className="fullDiv"
              type="date"
              onChange={(e) => {
                setDob(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="fullDiv">
            <div className="halfDiv" style={{ paddingRight: "10px" }}>
              <TextField
                required
                disabled
                id="male"
                label="Male"
                className="fullDiv"
                onClick={(e) => setGender("male")}
              />
              {gender === "male" && <CheckIcon className="checkIcon" />}
            </div>
            <div className="halfDiv" style={{ paddingLeft: "10px" }}>
              <TextField
                required
                disabled
                id="female"
                label="Female"
                className="fullDiv"
                onClick={(e) => setGender("female")}
              />
              {gender === "female" && <CheckIcon className="checkIcon" />}
            </div>
          </div>
          <div className="fullDiv">
            <TextField
              required
              id="Email"
              label="Email"
              value={email}
              className="fullDiv"
              error={Boolean(emailError?.email)}
              helperText={emailError?.email}
              onChange={ValidateEmail}
              // onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!props.patientData && (
            <div className="fullDiv selectBox">
              <TextField
                required
                select
                // required
                // autoFocus
                label="Relation"
                margin="normal"
                variant="filled"
                className="fullDiv"
                // style={textBoxStyleTitle}
                value={relation}
                // error={errors.firstName}
                onChange={(e) => setRelation(e.target.value)}
              >
                {/* <MenuItem value="" disabled></MenuItem> */}
                {relationList.length > 0 &&
                  relationList.map((item, i) => (
                    <MenuItem key={"state-" + i} value={item.relation}>
                      {item.relation}
                    </MenuItem>
                  ))}
              </TextField>
            </div>
          )}
          <div className="fullDiv selectBox">
            <FormControl variant="filled" className={classes.formControl}>
              <InputLabel
                id="demo-simple-select-filled-label"
                style={{ marginTop: "1px", marginLeft: 0 }}
              >
                Languages *
              </InputLabel>
              <Select
                required
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                multiple
                className="languages_field"
                value={language}
                onChange={(e) => {
                  handleLanguage(e.target.value);
                }}
                MenuProps={MenuProps}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
              >
                {lang.map((name) => (
                  <MenuItem key={name.id} value={name}>
                    {/* {name} */}
                    <Checkbox checked={language.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="fullDiv">
            <TextField
              required
              id="address"
              label="Address"
              value={address === "NA" ? "" : address}
              className="fullDiv"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="fullDiv selectBox">
            <TextField
              required
              select
              label="State/Province"
              id="state *"
              value={state}
              // required
              margin="normal"
              variant="filled"
              className={"fullDiv " + (errMsg && state === "" ? "err" : "")}
              onChange={(e) => setState(e.target.value)}
              // displayEmpty
              // className={" newblock " + (state === "" ? "err1" : "")}
            >
              {/* <MenuItem value="" disabled></MenuItem> */}
              {stateList.length > 0 &&
                stateList.map((state, id) => (
                  <MenuItem key={"state-" + id} value={state}>
                    {state}
                  </MenuItem>
                ))}
            </TextField>
          </div>
          <div className="fullDiv selectBox">
            <TextField
              required
              select
              label="City"
              id="city *"
              value={city}
              className={"fullDiv " + (errMsg && city === "" ? "err" : "")}
              margin="normal"
              variant="filled"
              onChange={(e) => setCity(e.target.value)}
            >
              {/* <MenuItem value="" disabled></MenuItem> */}
              {cityList.length > 0 &&
                cityList.map((city, id) => (
                  <MenuItem key={"city-" + id} value={city}>
                    {city}
                  </MenuItem>
                ))}
            </TextField>
          </div>
          <div className="fullDiv">
            <TextField
              required
              id="Pin"
              label="Pin"
              value={pin === "NA" ? "" : pin}
              className="fullDiv"
              error={Boolean(pinError?.pin)}
              helperText={pinError?.pin}
              onChange={pinValidate}
            />
          </div>
          <div className="fullDiv">
            {patientData && patientData.id ? (
              <Button
                onClick={uploadProfileImages}
                color="primary"
                style={{
                  width: "90%",
                  background: "#34106f",
                  height: "60px",
                  color: "white",
                  marginLeft: "5%",
                  fontSize: "18px",
                  borderRadius: "30px",
                }}
              >
                SAVE
              </Button>
            ) : (
              <Button
                onClick={submitFamilyDetails}
                color="primary"
                style={{
                  width: "90%",
                  background: "#34106f",
                  height: "60px",
                  color: "white",
                  marginLeft: "5%",
                  fontSize: "18px",
                  borderRadius: "30px",
                }}
              >
                ADD FAMILY MEMBER
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AddFamilyMember;
