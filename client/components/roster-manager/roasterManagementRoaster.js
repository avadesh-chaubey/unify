import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import time from "../../data/timeRoster.json";
import days from "../../data/day.json";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  CircularProgress,
  Button,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export default function RoasterSection(props) {
  let doctorSelected = props.doctorSelected;
  const [consltFee, setConsltFee] = useState("");
  const [timing, setTiming] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cookies] = useCookies(["name"]);
  const [responseData, setResponseData] = useState([]);

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
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    if (doctorSelected.userType === "physician:assistant") {
      axios
        .get(config.API_URL + `/api/appointment/assistanttimetable/${id}`, {
          headers,
        })
        .then((response) => {
          setLoader(false);
          if (response.data.data) {
            setResponseData(response.data.data);
            let WorkingTmpArray = [];
            days.forEach((item) => {
              let obj = {};
              obj.id = item.id;
              obj.day = item.day;
              obj.checked = false;
              obj.timeSlot = [{ timeFrom: "", timeTo: "" }];
              if (
                response.data.data.mondayAvailability &&
                item.day == "Monday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.mondayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.tuesdayAvailability &&
                item.day == "Tuesday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.tuesdayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.wednesdayAvailability &&
                item.day == "Wednesday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.wednesdayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.thursdayAvailability &&
                item.day == "Thursday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.thursdayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.fridayAvailability &&
                item.day == "Friday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.fridayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.saturdayAvailability &&
                item.day == "Saturday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.saturdayAvailability
                );
                obj.checked = data.checked;
                obj.timeSlot[0].timeFrom = data.timeFrom;
                obj.timeSlot[0].timeTo = data.timeTo;
              }
              if (
                response.data.data.sundayAvailability &&
                item.day == "Sunday"
              ) {
                let data = showTimeSlotForAssist(
                  response.data.data.sundayAvailability
                );
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
          console.log("Fetch Timeslot Err", error);
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
            setResponseData(response.data.data);
            let WorkingTmpArray = [];
            days.forEach((item) => {
              let obj = {};
              obj.id = item.id;
              obj.day = item.day;
              obj.checked = false;
              obj.timeSlot = [{ timeFrom: "", timeTo: "" }];
              //   let dInd;
              if (
                response.data.data &&
                response.data.data.mondayAvailableSlotList.length > 0 &&
                item.day == "Monday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.mondayAvailableSlotList,
                  "Monday"
                );
              }
              if (
                response.data.data &&
                response.data.data.tuesdayAvailableSlotList.length > 0 &&
                item.day == "Tuesday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.tuesdayAvailableSlotList,
                  "Tuesday"
                );
              }
              if (
                response.data.data &&
                response.data.data.wednesdayAvailableSlotList.length > 0 &&
                item.day == "Wednesday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.wednesdayAvailableSlotList,
                  "Wednesday"
                );
              }
              if (
                response.data.data &&
                response.data.data.thursdayAvailableSlotList.length > 0 &&
                item.day == "Thursday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.thursdayAvailableSlotList,
                  "Thursday"
                );
              }
              if (
                response.data.data &&
                response.data.data.fridayAvailableSlotList.length > 0 &&
                item.day == "Friday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.fridayAvailableSlotList,
                  "Friday"
                );
              }
              if (
                response.data.data &&
                response.data.data.saturdayAvailableSlotList.length > 0 &&
                item.day == "Saturday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.saturdayAvailableSlotList,
                  "Saturday"
                );
              }
              if (
                response.data.data &&
                response.data.data.sundayAvailableSlotList.length > 0 &&
                item.day == "Sunday"
              ) {
                obj.checked = true;
                obj.timeSlot = showTimeSlot(
                  response.data.data.sundayAvailableSlotList,
                  "Sunday"
                );
              }
              WorkingTmpArray.push(obj);
            });

            setTiming(WorkingTmpArray);
          } else {
            setTiming(emptyTimeArr());
            setResponseData([]);
          }
          setLoader(false);
        })
        .catch((error) => {
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
    let obj = {
      timeFrom: "",
      timeTo: "",
    };
    timeData.map((item) => {
      if (item.value == data.shiftFirstSlotId && data.weeklyDayOff !== true) {
        obj.timeFrom = item.label;
      }
      if (
        item.value == data.shiftLastSlotId + 1 &&
        data.weeklyDayOff !== true
      ) {
        obj.timeTo = item.label;
      }
    });
    obj.checked = !data.weeklyDayOff;

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
      obj.checked = false;
      WorkingTimeArray.push(obj);
    });
    return WorkingTimeArray;
  }
  useEffect(() => {
    setTiming(emptyTimeArr());
  }, []);

  const onWorkTimeChange = (index, type, value, id) => {
    let currentWorkTime = [...timing];
    if (type === "DAY") {
      currentWorkTime[id - 1].checked = !currentWorkTime[id - 1].checked;
    } else if (type === "FROM_TIME") {
      currentWorkTime[id - 1].timeSlot[index].timeFrom = value;
    } else if (type === "TO_TIME") {
      currentWorkTime[id - 1].timeSlot[index].timeTo = value;
    }
    setTiming(currentWorkTime);
  };

  const handleAddSlot = (i, item) => {
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
    const { locationBasedFeeConfig } = doctorSelected;

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
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    setLoader(true);
    if (doctorSelected.userType === "physician:assistant") {
      saveAssistSchedule(obj, headers);
    } else {
      axios
        .put(
          config.API_URL + "/api/partner/consultationcharge",
          {
            consultantId: doctorSelected.id,
            consultationCharge: consltFee,
            locationBasedFeeConfig: locationBasedFeeConfig,
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);

          props.consultFeeUpdate(doctorSelected.id);
        })
        .catch((error) => {
          props.setMsgData({
            message: error.response.data[0].message,
            type: "error",
          });
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
          props.setMsgData({ message: "Roster Updated", type: "success" });
        })
        .catch((error) => {
          setLoader(false);
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
          console.log(error);
        });
    }
  };
  function saveAssistSchedule(obj, headers) {
    console.log("obj in assist: ", obj);
    let assistObj = {
      assistantId: doctorSelected.id,
      mondayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      tuesdayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      wednesdayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      thursdayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      fridayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      saturdayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
      sundayAvailability: {
        shiftFirstSlotId: 0,
        shiftLastSlotId: 0,
        weeklyDayOff: true,
      },
    };
    if (obj.mondayAvailableSlotList.length > 0) {
      assistObj.mondayAvailability.shiftFirstSlotId =
        obj.mondayAvailableSlotList[0];
      assistObj.mondayAvailability.shiftLastSlotId =
        obj.mondayAvailableSlotList[obj.mondayAvailableSlotList.length - 1];
      assistObj.mondayAvailability.weeklyDayOff = false;
    }
    if (obj.tuesdayAvailableSlotList.length > 0) {
      assistObj.tuesdayAvailability.shiftFirstSlotId =
        obj.tuesdayAvailableSlotList[0];
      assistObj.tuesdayAvailability.shiftLastSlotId =
        obj.tuesdayAvailableSlotList[obj.tuesdayAvailableSlotList.length - 1];
      assistObj.tuesdayAvailability.weeklyDayOff = false;
    }
    if (obj.wednesdayAvailableSlotList.length > 0) {
      assistObj.wednesdayAvailability.shiftFirstSlotId =
        obj.wednesdayAvailableSlotList[0];
      assistObj.wednesdayAvailability.shiftLastSlotId =
        obj.wednesdayAvailableSlotList[
          obj.wednesdayAvailableSlotList.length - 1
        ];
      assistObj.wednesdayAvailability.weeklyDayOff = false;
    }
    if (obj.thursdayAvailableSlotList.length > 0) {
      assistObj.thursdayAvailability.shiftFirstSlotId =
        obj.thursdayAvailableSlotList[0];
      assistObj.thursdayAvailability.shiftLastSlotId =
        obj.thursdayAvailableSlotList[obj.thursdayAvailableSlotList.length - 1];
      assistObj.thursdayAvailability.weeklyDayOff = false;
    }
    if (obj.fridayAvailableSlotList.length > 0) {
      assistObj.fridayAvailability.shiftFirstSlotId =
        obj.fridayAvailableSlotList[0];
      assistObj.fridayAvailability.shiftLastSlotId =
        obj.fridayAvailableSlotList[obj.fridayAvailableSlotList.length - 1];
      assistObj.fridayAvailability.weeklyDayOff = false;
    }
    if (obj.saturdayAvailableSlotList.length > 0) {
      assistObj.saturdayAvailability.shiftFirstSlotId =
        obj.saturdayAvailableSlotList[0];
      assistObj.saturdayAvailability.shiftLastSlotId =
        obj.saturdayAvailableSlotList[obj.saturdayAvailableSlotList.length - 1];
      assistObj.saturdayAvailability.weeklyDayOff = false;
    }
    if (obj.sundayAvailableSlotList.length > 0) {
      assistObj.sundayAvailability.shiftFirstSlotId =
        obj.sundayAvailableSlotList[0];
      assistObj.sundayAvailability.shiftLastSlotId =
        obj.sundayAvailableSlotList[obj.sundayAvailableSlotList.length - 1];
      assistObj.sundayAvailability.weeklyDayOff = false;
    }

    axios
      .post(config.API_URL + "/api/appointment/assistanttimetable", assistObj, {
        headers,
      })
      .then((response) => {
        console.log(response.data);
        fetchTimeslot(doctorSelected.id);
        setLoader(false);
        props.setMsgData({ message: "Roster Updated", type: "success" });
      })
      .catch((error) => {
        setLoader(false);
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
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

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      {doctorSelected.userFirstName ? (
        <div className="centerItemMain roaster-section">
          <div className="centerItem roaster-center-item">
            <div className="docname">
              <span style={{ fontWeight: "bold" }}>
                {doctorSelected.userFirstName +
                  " " +
                  doctorSelected.userLastName}{" "}
              </span>
              <div style={{ fontSize: "14px", lineHeight: "2" }}>
                {doctorSelected.userType === "physician:assistant"
                  ? "assistant"
                  : doctorSelected.userType === "facility:superuser"
                  ? "superuser"
                  : doctorSelected.userType}
              </div>
            </div>

            <div className="slotPreferenceTime">
              {timing.map((item, itemIndex) => {
                return (
                  <div
                    key={item.day}
                    style={{
                      display: "flex",
                      // alignItems: 'center',
                      // paddingBottom: "3px",
                      verticalAlign: "top",
                    }}
                  >
                    <div className="slot-days">
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`checkbox-${itemIndex}`}
                            checked={item.checked}
                            onChange={(e) => {
                              onWorkTimeChange(
                                itemIndex,
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
                    <div className="user-time-slot-div">
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
                                width: "38%",
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                select
                                size="small"
                                label={
                                  doctorSelected.userType ===
                                  "physician:assistant"
                                    ? "Start time"
                                    : "From"
                                }
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
                                width: "38%",
                                // marginRight: "10px",
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                defaultValue={DEFAULT_TO_TIME}
                                select
                                label={
                                  doctorSelected.userType ===
                                  "physician:assistant"
                                    ? "End time"
                                    : "To"
                                }
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
                            {index > 0 ? (
                              <Button
                                onClick={() => handleRemoveSlot(index, item.id)}
                                className="minus-fee-btn removeIcon roaster-minus-btn"
                                variant="contained"
                                color="default"
                              >
                                <RemoveIcon />
                              </Button>
                            ) : doctorSelected.userType ===
                              "physician:assistant" ? (
                              ""
                            ) : (
                              <Button
                                onClick={() => handleAddSlot(itemIndex, item)}
                                className="plus-fee-btn roaster-plus-btn"
                                variant="contained"
                                color="default"
                              >
                                <AddIcon />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
          <div className="action save-fees-row-btn">
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
    </>
  );
}
