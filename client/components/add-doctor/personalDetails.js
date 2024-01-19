import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Remove";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { StepUpdateContext } from "../../context/registerStep";
import Input from "@material-ui/core/Input";
import { loadCSS } from "fg-loadcss";
import { useAlert, types } from "react-alert";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { validate } from "@material-ui/pickers";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

const SpecializationType = [
  { name: "Medicine", value: "medicine" },
  { name: "Surgery", value: "surgery" },
  { name: "Gynaecology", value: "gynaecology" },
  { name: "Obstetrics", value: "obstetrics" },
  { name: "Paediatrics", value: "paediatrics" },
  { name: "Eye", value: "eye" },
  { name: "ENT", value: "ENT" },
  { name: "Dental", value: "dental" },
  { name: "Orthopaedics", value: "orthopaedics" },
  { name: "Neurology", value: "neurology" },
  { name: "Cardiology", value: "cardiology" },
  { name: "Psychiatry", value: "psychiatry" },
  { name: "Skin", value: "skin" },
  { name: "VD", value: "vd" },
  { name: "PlasticSurgery", value: "plastic-surgery" },
  { name: "NuclearMedicine", value: "nuclear-medicine" },
  { name: "InfectiousDisease", value: "infectious-disease" },
  { name: "Diabetic", value: "diabetic" },
  { name: "Physiotherapy", value: "physiotherapy" },
  { name: "HealthEducation", value: "health-education" },
  { name: "Counseling", value: "counseling" },
  { name: "Nutritionist", value: "nutritionist" },
];
function getStyles(name, language, theme) {
  return {
    fontWeight:
      language.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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
    margin: theme.spacing(1),
    minWidth: 650,
    float: "left",
    width: "97%",
    margin: "0 14px",
    textAlign: "left",
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
const textBoxStyleTitle = {
  marginTop: "0px",
  width: "100%",
};
const textBoxStyle = {
  marginTop: "0px",
  width: "100%"
};

const textBoxStyleLast = {
  marginTop: "1px",
  width: "100%"
};
const textBoxStyleAddr = {
  marginTop: "0px",
  width: "96%",
};

const names = [
  "Assamese",
  "Bengali",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kashmiri",
  "Maithili",
  "Malayalam",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Rajasthani",
  "Sanskrit",
  "Santali",
  "Tamil",
  "Telugu",
  "Urdu",
];
const educationnames = [
  "MBBS",
  "BDS",
  "MD",
  "MS",
  "DNB",
  "DM",
  "M.Ch",
  "MDS",
  "Ph.D.",
  "D.Sc.",
  "Diploma",
  "Fellowship",
  "FICM",
  "PGDD",
  "FRCP",
  "Graduate",
  "Post-Graduate",
  "FIMSA",
  "MRCPS",
  "Post Doctoral Diploma",
  "MRCS",
  "MNAMS",
  "FRCS",
  "FIAGES",
  "FNB",
  "FHIV",
  "Graduation",
  "Post Graduation",
  "B.Sc.",
  "M.Sc.",
  "F.Diab",
  "FCD",
  "CCGDM",
  "CCMH"
];

function PersonalDetails(props) {
  const router = useRouter();
  const theme = useTheme();
  const classes = useStyles();
  const alert = useAlert();
  const [cookies, getCookie] = useCookies(["name"]);
  const { step, newStep } = useContext(StepUpdateContext);
  const [empId, setEmpId] = useState("");
  const [title, setTitle] = useState("Mr.");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validationErr, setValidationErr] = useState(false);
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState(new Date());
  const [dobError, setDobError] = useState("");
  const [department, setDepartment] = useState("Consultant");
  const [role, setRole] = useState("Doctor");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState("");
  const [registration, setRegistration] = useState("");
  const [countryName, setCountryName] = useState("");
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  // const [address, setAddress] = useState("");
  // const [panNo, setPanNo] = useState("");
  // const [aadharNo, setAadharNo] = useState("");
  // const [aadharNoError, setAadharNoError] = useState("");
  const [language, setLanguage] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFileName, setProfileImageFileName] = useState("");
  // const [pancardFileName, setPancardFileName] = useState("");
  // const [aadharCardFileName, setAadharCardFileName] = useState("");
  const [loader, setLoader] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [btype, setBType] = useState("");
  const [showUserType, setShowUserType] = useState("");
  const [uploading, setUploading] = useState(false);

  const getStates = () => {
    if (empId === "") {
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
    if (empId === "") {
      setCity("");
    }
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
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const upemp = JSON.parse(localStorage.getItem("updateEmp"));
    console.log(upemp, "update");
    if (upemp !== null) {
      setEmpId(upemp.id);
      setTitle(upemp.title);
      // const newfir = "";
      const fir = upemp.userFirstName;
      const tit = upemp.title;
      if (fir.startsWith(tit)) {
        setFirstName(fir.replace(tit + " ", ""))
      }
      else {
        setFirstName(upemp.userFirstName);
      }
      setLastName(upemp.userLastName);
      setPhone(upemp.phoneNumber);
      setEmail(upemp.emailId);
      setDob(upemp.dateOfBirth);
      setGender(upemp.genderType);
      setCountry(upemp.country);
      setState(upemp.state);
      setPin(upemp.pin);
      setProfileImage(upemp.profileImageName);
      setProfileImageUrl(upemp.profileImageName);
      // let temp = "";
      // temp.push(upemp.city);
      // console.log("temp", temp);
      // setCity(temp);
      setCity(upemp.city);
      // setCityList(upemp.city);
      setBType(upemp.userType);
      let totalEdu = [];
      upemp.qualificationList.map((eachedu) => {
        totalEdu.push(eachedu);
      });
      setEducation(totalEdu);
      let totalLang = [];
      upemp.languages.map((eachlang) => {
        totalLang.push(eachlang);
      });
      setLanguage(totalLang);
      setExperience(upemp.experinceInYears);
      setRegistration(upemp.doctorRegistrationNumber);
    }
  }, []);

  useEffect(() => {
    // setShowUserType
    let temp = localStorage.getItem("uservalue");
    if (temp === "physician:assistant") {
      setShowUserType("Physician Assistant");
    } else if (temp === "roster:manager") {
      setShowUserType("Roster Manager");
    } else if (temp === "educator") {
      setShowUserType("Diabetes Educator");
    }else if (temp === "dietician") {
      setShowUserType("dietitian");
    } else {
      router.asPath.includes("addDoctor")
        ? setShowUserType('Doctor')
        : setShowUserType(temp);
    }
    getLanguages();
  }, []);

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
  const handleLanguage = (value) =>{
    if(value.length < 4){
      setLanguage(value);
    }else{
      props.setMsgData({ message: "You can select maximum 3 languages", type: "error" });
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
  function DobValidation(birthday) {
    console.log("birth", birthday.target.value);
    setDob(birthday.target.value);
    const {
      target: { value },
    } = event;
    setDobError({ dob: "" });
    setDob(value);
    let reg = new RegExp(/^[0-9]{1,4}\-[0-9]{1,2}\-[0-9]{1,2}$/).test(
      birthday.target.value
    );
    if (!reg) {
      setDobError({ dob: "Please enter valid date of birth" });
    }
  }

  function phonenumber(inputtxt) {
    // setPhone(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setPhoneError({ phone: "" });
    // setPhone(value);
    // let reg = new RegExp(/^\d*$/).test(value);
    // if (!reg && value.length === 10) {
    //   setPhoneError({ phone: "Please enter valid phone number" });
    // }

    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPhoneError({ phone: "Please enter only numbers" });
    }else{
      setPhone(value);
    }
    if(value.length > 10){
      setPhoneError({ phone: "Phone number should be of ten digits" });
    }

  }
  function pinValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    // let reg = new RegExp(/^\d*$/).test(value);
    // if (!reg) {
    //   setPinError({ pin: "Please enter only numbers" });
    // }
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only numbers" });
    }else{
      setPin(value);
    }
    if(value.length > 6){
      setPinError({ pin: "It must be of six digits" });
    }
  }
  function ValidateYears(years) {
    // setExperience(years.target.value);
    const {
      target: { value },
    } = event;
    setExperienceError({ experience: "" });
    // setExperience(value);
    // let reg = new RegExp(/^\d*$/).test(value);
    // if (!reg) {
    //   setExperienceError({ experience: "Please enter only numbers" });
    // }
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setExperienceError({ experience: "Please enter only numbers" });
    }else{
      setExperience(value);
    }
  }
  function validateRegister(register) {
    // setRegistration(register.target.value);
    const {
      target: { value },
    } = event;
    setRegistrationError({ registration: "" });
    // setRegistration(value);
    // let reg = new RegExp(/^\d*$/).test(value);
    // if (!reg) {
    //   setRegistrationError({ registration: "Please enter only numbers" });
    // }
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setRegistrationError({ registration: "Please enter only numbers" });
    }else{
      setRegistration(value);
    }
  }

  let documentarr = [];

  const submitPersonalDetails = async (e) => {
    e.preventDefault();
    setErrMsg(false);
    documentarr = [];
    if (profileImageFileName !== "") {
      documentarr.push({
        name: "Profile Image",
        id: "profilePic",
        key: profileImageFileName,
        filename: profileImageFileName,
      });
    }
    setLoader(true);
    if (documentarr.length > 0) {
      uploadImages();
    }
    else {

      console.log("image", profileImage);
      if(profileImage !== ""){
        addNewEmp(profileImage);
      }else{
        props.setMsgData({ message: "Photo is required", type: "error" });
      }
      setLoader(false);
    }
    // addNewEmp();
    // }
  };
  // to upload image to the server
  const uploadImages = (a) => {
    let imageUrl = null;
    console.log("documentarr: ", documentarr);
    var model = {
      file: document.getElementById("profilePic").files[0],
    };
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
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
        console.log(response.data, "uploading");
        imageUrl = response.data.fileName;
        setProfileImageUrl(response.data.fileName);
        addNewEmp(imageUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const addNewEmp = (imageUrl) => {
    if (empId === "") {
      setErrMsg(false);
      if (phone.length !== 10) {
        setErrMsg(true);
        props.setMsgData({
          message: "Phone number should be of ten digits",
          type: "error",
        });
        return false;
      } else if (pin.length !== 6) {
        setErrMsg(true);
        props.setMsgData({
          message: "Pin code should be of six digits",
          type: "error",
        });
        return false;
      } 
      if (
        firstName === "" ||
        lastName === "" ||
        phone === "" ||
        email === "" ||
        language === "" ||
        education === "" ||
        state === "" ||
        city === "" ||
        pin === "" ||
        experience === "" ||
        country === "" ||
        profileImage === ""
      ) {
        setErrMsg(true);
        setLoader(false);
        if (language === "") {
          props.setMsgData({ message: "Language is required", type: "error" });
        } else if (profileImage === "" || imageUrl === "") {
          props.setMsgData({ message: "Photo is required", type: "error" });
        } else if (state === "") {
          props.setMsgData({ message: "State is required", type: "error" });
        } else if (city === "") {
          props.setMsgData({ message: "City is required", type: "error" });
        } else if (dob === "") {
          props.setMsgData({
            message: "Date of birth is required",
            type: "error",
          });
        } else {
          props.setMsgData({
            message: "All fields are required",
            type: "error",
          });
        }
        return false;
      }
      let spec = "NA";
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: JSON.parse(localStorage.getItem('token')),
      };
      let obj = {
        title: title,
        userFirstName: firstName,
        userLastName: lastName,
        emailId: email,
        phoneNumber: phone,
        userType: localStorage.getItem("uservalue"),
        dateOfBirth: dob,
        experinceInYears: experience,
        qualificationList: education,
        city: city,
        state: state,
        country: country,
        pin: pin,
        department: "medical-department",
        specialization: "diabetic",
        languages: language,
        profileImageName: imageUrl,
        designation: "doctor",
        doctorRegistrationNumber: registration,
        genderType: gender,
      };
      const url = config.API_URL + "/api/partner/employee";
      setLoader(true);
      axios
        .post(url, obj, { headers })
        .then((response) => {
          setLoader(true);
          console.log("response: ", response);
          // props.updateList(response);
          setLoader(false);
          setUploading(false);
          // alert.show("Employee added successfully", { type: "success" });
          props.setMsgData({
            message: "Employee added successfully",
            type: "success",
          });

          router.push("/listing");
        })
        .catch((error) => {
          setLoader(false);
          console.log(error, "error");
          // alert.show(error.response.data.errors[0].message, { type: "error" });
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
        });
    } else {
      setErrMsg(false);
      if (phone.length !== 10) {
        setErrMsg(true);
        props.setMsgData({
          message: "Phone number should be of ten digits",
          type: "error",
        });
        return false;
      } else if (pin.length !== 6) {
        setErrMsg(true);
        props.setMsgData({
          message: "Pin code should be of six digits",
          type: "error",
        });
        return false;
      } 
      if (
        firstName === "" ||
        lastName === "" ||
        phone === "" ||
        email === "" ||
        language === "" ||
        education === "" ||
        state === "" ||
        city === "" ||
        pin === "" ||
        experience === "" ||
        country === "" ||
        profileImage === ""
      ) {
        setErrMsg(true);

        setLoader(false);
        if (language === "") {
          props.setMsgData({ message: "Language is required", type: "error" });
        } else if (profileImage === "" || imageUrl === "") {
          props.setMsgData({ message: "Photo is required", type: "error" });
        } else if (state === "") {
          props.setMsgData({ message: "State is required", type: "error" });
        } else if (city === "") {
          props.setMsgData({ message: "City is required", type: "error" });
        } else if (dob === "") {
          props.setMsgData({
            message: "Date of birth is required",
            type: "error",
          });
        } else {
          props.setMsgData({
            message: "All fields are required",
            type: "error",
          });
        }
        return false;
      }
      let spec = "NA";
      let cooki = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cooki = value;
        }
      }
      let obj = {
        id: empId,
        title: title,
        userFirstName: firstName,
        userLastName: lastName,
        emailId: email,
        phoneNumber: phone,
        userType: btype,
        dateOfBirth: dob,
        experinceInYears: experience,
        qualificationList: education,
        city: city,
        state: state,
        country: country,
        pin: pin,
        department: "medical-department",
        specialization: "diabetic",
        languages: language,
        profileImageName: imageUrl,
        designation: "doctor",
        doctorRegistrationNumber: registration,
        genderType: gender,
      };
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: JSON.parse(localStorage.getItem('token')),
      };
      const url = config.API_URL + "/api/partner/employee";
      setLoader(true);
      axios
        .put(url, obj, { headers })
        .then((response) => {
          setLoader(true);
          console.log("response: ", response);
          setLoader(false);
          setUploading(false);
          props.setMsgData({
            message: "Employee Updated Successfully",
            type: "success",
          });

          localStorage.removeItem("updateEmp");
          localStorage.removeItem("uservalue");

          router.push("/listing");
        })
        .catch((error) => {
          setLoader(false);
          console.log(error, "error");
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
        });
    }
  };

  const goBackBasicPage = (e) => {
    e.preventDefault();
    localStorage.removeItem("updateEmp");
    localStorage.removeItem("uservalue");
    router.push("/listing");
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <h2 className="newHead">
        Basic Details of{" "}
        <span style={{ textTransform: "capitalize" }}>{showUserType}</span>{" "}
      </h2>
      <div style={{ textAlign: "end" }}>
        <img
          style={{
            height: "25px",
            cursor: "pointer",
            marginTop: "-43px",
            marginBottom: "39px",
          }}
          src="crossIcon.png"
          onClick={goBackBasicPage}
        />
      </div>
      <div className="form-input textBottom">
        <form autoComplete="off" onSubmit={submitPersonalDetails}>
          <div className="mainForm">
            <div style={{ width: "100%" }}>
              <div className="section-left">
                <TextField
                  id="first-name"
                  label="First Name *"
                  errorText={firstNameError}
                  margin="normal"
                  style={{ display: "none" }}
                  value={empId}
                />
                <div className="elements-title full" style={{ width: "20%" }}>
                  <TextField
                    select
                    // required
                    // autoFocus
                    label="Title *"
                    margin="normal"
                    variant="filled"
                    style={textBoxStyleTitle}
                    value={title}
                    // error={errors.firstName}
                    onChange={(e) => setTitle(e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Mr.">Mr.</MenuItem>
                    <MenuItem value="Ms.">Ms.</MenuItem>
                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                    <MenuItem value="Dr.">Dr.</MenuItem>
                  </TextField>
                </div>
                <div className="elements-first">
                  <TextField
                    // required
                    // autoFocus
                    label="First Name *"
                    errorText={firstNameError}
                    margin="normal"
                    variant="filled"
                    style={textBoxStyle}
                    className="label"
                    // size="small"
                    // InputLabelProps={{ shrink: true }}
                    className={" " + (errMsg && firstName === "" ? "err" : "")}
                    value={firstName}
                    // error={errors.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="elements-last">
                  <TextField
                    // required
                    id="last-name"
                    label="Last Name *"
                    errorText={lastNameError}
                    margin="normal"
                    variant="filled"
                    style={textBoxStyleLast}
                    // InputLabelProps={{ shrink: true }}
                    className={" " + (errMsg && lastName === "" ? "err" : "")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="elements">
                  <TextField
                    // required
                    id="mobile"
                    label="Mobile *"
                    // disabled={empId === "" ? false : true}
                    error={Boolean(phoneError?.phone)}
                    helperText={phoneError?.phone}
                    margin="normal"
                    variant="filled"
                    className={" " + (errMsg && phone === "" ? "err" : "")}
                    style={textBoxStyle}
                    value={phone}
                    onChange={phonenumber}
                  />
                </div>
                <div className="elements">
                  <TextField
                    // required
                    id="emailid"
                    label="Email *"
                    disabled={empId === "" ? false : true}
                    error={Boolean(emailError?.email)}
                    helperText={emailError?.email}
                    margin="normal"
                    variant="filled"
                    style={textBoxStyle}
                    // InputLabelProps={{ shrink: true }}
                    className={" " + (errMsg && email === "" ? "err" : "")}
                    value={email}
                    onChange={ValidateEmail}
                  />
                </div>
                <div className="elements">
                  <TextField
                    id="date"
                    required
                    label="Date of Birth "
                    variant="filled"
                    type="date"
                    error={Boolean(dobError?.dob)}
                    helperText={dobError?.dob}
                    className={" " + (errMsg && dob === "" ? "err" : "")}
                    value={dob}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={textBoxStyle}
                    onChange={DobValidation}
                  />
                </div>
                <div className="elements radio-cutom">
                  <FormLabel component="legend">Gender *</FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    className="radio-exe"
                    name="position"
                    value={gender}
                    error={Boolean(dobError?.dob)}
                    helperText={dobError?.dob}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      display: "inline-block",
                      marginLeft: "-2px",
                      marginTop: "-3px",
                    }}
                  >
                    <FormControlLabel
                      id="male"
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      id="female"
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </div>
              </div>
              <div className="section-right">
                <div className="avtar">
                  <div className="elements">
                    <FormLabel
                      component="legend"
                      className={
                        "dragImage" +
                        (errMsg && profileImage === "" ? "err" : "")
                      }
                    >
                      Photo *
                    </FormLabel>
                    <div className="image" id="image">
                      <label htmlFor="profilePic" style={{ cursor: "pointer" }}>
                        {profileImage === "" ? (
                          <img src="avtar.svg" />
                        ) : (
                            // <img src={profileImage} />
                            <img
                              src={
                                uploading !== true
                                  ? `${config.API_URL}/api/utility/download/` +
                                  profileImage
                                  : profileImage
                              }
                            />
                          )}
                        <img className="small-icon" src="upload-img.svg" />
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
                </div>
              </div>
            </div>
            <div className="elements full" style={{ width: "22%" }}>
              <TextField
                select
                // labelId="country-label"
                label="Country"
                id="country"
                disabled
                value={country}
                // required
                margin="normal"
                variant="filled"
                onChange={(e) => setCountry(e.target.value)}
              >
                <MenuItem value={"India"}>India</MenuItem>
                <MenuItem value={"USA"}>USA</MenuItem>
              </TextField>
            </div>

            <div className="elements full" style={{ width: "26%" }}>
              <TextField
                select
                label="State/Province"
                id="state *"
                value={state}
                // required
                margin="normal"
                variant="filled"
                className={" " + (errMsg && state === "" ? "err" : "")}
                onChange={(e) => setState(e.target.value)}
              // displayEmpty
              // className={" newblock " + (state === "" ? "err1" : "")}
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
            <div className="elements full" style={{ width: "22%" }}>
              <TextField
                select
                label="City"
                id="city *"
                value={city}
                className={" " + (errMsg && city === "" ? "err" : "")}
                margin="normal"
                variant="filled"
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

            <div className="elements full" style={{ width: "26%" }}>
              <TextField
                // required
                id="pin"
                label="PIN *"
                style={{ margin: "6px 8px" }}
                margin="normal"
                variant="filled"
                error={Boolean(pinError?.pin)}
                helperText={pinError?.pin}
                className={"more " + (errMsg && pin === "" ? "err" : "")}
                value={pin}
                onChange={pinValidate}
              />
            </div>
            <div className="full" style={{ width: "97%" }}>
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel
                  id="demo-simple-select-filled-label"
                  style={{ marginTop: "1px", marginLeft: 0 }}
                >
                  Languages * (You can select multiple languages)
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  multiple
                  className="languages_field"
                  value={language}
                  onChange={(e) => {handleLanguage(e.target.value)}}
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
            <div style={{ height: "20px", float: "left", width: "100%" }} />
            <div className="full" style={{ width: "97%" }}>
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="education" style={{ marginTop: "1px", marginLeft: 0 }}>
                  Educations&nbsp;
                  {showUserType === "diabetologist"
                    ? "* (You can select multiple education)"
                    : showUserType === "dietitian"
                      ? "* (You can select multiple education)"
                      : "(You can select multiple education)"}
                </InputLabel>
                <Select
                  // required
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  required={
                    showUserType === "diabetologist"
                      ? true
                      : showUserType === "dietitian"
                        ? true
                        : false
                  }
                  multiple
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  MenuProps={MenuProps}
                  className="languages_field"
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
                  {educationnames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {/* {name} */}
                      <Checkbox checked={education.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="elements full" style={{ width: "30%" }}>
              <TextField
                required
                id="experience"
                style={{ width: "98%", float: "left" }}
                label="Experience in Years"
                margin="normal"
                variant="filled"
                className="proEducation"
                // className={" " + (errMsg && experience === "" ? "err" : "")}
                value={experience}
                error={Boolean(experienceError?.experience)}
                helperText={experienceError?.experience}
                onChange={ValidateYears}
              />
            </div>
            <div className="elements full" style={{ width: "40%" }}>
              <TextField
                required={
                  showUserType === "diabetologist"
                    ? true
                      : false
                }
                // : showUserType === "dietitian"
                //       ? true
                style={{ width: "98%", float: "left" }}
                label=" Registration No."
                margin="normal"
                variant="filled"
                // className={" " + (errMsg && experience === "" ? "err" : "")}
                value={registration}
                error={Boolean(registrationError?.registration)}
                helperText={registrationError?.registration}
                onChange={validateRegister}
                id="registration"
              />
            </div>

            {/*<div className="section-left">
              <div className="elements">
                <TextField
                  required
                  label="PAN Number"
                  margin="normal"
                  variant="filled"
                  style={textBoxStyle}
                  // InputLabelProps={{ shrink: true }}
                  className={" " + (errMsg && panNo === "" ? "err" : "")}
                  value={panNo}
                  onChange={(e) => setPanNo(e.target.value)}
                />
              </div>
              <div className="elements">
                <TextField
                  required
                  label="Aadhar Number"
                  margin="normal"
                  variant="filled"
                  style={textBoxStyle}
                  error={Boolean(aadharNoError?.aadharNo)}
                  helperText={aadharNoError?.aadharNo}
                  value={aadharNo}
                  onChange={validAadhar}
                />
              </div>

              <div className="two-div">
                <div className="upload-option">
                  <input
                    type="file"
                    className="choose"
                    id="pancard"
                    onChange={uploadPan}
                  />
                  <label htmlFor="pancard" className="dragContent">
                    <img src="upload.svg" />
                    <span className="dragContentText">
                      Drag and drop to upload Scanned copy of PAN document.
                    </span>
                  </label>
                </div>
              </div>

              <div className="two-div">
                <div className="upload-option">
                  <input
                    type="file"
                    className="choose"
                    id="aadharcard"
                    onChange={uploadAadhar}
                  />
                  <label htmlFor="aadharcard" className="dragContent">
                    <img src="upload.svg" />
                    <span className="dragContentText">
                      Drag and drop to upload Scanned copy of Aadhar Card
                      document.
                    </span>
                  </label>
                </div>
              </div>
            </div>
            */}
          </div>

          <div className="action">
            <Button
              id="submit"
              style={{ color: "#000" }}
              size="small"
              variant="contained"
              // color="secondary"
              className="primary-button forward"
              type="submit"
            >
              SAVE
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PersonalDetails;
