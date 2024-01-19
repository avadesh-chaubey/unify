import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  Button,
  InputBase,
  Badge,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Sidenavbar from "../dashboard/Sidenavbar";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import time from "../../data/time.json";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  MainContainer: {
    "& h5, & h6": {
      color: "#000000A1",
    },
  },
  paper: {
    padding: "5px",
    textAlign: "center",
    boxShadow: "none",
  },
  text: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "50px",
  },
  Button: {
    width: "110px",
    border: "2px solid #152A75",
    background: "#152A7526",
    color: "#555555",
    boxShadow: "none",
    borderRadius: "10px",
    display: "inline-block",
    opacity: "1",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    "& span": {
      fontSize: "12px",

      color: "#152A75",
    },
    buttonActive: {
      width: "110px",
      border: "2px solid #152A75",
      background: "#152A7526",
      color: "#555555",
      boxShadow: "none",
      borderRadius: "10px",
      display: "inline-block",
      opacity: "1",
      boxShadow: "none",
      display: "flex",
      alignItems: "center",
      "& span": {
        fontSize: "12px",

        color: "#152A75",
      },
    },
  },
  selectedButton: {
    width: "110px",
    border: "2px solid #152A75",
    background: "#152A75",
    boxShadow: "none",
    borderRadius: "10px",
    display: "inline-block",
    opacity: "none",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    "& span": {
      fontSize: "12px",

      color: "#FFFFFF",
    },
    "&:hover": {
      backgroundColor: "#152A75",
    },
  },
  Button2: {
    marginRight: "50px",
    "& span": {
      fontSize: "13px",

      color: "black",
    },
    "&:hover": {
      backgroundColor: "#91D8F6",
    },
  },
  ButtonActive2: {
    marginRight: "50px",
    //backgroundColor: '#0657C8',
    border: "none",
    //borderTop:'2px solid #0657C8',
    "& span": {
      fontSize: "13px",

      color: "#2B6BFF",
    },
    "&:hover": {
      backgroundColor: "#91D8F6",
    },
  },
  picker: {
    "& input": {
      display: "none",
    },
    "& ::before": {
      display: "none",
    },
  },
  searchInput: {
    border: "1px ",
    borderColor: "#B2AEAE",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    // marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "400px",
    height: "35px",
    backgroundColor: "#FFFFFF",

    color: "#555555",
  },
  "&:hover": {
    backgroundColor: "#E4F4FF",
  },
  formsection: {
    minWidth: "50%",
    "& div": {
      marginTop: "3px",
      // marginRight: '35px',
      "& label": {},
      "& div": {
        width: "95%",
      },
    },
  },
  formsectionDialog: {
    minWidth: "70%",
    "& div": {
      marginTop: "2px",
      margin: "5px",
      // marginRight: '35px',
      "& label": {},
      "& div": {
        width: "200px",
      },
    },
  },
  formsectionpayment: {
    minWidth: "70%",
    "& div": {
      marginTop: "3px",
      //   marginLeft: "10px",
      // marginRight: '35px',
      "& label": {
        // marginLeft: "10px",
      },
      "& div": {
        width: "450px",
      },
    },
  },
  familyMember: {
    backgroundColor: "#FFFFFF",
    border: "2px solid #B2AEAE",
    borderRadius: "25px",
    fontSize: "11px",
    margin: "12px",
    marginTop: "5px",
    height: "40px",
    padding: "18px",
    textTransform: "capitalize",
    "& span": {
      fontSize: "13px",
    },
  },
  svgIcon: {
    color: "#00BD7F",
  },
  familyMemberSelect: {
    backgroundColor: "#E4F4FF",
    border: "2px solid #B2AEAE",
    borderRadius: "25px",
    fontSize: "11px",
    margin: "12px",
    marginTop: "5px",
    height: "40px",
    padding: "18px",
    textTransform: "capitalize",
    "& span": {
      fontSize: "13px",
    },
  },
  svgIconSelect: {
    color: "#B9B9B9",
  },

  activebutton: {
    border: "2px solid #B2AEAE",
    backgroundColor: "#E4F4FF",
    borderRadius: "25px",
    fontSize: "11px",
    margin: "12px",
    marginTop: "5px",
    height: "40px",
    padding: "18px",
    "& span": {},
  },

  ButtonAddAppointment: {
    width: "100px",
    border: "2px solid #152A75",
    background: "#152A75",
    color: "#555555",
    boxShadow: "none",
    borderRadius: "35px",
    display: "inline-block",
    opacity: "1",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    marginLeft: "15px",
    color: "#fff",
    "& span": {
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#00000029",
      color: "#000000",
    },
  },
  ButtonDialog: {
    width: "100px",
    border: "2px solid #152A75",
    background: "#152A75",
    color: "#555555",
    boxShadow: "none",
    borderRadius: "35px",
    cursor: "pointer",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    marginRight: "35px",
    marginTop: "20px",
    marginBottom: "30px",
    "& span": {
      fontSize: "12px",

      color: "#fff",
    },
  },
  Paper: {
    flexGrow: "1",
  },
  listbox: {
    width: 350,
    marginTop: "36px",
    marginLeft: "53px",
    paddingLeft: "10px",
    zIndex: 2,
    fontSize: "14px",
    position: "absolute",
    listStyle: "none",
    backgroundColor: "#FFF",
    overflow: "auto",
    maxHeight: 200,
    textTransform: "capitalize",
    '& li[data-focus="true"]': {
      backgroundColor: "#F1EFEF",
      color: "#000000",
      cursor: "pointer",
    },
    "& li:active": {
      backgroundColor: "#4a8df6",
      color: "white",
    },
    "& li": {
      padding: "10px",
    },
  },
  addFamilyButton: {
    backgroundColor: "#FFFFFF",
    border: "2px solid #B2AEAE",
    borderRadius: "25px",
    fontSize: "11px",
    margin: "12px",
    marginTop: "5px",
    height: "40px",
    padding: "18px",
    "& span": {},
  },
  appointmentDialogButton: {
    "& span": {
      fontSize: "15px",
    },
  },
}));

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

