import React, {useEffect, useState, forwardRef} from 'react'
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import moment from 'moment';
import time from "../../data/timeRoster.json";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CircularProgress from "@material-ui/core/CircularProgress";
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function RescheduleAppointment(props) {
  console.log("props: ",props);
  const [cookies, getCookie] = useCookies(["name"]);
  const [showSlots, setShowSlots] = useState([]);
  const [loader, setLoader] = useState(false);

  let selectedDate = props.selectedDate;
  let slotSelected = props.slotSelected; 

  let appointmentData = props.appointmentData;
  const timeData = time;
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRangeIcon className="dateIcons" />
      <span className="dateVal">{value}</span>
      <ExpandMoreIcon className="dateIcons"/>
    </button>
  ));

  useEffect(() => {
    console.log("appointmentData: ",appointmentData)
    if(appointmentData.id){
      getSlot(appointmentData.consultantId,selectedDate);
    }
  }, [appointmentData]);

  useEffect(() => {
    if(appointmentData.consultantId){
      getSlot(appointmentData.consultantId,selectedDate);
    }
  }, [selectedDate]);
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
      console.log("slot in book appointment:", res.data)
      availSlot = res.data[0].availableSlotsList;
      timeData.map((item) => {
        let obj = {};
        if (availSlot[item.value] === "available") {
          temp.push(item.value);
        }
      });
      console.log("temp: ",temp)
      // setSlotSelectedDay(temp);
      showSlot(temp)
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
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
      console.log("tempArr: ",tempArr);
      setShowSlots(tempArr);
  }
  const onSlotClick = (val) =>{
    console.log("val: ",val)
    props.setSlotSelected(val)
  }
  const onDateChange = (val) =>{
    console.log("val: ",val);
    console.log("selectedDate: ",selectedDate)
    if(val === "back"){
      var new_date = moment(selectedDate).subtract(1, "day").format("YYYY-MM-DD");
      props.setSelectedDate(new_date);
      console.log("new_date: ",new_date);
    }
    if(val === "next"){
      var new_date = moment(selectedDate).add(1, "day").format("YYYY-MM-DD");
      props.setSelectedDate(new_date);
      console.log("new_date: ",new_date);
    }
  }
  const onDateChangeCalender = (date) =>{
    console.log("date: ",date);
    var new_date = moment(date).format("YYYY-MM-DD");
    props.setSelectedDate(new_date);
    console.log("new_date: ",new_date);
  }
  return (
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <div style={{position:"relative", padding:"0px"}} className="slotSec">
        <div className="dateSec" >
          <div className="dateNevigate" style={{borderRight:"1px solid"}}>
            <NavigateBeforeIcon onClick={(e)=>onDateChange("back")}/>
          </div>
          <div style={{width:"60%", display:"inline-block"}}>
            <DatePicker 
              selected={new Date(selectedDate)} 
              onChange={(date) => onDateChangeCalender(date)} 
              customInput={<ExampleCustomInput />}
              dateFormat='dd-MMMM-yyyy'
              minDate={new Date()}
              withPortal
              portalId="root-portal"
              />
          </div>
          {/* <div style={{display:"inline-block", width:"60%", textAlign:"center", fontSize:"18px", fontWeight:"bold"}}>{selectedDate}{selectedDate === moment(new Date()).format('YYYY-MM-DD') ? "(Today)":''}</div> */}
          <div className="dateNevigate" style={{borderLeft:"1px solid"}}>
            <NavigateNextIcon onClick={(e)=>onDateChange("next")}/>
          </div>
        </div>
      </div>
      
      <div className="selectSlotSec" style={{padding:"10px 5px"}}>
        {showSlots.length > 0 && showSlots.map((item)=>(
          <span className={slotSelected === item ? "slotStyle selected" : "slotStyle"} onClick={(e)=>{onSlotClick(item)}}>{item.label}</span>
        ))}
        {showSlots.length < 1 &&<div style={{fontSize:"18px", fontWeight:"600", textAlign:"center", marginTop:"30%"}}>
          No Slots Available
        </div> }
      </div>
    </div>
  )
}

export default RescheduleAppointment
