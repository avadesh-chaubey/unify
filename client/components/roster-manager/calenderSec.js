import Calendar from "react-calendar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAlert, types } from "react-alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
// import time from "../../data/time.json";
import time from "../../data/timeRoster.json";
import timeMorning from "../../data/timeRosterMorning.json";
import timeAfterNoon from "../../data/timeRosterAfterNoon.json";
import timeEvening from "../../data/timeRosterEvening.json";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function CalenderSec(props) {
  console.log("props in CalenderSec: ", props);
  let doctorSelected = props.doctorSelected;
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);

  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [slotSelectedDay, setSlotSelectedDay] = useState([]);

  // const timeData = timeMorning;
  const [timeData, setTimeData] = useState(timeMorning);
  const [timeSlotArr, setTimeSlotArr] = useState(timeData);
  const [leaveBtnFlag, setLeaveBtnFlag] = useState("show");
  const [consultType, setConsultType] = useState("");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const consultTypeArr = [
    { name: "Physical Consultation", value: "physical-consultation" },
    { name: "Video Consultation", value: "video-consultation" },
    { name: "Both", value: "both" },
  ];
  const alert = useAlert();
  // useEffect(()=>{
  //   if (doctorSelected.id !== undefined) {
  //     setDate(new Date());
  //     let tempDate = moment(date).format("YYYY-MM-DD");
  //     checkSlotOnselectedday(tempDate);
  //   }
  // },[doctorSelected])
  const onDateChange = (date) => {
    console.log("date: ", date);
    let tempDate = moment(date).format("YYYY-MM-DD");
    console.log("tempdate: ", tempDate);
    setDate(new Date(date));
  };

  const onMonthChange = ({ activeStartDate, view }) => {
    console.log("activeStartDate: ", activeStartDate);
    console.log("view: ", view);
  };
  const onSlotBtnClick = (i, item) => {
    // Allow to select multiple time slot
    let temptimeSlot = [...timeSlotArr];

    // Booked slot cannot be updated
    if (!temptimeSlot[i].booked) {
      temptimeSlot[i].selected = !item.selected;

      // Uncheck slot error
      if (temptimeSlot[i].error) {
        temptimeSlot[i].selected = false;
        temptimeSlot[i].error = !item.error;
      }

      setTimeSlotArr(temptimeSlot);
    }
  };
  const [rosterType, setRosterType] = useState("weekly");

  const handleRosterType = (event) => {
    setRosterType(event.target.value);
  };
  const [slotTiming, setSlotTiming] = useState("morning");

  const handleSlotTiming = (event) => {
    setSlotTiming(event.target.value);
  };
  useEffect(() => {
    console.log("slotTiming: ", slotTiming);
    if (slotTiming === "morning") {
      setTimeData(timeMorning);
    } else if (slotTiming === "afternoon") {
      setTimeData(timeAfterNoon);
    } else if (slotTiming === "evening") {
      setTimeData(timeEvening);
    }
  }, [slotTiming]);
  useEffect(() => {
    console.log("timeData: ", timeData);
    setTimeSlotArr(timeData);
  }, [timeData]);
  const saveSlot = () => {
    console.log("saveSlot: ", consultType);
  };
  return (
    <div className="calenderSec">
      <div className="rosterRadio">
        <RadioGroup
          row
          style={{ visibility: "hidden" }}
          aria-label="Roster Type"
          name="Roster Type"
          value={rosterType}
          onChange={handleRosterType}
        >
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          <FormControlLabel
            value="monthly"
            control={<Radio />}
            label="Monthly"
          />
          {/* <FormControlLabel value="month" control={<Radio />} label="Month" /> */}
        </RadioGroup>
        <RadioGroup
          row
          aria-label="Slot Timing"
          name="Slot Timing"
          value={slotTiming}
          onChange={handleSlotTiming}
        >
          <FormControlLabel
            value="morning"
            control={<Radio />}
            label="Morning"
          />
          <FormControlLabel
            value="afternoon"
            control={<Radio />}
            label="After Noon"
          />
          <FormControlLabel
            value="evening"
            control={<Radio />}
            label="Evening"
          />
        </RadioGroup>
      </div>
      <div className="calander">
        <Calendar
          // tileClassName = {showLeaveMark}
          onChange={onDateChange}
          value={date}
          // tileClassName={({ date, view }) => {
          //     if(leaveDayArr.find(x=>x===moment(date).format("YYYY-MM-DD"))){
          //         return  'leaveMark'
          //     }
          // }}
          // tileContent={({ date, view }) => {
          //   if (
          //     leaveDayArr.find((x) => x === moment(date).format("YYYY-MM-DD"))
          //   ) {
          //     return <span className="redDot">.</span>;
          //   }
          // }}
          onActiveStartDateChange={onMonthChange}
        />
      </div>
      <div className="slotSec">
        <div style={{ height: "65px" }}>
          <TextField
            id="consultType"
            select
            label="Consultation Type"
            value={consultType}
            onChange={(e) => setConsultType(e.target.value)}
            // helperText="Please select your currency"
            style={{ width: "200px", marginLeft: "20px" }}
          >
            {consultTypeArr.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {timeData.length > 0 && (
          <div className="timeSlots">
            <div className="addNewSlot">
              <div className="apmtTimeSlot">
                {timeData.map((item, index) => {
                  return (
                    <div
                      id={`select-time-slot-${index}`}
                      className={`timeBtn slot-time-btn ${
                        item.selected == true ? "slotSelected" : ""
                      } ${item.booked ? "slotError" : ""} ${
                        item.error ? "slotError" : ""
                      }`}
                      key={index}
                      onClick={() => onSlotBtnClick(index, item)}
                    >
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {timeData.length > 0 && (
          <div className="timeSlots">
            <div className="action">
              <Button
                id="update-time-slot"
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button forward"
                // type="submit"
                onClick={saveSlot}
              >
                UPDATE
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalenderSec;
