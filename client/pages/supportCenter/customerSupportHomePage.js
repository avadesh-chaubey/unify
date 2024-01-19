import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';  
import config from "../../app.constant";
import { Card, CardActionArea, CardContent,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress,
  Tooltip, Link, Button
} from "@material-ui/core";
import time from "../../data/time.json";
import { useAlert, types } from "react-alert";
import Head from "next/head";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Header from "../../components/header/header";
import LabelBreadCrumb from '../../components/doctor/LabelBreadCrumb';
import { getInitialsOfGender } from '../../utils/helpers';
import SupportCenterAppBar from '../../components/support-centers/SupportCenterAppBar';
import TabPanel from '../../components/support-centers/TabPanel';
import SupportCenterDetails from "../../components/support-centers/SupportCenterDetails";
import SupportCenterTimelines from "../../components/support-centers/SupportCenterTimelines";
import SupportCenterChat from "../../components/support-centers/SupportCenterChat";
import Sidenavbar from "../../components/dashboard/Sidenavbar";

const TITLE = "Unify Care";

function CustomerSupportHomePage(props) {
  const { firebase } = props;
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [daySelected, setDaySelected] = useState("today");
  const [timeSlot, setTimeSlot] = useState([]);
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [preAppointmentList, setPreAppointmentList] = useState([]);
  const [patientSelected, setPatientSelected] = useState([{}]);
  const [loader, setLoader] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(() => {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    let newdate = year + "-" + month + "-" + day;
    return newdate;
  });
  const [bookDay, setBookDay] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showImage, setShowImage] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);

  // to close add new appointment dialog
  const handleClose = () => {
    setOpen(false);
  };

  const timeData = time;
  let temp = [];

  // to open add new appointment dialog
  const openNewApmt = (day) => {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let date = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let newdate;
    // this condition is here because date and month < 10 return in single digit, but in api, it required in double digit

    if (day == "tomorrow") {
      date = date + 1;
      if ((month == 1 || 3 || 5 || 7 || 8 || 10 || 12) && date > 31) {
        date = 1;
        month = month + 1;
        if (month > 12) {
          year = year + 1;
          month = "01";
        }
      }
      if ((month == 4 || 6 || 9 || 11) && date > 30) {
        date = 1;
        month = month + 1;
      }
      if (month == 2 && date > 29) {
        date = 1;
        month = month + 1;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      newdate = year + "-" + month + "-" + date;
    } else {
      if (date < 10) {
        date = "0" + date;
      }
      if (month < 10) {
        month = "0" + month;
      }
      newdate = year + "-" + month + "-" + date;
    }
    setBookDay(newdate);
    let availSlot = [];
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    axios
      .post(
        config.API_URL + "/api/appointment/viewslots",
        {
          consultantId: patientSelected.consultantId,
          startDate: newdate,
          stopDate: newdate,
        },
        { headers }
      )
      .then((response) => {
        console.log("fetch Doctor slot: ", response.data);
        availSlot = response.data[0].availableSlotsList;
        timeData.map((item) => {
          let obj = {};
          if (availSlot[item.value] === "available") {
            // console.log("dshfj: ",data)
            obj.id = item.id;
            obj.label = item.label;
            obj.value = item.value;
            obj.selected = false;
            temp.push(obj);
          }
        });
      })
      .catch((error) => {
        alert.show(error.response.data.errors[0].message, { type: "error" });
        alert.show("Api error", { type: "error" });
        console.log(error);
        setLoader(false);
      });

    setOpen(true);
    setTimeout(() => {
      setTimeSlot(temp);
    }, 1000);
  };

  // for time slot value
  const onSlotBtnClick = (i, item) => {
    // console.log("item :",item)
    // item.selected = !item.selected;

    let temptimeSlot = [...timeSlot];
    temptimeSlot.map((item) => {
      item.selected = false;
    });
    temptimeSlot[i].selected = true;
    // console.log("item after: ", item)
    // console.log("temp: ",temptimeSlot);
    setTimeSlot(temptimeSlot);
  };

  const changeDateFormat = (date) => {
    let dateObj = new Date(date);
    let month = dateObj.toLocaleString("en-us", { month: "short" }); //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    let newdate = day + "-" + month + "-" + year;
    return newdate;
  };

  // to fetch all apointment

  // const fetchAllData = () => {
  //    let currentYear = new Date().getFullYear();
  //    let headers = {
  //       'authtoken': JSON.parse(localStorage.getItem('token')),
  //    }
  //    setLoader(true)
  //    axios.get(config.API_URL + '/api/patient/allappointments', {headers})
  //    .then(response => {
  //       console.log(response.data)
  //       if(response.data && response.data.length){
  //          response.data.map((item)=>{
  //             // console.log('jsdagg',item)
  //             if(item.customerDateOfBirth){
  //                item.age = currentYear - new Date(item.customerDateOfBirth).getFullYear();
  //             }else{
  //                item.age = 22;
  //             }
  //             timeData.forEach((tm)=>{
  //                if(tm.value == item.appointmentSlotId){
  //                   item.appointmentSlot = tm.label;
  //                }
  //             })
  //          })
  //          setAppointmentList(response.data)
  //          setPatientSelected(response.data[0]);
  //          fetchPatientData(response.data[0].customerId);
  //          setLoader(false);
  //       }
  //    })
  //    .catch(error => {
  //       console.log(error);
  //       setLoader(false);
  //       alert.show(error.response.data.errors[0].message, { type: 'error' });
  //    });
  // }
  // useEffect(() => {
  //    fetchAllData()
  // }, []);

  // to fetch today's apointment only
  const fetchTodayData = () => {
    let currentYear = new Date().getFullYear();
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/patient/todayappointments", { headers })
      .then((response) => {
        console.log("fetchTodayData: ", response.data);
        if (response.data && response.data.length) {
          response.data.map((item) => {
            // console.log('jsdagg',item)
            if (item.customerDateOfBirth) {
              item.age =
                currentYear - new Date(item.customerDateOfBirth).getFullYear();
            } else {
              item.age = 22;
            }
            timeData.forEach((tm) => {
              if (tm.value == item.appointmentSlotId) {
                item.appointmentSlot = tm.label;
              }
            });
            item.showAppointmentDate = changeDateFormat(item.appointmentDate);
          });
          setAppointmentList(response.data);
          setPatientSelected(response.data[0]);
          fetchPatientData(response.data[0].customerId);
          setLoader(false);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log('fetchTodayData - api error', error);
        setLoader(false);
        alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  };
  useEffect(() => {
    fetchTodayData();
  }, []);

  //to fetch selected patient data
  const onPatientSelect = (e, item, i) => {
    // console.log("item: ",item);
    setPatientSelected(item);
    console.log('calling from onPatientSelect');
    fetchPatientData(item.customerId);
    e.preventDefault();
  };

  const fetchPatientData = (id) => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    // axios
    //   .get(config.API_URL + `/api/patient/allappointments/${id}`, { headers })
    //   .then((response) => {
    //     console.log("response: ", response);
    //     let temp = [];
    //     if (response.data && response.data.length) {
    //       response.data.map((item) => {
    //         timeData.forEach((tm) => {
    //           if (tm.value == item.appointmentSlotId) {
    //             item.appointmentSlot = tm.label;
    //           }
    //         });
    //         // console.log('jsdagg',item)
    //         let todayDate = new Date().getTime();
    //         let apmtDate = new Date(item.appointmentDate).getTime();
    //         // console.log("today date: ",todayDate);
    //         // console.log("appointment date: ", apmtDate)
    //         if (todayDate > apmtDate) {
    //           item.showPreApmtDate = changeDateFormat(item.appointmentDate);
    //           temp.push(item);
    //         } else {
    //           // console.log("hide details: ")
    //         }
    //       });
    //       console.log("previous Appointment:", temp);
    //       // setPreAppointmentList(response.data);
    //       setPreAppointmentList(temp);
    //       setLoader(false);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('fetchPatientData- error', error);
    //     setLoader(false);
    //     alert.show(error.response.data.errors[0].message, { type: "error" });
    //   });
  };

  // to open and close cancel and refund dialog
  const closeRefund = () => {
    setOpenRefund(false);
  };
  const openCancelAndRefund = () => {
    setOpenRefund(true);
  };
  // to reschedule appointment
  const rescheduleTime = (date) => {
    console.log("rescheduled date: ", date);
    let availSlot = [];
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    axios
      .post(
        config.API_URL + "/api/appointment/viewslots",
        {
          consultantId: patientSelected.consultantId,
          startDate: date,
          stopDate: date,
        },
        { headers }
      )
      .then((response) => {
        console.log("fetch Doctor slot: ", response.data);
        availSlot = response.data[0].availableSlotsList;
        timeData.map((item) => {
          let obj = {};
          if (availSlot[item.value] === "available") {
            // console.log("dshfj: ",data)
            obj.id = item.id;
            obj.label = item.label;
            obj.value = item.value;
            obj.selected = false;
            temp.push(obj);
          }
        });
      })
      .catch((error) => {
        alert.show(error.response.data.errors[0].message, { type: "error" });
        alert.show("Api error", { type: "error" });
        console.log(error);
        setLoader(false);
      });
    setTimeout(() => {
      setRescheduleTimeSlot(temp);
    }, 1000);
    console.log("temp: ", temp);
    // setRescheduleTimeSlot(temp);
  };
  const changeRescheduleDate = (date) => {
    let dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    let newdate = year + "-" + month + "-" + day;
    console.log("date: ", newdate);
    setRescheduleDate(newdate);
    rescheduleTime(newdate);
  };

  const openRescheduleDig = () => {
    console.log("rescheduleDate: ", rescheduleDate);
    rescheduleTime(rescheduleDate);
    setOpenReschedule(true);
  };
  const closeReschedule = () => {
    // console.log("closeReschedule")
    setOpenReschedule(false);
  };

  // to submit rescheduled data
  const submitReschedule = () => {
    let saveSlot;
    rescheduleTimeSlot.map((data) => {
      timeData.map((item) => {
        if (data.selected == true && data.id == item.id) {
          saveSlot = item.value;
        }
      });
    });
    let obj = {
      appointmentId: patientSelected.id,
      consultantId: patientSelected.consultantId,
      parentId: patientSelected.parentId,
      customerId: patientSelected.customerId,
      appointmentDate: rescheduleDate,
      consultationType: "paid:patient:doctor",
      appointmentSlotId: saveSlot,
    };

    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/reschedule", obj, { headers })
      .then((response) => {
        console.log(response.data);
        setOpenReschedule(false);
        fetchTodayData();
        setLoader(false);
        alert.show("Appointment rescheduled", { type: "success" });
      })
      .catch((error) => {
        setOpenReschedule(false);
        setLoader(false);
        console.log(error);
        alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  };
  // to get rescheduled time slot
  const onReschdSlotClick = (i, item) => {
    // console.log("item :",item)
    // item.selected = !item.selected;

    let temptimeSlot = [...rescheduleTimeSlot];
    temptimeSlot.map((item) => {
      item.selected = false;
    });
    temptimeSlot[i].selected = true;
    // console.log("item after: ", item)
    // console.log("temp: ",temptimeSlot);
    setRescheduleTimeSlot(temptimeSlot);
  };

  // submit cancel and refund function
  const cancelAndRefund = () => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    axios
      .post(
        config.API_URL + "/api/appointment/cancel",
        { appointmentId: patientSelected.id },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setLoader(false);
        // if(response.data && response.data.length){

        // }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        alert.show(error.response.data.errors[0].message, { type: "error" });
      });
    setOpenRefund(false);
  };
  const onDaySelect = (day) => {
    setDaySelected(day);
    openNewApmt(day);
    // console.log("onDaySelect: ",day);
  };

  // book new appointment APi
  const bookApmt = () => {
    let saveSlot;
    timeSlot.map((data) => {
      timeData.map((item) => {
        if (data.selected == true && data.id == item.id) {
          saveSlot = item.value;
        }
      });
    });
    if (saveSlot === undefined) {
      alert.show("Please Select any slot", { type: "error" });
    }
    let obj = {
      consultantId: patientSelected.consultantId,
      customerId: patientSelected.customerId,
      parentId: patientSelected.parentId,
      appointmentDate: bookDay,
      consultationType: "paid:patient:doctor",
      appointmentSlotId: saveSlot,
    };
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    // console.log("obj: ",obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/add", obj, { headers })
      .then((response) => {
        console.log(response.data);
        setOpen(false);
        setLoader(false);
        alert.show("Appointment Added", { type: "success" });
        // if(response.data && response.data.length){

        // }
      })
      .catch((error) => {
        setOpen(false);
        setLoader(false);
        console.log(error);
        alert.show(error.response.data.errors[0].message, { type: "error" });
        // alert.show('API error', { type: 'error' });
      });
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{ TITLE }</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Sidenavbar />
      <div className="right-area custmerSupport">
        <Header name="Support Center" />
        <SupportCenterAppBar setCurrentTab={setCurrentTab} currentTab={currentTab} />

        <div className="mainView">
          {/* appointment list */}
          {appointmentList.length > 0 ? (
            <div>
              <div className="patientlist patient-list-card">
                {appointmentList.map((item, index) => (
                  <Card
                    className={
                      "patientCard" +
                      (item.id === patientSelected.id ? " active" : "")
                    }
                    key={index}
                  >
                    <CardActionArea
                      style={{ height: "100%" }}
                      onClick={(e) => onPatientSelect(e, item, index)}
                    >
                      <CardContent>
                        <div className="patientDetails">
                          <span style={{ fontWeight: "bold" }}>
                            {`${item.customerFirstName} ${item.customerFirstName} ${item.age} ${ getInitialsOfGender(item.customerGender) }`}
                          </span>
                          <span className="appointment-date-time">
                              {item.appointmentSlot} <br />{moment(item.appointmentDate).format('DD MMM YY')}
                            </span>

                            <span style={{ padding: 2 }}>
                              <div className="docDetails">
                                <Tooltip
                                  title={`${item.consultantName}`}
                                  placement="right-start"
                                  arrow
                                >
                                  <span className="customer-support-docName doc-name-2">
                                    {item.consultantName}
                                  </span>
                                </Tooltip>
                              </div>
                            </span>
                            <span className="customer-support-chip">
                              <LabelBreadCrumb status={item.appointmentStatus} />
                            </span>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>

              {/* patient details */}
              <div className="detailSec">
                {!!patientSelected.id && (
                  <TabPanel value={currentTab} index={0}>
                    <SupportCenterDetails
                      showImage={showImage}
                      setShowImage={setShowImage}
                      openRescheduleDig={openRescheduleDig}
                      openCancelAndRefund={openCancelAndRefund}
                      patientSelected={patientSelected}
                    />
                  </TabPanel>
                )}
                <Dialog
                  open={openRefund}
                  // onClose={closeRefund}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  className="cancelAndRefund"
                >
                  <DialogTitle id="alert-dialog-title">
                    <span>Do you want to cancel the Appointment?</span>
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      onClick={closeRefund}
                      color="primary"
                      color="primary"
                      className="back cancelBtn"
                    >
                      No
                    </Button>
                    <Button
                      onClick={cancelAndRefund}
                      color="primary"
                      className="primary-button forward saveBtn"
                      style={{ marginRight: "30px" }}
                    >
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
              {/* patient previos appointment list */}
              <div className="rightDocList" style={{ display: 'none' }}>
                <div className="preApmt">
                  <span>Previous Appointments</span>
                </div>
                <div className="preApmtList">
                  {preAppointmentList.length > 0 ? (
                    <div>
                      {preAppointmentList.map((item, index) => (
                        // key={index}
                        <Card className={"doctorPreApmt"} key={item.id}>
                          <CardActionArea style={{ height: "100%" }}>
                            <CardContent>
                              <div className="doctorImg">
                                <img
                                  src={
                                    `${config.API_URL}/api/utility/download/` +
                                    item.consultantProfileImageName
                                  }
                                />
                              </div>
                              <div className="doctorDetails">
                                <span style={{ fontWeight: "bold" }}>
                                  {item.consultantName}{" "}
                                </span>
                                <span>
                                  {item.appointmentSlot} &nbsp;
                                  {item.showPreApmtDate}
                                </span>
                                <span style={{ display: "inline-flex" }}>
                                  Fee: &nbsp;
                                  <span className="cnstFee">
                                    ₹{item.basePriceInINR}
                                  </span>
                                </span>
                              </div>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}
                    </div>
                  ) : (
                      <div className="preApmt">No Previous Appointment</div>
                    )}
                </div>
              </div>
            </div>
          ) : (
              <div style={{ textAlign: "center", marginTop: "10%" }}>
                <h3>No Appointment added.</h3>
              </div>
            )}
        </div>

        <TabPanel value={currentTab} index={1}>
          {!!patientSelected.id && (
            <SupportCenterTimelines patientSelected={patientSelected} />
          )}
        </TabPanel>
        <TabPanel  value={currentTab} index={2}>
          <SupportCenterChat firebase={firebase} />
        </TabPanel>
        
        {/* add new appointment dialog */}
        {/* onClose={handleClose}  */}
        <Dialog
          open={open}
          aria-labelledby="form-dialog-title"
          className="addNewApmt"
        >
          <DialogTitle id="form-dialog-title">
            {patientSelected.customerName ? patientSelected.customerName : " "}{" "}
            : New Appointment
            <img
              style={{
                height: "20px",
                cursor: "pointer",
                float: "right",
                marginTop: "5px",
                marginRight: "25px",
              }}
              src="crossIcon.png"
              onClick={handleClose}
            />
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
                  To subscribe to this website, please enter your email address here. We will send updates
                  occasionally.
               </DialogContentText> */}
            <TextField
              disabled
              required
              autoFocus
              label="Patient"
              style={{ margin: 8 }}
              margin="normal"
              variant="filled"
              // className={"half-div"}
              // + (errMsg && fName === '' ? 'err' : '')
              className={"half-div "}
              value={
                (patientSelected.customerName
                  ? patientSelected.customerName
                  : "NA") + " (self)"
              }
            // onChange={(e) => setfName(e.target.value)}
            />
            <TextField
              disabled
              required
              label="Doctor"
              style={{ margin: 8 }}
              margin="normal"
              variant="filled"
              // className={"half-div"}
              // + (errMsg && lName === '' ? 'err' : '')
              className={"half-div "}
              value={
                patientSelected.consultantName
                  ? patientSelected.consultantName
                  : "NA"
              }
            // onChange={(e) => setlName(e.target.value)}
            />
            <div className="addNewSlot">
              <div className="consultSec">
                <span className="text">Online Consultation</span>{" "}
                <span className="cnstFee">₹500</span>
              </div>
              <div className="daySec">
                <span
                  className={daySelected == "today" ? "daySelected" : ""}
                  style={{ marginRight: "35px", marginLeft: "7px" }}
                  onClick={() => onDaySelect("today")}
                >
                  {" "}
                  TODAY{" "}
                </span>
                <span
                  className={daySelected == "tomorrow" ? "daySelected" : ""}
                  onClick={() => onDaySelect("tomorrow")}
                >
                  TOMORROW
                </span>
              </div>
              {timeSlot.length > 0 ? (
                <div className="apmtTimeSlot">
                  {/* <div className='timeBtn slotSelected'>
                        <span>12:00 PM</span>
                     </div> */}
                  {timeSlot.map((item, index) => {
                    return (
                      <div
                        className={
                          "timeBtn " +
                          (item.selected == true ? "slotSelected" : "")
                        }
                        key={index}
                        onClick={() => onSlotBtnClick(index, item)}
                      >
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "#808080",
                    }}
                  >
                    No slots available
                  </div>
                )}
            </div>
          </DialogContent>
          <DialogActions style={{ margin: "5px 5px" }}>
            <Button
              onClick={handleClose}
              color="primary"
              className="back cancelBtn"
            >
              Cancel
            </Button>
            <Button
              onClick={bookApmt}
              color="primary"
              className="primary-button forward saveBtn"
              style={{ marginRight: "30px" }}
            >
              Book
            </Button>
          </DialogActions>
        </Dialog>

        {/* reschedule appointment dialog */}
        <Dialog
          open={openReschedule}
          aria-labelledby="form-dialog-title"
          className="reschedule"
        >
          <DialogTitle id="form-dialog-title">
            {patientSelected.customerName ? patientSelected.customerName : " "}{" "}
            : Reschedule Appointment
            <img
              style={{
                height: "20px",
                cursor: "pointer",
                float: "right",
                marginTop: "0px",
                marginRight: "0px",
              }}
              src="crossIcon.png"
              onClick={closeReschedule}
            />
          </DialogTitle>
          <DialogContent>
            {/* <TextField
                  id="date"
                  label="Reschedule Date"
                  type="date"
                  style={{margin:'8px 25px'}}
                  value={rescheduleDate}
                  onChange={(e) => changeRescheduleDate(e.target.value)}
                  InputLabelProps={{
                     shrink: true,
                  }}
               /> */}
            <Button
              onClick={() => setIsOpen(true)}
              style={{ position: "absolute" }}
            ></Button>
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}> */}
              {/*
              Commenting out to fix the issue
              <KeyboardDatePicker
                style={{ margin: "5px", marginBottom: "10px" }}
                disableToolbar="true"
                autoOk
                variant="inline"
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                label="Reschedule Date"
                format="dd MMM yyyy"
                value={rescheduleDate}
                onChange={(e) => changeRescheduleDate(e)}
              />
            */}
            {/* </MuiPickersUtilsProvider> */}
            <div className="addNewSlot">
              {rescheduleTimeSlot.length > 0 ? (
                <div className="apmtTimeSlot">
                  {rescheduleTimeSlot.map((item, index) => {
                    return (
                      <div
                        className={
                          "timeBtn " +
                          (item.selected == true ? "slotSelected" : "")
                        }
                        key={index}
                        onClick={() => onReschdSlotClick(index, item)}
                      >
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "17px",
                      fontWeight: "bold",
                      paddingTop: "10%",
                      color: "#808080",
                    }}
                  >
                    No slots available
                  </div>
                )}
            </div>
          </DialogContent>
          <DialogActions style={{ margin: "5px", marginBottom: "10px" }}>
            <Button
              onClick={closeReschedule}
              color="primary"
              className="back cancelBtn"
            >
              Cancel
            </Button>
            <Button
              onClick={submitReschedule}
              color="primary"
              className="primary-button forward saveBtn"
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default CustomerSupportHomePage;
