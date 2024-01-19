import React, {useState, useEffect, forwardRef} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DialogTitle from '@material-ui/core/DialogTitle';

import { createImageFromInitials } from "../../utils/nameDP";
import Paper from '@material-ui/core/Paper';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import moment from 'moment';
import time from "../../data/timeRoster.json";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const specialityList = [{name:"Child Care",value:"child-care"},{name:"Woman Health",value:"woman-health"},{name:"Fertility Care",value:"fertility-care"}];

function BookAppointment(props) {
  const [cookies, getCookie] = useCookies(["name"]);
  const [famList, setFamList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [view, setView] = useState(0);
  const [titleText, setTitletext] = useState("Select Patient");
  const [docSelected, setDocSelected] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [slotSelectedDay, setSlotSelectedDay] = useState([]);
  const [showSlots, setShowSlots] = useState([]);
  const [slotSelected, setSlotSelected] = useState({});
  const [patientSelected, setPatientSelected] = useState({});
  const [specialitySelected, setSpecialitySelected] = useState({});
  const [productId, setProductId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [freeConsult, setFreeConsult] = useState(false);
  const timeData = time;
  const [loader, setLoader] = useState(false);
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRangeIcon className="dateIcons" />
      <span className="dateVal">{value}</span>
      <ExpandMoreIcon className="dateIcons"/>
    </button>
  ));
  const backBtnClick = (val) =>{
    if(val === "0"){
      props.handleClose();
    }else if(val === "1"){
     setView(0);
    }else if(val === "2"){
     setView(1);
    }else if(val === "3"){
     setView(2);
    }else if(val === "4"){
      setView(3);
     }
    
  }
  useEffect(() => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/patient/familymembers", {
        headers,
    })
    .then((res) => {
      console.log("familyList in book appointment:", res.data)
      setFamList(res.data);
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }, [])
  
  useEffect(() => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/doctors?userType=diabetologist", {
        headers,
    })
    .then((res) => {
      console.log("docList in book appointment:", res.data)
      let temp = res.data;
      temp.map((item)=>{
        let freeDiet = item.freeDieticianConsultations == undefined ? 0 : item.freeDieticianConsultations;
        
        if(item.consultationChargesInINR > 0 && (item.userType == "diabetologist" || freeDiet == 0)){
          item.showFee = item.consultationChargesInINR;
          // console.log("if true: ",item);
        }else{
          item.showFee = "Free";
          console.log("for free: ",item)
        }
      })
      setDocList(res.data);
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }, [])

  const onPatientClick = (item) =>{
    console.log("item: ",item);
    setPatientSelected(item);
    setView(1);
  }
  const onSpecialityClick = (item) =>{
    console.log("onSpecialityClick: ",item);
    setSpecialitySelected(item);
    setView(2);

  }
  const onDocClick = (item) =>{
    console.log("onDocClick: ",item);
    setDocSelected(item);
    setView(3);
    getSlot(item.id,selectedDate);
    if(item.showFee === "Free"){
      setFreeConsult(true);
    }
   
    
  }
  
  const getSlot = (id,date) =>{
    setSlotSelectedDay([]);
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
      setSlotSelectedDay(temp);
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
  const onDateChange = (val) =>{
    console.log("val: ",val);
    console.log("selectedDate: ",selectedDate)
    if(val === "back"){
      var new_date = moment(selectedDate).subtract(1, "day").format("YYYY-MM-DD");
      setSelectedDate(new_date);
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
  useEffect(() => {
    console.log("docSelected: ",docSelected)
    if(docSelected.id){
      getSlot(docSelected.id,selectedDate);
    }
  }, [selectedDate]);
  const onSlotClick = (val) =>{
    console.log("val: ",val)
    setSlotSelected(val)
  }
  const submitDetails = () =>{
    console.log("docSelected: ",docSelected, "patientSelected: ",patientSelected,"slotSelected:" ,slotSelected, "selectedDate ", selectedDate, "specialitySelected: ",specialitySelected )
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    
    let obj = {
      appointmentDate: selectedDate,
      appointmentSlotId: slotSelected.value,
      consultantId: docSelected.id,
      consultationType: docSelected.userType,
      customerId: patientSelected.id,
      parentId: patientSelected.parentId
    }
    if(freeConsult === true){
      obj.orderType =  "free:appointment";
    }
    console.log("obj: ",obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/appointment/add", obj, {
        headers,
    })
    .then((res) => {
      console.log("res in add details API :", res.data);
      setProductId(res.data.id)
      setView(4);
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }
  const submitPayment = () => {
    console.log("submitPayment")
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    
    let obj = {
      productId: productId
    }
    console.log("obj: ",obj);
    // return false;
    setLoader(true);
    axios
      .post(config.API_URL + "/api/order/new", obj, {
        headers,
    })
    .then((res) => {
      console.log("res in add Pay API :", res.data);
      if(freeConsult === true){
        setView(5);
        // setLoader(false);
        props.setRefreshList(res.data);
      }else{
        setPaymentDetails(res.data);
        displayRazorpay(res.data);
        setLoader(false);
      
      }
    
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }
  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
  }

async function displayRazorpay(paymentDetail) {
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // const result = await axios.post("http://localhost:5000/payment/orders");

    // if (!result) {
    //     alert("Server error. Are you online?");
    //     return;
    // }

    // const { amount, id: order_id, currency } = result.data;
    console.log("paymentDetail: ",paymentDetail);
    const options = {
        key: "rzp_test_xMql4J71OEZ0W8", // Enter the Key ID generated from the Dashboard
        amount: (paymentDetail.priceInINR).toString(),
        currency: paymentDetail.currency,
        name: "Test",
        description: "Test Transaction",
        // image: { logo },
        order_id: paymentDetail.order_id,
        handler: async function (response) {
          console.log("response in payment: ",response)
          let cookie = "";
              for (const [key, value] of Object.entries(cookies)) {
                if (key === "cookieVal") {
                    cookie = value;
                }
              }
              let headers = {
              authtoken: cookie,
              };
              let obj ={
                order_id: paymentDetail.order_id,
                mock_key: "bbbshyaw?ysys3bf"
              }
              setLoader(true);
              axios
                .post(config.API_URL + "/api/order/capturemockpayment", obj, {
                  headers,
              })
              .then((res) => {
                console.log("res: ",res);
                props.setRefreshList(res.data);
                setLoader(false);
              })
              .catch((err) => {
                console.log("err",err);
                setLoader(false);
              });
          setView(5);
            // const data = {
            //     orderCreationId: paymentDetail.order_id,
            //     razorpayPaymentId: response.razorpay_payment_id,
            //     razorpayOrderId: response.razorpay_order_id,
            //     razorpaySignature: response.razorpay_signature,
            // };

            // const result = await axios.post("http://localhost:5000/payment/success", data);

            // alert(result.data.msg);
        },
        prefill: {
            name: patientSelected.userFirstName +  " " + patientSelected.userLastName,
            email: patientSelected.emailId,
            contact: "+91" + patientSelected.phoneNumber,
        },
        notes: {
            address: "test test",
        },
        theme: {
            color: "#61dafb",
        },
    };

    const paymentObject = new window.Razorpay(options);
    console.log("paymentObject: ",paymentObject);
    paymentObject.open();
  }

  const submitConfirm = () =>{
    console.log("submitConfirm ");
    props.handleClose();
  }
  return (
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      {/* <DialogTitle id="alert-dialog-title">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={backBtnClick}/>
        <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Select Patient</div>
      </DialogTitle> */}
      {view === 0 && <div className="pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("0")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Select Patient</div>
        </DialogTitle>
        {famList.length > 0 && famList.map((item)=>(
          <Paper className="bookapmtcardStyle" onClick={(e)=>{onPatientClick(item)}}>
            <div className="imageSec">
              <img
                  // src={
                  //   `${config.API_URL}/api/utility/download/` +
                  //   item.consultantProfileImageName
                  // }
                  src={
                    item.profileImageName &&
                      item.profileImageName != "NA"
                      ? `${config.API_URL}/api/utility/download/` +
                      item.profileImageName
                      : createImageFromInitials(
                        100,
                        `${item.userFirstName + " " + item.userLastName
                        }`,
                        "#00888a"
                      )
                  }
                />
              </div>
            <div className="detailSec">
              <div>{item.userFirstName + " " + item.userLastName}</div>
              <div style={{fontSize:"16px"}}>{item.relationship}</div>
            </div>
          </Paper>
        ))  }
        
      </div>}
      {view === 1 && <div className="pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("1")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Select Speciality</div>
        </DialogTitle>
        {specialityList.length > 0 && specialityList.map((item)=>(
          <Paper className="bookapmtcardStyle" onClick={(e)=>{onSpecialityClick(item)}} style={{height:"90px"}}>
            <div className="detailSec" style={{marginLeft:"20px"}}>
              <div>{item.name}</div>
              {/* <div style={{fontSize:"18px"}}>{item.name}</div> */}
            </div>
          </Paper>
        ))  }
      </div>}
      {view === 2  && <div className="pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("2")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Select Doctor</div>
        </DialogTitle>
        <div style={{padding: "10px 20px", fontSize: "18px", fontWeight: "bold", color: "#545454"}}>{docList.length} Doctors</div>
        {docList.length > 0 && docList.map((item)=>(
          <Paper className="bookapmtcardStyle" onClick={(e)=>{onDocClick(item)}} style={{height:"150px"}}>
            <div className="imageSec" style={{margin: "20px 10px"}}>
              <img
                  // src={
                  //   `${config.API_URL}/api/utility/download/` +
                  //   item.consultantProfileImageName
                  // }
                  src={
                    item.profileImageName &&
                      item.profileImageName != "NA"
                      ? `${config.API_URL}/api/utility/download/` +
                      item.profileImageName
                      : createImageFromInitials(
                        100,
                        `${item.userFirstName + " " + item.userLastName
                        }`,
                        "#00888a"
                      )
                  }
                />
              </div>
            <div className="detailSec" style={{wordBreak: "break-word", width:"calc(100% - 110px)"}}>
              <div style={{fontSize:"18px"}}>{item.userFirstName + " " + item.userLastName}</div>
              {item.qualificationList.map((data)=>(
                <span style={{fontSize:"14px"}}>{data},&nbsp;</span>
              ))}
              <div style={{fontSize:"14px"}}>Experience: {item.experinceInYears} Years</div>
            </div>
          </Paper>
        ))  }
      </div>}
      
      {view === 3  && <div className="pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("3")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Select Slot</div>
        </DialogTitle>
        <div className="slotSec">
          <div className="docImageSec">
            <img
              src={
                docSelected.profileImageName &&
                  docSelected.profileImageName != "NA"
                  ? `${config.API_URL}/api/utility/download/` +
                  docSelected.profileImageName
                  : createImageFromInitials(
                    100,
                    `${docSelected.userFirstName + " " + docSelected.userLastName
                    }`,
                    "#00888a"
                  )
              }
            />
          </div>
          <div className="docDetailsSec">
              <div style={{fontSize:"20px"}}>{docSelected.userFirstName + " " + docSelected.userLastName}</div>
              {docSelected.qualificationList.map((data)=>(
                <span style={{fontSize:"14px"}}>{data},&nbsp;</span>
              ))}
              <div style={{fontSize:"14px"}}>Experience: {docSelected.experinceInYears} Years</div>
              <div className="consultCharge">₹{docSelected.showFee}</div>
            </div>
            <div style={{position:"relative", padding:"0 20px"}}>
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
                {/* <div style={{display:"inline-block", width:"60%", textAlign:"center", fontSize:"16px", fontWeight:"600"}}>{selectedDate}{selectedDate === moment(new Date()).format('YYYY-MM-DD') ? "(Today)":''}</div> */}
                <div className="dateNevigate" style={{borderLeft:"1px solid"}}>
                  <NavigateNextIcon onClick={(e)=>onDateChange("next")}/>
                </div>
              </div>
            </div>
            
          <div className="selectSlotSec">
              {showSlots.length > 0 && showSlots.map((item)=>(
                <span className={slotSelected === item ? "slotStyle selected" : "slotStyle"} onClick={(e)=>{onSlotClick(item)}}>{item.label}</span>
              ))}
            <div style={{textAlign:"center", marginTop:"30px"}}>
              <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="submitSlotBtn"
                onClick={submitDetails}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>}
    
      {view === 4  && <div className="patientDetails pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("4")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Booking Details</div>
        </DialogTitle>
        <Paper className="patientdetailscardStyle">
          <div className="title">
            Patient
          </div>
          <div className="content">
            <div style={{fontWeight:"600"}}>
              {patientSelected.userFirstName + " " + patientSelected.userLastName}
            </div>
            <div>
              {patientSelected.relationship}
            </div>
          </div>
        </Paper>
        <Paper className="patientdetailscardStyle">
          <div className="title">
            Doctor
          </div>
          <div className="content">
            <div style={{fontWeight:"600"}}>
              {docSelected.title + " " + docSelected.userFirstName + " " +docSelected.userLastName}
            </div>
          </div>
        </Paper>
        <Paper className="patientdetailscardStyle">
          <div className="title">
            Date
          </div>
          <div className="content">
            <div style={{fontWeight:"600"}}>
              {moment(selectedDate).format('DD MMM YYYY')}
            </div>
          </div>
        </Paper>
        <Paper className="patientdetailscardStyle">
          <div className="title">
            Time
          </div>
          <div className="content">
            <div style={{fontWeight:"600"}}>
              {slotSelected.label}
            </div>
          </div>
        </Paper>
        <Paper className="patientdetailscardStyle">
          <div className="title">
            Fee
          </div>
          <div className="content">
            <div style={{fontWeight:"600"}}>
              {docSelected.consultationChargesInINR}
            </div>
          </div>
        </Paper>
        <div style={{textAlign:"center", marginTop:"30px"}}>
          <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="submitSlotBtn"
            onClick={submitPayment}
          >
            {freeConsult ? "Book": "Pay Now"}
          </Button>
        </div>
      </div>
      }
      { view === 5 && <div className="pageView confirmPage">

        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", marginTop:"-4px"}} onClick={(e)=>backBtnClick("5")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Booking Confirmed</div>
        </DialogTitle>
        
        <div>
          <img src="/confirm_Sign.svg" style={{marginLeft:"50%", transform: "translateX(-50%)", marginTop:"20%"}}/>
          <div style={{color : "#545454", fontSize:"20px", width:"70%", marginLeft:"15%"}}> Your appointment for online consultation has been confirmed with {docSelected.title + " " + docSelected.userFirstName + " " +docSelected.userLastName} at {slotSelected.label} {selectedDate === moment(new Date()).format('YYYY-MM-DD') ? "Today" : selectedDate}. </div>
        </div>
        <div style={{textAlign:"center", marginTop:"100px"}}>
          <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="submitSlotBtn"
            onClick={submitConfirm}
          >
            Done
          </Button>
        </div>
      </div>

      }
    </div>
  )
}

export default BookAppointment
