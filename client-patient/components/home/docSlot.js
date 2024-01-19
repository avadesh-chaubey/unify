import React, {useState, useEffect, forwardRef} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import moment from 'moment';
import time from "../../data/timeRoster.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
function DocSlot({docSelected,patientSelected,specialitySelected,setView,selectedDate,slotSelected,submitDetails,setSlotSelected,setSelectedDate,setMsgData}) {
  const [cookies, getCookie] = useCookies(["name"]);
  const [showSlots, setShowSlots] = useState([]);
  const [loader, setLoader] = useState(false);
  const timeData = time;
  const [freeConsult, setFreeConsult] = useState(false);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRangeIcon className="dateIcons" />
      <span className="dateVal">{value}</span>
      {/* <ExpandMoreIcon className="dateIcons"/> */}
    </button>
  ));
  useEffect(() => {
    console.log("docSelected saf: ",docSelected)
    if(docSelected.id){
      getSlot(docSelected.id,selectedDate);
    }
  }, [selectedDate,docSelected]);
  const getSlot = (id,date) =>{
    let temp = [];
    let availSlot = [];

    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    let obj = {startDate:date,consultantId:id,stopDate:date}
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/viewslots", obj, {
        headers,
    })
    .then((res) => {
      availSlot = res.data[0].availableSlotsList;
      timeData.map((item) => {
        let obj = {};
        if (availSlot[item.value] === "available") {
          temp.push(item.value);
        }
      });
      showSlot(temp)
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      
      setLoader(false);
    });
  }
  function showSlot (arr){
    let tempArr = [];
    if(arr.length > 0){
      time.map((item)=>{
        arr.map((data)=>{
          if(data === item.value){
            tempArr.push(item);
          }
        })
      })
    }
      setShowSlots(tempArr);
  }
  const onDateChange = (val) =>{
    console.log("val: ",val);
    console.log("selectedDate: ",selectedDate)
    if(val === "back"){
      var new_date = moment(selectedDate).subtract(1, "day").format("YYYY-MM-DD");
      let todayDate = moment(new Date()).format('YYYY-MM-DD');
      if(new_date >= todayDate){
        setSelectedDate(new_date);
      }else{
        setMsgData({ message: "Cannot view slot of past date", type: "error" });
      }
     
      console.log("new_date: ",new_date);
    }
    if(val === "next"){
      var new_date = moment(selectedDate).add(1, "day").format("YYYY-MM-DD");
      setSelectedDate(new_date);
      console.log("new_date: ",new_date);
    }
  }
  const onDateChangeCalender = (date) =>{
    console.log("date: ",date);
    var new_date = moment(date).format("YYYY-MM-DD");
    setSelectedDate(new_date);
    console.log("new_date: ",new_date);
  }
  const onSlotClick = (val) =>{
    console.log("val: ",val)
    setSlotSelected(val)
  }

  return (
    <div>
      {/* {view === 0 &&<div> */}
        <div style={{position:"relative"}}>
          <div className="dateSec" >
            <div className="dateNevigate" style={{float:"left"}}>
              <NavigateBeforeIcon onClick={(e)=>onDateChange("back")}/>
            </div>
            <div style={{width:"60%", display:"inline-block"}}>
              <DatePicker 
                selected={new Date(selectedDate)} 
                onChange={(date) => onDateChangeCalender(date)} 
                customInput={<ExampleCustomInput />}
                dateFormat='d-MMM-yyyy'
                minDate={new Date()}
                withPortal
                portalId="root-portal"
                />
              </div>
            {/* <div style={{display:"inline-block", width:"60%", textAlign:"center", fontSize:"16px", fontWeight:"600"}}>{selectedDate}{selectedDate === moment(new Date()).format('YYYY-MM-DD') ? "(Today)":''}</div> */}
            <div className="dateNevigate" style={{float:"right"}}>
              <NavigateNextIcon onClick={(e)=>onDateChange("next")}/>
            </div>
          </div>
        </div>
        
        <div className="selectSlotSec">
          {showSlots.length > 0 && showSlots.map((item)=>(
            <span className={slotSelected === item ? "slotStyle selected" : "slotStyle"} onClick={(e)=>{onSlotClick(item)}}>{item.label}</span>
          ))}
        </div>
        <div style={{textAlign:"center", marginTop:"30px"}} className="btnSec">
            <Button
              id="OTP Submit Btn"
              size="small"
              variant="contained"
              className="viewDetails"
              onClick={(e)=>setView(3)}
            >
              BOOKING DETAILS
            </Button>
            <Button
              id="OTP Submit Btn"
              size="small"
              variant="contained"
              className="submitBtn"
              onClick={submitDetails}
            >
              {freeConsult ? "Book": "Pay Now"}
            </Button>
          </div>
      {/* </div>} */}
    </div>
  )
}

export default DocSlot
