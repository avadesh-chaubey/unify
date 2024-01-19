import React, {useState, useEffect} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TodayIcon from '@material-ui/icons/Today';
import { createImageFromInitials } from "../../utils/nameDP";
import Paper from '@material-ui/core/Paper';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import moment from 'moment';
import time from "../../data/timeRoster.json";
import Button from "@material-ui/core/Button";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import MailIcon from '@material-ui/icons/Mail';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useRouter } from 'next/router';
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import MessagePrompt from "../messagePrompt";

function OrderMedicine(props) {
  const router = useRouter();
  const [msgData, setMsgData] = useState({});

  const [cookies, getCookie] = useCookies(["name"]);
  const timeData = time;
  const [view, setView] = useState(0);
  const [apmtList, setApmtList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [address, setAddress] = useState("");
  
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
  const getStates = () => {
    let url = config.API_URL + "/api/utility/cities?countryName=" + country;
    setLoader(true);
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setStateList(response.data);
        }
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  };

  useEffect(() => {
    getStates();
  }, []);

  const [cityList, setCityList] = useState("");
  const getCities = () => {
   
    let url =
      config.API_URL +
      "/api/utility/cities?countryName=" +
      country +
      "&stateName=" +
      state;
    axios
      .get(url)
      .then((response) => {
        const showcity = [];
        if (response.data) {
          response.data.map((city) => {
            showcity.push(city.name);
          });
          setCityList(showcity);
        }
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  };

  useEffect(() => {
    if (state !== "") {
      getCities();
    }
  }, [state]);
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
      .get(config.API_URL + "/api/patient/all-family-appointments", {
        headers,
    })
    .then((res) => {
      let temp = [];
      let newTemp = [];
      console.log("res: ",res);
      temp = res.data;
      temp.map((item)=>{
        timeData.map((data)=>{
          if(item.appointmentSlotId === data.value){
            item.slotLabel = data.label
          }
        })
        if(new Date(item.appointmentDate) < new Date()){
          newTemp.push(item);
        }
      });
      setApmtList(newTemp);
      setLoader(false);
    })
    .catch((err) => {
      console.log("err",err);
      setLoader(false);
    });
  }, [])
  useEffect(() => {
    console.log("userDetails: ",userDetails)
    if(userDetails && userDetails.id){
      setAddress(userDetails.deliveryAddress);
      setState(userDetails.state);
      setCity(userDetails.city);
      setPin(userDetails.pincode);
    }
  }, [userDetails])
  function pinValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only numbers" });
    }else{
      setPin(value);
    }
    if(value.length > 6){
      setPinError({ pin: "It must be of six digits" });
    }
  }
  const onAppointmentClick =(data) =>{
    console.log("data: ",data)
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "cookieVal") {
          cookie = value;
      }
    }
    let headers = {
    authtoken: cookie,
    };
    axios
      .get(config.API_URL + "/api/patient/appointmentcasesheet/"+data.id, {
        headers,
    })
    .then((res) => {
      
      console.log("res: ",res);
      setLoader(true);
      axios
        .get(config.API_URL + "/api/patient/createdeliveryorder/"+res.data.id, {
          headers,
      })
      .then((response) => {
        console.log("response ####: ",response.data);
        setAddress(response.data.deliveryAddress);
        setState(response.data.state);
        setCity(response.data.city);
        setPin(response.data.pincode);
        setUserDetails(response.data);
        setView(1)
        updateDeliveryOrder(response.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err",err);
        setLoader(false);
      });
    })
    .catch((err) => console.log("err",err));
    
  }
  const handlePackChange = (item, index,val) =>{
    console.log("item, index,val: ",item, index,val)
    let tempList =[...userDetails.medicinePrescription];
    if(val === "plus"){
      tempList[index].numberOfUnits = tempList[index].numberOfUnits + 1; 
    }
    if(val === "minus" && tempList[index].numberOfUnits > 0){
      tempList[index].numberOfUnits = tempList[index].numberOfUnits - 1; 
    }
    console.log("tempList ", tempList[index])
    setUserDetails(userDetails);
    updateDeliveryOrder();
  }

  const updateDeliveryOrder = (data) =>{
    console.log("data: ",data);
    console.log("userdetais:", userDetails )
    let tempDetails = {};
    if(data && data.id){
      tempDetails = data;
    }else{
      tempDetails = userDetails;
    }
    let obj = {
      id: tempDetails.id,
      medicinePrescription: tempDetails.medicinePrescription,
      testPrescription: [],
      deliveryAddress: address,
      city: city,
      state: state,
      pincode: pin,
      addressType:  "home" ,
      medicineDeliveryEnabled : true,
      testCollectionEnabled : false
      }
      console.log("obj updateDeliveryOrder: ",obj);
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
      setLoader(true);
      axios
        .post(config.API_URL + "/api/patient/updatedeliveryorder", obj, {
          headers,
      })
      .then((res) => {
        console.log("slot in book appointment:", res.data)
        setUserDetails(res.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err",err);
        setLoader(false);
      });
  }

  const payNow = () =>{
    if(address === ""){
      setMsgData({ message: "Please Enter Address", type: "error" });
      return false;
    }else if(state === ""){
      setMsgData({ message: "Please Enter State", type: "error" });
      return false;
    }else if(city === ""){
      setMsgData({ message: "Please Enter City", type: "error" });
      return false;
    }else if(pin === ""){
      setMsgData({ message: "Please Enter Pin", type: "error" });
      return false;
    }
    let obj = {
    id: userDetails.id,
    medicinePrescription: userDetails.medicinePrescription,
    testPrescription: [],
    deliveryAddress: address,
    city: city,
    state: state,
    pincode: pin,
    addressType:  "home" ,
    medicineDeliveryEnabled : true,
    testCollectionEnabled : false
    }
    console.log("obj: ",obj);
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
    setLoader(true);
    axios
      .post(config.API_URL + "/api/patient/paydeliveryorder", obj, {
        headers,
    })
    .then((res) => {
      console.log("slot in book appointment:", res.data)
      submitPayment(res.data.id);
      setLoader(false);
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
        // setPaymentDetails(res.data);
        displayRazorpay(res.data);
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
  const submitConfirm = () =>{
    console.log("submitConfirm ");
    router.push("/myOrder");
    props.handleClose();
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
              setView(2)
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
            name: userDetails.patientName,
            email: userDetails.patientEmail,
            contact: "+91" + userDetails.patientPhone,
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
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <MessagePrompt msgData={msgData} />
      {view === 0 && <div className="pageView">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={(e)=>backBtnClick("0")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"600"}}>Select Prescription</div>
        </DialogTitle>
        <div style={{flexGrow:"1", margin:"15px"}} >
        {apmtList.length>0 &&
          <Grid container spacing={2}>
            {apmtList.map((item)=>(
              <Grid item xs={12} sm={4} key={item.id} onClick={(e)=>{onAppointmentClick(item)}}>
                <Paper className="apmtcardStyle">
                  <div>
                    <div className="cardTopSec">
                        <div className="imageSec">
                          <img
                              src={
                                `${config.API_URL}/api/utility/download/` +
                                item.consultantProfileImageName
                              }
                              // src={
                              //   doct.profileImageName &&
                              //     doct.profileImageName != "NA"
                              //     ? `${config.API_URL}/api/utility/download/` +
                              //     doct.profileImageName
                              //     : createImageFromInitials(
                              //       100,
                              //       `${doct.userFirstName + " " + doct.userLastName
                              //       }`,
                              //       "#00888a"
                              //     )
                              // }
                          />
                        </div>
                      <div className="detailSec">
                        <div>{item.consultantName}</div>
                        <div style={{wordBreak:"break-all"}} >{item.consultantQualification}</div>
                        <div>Experience: {item.consultantExperince}</div>
                        <div className="apmtTimeDev" >
                          <TodayIcon className="todayIcon" />
                          <div className="apmtTime">
                            {item.slotLabel} {moment(item.appointmentDate).format('DD-MMM-YYYY')}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="cardBottomSec">
                      <TodayIcon style={{marginLeft: "10px"}} />
                      <div style={{color:"#000", fontSize:"14px", fontWeight:"600", width:"50%"}}>
                        {item.slotLabel} {moment(item.appointmentDate).format('DD-MMM-YYYY')}
                      </div>
                    </div> */}
                  </div>
                </Paper>
              </Grid>
            ))}
            </Grid>
          }
        </div>

      </div>
      }
      {view === 1 && <div className="pageView confirmOrder">
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={(e)=>backBtnClick("1")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"600"}}>Confirm Order</div>
        </DialogTitle>
          <div className="details"> 
            <div className="patientDetails">
              <div className="title">
                Patient Details
              </div>
              <div className="name">
                {userDetails.patientName}
              </div>
              <div>
                {userDetails.patientAge}, {userDetails.patientGender}
              </div>
              <div>
                ARH ID: {userDetails.patientARHId}
              </div>
            </div>
            <div className="docDetails">
              <div className="title">
                Doctor Details
              </div>
              <div className="name">
                {userDetails.consultantName}
              </div>
              <div>
                {userDetails.consultantQualification}
              </div>
            </div>
            <div className="apptDetails">
              <div className="title">
                Appointment Details
              </div>
              <div className="name">
                {moment(userDetails.appointmentDate).format('DD-MMM-YYYY')}
              </div>
              <div>
               {timeData.map((data)=>{
                if(userDetails.appointmentSlotId === data.value){
                  return data.label
                  }
                })
              }
              </div>
            </div>
          </div>
          <div>
            <div style={{margin:"15px 30px",fontSize:"20px", fontWeight:"600"}}>Medicines</div>
            <div className="details">
              {userDetails.medicinePrescription.length >0 && <div>
                {userDetails.medicinePrescription.map((item, index)=>(
                  <div className="medSec">
                    <div>
                      <span>{item.nameOfTheDrug}</span>
                      <span style={{float:"right"}}>₹ {item.MRP*item.numberOfUnits}</span>
                    </div>
                    <div className="buttonSec">
                      <Button
                        aria-label="reduce"
                        // onClick={() => {
                        //   setCount(Math.max(count - 1, 0));
                        // }}
                        onClick={(e) => {
                          handlePackChange(item,index,"minus")
                        }}
                        style={{borderRadius:'unset', borderRight:"1px solid", minWidth:"45px", padding:"10px 0"}}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>

                      <span className="countVal"> {item.numberOfUnits} Pack</span>
                      
                      <Button
                        aria-label="increase"
                        // onClick={() => {
                        //   setCount(count + 1);
                        // }}
                        onClick={(e) => {
                          handlePackChange(item,index,"plus");
                        }}
                        style={{borderRadius:'unset', borderLeft:"1px solid", minWidth:"45px", padding:"10px 0"}}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </div>
                  </div>
                ))
                  
                }
                <div style={{padding:"10px 0", borderTop:"1px solid"}}>
                  <div style={{display:"inline-block", fontWeight:"600", fontSize:"18px",color:"#000"}}>
                    Sub Total
                  </div>
                  <div style={{display:"inline-block", float:"right",fontWeight:"600", fontSize:"16px",color:"#000"}}>
                    ₹ {(userDetails.medicineTotalAmountInINR).toFixed(2)}
                  </div>
                </div>
              </div>
              }
              {userDetails.medicinePrescription.length < 1 && <div>
                No Medicine Prescribed.
              </div>}
            </div>
              
            {userDetails.medicinePrescription.length >0 && <div className="totalAmount">
              <div>
                Total
              </div>
              <div style={{float:"right"}}>
                ₹ {(userDetails.totalAmountInINR).toFixed(2)}
              </div>
            </div>
            }
            <div style={{margin:"15px 30px",fontSize:"20px", fontWeight:"600"}}>Address</div>
            <div className="addressSec addNewFamMember">
              <div className="addressType">
                <div>Address*</div>
                {/* <div>{userDetails.deliveryAddress}</div> */}
                <div>
                <TextField 
                  id="Email" 
                  value={address}
                  className="fullDiv"
                  inputProps={{ 'aria-label': 'naked' }}
                  onChange={(e) => setAddress(e.target.value)}
                />
                </div>
              </div>

              <div className="addressType">
                <div>State*</div>
                {/* <div>{userDetails.state}</div> */}
                <div>
                  <TextField
                    required
                    select
                    // label="State/Province"
                    id="state *"
                    value={state}
                    // required
                    margin="normal"
                    variant="filled"
                    className="fullDiv"
                    // className={"fullDiv " + (errMsg && state === "" ? "err" : "")}
                    onChange={(e) => setState(e.target.value)}
                  // displayEmpty
                  // className={" newblock " + (state === "" ? "err1" : "")}
                  >
                    {/* <MenuItem value="" disabled></MenuItem> */}
                    {stateList.length > 0 &&
                      stateList.map((state, id) => (
                        <MenuItem key={"state-" + id} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
              </div>

              <div className="addressType">
                <div>City*</div>
                {/* <div>{userDetails.city}</div> */}
                <div>
                  <TextField
                    required
                    select
                    // label="City"
                    id="city"
                    value={city}
                    className="fullDiv"
                    // className={"fullDiv " + (errMsg && city === "" ? "err" : "")}
                    margin="normal"
                    variant="filled"
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {/* <MenuItem value="" disabled></MenuItem> */}
                    {cityList.length > 0 &&
                      cityList.map((city, id) => (
                        <MenuItem key={"city-" + id} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
              </div>
              <div className="addressType">
                <div>Pin*</div>
                {/* <div>{userDetails.pincode}</div> */}
                <div>
                  <TextField 
                    id="Email" 
                    // value={pin}
                    className="fullDiv"
                    inputProps={{ 'aria-label': 'naked' }}
                    value={pin === "NA" ? "" : pin}
                    error={Boolean(pinError?.pin)}
                    helperText={pinError?.pin}
                    onChange={pinValidate}
                  />
                </div>
              </div>
            </div>
            {userDetails.medicinePrescription.length >0 && <div style={{textAlign:"center", marginTop:"30px"}}>
              <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="submitSlotBtn"
                onClick={payNow}
              >
                PAY NOW
              </Button>
            </div>}
          </div>
        </div>
      }
      
      { view === 2 && <div className="pageView confirmPage">

        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={(e)=>backBtnClick("3")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"600"}}>Booking Confirmed</div>
        </DialogTitle>
        
        <div>
          <img src="/confirm_Sign.svg" style={{marginLeft:"50%", transform: "translateX(-50%)", marginTop:"20%"}}/>
          <div style={{color : "#545454", fontSize:"20px", width:"70%", marginLeft:"25%", marginTop:"10%"}}> Your Order has been successfully placed. </div>
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

export default OrderMedicine
