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
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
function CalanderSection(props) {
  // console.log("props in calander section: ",props);
  let responseData = props.responseData;
  let doctorSelected = props.doctorSelected;
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [slotSelectedDay, setSlotSelectedDay] = useState([]);
  const timeData = time;
  const [date, setDate] = useState(new Date());
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
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const alert = useAlert();
  const [leaveDayArr, setLeaveDayArr] = useState([]);
  const [leaveBtnFlag, setLeaveBtnFlag] = useState("show");
  const [timeSlotArr, setTimeSlotArr] = useState(timeData);

  useEffect(() => {
    timeSlotArr.map((item) => {
      item.selected = false;
      item.error = false;
    });
    setTimeSlotArr(timeSlotArr);
  }, []);

  // const [fromVal, setFromVal] = useState(-1);
  const onDateChange = (date) => {
    setDate(date);
    setSelectedDay(date.getDay());
    changeTimeSlotDay(date.getDay());
    if (doctorSelected.id !== undefined) {
      checkSlotOnselectedday(date);
    }
    let temp = leaveDayArr.indexOf(changeDateFormat(date));
    if (temp > -1) {
      setLeaveBtnFlag("hide");
    } else {
      setLeaveBtnFlag("show");
    }
  };

  function checkSlotOnselectedday(date) {
    setSlotSelectedDay([]);
    let startDate = changeDateFormat(date);
    let obj = {
      consultantId: doctorSelected.id,
      startDate: startDate,
      stopDate: startDate,
    };
    let temp = [];
    let availSlot = [];
    // console.log("obj: ",obj)
    // return false;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };

    let bookedArr = [];

    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/viewslots", obj, { headers })
      .then((response) => {
        availSlot = response.data[0].availableSlotsList;
        timeData.map((item) => {
          let obj = {};
          if (availSlot[item.value] === "available") {
            temp.push(item.value);
          }
        });

        // For appointment booked type only
        timeData.map((item) => {
          if (availSlot[item.value] === "booked") {
            bookedArr.push(item.value);
          }
        });
        // if (temp.length > 0) {
        setSlotSelectedDay(showTimeSlot(temp, bookedArr));
        // }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }
  useEffect(() => {
    changeTimeSlotDay(date.getDay());
    onDateChange(new Date());
  }, [responseData]);

  function changeTimeSlotDay(day) {
    if (responseData.id != undefined) {
      // if (doctorSelected.userType === "physician:assistant") {
      //   if (day == 1) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.mondayAvailability)
      //     );
      //   }
      //   if (day == 2) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.tuesdayAvailability)
      //     );
      //   }
      //   if (day == 3) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.wednesdayAvailability)
      //     );
      //   }
      //   if (day == 4) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.thursdayAvailability)
      //     );
      //   }
      //   if (day == 5) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.fridayAvailability)
      //     );
      //   }
      //   if (day == 6) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.saturdayAvailability)
      //     );
      //   }
      //   if (day == 0) {
      //     setSlotSelectedDay(
      //       showTimeSlotForAssist(responseData.sundayAvailability)
      //     );
      //   }
      // } else 
      {
        if (day == 1 && responseData.mondayAvailableSlotList && responseData.mondayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.mondayAvailableSlotList)
          );
        }
        if (day == 2 && responseData.tuesdayAvailableSlotList && responseData.tuesdayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.tuesdayAvailableSlotList)
          );
        }
        if (day == 3 && responseData.wednesdayAvailableSlotList && responseData.wednesdayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.wednesdayAvailableSlotList)
          );
        }
        if (day == 4 && responseData.thursdayAvailableSlotList && responseData.thursdayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.thursdayAvailableSlotList)
          );
        }
        if (day == 5 && responseData.fridayAvailableSlotList && responseData.fridayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.fridayAvailableSlotList)
          );
        }
        if (day == 6 && responseData.saturdayAvailableSlotList && responseData.saturdayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.saturdayAvailableSlotList)
          );
        }
        if (day == 0 && responseData.sundayAvailableSlotList && responseData.sundayAvailableSlotList.length > 0) {
          setSlotSelectedDay(
            showTimeSlot(responseData.sundayAvailableSlotList)
          );
        }
      }
    } else {
      // console.log("in else: ",responseData);
      setSlotSelectedDay([]);
    }
  }
  function showTimeSlotForAssist(data) {
    // console.log("item : ",data);
    let tempArr = [];
    let obj = {};

    if (data.weeklyDayOff !== true) {
      timeData.map((item) => {
        if (item.value == data.shiftFirstSlotId) {
          obj.timeFrom = item.label;
        }
        if (item.value == data.shiftLastSlotId + 1) {
          obj.timeTo = item.label;
        }
      });
      tempArr.push(obj);
    }
    return tempArr;
  }
  function showTimeSlot(arr, bookedArr=[]) {
    let newTimeSlot = [];
    let bookedTimeSlot = [];

    // Check the available time slot
    newTimeSlot = timeSlotArr.map(i => {
      const b1 = arr.filter(d => d === i.value);
      
      if (b1[0] === i.value) {
           i.selected = false;
      } else {
        i.selected = true;
      }
      i.booked = false;
      i.error = false;
      return i;
   });
   
   // Iterate the element only when bookedArr is not empty
   if (bookedArr.length) {
     //  Iterate element for booked time slot
    const bookedTimeSlot = newTimeSlot.map(i => {
      const b1 = bookedArr.filter(j => j === i.value);
  
      if (b1[0] === i.value) {
        i.booked = true;
      } else {
        i.booked = false;
      }
      
      return i;
    });

    return bookedTimeSlot;
   }

    return newTimeSlot;
  }
  const handleSlotSpecDay = () => {
    // Add new time slot
    setSlotSelectedDay(timeSlotArr);
  };

  const onSpecDayTimeChange = (index, type, value) => {
    let tempSlot = [...slotSelectedDay];
    console.log(slotSelectedDay, "onspec");
    if (type === "FROM_TIME") {
      //  currentWorkTime[id -1].timeSlot[index].timeFrom = value;
      // timeData.map((item) => {
      //   if (item.label === value) {
      //     setFromVal(item.id)
      //   }
      // });

      tempSlot[index].timeFrom = value;
    } else if (type === "TO_TIME") {
      //  currentWorkTime[id -1].timeSlot[index].timeTo = value;
      // timeData.map((item) => {
      //   if (item.label === value) {
      //     setFromVal(item.id)
      //   }
      // });
      tempSlot[index].timeTo = value;
    }
    console.log("tempSlot: ", tempSlot);
    setSlotSelectedDay(tempSlot);
  };
  function changeDateFormat(dateObj) {
    // let month = dateObj.getUTCMonth() + 1; //months from 1-12
    // let day = dateObj.getUTCDate();
    // let year = dateObj.getUTCFullYear();
    let month = dateObj.getMonth() + 1; //months from 1-12
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + day;
  }
  function fetchSlotFromArr(arr) {
    // Filtered the available slots and booked slots
    let temp = [];
    const filterSelectedSlot = arr.filter(i => i.selected === false || i.booked);
    temp = filterSelectedSlot.map(i => i.value);

    return temp;
  }
  const saveSlotSpecDay = () => {
    let slotList = fetchSlotFromArr(timeSlotArr);
    let newdate = changeDateFormat(date);
    let obj = {
      consultantId: doctorSelected.id,
      appointmentDate: newdate,
      availableSlotList: slotList,
    };

    console.log("obj: ", obj);
    // return false;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/addslots", obj, { headers })
      .then((response) => {
        console.log(response, "response");
        setLoader(false);
        // alert.show("Slot updated successfully", { type: "success" });
        props.setMsgData({
          message: "Slot updated successfully",
          type: "success",
        });
      })
      .catch((error) => {
        const errMsg = error.response.data.errors[0].message.split('(SlotID:');
        const slotErrMsg = 'Cannot remove slots with booked appointment. Please reschedule and try again.';
        
        if (errMsg[0].trim() === slotErrMsg) {
          // Update the time slot with error
          const getSlotId = parseInt(errMsg[1].replace(')', ''));
          const updateSelectedSlot = slotSelectedDay.map(i => {
            if (i.value === getSlotId) {
              i.selected = false;
              i.error = true;
              return i;
            }

            i.error = false;
            return i;
          });

          props.setMsgData({
            message: slotErrMsg,
            type: "error",
          });

          setSlotSelectedDay(updateSelectedSlot); 
        } else {
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
        }
    
        setLoader(false);
      });
    // fetchSlotFromArr(slotSelectedDay)
  };

  const handleRemoveSlotSpecDay = (id) => {
    const values = [...slotSelectedDay];
    console.log(slotSelectedDay, id, "clear");
    values.splice(id, 1);
    setSlotSelectedDay(values);
    // saveSlotSpecDay()
  };

  function dateSuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  const [openLeaveMark, setOpenMarkLeave] = useState(false);
  const closeMarkLeave = () => {
    setOpenMarkLeave(false);
  };
  const openMarkLeave = () => {
    setOpenMarkLeave(true);
  };
  const markLeave = () => {
    let newdate = changeDateFormat(date);
    let obj = {
      consultantId: doctorSelected.id,
      leaveDate: newdate,
    };
    // console.log("obj: ",obj)
    // return false;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    setLoader(true);
    // /api/appointment/addslots
    axios
      .post(config.API_URL + "/api/appointment/markleave", obj, { headers })
      .then((response) => {
        console.log(response.data);
        onDateChange(new Date());
        leaveDtlOnDatechange();
        setLoader(false);
        // alert.show("Leave applied successfully", { type: "success" });
        props.setMsgData({
          message: "Leave applied successfully",
          type: "success",
        });
      })
      .catch((error) => {
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        // alert.show('Api error', { type: 'error' });
        console.log(error);
        setLoader(false);
      });
    setOpenMarkLeave(false);
  };
  const [openCancelLeave, setOpenCancrlLeave] = useState(false);
  const closeCancelLeave = () => {
    setOpenCancrlLeave(false);
  };
  const openCancelLeavemark = () => {
    setOpenCancrlLeave(true);
  };
  const cancleLeave = () => {
    let newdate = changeDateFormat(date);
    let obj = {
      consultantId: doctorSelected.id,
      leaveDate: newdate,
    };
    // console.log("obj: ",obj)
    // return false;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    setLoader(true);
    // /api/appointment/addslots
    axios
      .post(config.API_URL + "/api/appointment/cancelLeave", obj, { headers })
      .then((response) => {
        console.log(response.data);
        onDateChange(new Date());
        leaveDtlOnDatechange();
        setLoader(false);
        // alert.show("Leave cancelled successfully", { type: "success" });
        props.setMsgData({
          message: "Leave cancelled successfully",
          type: "success",
        });
      })
      .catch((error) => {
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        // alert.show('Api error', { type: 'error' });
        console.log(error);
        setLoader(false);
      });
    setOpenCancrlLeave(false);
  };
  useEffect(() => {
    if (doctorSelected.id !== undefined) {
      leaveDtlOnDatechange();
    }
  }, [doctorSelected]);

  function leaveDtlOnDatechange() {
    let todayDate = new Date();
    let startDate = changeDateFormat(todayDate);
    let month = todayDate.getMonth() + 1; //months from 1-12
    let year = todayDate.getFullYear();
    let day = "30";
    if (month < 10) {
      month = "0" + month;
    }
    if (month == 2) {
      if (moment([todayDate.getFullYear()]).isLeapYear()) {
        day = 29;
      } else {
        day = 28;
      }
    }
    if (
      month == 1 ||
      month == 3 ||
      month == 5 ||
      month == 7 ||
      month == 8 ||
      month == 10 ||
      month == 12
    ) {
      day = 31;
    }
    let endDate = year + "-" + month + "-" + day;
    getLeaveDetails(startDate, endDate);
  }
  const getLeaveDetails = (startDate, endDate) => {
    let obj = {
      consultantId: doctorSelected.id,
      startDate: startDate,
      stopDate: endDate,
    };
    // console.log("obj: ",obj)
    // return false;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/viewslots", obj, { headers })
      .then((response) => {
        // console.log(response.data)
        let tempArr = [];
        response.data.map((item) => {
          if (item.isDoctorOnLeave === true) {
            tempArr.push(item.appointmentDate);
          }
        });
        setLeaveDayArr(tempArr);
        setLoader(false);
      })
      .catch((error) => {
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        // alert.show('Api error', { type: 'error' });
        console.log(error);
        setLoader(false);
      });
  };
  const onMonthChange = ({ activeStartDate, view }) => {
    // && activeStartDate.getMonth >= date.getMonth()
    let todayDate = new Date();
    if (activeStartDate.getFullYear() >= todayDate.getFullYear()) {
      let startDate = changeDateFormat(activeStartDate);
      let month = activeStartDate.getMonth() + 1; //months from 1-12
      let year = activeStartDate.getFullYear();
      let day = "30";
      if (month < 10) {
        month = "0" + month;
      }
      if (month == 2) {
        if (moment([activeStartDate.getFullYear()]).isLeapYear()) {
          day = 29;
        } else {
          day = 28;
        }
      }
      if (
        month == 1 ||
        month == 3 ||
        month == 5 ||
        month == 7 ||
        month == 8 ||
        month == 10 ||
        month == 12
      ) {
        day = 31;
      }
      let endDate = year + "-" + month + "-" + day;
      if (
        activeStartDate.getFullYear() == todayDate.getFullYear() &&
        activeStartDate.getMonth() >= todayDate.getMonth()
      ) {
        if (activeStartDate.getMonth() == todayDate.getMonth()) {
          startDate = changeDateFormat(todayDate);
        }
        getLeaveDetails(startDate, endDate);
      } else if (activeStartDate.getFullYear() > todayDate.getFullYear()) {
        getLeaveDetails(startDate, endDate);
      }
    }
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

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <div className="rightView calendar-right-view">
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
            tileContent={({ date, view }) => {
              if (
                leaveDayArr.find((x) => x === moment(date).format("YYYY-MM-DD"))
              ) {
                return <span className="redDot">.</span>;
              }
            }}
            onActiveStartDateChange={onMonthChange}
          />
        </div>
        <div className="showSelectedDate">
          <span className="appoint-date">
            {dateSuffix(date.getDate())} &nbsp;{months[date.getMonth()]}
          </span>
          {/* <span className={"markLeave " + leaveBtnFlag} onClick={openMarkLeave}>
            Mark Leave
          </span>
          <span
            className={"markLeave CancelLeave " + leaveBtnFlag}
            onClick={openCancelLeavemark}
          >
            Cancel Leave
          </span> */}
        </div>

        <Dialog
          open={openLeaveMark}
          // onClose={closeRefund}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="cancelAndRefund"
        >
          <DialogTitle id="alert-dialog-title">
            <span>
              Do you want to mark leave on {dateSuffix(date.getDate())}&nbsp;
              {months[date.getMonth()]}?
            </span>
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={closeMarkLeave}
              color="primary"
              color="primary"
              className="back cancelBtn"
            >
              No
            </Button>
            <Button
              onClick={markLeave}
              color="primary"
              className="primary-button forward saveBtn"
              style={{ marginRight: "30px" }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCancelLeave}
          // onClose={closeCancelLeave}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="cancelAndRefund"
        >
          <DialogTitle id="alert-dialog-title">
            <span>
              Do you want to cancel leave on {dateSuffix(date.getDate())}&nbsp;
              {months[date.getMonth()]}?
            </span>
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={closeCancelLeave}
              color="primary"
              color="primary"
              className="back cancelBtn"
            >
              No
            </Button>
            <Button
              onClick={cancleLeave}
              color="primary"
              className="primary-button forward saveBtn"
              style={{ marginRight: "30px" }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {/* {console.log("slotSelectedDay: ",slotSelectedDay,"timedata: ",timeData)} */}
        
        {slotSelectedDay.length ? (
          <div className="timeSlots">
            <div className="addNewSlot">
              <div className="apmtTimeSlot">
                {slotSelectedDay.map((item, index) => {
                  return (
                    <div
                      id={`select-time-slot-${index}`}
                      className={
                        `timeBtn slot-time-btn ${(item.selected == true ? "slotSelected" : "")} ${item.booked ? 'slotError' : '' } ${item.error ? 'slotError' : '' }`
                      }
                      key={index}
                      onClick={() => onSlotBtnClick(index, item)}
                    >
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {doctorSelected.userType === "physician:assistant" ? (
              ""
            ) : (
              <>
                <div className="plusBtn hideNewSlotBtn" onClick={handleSlotSpecDay}>
                  <span>+ ADD NEW SLOT</span>
                </div>

                {/* <div className="action">
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  className="primary-button forward"
                  // type="submit"
                  onClick={saveSlotSpecDay}
                >
                  UPDATE
                </Button>
              </div> */}
              </>
            )}
          </div>
        ) : (
          <div className="timeSlots">
            {leaveBtnFlag === "show" ? (
              <>
                <div style={{ textAlign: "center", marginTop: "10%" }}>
                  <span>
                    No slot for {dateSuffix(date.getDate())}&nbsp;
                    {months[date.getMonth()]}{" "}
                  </span>
                </div>
                {doctorSelected.userType === "physician:assistant" ? (
                  ""
                ) : (
                  <div
                    className="plusBtn hideNewSlotBtn"
                    onClick={handleSlotSpecDay}
                    style={{ margin: "35px 10px" }}
                  >
                    <span>+ ADD NEW SLOT</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginTop: "10%" }}>
                  <span>
                    Leave applied for {dateSuffix(date.getDate())}&nbsp;
                    {months[date.getMonth()]}{" "}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        <div className="timeSlots">
          {doctorSelected.userType === "physician:assistant" ? (
            ""
          ) : (
            <div className="action">
              <Button
                id="update-time-slot"
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button forward"
                // type="submit"
                onClick={saveSlotSpecDay}
              >
                UPDATE
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default CalanderSection;