export default function AddnewAppointments() {
  const [phoneNum, setPhoneNum] = useState("");
  const [open, setOpen] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [selectedValue, setSelectedValue] = useState("card");
  const [specialist, setSpecialist] = useState([]);
  const [speciality, setSpeciality] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [dateList, setDateList] = useState([]);
  const [cookies] = useCookies(["name"]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotDate, setSlotDate] = useState(new Date());
  const [slotList, setSlotList] = useState([]);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [allSlotList, setAllSlotList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [search, setSearch] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [relation, setRelation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [familyMember, setFamilyMember] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [addAppointment, setAddAppointment] = useState([]);
  const [selectAppointmentType, setSelectAppointmentType] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [selectedFamilyMember, setSelectedFamilyMember] = useState();
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [appointmentDialogOpen, setAddAppointmentDialogOpen] = useState(false);
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "",
    options: search,
    getOptionLabel: (option) =>
      option.userFirstName +
      " " +
      option.userLastName +
      " " +
      option.phoneNumber,
  });
  const timeData = time;

  const handleChangeDate = (e, newValue) => {
    setValue(newValue);
  };

  const handleSpeciality = (e, speciality) => {
    e.preventDefault();
    setSpeciality(speciality);
  };

  const slotButtonClickHandle = (value) => {
    setSelectedSlot(value);
    console.log("=============>value", value);
  };

  const familyMemberButtonHandler = (item) => {
    setSelectedFamilyMember(item);
    console.log("========>family", familyMember);
  };

  const specialistHandler = (event) => {
    setSelectedSpecialist(event.target.value);
    console.log("=========>event", event.target.value);
  };

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

  const handleAddAppointment = () => {
    // console.log('===========>patient Name', patientName)
    // console.log('===========>choose specialist', specialist)
    // console.log('=====================>doctor', selectedDoctor)
    // console.log('==========>phone', phone)
    // console.log('===========>slot', selectedSlot)
    // console.log('=============>type', selectAppointmentType)
    // console.log('===========>payment option', selectedValue )
    let obj = {
      consultantId: selectedDoctor,
      appointmentDate: getFormateDate(slotDate),
      customerId: patientId,
      consultationType: selectedSpecialist,
      appointmentSlotId: selectedSlot,
      parentId: patientId,
    };
    getAddAppointment(obj);
    setAddAppointmentDialogOpen(true);
  };

  const addAppointmentHandleClose = () => {
    setAddAppointmentDialogOpen(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const classes = useStyles();

  const dateClickhandler = (value) => {
    const list =
      (allSlotList && allSlotList[value] && allSlotList[value].slotList) || [];
    setSlotList(list);
    setSelectedButtonIndex(value);
  };
  const calendarClickhandler = (value) => {
    // const slot = ['11:00 AM', '1:00 PM', '1:00 PM',
    //     '2:00 PM', '3:00 PM', '4:00 PM', '10:00 AM', '1:00 AM', '3:00 PM', '4:00 PM', '9:00 PM',
    //     '6:00 PM', '5:00 AM', '6:00 AM', '11:00 AM', '12:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
    //     '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',]
    // setSlotList(slot)
    setSelectedDate(value);
  };
  const handleClick = () => {
    setSlotList(slot);
  };
  const paymentOption = (event) => {
    setSelectedValue(event.target.value);
    console.log("=========>payment", event.target.value);
  };

  const appointmentTypeHandle = (event) => {
    setSelectAppointmentType(event.target.value);
    console.log("========>typeValue", event.target.value);
  };

  const transactionHandler = (event) => {
    setTransactionNumber(event.target.value);
    console.log("===========>value", event.target.value);
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

  const getData = async () => {
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
      const url = config.API_URL + "/api/partner/doctorlist";
      const response = await axios.get(url, { headers });
      const data = response.data.map((item) => {
        const doctorDetails =
          item.userFirstName +
          " " +
          item.userLastName +
          " ( " +
          "₹" +
          item.consultationChargesInINR +
          " )";
        const doctorCharges = item.consultationChargesInINR;
        const doctorid = item.id;
        return { doctorid, doctorDetails, doctorCharges };
      });
      const data2 = response.data.map((item) => {
        const user = item.userType;
        return user;
      });
      setSpecialist(data2);
      setDoctorList(data);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);

  const getDate = (value) => {
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
    let newdate = new Date(selectedDate);
    newdate.setDate(newdate.getDate() + value);
    const dd = newdate.getDate();
    const mm = monthNames[newdate.getMonth()];
    const y = newdate.getFullYear();
    const formattedDate = dd + " " + mm + " " + y;
    return formattedDate;
  };
  const getDateList = () => {
    const list = [0, 1, 2, 3, 4, 5].map((item) => {
      return getDate(item);
    });
    setDateList(list);
  };
  useEffect(() => {
    getDateList();
  }, [selectedDate]);

  const getSlotList = () => {
    const startDate = new Date(dateList[0])
      .toLocaleString("en-CA")
      .split(" ")[0]
      .replace(",", "");
    const stopDate = new Date(dateList[5])
      .toLocaleString("en-CA")
      .split(" ")[0]
      .replace(",", "");
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    axios
      .post(
        config.API_URL + "/api/appointment/viewslots",
        {
          consultantId: selectedDoctor,
          startDate,
          stopDate,
        },
        { headers }
      )
      .then((response) => {
        console.log("fetch Doctor slot: ", response.data);
        const data = response.data.map((slot) => {
          const availSlot = slot.availableSlotsList;
          const allSlotList = timeData.map((item) => {
            let obj = {
              id: item.id,
              label: item.label,
              value: item.value,
              selected: true,
            };
            if (availSlot[item.value] === "available") {
              obj.selected = false;
            }
            return obj;
          });
          const slotList = allSlotList.filter((item) => !item.selected);
          return { ...slot, slotList };
        });
        setAllSlotList(data);
        setSlotList(data[0].slotList);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (selectedDoctor) getSlotList();
  }, [selectedDoctor]);

  const getAddFamily = async (patientId) => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let obj = {
        userFirstName: firstName,
        userLastName: lastName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        relationship: relation,
        mhrId: "NA",
        languages: [language],
        address: address,
        city: city,
        state: state,
        pin: pinCode,
      };
      let headers = {
        authtoken: cookie,
      };
      const url =
        config.API_URL + "/api/patient/addfamilymember?patientId=" + patientId;
      await axios.post(url, obj, { headers });
      setFamilyMember([...familyMember, obj]);
    } catch (err) {
      console.log("============>", err);
    }
  };
  // useEffect(() => {
  //     if (patientId)
  //         getAddFamily(patientId);
  // }, [patientId]);

  const getSearch = async () => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let obj = {
        patientName: "",
      };
      let headers = {
        authtoken: cookie,
      };
      const url = config.API_URL + "/api/patient/searchpatient";
      const response = await axios.get(url + "? =" + obj, { headers });
      const data = response.data;
      setSearch(data);
    } catch (err) {}
  };
  useEffect(() => {
    getSearch();
  }, []);

  const selectOnClick = (option) => {
    console.log("=========>", option.id);
    setPatientId(option.id);
    setPatientName(option.userFirstName + " " + option.userLastName);
    setPhone(option.phoneNumber);
  };
  const saveHandler = () => {
    if (patientId) {
      getAddFamily(patientId);
    } else {
      console.log("===========> ERROR : Please selet Patient");
    }
  };

  const getShowMember = async () => {
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
      const url =
        "https://rainbow.unify.care/api/patient/familymembers?parentId=" +
        patientId;
      const response = await axios.get(url, { headers });
      const data = response.data;
      setFamilyMember(data);
      console.log;
    } catch (err) {}
  };
  useEffect(() => {
    if (patientId) {
      getShowMember();
    }
  }, [patientId]);

  const getAddAppointment = async (obj) => {
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
      const url = config.API_URL + "/api/appointment/add";
      await axios.post(url, obj, { headers });
      const data = response;
      setAddAppointment(data);
      console.log("=======>data", data);
      alert("Response", data);
    } catch (err) {
      console.log("============>", err);
    }
  };

  return (
    <>
      <hr />
      <div style={{ marginLeft: "15px" }}>
        <Grid item xs={11} className={classes.MainContainer}>
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
                            label="Patient Name"
                            style={{ margin: 4 }}
                            margin="normal"
                            variant="filled"
                            className="form-auto hospital-unit-label"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.name)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </div>

                        <div className="half-div onboarding-half-div">
                          <TextField
                            id="title"
                            required
                            label="Phone Number"
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
                      </div>
                    </div>
                    <Grid container>
                      {familyMember &&
                        familyMember.map((item) => {
                          return (
                            <Grid item>
                              {item == selectedFamilyMember ? (
                                <Button
                                  onClick={() =>
                                    familyMemberButtonHandler(item)
                                  }
                                  className={classes.familyMemberSelect}
                                  variant="outlined"
                                  endIcon={
                                    <CheckCircleIcon
                                      className={classes.svgIcon}
                                    />
                                  }
                                >
                                  ({item.relationship}) -{" "}
                                  {item.userFirstName + " " + item.userLastName}
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    familyMemberButtonHandler(item)
                                  }
                                  className={classes.familyMember}
                                  variant="outlined"
                                  endIcon={
                                    <CheckCircleIcon
                                      className={classes.svgIconSelect}
                                    />
                                  }
                                >
                                  ({item.relationship}) -{" "}
                                  {item.userFirstName + " " + item.userLastName}
                                </Button>
                              )}
                            </Grid>
                          );
                        })}
                      <Grid item>
                        <Button
                          className={classes.addFamilyButton}
                          onClick={handleClickOpen}
                          variant="outlined"
                        >
                          + Add New Member
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          maxWidth="lg"
                          disableBackdropClick
                        >
                          <DialogTitle id="form-dialog-title">
                            Add New Family Member
                          </DialogTitle>
                          <DialogContent>
                            <Grid
                              container
                              justify="space-between"
                              style={{ marginLeft: "20px" }}
                            >
                              <Grid item className={classes.formsection}>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    label="Frist Name"
                                    id="standard-size-small"
                                    placeholder=""
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setFirstName(event.target.value)
                                    }
                                  />
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    label="Date Of Birth"
                                    placeholder="DD/MM/YYYY"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    id="standard-size-small"
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setDateOfBirth(event.target.value)
                                    }
                                  />
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    label="Relation"
                                    id="standard-size-small"
                                    placeholder=""
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setRelation(event.target.value)
                                    }
                                  />
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    label="Address"
                                    id="standard-size-small"
                                    placeholder="521- B , Rohini"
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setAddress(event.target.value)
                                    }
                                  />
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    select
                                    required
                                    label="City"
                                    id="standard-size-small"
                                    size="small"
                                    variant="filled"
                                    value={city}
                                    className={
                                      " " + (errMsg && city === "" ? "err" : "")
                                    }
                                    onChange={(e) => setCity(e.target.value)}
                                  >
                                    <MenuItem value="" disabled></MenuItem>
                                    {cityList.length > 0 &&
                                      cityList.map((city, id) => (
                                        <MenuItem
                                          key={"city-" + id}
                                          value={city}
                                        >
                                          {city}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </div>
                              </Grid>
                              <Grid item className={classes.formsection}>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    label="Last Name"
                                    id="standard-size-small"
                                    placeholder=""
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setLastName(event.target.value)
                                    }
                                  />
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    select
                                    required
                                    label="Gender"
                                    id="standard-size-small"
                                    size="small"
                                    value={gender}
                                    variant="filled"
                                    onChange={(e) => setGender(e.target.value)}
                                  >
                                    <MenuItem value="" disabled></MenuItem>
                                    {["Male", "Female"].map((gender, id) => (
                                      <MenuItem
                                        key={"gender-" + id}
                                        value={gender}
                                      >
                                        {gender}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    required
                                    select
                                    label="Language"
                                    id="standard-size-small"
                                    size="small"
                                    value={language}
                                    variant="filled"
                                    onChange={(e) =>
                                      setLanguage(e.target.value)
                                    }
                                  >
                                    <MenuItem value="" disabled></MenuItem>
                                    {[
                                      "English",
                                      "Hindi",
                                      "Bengali",
                                      "Tamil",
                                      "Gujarati",
                                      "Sindhi",
                                    ].map((language, id) => (
                                      <MenuItem
                                        key={"language-" + id}
                                        value={language}
                                      >
                                        {language}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    select
                                    required
                                    label="State"
                                    id="standard-size-small"
                                    size="small"
                                    value={state}
                                    variant="filled"
                                    className={
                                      " " +
                                      (errMsg && state === "" ? "err" : "")
                                    }
                                    onChange={(e) => setState(e.target.value)}
                                  >
                                    <MenuItem value="" disabled></MenuItem>
                                    {stateList.length > 0 &&
                                      stateList.map((state, id) => (
                                        <MenuItem
                                          key={"state-" + id}
                                          value={state}
                                        >
                                          {state}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </div>
                                <div style={{ width: "400px", height: "55px" }}>
                                  <TextField
                                    label="Pin Code"
                                    id="standard-size-small"
                                    placeholder="110034"
                                    size="small"
                                    variant="filled"
                                    onChange={(event) =>
                                      setPinCode(event.target.value)
                                    }
                                  />
                                </div>
                              </Grid>
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={handleClose}
                              className={classes.ButtonDialog}
                              // color="primary"
                              variant="contained"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={saveHandler}
                              className={classes.ButtonDialog}
                              // color="primary"
                              variant="contained"
                            >
                              ADD
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Grid>
                    </Grid>
                    <div className="half-div onboarding-half-div">
                      <Autocomplete
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
                            label="Choose Specialist"
                            id="title"
                            required
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </div>
                    <div className="half-div onboarding-half-div">
                      <Autocomplete
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
                            label="Choose Specialist"
                            id="title"
                            required
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </div>
                    <br />
                    <div>
                      <Typography
                        style={{ marginLeft: "10px", fontWeight: 500 }}
                      >
                        Appointment Type
                        <Radio
                          checked={selectAppointmentType === "online"}
                          onClick={appointmentTypeHandle}
                          value="online"
                          inputProps={{ "aria-label": "Online" }}
                        />
                        Online
                        <Radio
                          checked={selectAppointmentType === "offline"}
                          onClick={appointmentTypeHandle}
                          value="offline"
                          inputProps={{ "aria-label": "Offline" }}
                        />{" "}
                        Offline
                      </Typography>
                    </div>
                  </form>
                </div>
              </div>
            </Grid>
            <div
              style={{ marginTop: "10px", width: "97%", marginLeft: "15px" }}
            >
              <ThemeProvider>
                <Typography style={{ marginBottom: "10px", fontWeight: 500 }}>
                  Choose slot
                </Typography>
                <hr></hr>
                {dateList.map((item, index) => {
                  return (
                    <Button
                      size="small"
                      className={`${classes.Button2} ${
                        index === selectedButtonIndex
                          ? classes.ButtonActive2
                          : ""
                      }`}
                      onClick={() => dateClickhandler(index)}
                    >
                      {item}
                    </Button>
                  );
                })}
              </ThemeProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  className={classes.picker}
                  // disableToolbar
                  variant="dialog"
                  autoOk
                  format="dd/MM/yyyy"
                  margin="normal"
                  animateYearScrolling
                  value={selectedDate}
                  onChange={(e) => calendarClickhandler(e)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
              <Grid
                container
                style={{
                  border: "2px solid #e3e3e3",
                  borderRadius: "5px",
                  padding: "25px 10px",
                }}
              >
                {slotList.map((item) => {
                  return (
                    <Grid item spacing={2}>
                      <Paper className={classes.paper}>
                        {item.value == selectedSlot ? (
                          <Button
                            className={classes.selectedButton}
                            onClick={() => slotButtonClickHandle(item.value)}
                            variant="contained"
                          >
                            {item.label}
                          </Button>
                        ) : (
                          <Button
                            className={classes.Button}
                            variant="contained"
                            onClick={() => slotButtonClickHandle(item.value)}
                          >
                            {item.label}
                          </Button>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            <div
              style={{ marginTop: "25px", width: "97%", marginLeft: "15px" }}
            >
              {/* <ThemeProvider theme={theme}> */}
              <Typography style={{ marginBottom: "10px", fontWeight: 500 }}>
                Choose Your Payment Details
              </Typography>
              <Grid
                container
                style={{
                  border: "2px solid #e3e3e3",
                  borderRadius: "5px",
                  padding: "25px 10px",
                }}
              >
                <Grid item>
                  <Typography
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Add the Payment details below.
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <Radio
                        checked={selectedValue === "card"}
                        onChange={paymentOption}
                        value="card"
                        inputProps={{ "aria-label": "Card" }}
                      />{" "}
                      Card
                      <Radio
                        checked={selectedValue === "cash"}
                        onChange={paymentOption}
                        value="cash"
                        inputProps={{ "aria-label": "Cash" }}
                      />{" "}
                      Cash
                      <Radio
                        checked={selectedValue === "upi"}
                        onChange={paymentOption}
                        value="upi"
                        inputProps={{ "aria-label": "UPI" }}
                      />{" "}
                      UPI
                    </div>
                  </Typography>
                  <Grid container>
                    <Grid item className={classes.formsectionpayment}>
                      {selectedValue !== "cash" ? (
                        <TextField
                          style={{ marginLeft: "10px" }}
                          label="Transaction Number"
                          id="standard-size-small"
                          placeholder="xxxxxxxxxxxx"
                          size="small"
                          variant="filled"
                          onChange={transactionHandler}
                        />
                      ) : (
                        <Button
                          style={{
                            marginLeft: "10px",
                            border: "1px solid #979797",
                            borderRadius: "30px",
                            width: "120px",
                          }}
                        >
                          ₹ 500
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>

        <div className="action onboarding-action-buttons">
          <Button
            variant="contained"
            className="doctor-onboarding-cancel-btn"
            // onClick={cancelDetails}
          >
            Cancel
          </Button>

          <Button
            id="submit"
            size="small"
            variant="contained"
            onClick={handleAddAppointment}
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