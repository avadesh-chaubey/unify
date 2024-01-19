import React, {useState, useEffect, forwardRef} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import MessagePrompt from "../messagePrompt";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { createImageFromInitials } from "../../utils/nameDP";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import DocSlot from "./docSlot";
import moment from 'moment';
import Paper from '@material-ui/core/Paper';


const specialityList = [{name:"Child Care",value:"child-care"},{name:"Woman Health",value:"woman-health"},{name:"Fertility Care",value:"fertility-care"}];

function Consult247(props) {
  console.log("props in Consult247: ",props);
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [view, setView] = useState(0);
  
  const [msgData, setMsgData] = useState({});
  const [famList, setFamList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [patientSelected, setPatientSelected] = useState({});
  const [specialitySelected, setSpecialitySelected] = useState({});
  const [docSelected, setDocSelected] = useState({});
  const [slotSelected, setSlotSelected] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [freeConsult, setFreeConsult] = useState(false);

  const backBtnClick = (val) =>{
    if(val === "0"){
      // if(props.from === "patientDetails"){
      //   props.setShowAppmtSec(false)
      // }else{
      //   router.push("/home");
      // }
      props.set24X7Consult(false)
    }else if(val === "1"){
     setView(0);
    }else if(val === "2"){
     setView(1);
    }else if(val === "3"){
     setView(1);
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
      console.log("familyList in book Consult247:", res.data)
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
      console.log("docList in book Consult247:", res.data)
      let temp = res.data;
      temp.map((item)=>{
        let freeDiet = item.freeDieticianConsultations == undefined ? 0 : item.freeDieticianConsultations;
        
        if(item.consultationChargesInINR > 0 && (item.userType == "diabetologist" || freeDiet == 0)){
          item.showFee = item.consultationChargesInINR;
          // console.log("if true: ",item);
        }else{
          item.showFee = "Free";
        }
      })
      setDocList(res.data);
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }, []);

  const submitNext =()=>{
    console.log("submitNext ",specialitySelected, ": ", patientSelected)
    if(patientSelected && patientSelected.id === undefined){
      setMsgData({ message: "Please Select Family member", type: "error" });
      return false
    }else if(specialitySelected && specialitySelected.name === undefined){
      setMsgData({ message: "Please Select any Speciality", type: "error" });
      return false
    }
    setView(1);
  }
  const onDocClick = (item) =>{
    console.log("onDocClick: ",item);
    setSlotSelected({});
    setSelectedDate(moment(new Date()).format('YYYY-MM-DD'));
    if(item.id === docSelected.id){
      setDocSelected({});
    }else{
      setDocSelected(item);
    }
    // setDocSelected(item);
    // setSlotSelected({});
    // setSelectedDate(moment(new Date()).format('YYYY-MM-DD'));
    // setView(3);
    // getSlot(item.id,selectedDate);
    // if(item.showFee === "Free"){
    //   setFreeConsult(true);
    // }
   
    
  }
  const submitConfirm = () =>{
    console.log("submitConfirm ");
    props.set24X7Consult(false)

  }
  const submitDetails = () =>{
    console.log("docSelected: ",docSelected, "patientSelected: ",patientSelected,"slotSelected:" ,slotSelected, "selectedDate ", selectedDate, "specialitySelected: ",specialitySelected );
    // return false;
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
      // setProductId(res.data.id)
      submitPayment(res.data.id)
      // setView(4);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }
  const submitPayment = (productId) => {
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
      .post(config.API_URL + "/api/order/pay", obj, {
        headers,
    })
    .then((res) => {
      console.log("res in add Pay API :", res.data);
      if(freeConsult === true){
        setView(2);
        // setLoader(false);

      }else{
        // setPaymentDetails(res.data);
        displayRazorpay(res.data);
        setLoader(false);
      
      }
      // props.setRefreshList(res.data);
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
              setLoader(true);
              axios
                .get(config.API_URL + "/api/order/payment/"+response.razorpay_payment_id, {
                  headers,
              })
              .then((res) => {
                console.log("res: ",res);
                setLoader(false);
              })
              .catch((err) => {
                console.log("err",err);
                setLoader(false);
              });
              setView(2);

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
  return (
    <div className="mainDiv consult247" style={{background:"#cfcfcf"}}>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <MessagePrompt msgData={msgData} />

      {view === 0 && <div className="pageView" style={{background:"#fff"}}>
        <div className="orderTitle" style={{background:"#f5f5f5"}}>
          <KeyboardBackspaceIcon style={{fontSize:"34px", position:"absolute", top:"17px",left:"10px"}} onClick={(e)=>backBtnClick("0")}/>
            <div style={{marginLeft:"35px", fontSize:"18px", fontWeight:"600"}}>Consultation Service</div>
        </div>
        {console.log("famList: ",famList)}
        <div className="famListOutDiv">
          {famList.length > 0 &&<div className="famList" >
            {
              famList.map((item)=>(
                <div className={patientSelected === item ? "famItem selected" : "famItem"}  onClick={(e)=>{setPatientSelected(item)}}>
                  <div className="famImage">
                    <img src="./user.svg" />
                  </div>
                  <div className="famName">
                    {item.userFirstName + item.userLastName}
                  </div>
                  <div className="famRel">{item.relationship} </div>
                </div>
              ))
            }
          </div>}
        </div>
        <div className="fullDiv addNewFamMember">
          <div className="title">
            Select City*
          </div>
          <TextField
              select
              required
              // autoFocus
              // label="Select City"
              margin="normal"
              variant="outlined"
              className="fullDiv"
              // style={textBoxStyleTitle}
              // value={language}
              // error={errors.firstName}
              // onChange={(e) => setLanguage(e.target.value)}
            >
              {/* <MenuItem value="">Select</MenuItem> */}
              <MenuItem value="english">Delhi</MenuItem>
              <MenuItem value="hindi">Mumbai</MenuItem>
              <MenuItem value="tamil">Patna</MenuItem>
              <MenuItem value="Telugu">Chennai</MenuItem>
          </TextField>
        </div>

        <div className="fullDiv addNewFamMember">
          <div className="title">
            Select Unit*
          </div>
          <TextField
              select
              // required
              // autoFocus
              // label="Select Unit"
              margin="normal"
              variant="outlined"
              className="fullDiv"
              // style={textBoxStyleTitle}
              // value={language}
              // error={errors.firstName}
              // onChange={(e) => setLanguage(e.target.value)}
            >
              {/* <MenuItem value="">Select</MenuItem> */}
              <MenuItem value="english">Unit 1</MenuItem>
              <MenuItem value="hindi">Unit 2</MenuItem>
              <MenuItem value="tamil">Unit 3</MenuItem>
              <MenuItem value="Telugu">Unit 4</MenuItem>
          </TextField>
        </div>
        <div className="fullDiv">
            <div className="title">Select Speciality* </div>
              {specialityList.length > 0 && specialityList.map((item)=>(
                <div onClick={(e)=>{setSpecialitySelected(item)}} className={specialitySelected === item ? "speciality selected" : "speciality"}>
                  {/* <div className="" style={{marginLeft:"20px"}}> */}
                    {/* <div> */}
                      {item.name}
                    {/* </div> */}
                    {/* <div style={{fontSize:"18px"}}>{item.name}</div> */}
                  {/* </div> */}
                </div>
              ))  }
        </div>
    
        <div className="fullDiv addNewFamMember">
          <div className="title">
            Pediatrician*
          </div>
          <TextField
              select
              // required
              // autoFocus
              // label="Select Unit"
              margin="normal"
              variant="outlined"
              className="fullDiv"
              // style={textBoxStyleTitle}
              // value={language}
              // error={errors.firstName}
              // onChange={(e) => setLanguage(e.target.value)}
            >
              {/* <MenuItem value="">Select</MenuItem> */}
              <MenuItem value="english">Pediatrician 1</MenuItem>
              <MenuItem value="hindi">Pediatrician 2</MenuItem>
              <MenuItem value="tamil">Pediatrician 3</MenuItem>
              <MenuItem value="Telugu">Pediatrician 4</MenuItem>
          </TextField>
        </div>
        <div style={{textAlign:"center", marginTop:"30px"}}>
          <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="submitSlotBtn"
            onClick={submitNext}
          >
            Next
          </Button>
        </div>
      
      </div> }
     

      {view === 1 && <div className="pageView" style={{background:"#fff"}}>
        <div className="orderTitle" style={{background:"#f5f5f5"}}>
          <KeyboardBackspaceIcon style={{fontSize:"34px", position:"absolute", top:"17px",left:"10px"}} onClick={(e)=>backBtnClick("1")}/>
          <div style={{marginLeft:"35px", fontSize:"18px", fontWeight:"600"}}>Select Doctor</div>
        </div>
        <div style={{padding: "10px 20px", fontSize: "18px", fontWeight: "bold", color: "#545454"}}>{docList.length} Doctors</div>
        {docList.length > 0 && docList.map((item)=>(
          <Accordion expanded={item.id === docSelected.id} style={{ marginBottom: "20px" }} key={item.id}>
          <AccordionSummary>
              <div className="bookapmtcardStyle" onClick={(e)=>{onDocClick(item)}}>
                <div className="imageSec" style={{margin: "20px 10px"}}>
                  <img
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
              </div>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
           {item.id === docSelected.id && <DocSlot 
              docSelected = {docSelected}
              patientSelected = {patientSelected}
              specialitySelected = {specialitySelected}
              setView = {setView}
              selectedDate={selectedDate}
              slotSelected={slotSelected}
              submitDetails={submitDetails}
              setSlotSelected = {setSlotSelected}
              setSelectedDate ={setSelectedDate}
              setMsgData = {setMsgData}
            />}
          </AccordionDetails>
      </Accordion>
        ))  }
      </div>}
    
      { view === 2 && <div className="pageView confirmPage">
        <div className="orderTitle" style={{background:"#f5f5f5"}}>
          {/* <KeyboardBackspaceIcon style={{fontSize:"34px", position:"absolute", top:"17px",left:"10px"}} onClick={(e)=>backBtnClick("5")}/> */}
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Booking Confirmed</div>
        </div>

        <div>
          <img src="/confirm_Sign.svg" style={{marginLeft:"50%", transform: "translateX(-50%)", marginTop:"20%"}}/>
          <div style={{color : "#545454", fontSize:"20px", width:"70%", marginLeft:"15%"}}> Your appointment for online consultation has been confirmed with {docSelected.title + " " + docSelected.userFirstName + " " +docSelected.userLastName} at {slotSelected.label} {selectedDate === moment(new Date()).format('YYYY-MM-DD') ? "Today" : selectedDate}. </div>
          {/* <div style={{color : "#545454", fontSize:"20px", width:"70%", marginLeft:"15%"}}> Your appointment for online consultation has been confirmed.</div> */}

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
         {view === 3  && <div className="patientDetails pageView">
         <div className="orderTitle" style={{background:"#f5f5f5"}}>
          <KeyboardBackspaceIcon style={{fontSize:"34px", position:"absolute", top:"17px",left:"10px"}} onClick={(e)=>backBtnClick("2")}/>
          <div style={{marginLeft:"35px", fontSize:"18px", fontWeight:"600"}}>Booking Details</div>
        </div>
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
    </div>
  )
}

export default Consult247
