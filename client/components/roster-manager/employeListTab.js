import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Profile from "./profile";
import {
  makeStyles,
  CircularProgress,
  Box,
  Tab,
  Tabs,
  AppBar,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import config from "../../app.constant";
import CalenderSec from "./calenderSec";
import FeesSection from "./feesSection";
import { useCookies } from "react-cookie";
import DoctorRoster from "./doctorRoster";
import DoctorsDetails from "./doctors-details";
import DcotorCalender from "./doctorCalender/calender";
import RoasterCalender from "./roasterManagementCalender";
import RoasterSection from "./roasterManagementRoaster";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function EmployeListTab(props) {
  const classes = useStyles();
  const [cookies] = useCookies(["name"]);
  const [value, setValue] = useState(2);
  const [consultFeeUpdate, setConsultFeeUpdate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [tempDocList, setTempDocList] = useState([]);
  const [doctorSelected, setDoctorSelected] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = (val) => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/doctors", { headers })
      .then((response) => {
        if (response.data && response.data.length) {
          setDoctors(response.data);
          setTempDocList(response.data);

          if (val === "") {
            setDoctorSelected(response.data[0]);
          } else {
            response.data.map((item) => {
              if (item.id === val) {
                setDoctorSelected(item);
              }
            });
          }

          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData(consultFeeUpdate);
  }, [consultFeeUpdate]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Calender" {...a11yProps(0)} />
          <Tab label="Roaster" {...a11yProps(1)} />
          <Tab label="Profile" {...a11yProps(2)} />
          <Tab label="Fees" {...a11yProps(3)} />
          {/* <Tab label="Statistics" {...a11yProps(4)} /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {/* <div>Calender Sec</div> */}
        {/* Unify Care updated Mockup is in doctorCalender */}
        {/* <DcotorCalender doctorSelected={props.doctorSelected} /> */}
        {/* <CalenderSec doctorSelected={props.doctorSelected} /> */}
        <RoasterCalender
          responseData={[]}
          doctorSelected={props.doctorSelected}
          setMsgData={props.setMsgData}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Roster */}
        {/* <DoctorsDetails doctorSelected={props.doctorSelected} /> */}
        <RoasterSection
          doctorSelected={props.doctorSelected}
          consultFeeUpdate={setConsultFeeUpdate}
          setMsgData={props.setMsgData}
        />
        {/* <DoctorRoster /> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Profile
          doctorSelected={props.doctorSelected}
          // setDataDraft={props.setDataDraft}
          setMsgData={props.setMsgData}
        />
        {/* Profile Section */}
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FeesSection
          doctorSelected={props.doctorSelected}
          setMsgData={props.setMsgData}
          tempDocList={tempDocList}
          setTempDocList={setTempDocList}
        />
        {/* Fees Section */}
      </TabPanel>
      {/* <TabPanel value={value} index={4}>
        <div>Statistics Sec</div>
      </TabPanel> */}
    </div>
  );
}
