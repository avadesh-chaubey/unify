import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import time from "../../data/timeRoster.json";
import days from "../../data/day.json";
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
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import CalanderSection from "../roster-manager/calender-section";
function DoctorsDetails(props) {
  // console.log("props in doctor details: ",props);
  let doctorSelected = props.doctorSelected;
  const [consltFee, setConsltFee] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [timing, setTiming] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [responseData, setResponseData] = useState([]);
  const [slotSelectedDay, setSlotSelectedDay] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cookies, getCookie] = useCookies(["name"]);
  // const [monFromVal, setMonFromVal] = useState(-1);
  // const [tueFromVal, setTueFromVal] = useState(-1);
  // const [wedFromVal, setWedFromVal] = useState(-1);
  // const [thuFromVal, setThuFromVal] = useState(-1);
  // const [friFromVal, setFriFromVal] = useState(-1);
  // const [satFromVal, setSatFromVal] = useState(-1);
  // const [sunFromVal, setSunFromVal] = useState(-1);
  const alert = useAlert();

  useEffect(() => {
    if (doctorSelected.id !== undefined) {
      fetchTimeslot(doctorSelected.id);
      setConsltFee(doctorSelected.consultationChargesInINR);
    }
  }, [doctorSelected]);

  const fetchTimeslot = (id) => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    if (doctorSelected.userType === 'physician:assistant') {
      const data = {
        assistantId: id,
      };
      axios
        .post(config.API_URL + `/api/appointment/assistanttimetable`, data, {
          headers,
        })
        .then((response) => {
          setLoader(false);
          if (response.data) {
            setResponseData(response.data.data);
            let WorkingTmpArray = [];
            days.forEach((item) => {
              let obj = {};
              obj.id = item.id;
              obj.day = item.day;
              obj.checked = false;
              obj.timeSlot = [{ timeFrom: "", timeTo: "" }];
              if (response.data.mondayAvailability && item.day == "Monday") {
                let data = showTimeSlotForAssist(response.data.data.mondayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.tuesdayAvailability && item.day == "Tuesday") {
                let data = showTimeSlotForAssist(response.data.tuesdayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.wednesdayAvailability && item.day == "Wednesday") {
                let data = showTimeSlotForAssist(response.data.wednesdayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.thursdayAvailability && item.day == "Thursday") {
                let data = showTimeSlotForAssist(response.data.thursdayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.fridayAvailability && item.day == "Friday") {
                let data = showTimeSlotForAssist(response.data.fridayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.saturdayAvailability && item.day == "Saturday") {
                let data = showTimeSlotForAssist(response.data.saturdayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (response.data.sundayAvailability && item.day == "Sunday") {
                let data = showTimeSlotForAssist(response.data.sundayAvailability);
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              WorkingTmpArray.push(obj);
            });
            setTiming(WorkingTmpArray);
          } else {
            setTiming(emptyTimeArr());
          }
        })
        .catch((error) => {
          // alert.show('Api error', { type: 'error' });

          console.log('Fetch Timeslot Err', error);
          setTiming(emptyTimeArr());
          setLoader(false);
        });
    } else {
      axios
        .get(config.API_URL + `/api/appointment/slotstimetable/${id}`, {
          headers,
        })
        .then((response) => {
          if (response.data) {
            setResponseData(response.data);
            let WorkingTmpArray = [];
            days.forEach((item) => {
              let obj = {};
              obj.id = item.id;
              obj.day = item.day;
              obj.checked = false;
              obj.timeSlot = [{ timeFrom: "", timeTo: "" }];
              //   let dInd;
              if (
                response.data &&
                response.data.mondayAvailableSlotList.length > 0 &&
                item.day == "Monday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.mondayAvailableSlotList,
                  "Monday"
                );
              }
              if (
                response.data &&
                response.data.tuesdayAvailableSlotList.length > 0 &&
                item.day == "Tuesday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.tuesdayAvailableSlotList,
                  "Tuesday"
                );
              }
              if (
                response.data &&
                response.data.wednesdayAvailableSlotList.length > 0 &&
                item.day == "Wednesday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.wednesdayAvailableSlotList,
                  "Wednesday"
                );
              }
              if (
                response.data &&
                response.data.thursdayAvailableSlotList.length > 0 &&
                item.day == "Thursday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.thursdayAvailableSlotList,
                  "Thursday"
                );
              }
              if (
                response.data &&
                response.data.fridayAvailableSlotList.length > 0 &&
                item.day == "Friday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.fridayAvailableSlotList,
                  "Friday"
                );
              }
              if (
                response.data &&
                response.data.saturdayAvailableSlotList.length > 0 &&
                item.day == "Saturday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.saturdayAvailableSlotList,
                  "Saturday"
                );
              }
              if (
                response.data &&
                response.data.sundayAvailableSlotList.length > 0 &&
                item.day == "Sunday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.sundayAvailableSlotList,
                  "Sunday"
                );
              }
              WorkingTmpArray.push(obj);
            });
            //  console.log("WorkingTmpArray: ",WorkingTmpArray)
            setTiming(WorkingTmpArray);
          } else {
            setTiming(emptyTimeArr());
            setResponseData([]);
          }
          setLoader(false);
        })
        .catch((error) => {
          // alert.show('Api error', { type: 'error' });
          setTiming(emptyTimeArr());
          setResponseData([]);
          console.log(error);
          setLoader(false);
        });
    }
  };
  const timeData = time;
  function showTimeSlot(arr, day) {
    let newTimeSlot = [];
    let st;
    let end;
    st = parseInt(arr[0]);
    for (let i = 0; i < arr.length; i++) {
      let obj = {};
      if (parseInt(arr[i]) + 1 != parseInt(arr[i + 1])) {
        end = parseInt(arr[i]) + 1;
        timeData.map((item) => {
          if (item.value == st) {
            obj.timeFrom = item.label;
          }
          if (item.value == end) {
            obj.timeTo = item.label;
          }
        });
        newTimeSlot.push(obj);
        st = parseInt(arr[i + 1]);
      }
    }
    return newTimeSlot;
  }

  function showTimeSlotForAssist(data) {
    // console.log("item : ",data);
    let obj = {
      timeFrom: '',
      timeTo: ''
    };
    timeData.map((item) => {
      if (item.value == data.shiftFirstSlotId && data.weeklyDayOff !== true) {
        obj.timeFrom = item.label;
      }
      if (item.value == data.shiftLastSlotId + 1 && data.weeklyDayOff !== true) {
        obj.timeTo = item.label;
      }
    });
    obj.checked = !data.weeklyDayOff;
    // console.log("obj: ",obj);
    return obj;
  }
  const DEFAULT_FROM_TIME = "";
  const DEFAULT_TO_TIME = "";
  function emptyTimeArr() {
    const WorkingTimeArray = [];
    days.forEach((item) => {
      let obj = {};
      obj.id = item.id;
      obj.day = item.day;
      obj.timeSlot = [{ timeFrom: DEFAULT_FROM_TIME, timeTo: DEFAULT_TO_TIME }];
      //  obj.timeFrom = DEFAULT_FROM_TIME;
      //  obj.timeTo = DEFAULT_TO_TIME;
      obj.checked = false;
      WorkingTimeArray.push(obj);
    });
    return WorkingTimeArray;
  }
  useEffect(() => {
    setTiming(emptyTimeArr());
  }, []);

  // function changeTimeSlotDay(day) {
  //   if (responseData.id != undefined) {
  //     if (day == 1) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.mondayAvailableSlotList, "Monday")
  //       );
  //     }
  //     if (day == 2) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.tuesdayAvailableSlotList, "Tuesday")
  //       );
  //     }
  //     if (day == 3) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.wednesdayAvailableSlotList, "Wednesday")
  //       );
  //     }
  //     if (day == 4) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.thursdayAvailableSlotList, "Thursday")
  //       );
  //     }
  //     if (day == 5) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.fridayAvailableSlotList, "Friday")
  //       );
  //     }
  //     if (day == 6) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.saturdayAvailableSlotList, "Saturday")
  //       );
  //     }
  //     if (day == 0) {
  //       setSlotSelectedDay(
  //         showTimeSlot(responseData.sundayAvailableSlotList, "Sunday")
  //       );
  //     }
  //   } else {
  //     // console.log("in else: ",responseData);
  //     setSlotSelectedDay([]);
  //   }
  // }
  // useEffect(() => {
  //   changeTimeSlotDay(date.getDay());
  // }, [responseData]);
  const onWorkTimeChange = (index, type, value, id) => {
    let currentWorkTime = [...timing];
    if (type === "DAY") {
      //  currentWorkTime[index].checked = !currentWorkTime[index].checked;
      currentWorkTime[id - 1].checked = !currentWorkTime[id - 1].checked;
    } else if (type === "FROM_TIME") {
      // timeData.map((item) => {
      //   if (item.label === value) {
      //     switch (id) {
      //       case 1:
      //         setMonFromVal(item.id);
      //         break;
      //       case 2:
      //         setTueFromVal(item.id);
      //         break;
      //       case 3:
      //         setWedFromVal(item.id);
      //         break;
      //       case 4:
      //         setThuFromVal(item.id);
      //         break;
      //       case 5:
      //         setFriFromVal(item.id);
      //         break;
      //       case 6:
      //         setSatFromVal(item.id);
      //         break;
      //       case 7:
      //         setSunFromVal(item.id);
      //         break;
      //     }
      //   }
      // });
      currentWorkTime[id - 1].timeSlot[index].timeFrom = value;
      //  currentWorkTime[index].timeFrom = value;
    } else if (type === "TO_TIME") {
      // timeData.map((item) => {
      //   if (item.label === value) {
      //     switch (id) {
      //       case 1:
      //         setMonFromVal(item.id);
      //         break;
      //       case 2:
      //         setTueFromVal(item.id);
      //         break;
      //       case 3:
      //         setWedFromVal(item.id);
      //         break;
      //       case 4:
      //         setThuFromVal(item.id);
      //         break;
      //       case 5:
      //         setFriFromVal(item.id);
      //         break;
      //       case 6:
      //         setSatFromVal(item.id);
      //         break;
      //       case 7:
      //         setSunFromVal(item.id);
      //         break;
      //     }
      //   }
      // });
      currentWorkTime[id - 1].timeSlot[index].timeTo = value;
      //  currentWorkTime[index].timeTo = value;
    }
    setTiming(currentWorkTime);
  };

  const handleAddSlot = (i, item) => {
    // e.preventDefault();
    const values = [...timing];
    values[i].timeSlot.push({ timeFrom: "", timeTo: "" });
    setTiming(values);
  };

  const handleRemoveSlot = (index, itemId) => {
    console.log("i ", index);
    console.log("itemid ", itemId);
    const values = [...timing];
    console.log("values: ", values);
    values[itemId - 1].timeSlot.splice(index, 1);
    setTiming(values);
  };
  const saveSchedule = () => {
    let obj = {};
    obj.consultantId = doctorSelected.id;
    // let flag = false;
    // timing.forEach((item) => {
    //   if (item.checked == true) {
    //     flag = true;
    //   }
    // });
    // if (flag == false) {
    //   // alert.show("Please Select Time Schedule",{ type: "error" });
    //   props.setMsgData({message:'Please Select Time Schedule',type: "error"});
    //   return false;
    // }
    if (timing[0].checked === true) {
      obj.mondayAvailableSlotList = fetchSlotFromArr(timing[0].timeSlot);
    } else {
      obj.mondayAvailableSlotList = [];
    }
    if (timing[1].checked === true) {
      obj.tuesdayAvailableSlotList = fetchSlotFromArr(timing[1].timeSlot);
    } else {
      obj.tuesdayAvailableSlotList = [];
    }
    if (timing[2].checked === true) {
      obj.wednesdayAvailableSlotList = fetchSlotFromArr(timing[2].timeSlot);
    } else {
      obj.wednesdayAvailableSlotList = [];
    }
    if (timing[3].checked === true) {
      obj.thursdayAvailableSlotList = fetchSlotFromArr(timing[3].timeSlot);
    } else {
      obj.thursdayAvailableSlotList = [];
    }
    if (timing[4].checked === true) {
      obj.fridayAvailableSlotList = fetchSlotFromArr(timing[4].timeSlot);
    } else {
      obj.fridayAvailableSlotList = [];
    }
    if (timing[5].checked === true) {
      obj.saturdayAvailableSlotList = fetchSlotFromArr(timing[5].timeSlot);
    } else {
      obj.saturdayAvailableSlotList = [];
    }
    if (timing[6].checked === true) {
      obj.sundayAvailableSlotList = fetchSlotFromArr(timing[6].timeSlot);
    } else {
      obj.sundayAvailableSlotList = [];
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    console.log("obj : ", obj);
    // return false;
    setLoader(true);
    if (doctorSelected.userType === 'physician:assistant') {
      saveAssistSchedule(obj, headers);
    } else {
      const consultationChargesData = {
        consultantId: doctorSelected.id,
        consultationCharge: consltFee,
        locationBasedFeeConfig: doctorSelected.locationBasedFeeConfig
      };

      axios
        .put(
          config.API_URL + "/api/partner/consultationcharge",
          consultationChargesData,
          { headers }
        )
        .then((response) => {
          console.log(response.data);

          props.consultFeeUpdate(doctorSelected.id);
        })
        .catch((error) => {
          // setLoader(false);
          // alert.show(error.response.data.errors[0].message, { type: "error" });
          props.setMsgData({ message: error.response.data.errors[0].message, type: "error" });
          console.log(error);
        });
      axios
        .post(config.API_URL + "/api/appointment/slotstimetable", obj, {
          headers,
        })
        .then((response) => {
          console.log(response.data);
          fetchTimeslot(doctorSelected.id);
          setLoader(false);
          // alert.show("Roster Updated", { type: "success" });
          props.setMsgData({ message: "Roster Updated", type: "success" });

        })
        .catch((error) => {
          setLoader(false);
          // alert.show(error.response.data.errors[0].message, { type: "error" });
          props.setMsgData({ message: error.response.data.errors[0].message, type: "error" });
          console.log(error);
        });
    }


  };
  function saveAssistSchedule(obj, headers) {
    console.log("obj in assist: ", obj);
    let assistObj = {
      assistantId: doctorSelected.id,
      mondayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      tuesdayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      wednesdayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      thursdayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      fridayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      saturdayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
      sundayAvailability: { shiftFirstSlotId: 0, shiftLastSlotId: 0, weeklyDayOff: true },
    };
    if (obj.mondayAvailableSlotList.length > 0) {
      assistObj.mondayAvailability.shiftFirstSlotId = obj.mondayAvailableSlotList[0];
      assistObj.mondayAvailability.shiftLastSlotId = obj.mondayAvailableSlotList[obj.mondayAvailableSlotList.length - 1];
      assistObj.mondayAvailability.weeklyDayOff = false;
    }
    if (obj.tuesdayAvailableSlotList.length > 0) {
      assistObj.tuesdayAvailability.shiftFirstSlotId = obj.tuesdayAvailableSlotList[0];
      assistObj.tuesdayAvailability.shiftLastSlotId = obj.tuesdayAvailableSlotList[obj.tuesdayAvailableSlotList.length - 1];
      assistObj.tuesdayAvailability.weeklyDayOff = false;
    }
    if (obj.wednesdayAvailableSlotList.length > 0) {
      assistObj.wednesdayAvailability.shiftFirstSlotId = obj.wednesdayAvailableSlotList[0];
      assistObj.wednesdayAvailability.shiftLastSlotId = obj.wednesdayAvailableSlotList[obj.wednesdayAvailableSlotList.length - 1];
      assistObj.wednesdayAvailability.weeklyDayOff = false;
    }
    if (obj.thursdayAvailableSlotList.length > 0) {
      assistObj.thursdayAvailability.shiftFirstSlotId = obj.thursdayAvailableSlotList[0];
      assistObj.thursdayAvailability.shiftLastSlotId = obj.thursdayAvailableSlotList[obj.thursdayAvailableSlotList.length - 1];
      assistObj.thursdayAvailability.weeklyDayOff = false;
    }
    if (obj.fridayAvailableSlotList.length > 0) {
      assistObj.fridayAvailability.shiftFirstSlotId = obj.fridayAvailableSlotList[0];
      assistObj.fridayAvailability.shiftLastSlotId = obj.fridayAvailableSlotList[obj.fridayAvailableSlotList.length - 1];
      assistObj.fridayAvailability.weeklyDayOff = false;
    }
    if (obj.saturdayAvailableSlotList.length > 0) {
      assistObj.saturdayAvailability.shiftFirstSlotId = obj.saturdayAvailableSlotList[0];
      assistObj.saturdayAvailability.shiftLastSlotId = obj.saturdayAvailableSlotList[obj.saturdayAvailableSlotList.length - 1];
      assistObj.saturdayAvailability.weeklyDayOff = false;
    }
    if (obj.sundayAvailableSlotList.length > 0) {
      assistObj.sundayAvailability.shiftFirstSlotId = obj.sundayAvailableSlotList[0];
      assistObj.sundayAvailability.shiftLastSlotId = obj.sundayAvailableSlotList[obj.sundayAvailableSlotList.length - 1];
      assistObj.sundayAvailability.weeklyDayOff = false;
    }

    console.log("assist obj: ", assistObj);
    axios
      .post(config.API_URL + "/api/appointment/assistanttimetable", assistObj, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        fetchTimeslot(doctorSelected.id);
        setLoader(false);
        // alert.show("Roster Updated", { type: "success" });
        props.setMsgData({ message: "Roster Updated", type: "success" });

      })
      .catch((error) => {
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({ message: error.response.data.errors[0].message, type: "error" });
        console.log(error);
      });
  }
  function fetchSlotFromArr(arr) {
    let newArr = [];
    let st;
    let end;
    for (let i = 0; i < arr.length; i++) {
      timeData.map((val) => {
        if (val.label == arr[i].timeFrom) {
          st = val.value;
        }
        if (val.label == arr[i].timeTo) {
          end = val.value;
        }
      });
      for (let j = st; j < end; j++) {
        if (newArr.indexOf(j) === -1) {
          newArr.push(j);
        }
      }
    }
    return newArr;
  }

  function videoFee(inputtxt) {
    setCost(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setCostError({ cost: "" });
    setCost(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setCostError({ cost: "Please enter a value in video Consultation fees" });
    }
  }

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      {doctorSelected.userFirstName ? (
        <div className="centerItemMain timeslot-view">
          <div className="centerItem timeslots-main">
            <div className="docname">
              <span style={{ fontWeight: "bold" }}>
                {doctorSelected.userFirstName + " " + doctorSelected.userLastName}{" "}
              </span>
              <div style={{ fontSize: '14px', lineHeight: '2' }}>
                {doctorSelected.userType === 'physician:assistant' ? 'assistant' : (doctorSelected.userType === 'facility:superuser' ? 'superuser' : doctorSelected.userType)}
              </div>
            </div>
            {
              doctorSelected.userType === 'physician:assistant' ? '' :

                <div className="consultation">
                  <div className="constText">Video Consultation Fee: </div>
                  <TextField
                    // select
                    label=""
                    // fullWidth
                    type="number"
                    className="feeField"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" style={{ marginTop: '5px' }}>₹</InputAdornment>
                      ),
                    }}
                    onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                    size="small"
                    variant="filled"
                    value={consltFee}
                    onChange={(e) => {
                      const fees = e.target.value;
                      if (fees >= 0) {
                        setConsltFee(fees);
                      }
                    }}
                  ></TextField>
                  {/* <TextField
              select
              label=""
              className="feeField"
              // fullWidth
              size="small"
              variant="filled"
              // margin='normal'
              value={currency}
              onChange={(e) => {}}
            >
              <MenuItem value="INR">INR</MenuItem>
            </TextField> */}
                </div>
            }
            <div className="slotPreferenceTime">
              {timing.map((item, index) => {
                return (
                  <div
                    key={item.day}
                    style={{
                      display: "flex",
                      // alignItems: 'center',
                      // paddingBottom: "3px",
                      verticalAlign: 'top',
                    }}
                  >
                    <div
                      style={{
                        color: "#7B7B7B",
                        width: "130px",
                        // width: "25%",
                        verticalAlign: "top",
                        marginTop: "15px",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`checkbox-${index}`}
                            checked={item.checked}
                            onChange={(e) => {
                              onWorkTimeChange(
                                index,
                                "DAY",
                                !item.checked,
                                item.id
                              );
                            }}
                          />
                        }
                        label={item.day}
                      />
                    </div>
                    <div
                      style={{
                        width: "50px",
                        // width: "12%",
                        color: "#555555",
                        fontSize: "14px",
                        margin: "0",
                        marginTop: "30px",
                      }}
                    >
                      Time:
                  </div>
                    <div style={{ width: "62%" }}>
                      {item.timeSlot.map((i, index) => {
                        return (
                          <div
                            style={{ width: "100%", marginTop: "10px" }}
                            key={index}
                          >
                            <div
                              style={{
                                minWidth: "115px",
                                margin: "0",
                                float: "left",
                                marginRight: "20px",
                                width: '38%'
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                select
                                size="small"
                                label={
                                  doctorSelected.userType === 'physician:assistant' ? 'Start time' : "From"}
                                style={{ marginBottom: "10px" }}
                                defaultValue={DEFAULT_FROM_TIME}
                                fullWidth
                                variant="filled"
                                value={i.timeFrom}
                                onChange={(e) => {
                                  onWorkTimeChange(
                                    index,
                                    "FROM_TIME",
                                    e.target.value,
                                    item.id
                                  );
                                }}
                              >
                                {timeData.map((elm) => {
                                  return (
                                    <MenuItem
                                      // disabled={
                                      //   (elm.id < monFromVal && item.id == 1) ||
                                      //   (elm.id < tueFromVal && item.id == 2) ||
                                      //   (elm.id < wedFromVal && item.id == 3) ||
                                      //   (elm.id < thuFromVal && item.id == 4) ||
                                      //   (elm.id < friFromVal && item.id == 5) ||
                                      //   (elm.id < satFromVal && item.id == 6) ||
                                      //   (elm.id <= sunFromVal && item.id == 7)
                                      // }
                                      id="select-time-from"
                                      value={elm.label}
                                      key={elm.id}
                                    >
                                      {elm.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </div>
                            <div
                              style={{
                                minWidth: "115px",
                                margin: "0",
                                float: "left",
                                width: '38%'
                                // marginRight: "10px",
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                defaultValue={DEFAULT_TO_TIME}
                                select
                                label={
                                  doctorSelected.userType === 'physician:assistant' ? 'End time' : "To"}
                                style={{ marginBottom: "10px" }}
                                fullWidth
                                size="small"
                                variant="filled"
                                value={i.timeTo}
                                onChange={(e) => {
                                  onWorkTimeChange(
                                    index,
                                    "TO_TIME",
                                    e.target.value,
                                    item.id
                                  );
                                }}
                              >
                                {timeData.map((element) => {
                                  //    console.log("askjdlf:", i.timeFrom)
                                  let temp;
                                  return (
                                    <MenuItem
                                      // disabled={
                                      //   (element.id <= monFromVal &&
                                      //     item.id == 1) ||
                                      //   (element.id <= tueFromVal &&
                                      //     item.id == 2) ||
                                      //   (element.id <= wedFromVal &&
                                      //     item.id == 3) ||
                                      //   (element.id <= thuFromVal &&
                                      //     item.id == 4) ||
                                      //   (element.id <= friFromVal &&
                                      //     item.id == 5) ||
                                      //   (element.id <= satFromVal &&
                                      //     item.id == 6) ||
                                      //   (element.id <= sunFromVal && item.id == 7)
                                      // }
                                      id="select-time-to"
                                      value={element.label}
                                      key={element.id}
                                    >
                                      {element.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </div>
                            {index > 0 && (
                              <button
                                className="removeIcon"
                                type="button"
                                onClick={() => handleRemoveSlot(index, item.id)}
                              >
                                <span className="minusLine"></span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {
                      doctorSelected.userType === 'physician:assistant' ? '' :
                        <div
                          className="plusBtn"
                          onClick={() => handleAddSlot(index, item)}
                        >
                          <span style={{ display: 'block', marginTop: '0' }}>+</span>
                        </div>
                    }
                  </div>
                );
              })}
            </div>
            {/* <div className="action">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              style={{ color: "#000", width: "125px" }}
              onClick={saveSchedule}
            >
              Save
            </Button>
          </div> */}

          </div>
          <div className="action save-slot-btn">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              style={{ color: "#000", width: "125px" }}
              onClick={saveSchedule}
            >
              Save
          </Button>
          </div>
        </div>
      ) : (
          ""
        )}
      {doctorSelected.userType != 'physician:assistant' && <CalanderSection
        responseData={responseData}
        doctorSelected={doctorSelected}
        setMsgData={props.setMsgData}
      />}
    </>
  );
}
export default DoctorsDetails;
