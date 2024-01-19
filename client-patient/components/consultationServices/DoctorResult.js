import React, { useState, useEffect } from "react";
import {
  Typography,
  InputLabel,
  Breadcrumbs,
  Link,
  MenuItem,
  ListSubheader,
  InputBase,
  Select,
  Grid,
  FormControl,
  SvgIcon,
  TextField,
  Button,
  Card,
  FormLabel,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import DialogTitle from "@material-ui/core/DialogTitle";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DoctorList from "../consultationServices/DoctorList";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import { useCookies } from "react-cookie";
import config from "../../app.constant";
import axios from "axios";
import router from "next/router";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: "#f6f7fa",
    padding: " 15px 60px",
  },
  title: {
    color: "#4B2994",
    fontSize: "16px",
    fontWeight: "bold",
  },
  breadCrum: {
    color: "#4B2994",
  },
  AccordionSummary: {
    // backgroundColor:'red',
    "&.MuiAccordionSummary-root": {
      display: "inline-flex",
      padding: "0px 16px",
      minHeight: "48px",
      transition:
        "min-height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;",
    },
  },
  accordionDetails: {
    "&.MuiAccordionDetails-root": {
      display: "inline-block",
      padding: "8px 16px 16px",
      width: "100%",
      overflowY: "scroll",
      height: "195px",
    },
    "&::-webkit-scrollbar": {
      width: "10px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "nset 0 0 6px grey",
      borderRadius: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#cccaca",
      borderRadius: "15px",
      height: "20px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#949292",
      maxHeight: "20px",
    },
  },
  heading: {
    fontFamily: "Avenir_heavy !important",
    color: "#555555",
    paddingLeft: "23px",
    paddingRight: "153px",
  },
  mainAccordion: {
    "&.MuiAccordion-root:before": {
      display: "none",
    },
  },
  consultationHeading: {
    fontFamily: "Avenir_heavy !important",
    color: "#555555",
    paddingLeft: "23px",
    paddingRight: "90px",
  },
  expHeading: {
    fontFamily: "Avenir_heavy !important",
    color: "#555555",
    paddingLeft: "23px",
    paddingRight: "143px",
  },
}));
const timeList = [
  "Any Time",
  "Next 2hours",
  "Today",
  "Tomorrow",
  "Wednesday, 12 Jan",
  "Thursday, 13 Jan",
];
const expList = [
  "0-2 Years",
  "2.5 Years",
  "5-10 Years",
  "10-15 Years",
  "15-20 Years",
  "20> Years",
];
export default function DoctorResult(props) {
  const {
    docSelect,
    setView,
    selectedUnit,
    selectedSpec,
    setSelectedSpec,
    currentLink,
  } = props;
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [value, setValue] = React.useState("Physical Consultation");
  const [specialityArr, setSpecialityArr] = useState([]);
  const [doctList, setDocList] = useState([]);
  const [selectedSpeciality, setselectedSpeciality] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  // const [speciality, setSpeciality]=useState([])
  const headers = {
    authtoken: cookies["cookieVal"],
  };
  useEffect(() => {
    let query = window.location.search;
    let queryParams = new URLSearchParams(query);
    const hospitalUID = queryParams.get("hospitalUID");
    const specailityUID = queryParams.get("specailityUID");
    console.log("hospitalUID: ", hospitalUID);
    console.log("specailityUID: ", specailityUID);

    let url = "";
    if(query != ""){
      // &date=${moment(new Date()).format('YYYY-MM-DD')}
      url = `${config.API_URL}/api/patient/doctors?hospitalUID=${hospitalUID}&specailityUID=${specailityUID}`
      searchdoctor(url);
    } else {
      let tempPatientData = JSON.parse(localStorage.getItem("userDetails"));
      // console.log("patientData @@@@: ", JSON.parse(tempPatientData.data));
      axios
        .get(
          `${config.API_URL}/api/patient/patientbyid/${tempPatientData.id}`,
          { headers }
        )
        .then((res) => {
          console.log("res patientbyid: ", res);
          let data = res.data.data;
          console.log("data: ", data);
          url = `${config.API_URL}/api/patient/doctors?hospitalUID=${
            data.ownerOrganisationUID
          }&date=${moment(new Date()).format("YYYY-MM-DD")}`;
          searchdoctor(url);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, []);
  function searchdoctor(url) {
    console.log("url: ", url);
    axios
      // .get(`${config.API_URL}/api/patient/doctors?hospitalUID=1&date=2022-02-02&time=12:00&earliestAvailable=true`+query, { headers })
      .get(url, { headers })
      .then((res) => {
        let data = res.data.data;
        console.log("res data: ", res.data);
        console.log("res data: ", data);
        setDocList(data.doctors);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
  const handleChange = (item) => {
    setSelectedSpec(item);
    // setValue(event.target.value);
    console.log("=========>value", event.target.value);
  };

  const handleChangeSpecility = (event) => {
    setselectedSpeciality(event.target.value);
    // setValue(event.target.value);
    console.log("=========>value", event.target.value);
  };
  const handleChangeTime = (event) => {
    setSelectedTime(event.target.value);
  };
  const handleChangeExperience = (event) => {
    setSelectedExperience(event.target.value);
  };

  function goBack() {
    window.history.back();
  }

  function handleClick(event) {
    event.preventDefault();
    console.info("Clicked a breadcrumb.");
  }
  useEffect(() => {
    axios
      .get(config.API_URL + "/api/patient/speciality", { headers })
      .then((res) => {
        console.log("======>resSpeciality: ", res);
        setSpecialityArr(res.data.data);
        console.log("======>speciality", speciality);
      })
      .catch((err) => {
        console.log("======>speciality", err);
      });
  }, []);

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

  const searchHeandler = (value) => {
    console.log("value: ", value);
    searchdoctor(value);
  };
  console.log("=====>doctList", doctList);
  return (
    <>
      <HeadBreadcrumbs
        titleArr={
          currentLink === "bookAppointment"
            ? ["Home", "Book Appointment", "Consultation Services"]
            : ["Home", "Find a Doctor"]
        }
        lastTitle={"Select Doctor"}
        mainTitle={"Select Doctor"}
      />
      <Grid container>
        {/* <Grid item xs={12} style={{ backgroundColor: "#152A75" }}>
          <DialogTitle id="alert-dialog-title">
            <KeyboardBackspaceIcon
              style={{
                fontSize: "40px",
                position: "absolute",
                color: "#fff",
                marginLeft: "30px",
                marginTop: "-5px",
              }}
              onClick={goBack}
            />
            <div
              style={{
                marginLeft: "80px",
                fontSize: "20px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Doctor Result: 03
            </div>
          </DialogTitle>
        </Grid> */}
      </Grid>
      <Grid container>
        <Grid item xs={4}>
          <Card
            style={{
              backgroundColor: "#F6F7FA",
              marginLeft: "60px",
              marginTop: "20px",
              height: "550px",
            }}
          >
            <div className="sideMenuText">Filter</div>
            <hr />
            <div style={{ marginLeft: "30px", color: "#707070" }}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Consultation"
                  name="controlled-radio-buttons-group"
                  //value={value}
                  defaultValue="Physical Consultation"
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="Physical Consultation"
                    control={<Radio color="primary" />}
                    label="Physical Consultation"
                  />
                  <FormControlLabel
                    value="Video Consultation"
                    control={<Radio color="primary" />}
                    label="Video Consultation"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <hr />
            <Accordion
              disableGutters
              elevation={0}
              TransitionProps={{
                timeout: 300,
              }}
              className={classes.mainAccordion}
              style={{ backgroundColor: "#F6F7FA" }}
            >
              <AccordionSummary
                className={classes.AccordionSummary}
                expandIcon={
                  <ExpandMoreIcon
                    style={{ color: "#555555", pointerEvents: "none" }}
                  />
                }
                aria-controls="speciality-content"
                id="speciality-header"
              >
                <Typography className={classes.heading}>Speciality</Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className={classes.accordionDetails}>
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={selectedSpeciality}
                  onChange={handleChangeSpecility}
                >
                  {specialityArr.map((item) => {
                    return (
                      <FormControlLabel
                        value={item.specialityName}
                        control={<Radio color="primary" size="small" />}
                        label={item.specialityName}
                      />
                    );
                  })}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
            <hr />
            <Accordion
              disableGutters
              elevation={0}
              TransitionProps={{
                timeout: 300,
              }}
              className={classes.mainAccordion}
              style={{ backgroundColor: "#F6F7FA" }}
            >
              <AccordionSummary
                className={classes.AccordionSummary}
                expandIcon={
                  <ExpandMoreIcon
                    style={{ color: "#555555", pointerEvents: "none" }}
                  />
                }
                aria-controls="speciality-content"
                id="speciality-header"
              >
                <Typography className={classes.consultationHeading}>
                  Consultation Time
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className={classes.accordionDetails}>
                <RadioGroup
                  aria-label="time"
                  name="time"
                  value={selectedTime}
                  onChange={handleChangeTime}
                >
                  {timeList.map((item) => {
                    return (
                      <FormControlLabel
                        value={item}
                        control={<Radio color="primary" size="small" />}
                        label={item}
                      />
                    );
                  })}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
            <hr />
            <Accordion
              disableGutters
              elevation={0}
              TransitionProps={{
                timeout: 300,
              }}
              className={classes.mainAccordion}
              style={{ backgroundColor: "#F6F7FA" }}
            >
              <AccordionSummary
                className={classes.AccordionSummary}
                expandIcon={
                  <ExpandMoreIcon
                    style={{ color: "#555555", pointerEvents: "none" }}
                  />
                }
                aria-controls="speciality-content"
                id="speciality-header"
              >
                <Typography className={classes.expHeading}>
                  Experience
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails className={classes.accordionDetails}>
                <RadioGroup
                  aria-label="experience"
                  name="experience"
                  value={selectedExperience}
                  onChange={handleChangeExperience}
                >
                  {expList.map((item) => {
                    return (
                      <FormControlLabel
                        value={item}
                        control={<Radio color="primary" size="small" />}
                        label={item}
                      />
                    );
                  })}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
          </Card>
          <br />
          <br />
        </Grid>

        <br />
        <br />
        <br />
        <Grid item xs={8} justifyContent="space-between">
          <InputBase
            onChange={(e) => searchHeandler(e.target.value)}
            placeholder="Search Doctor"
            className="searchInput"
            //startAdornment={<SearchIcon fontSize="small" style={{marginRight:'4px'}} />}
            startAdornment={
              <img
                src="/search.svg"
                height="20"
                width="20"
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
              />
            }
          />
          <Button
            style={{
              backgroundColor: "#f6f7fa",
              borderRadius: "5px",
              height: "45px",
              marginBottom: "15px",
              marginLeft: "10px",
              textTransform: "capitalize",
            }}
            variant="Filter"
            color="default"
            //className="filterButton"
            endIcon={<ExpandMoreIcon />}
          >
            Sort
          </Button>
          <div style={{ marginLeft: "15px" }}>
            <DoctorList
              doctList={doctList}
              docSelect={docSelect}
              setView={setView}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
