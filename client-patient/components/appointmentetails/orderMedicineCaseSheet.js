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

function OrderMedicineCaseSheet(props) {
  console.log("props: ",props)
  let caseSheetData = props.caseSheetData;

  const router = useRouter();

  const [cookies, getCookie] = useCookies(["name"]);
  const timeData = time;
  const [view, setView] = useState(0);
  const [apmtList, setApmtList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    console.log("caseSheetData: ",caseSheetData)
    if(caseSheetData.id){
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
          .get(config.API_URL + "/api/patient/createdeliveryorder/"+caseSheetData.id, {
            headers,
        })
        .then((response) => {
          console.log("response: ",response.data);
            setUserDetails(response.data);
            updateDeliveryOrder(response.data);
            setLoader(false);
          //     axios
          //       .get(config.API_URL + "/api/patient/deliveryorder/"+response.data.id, {
          //         headers,
          //     })
          //     .then((res1) => {
          //       console.log("res1: ",res1.data);
          //       updateDeliveryOrder(response.data);
          // // updateDeliveryOrder();
          //     })
          //     .catch((err) => console.log("err",err));
        })
        .catch((err) => {
          console.log("err",err);
          props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
          setLoader(false);
        });
    }
  }, []);
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
      deliveryAddress: tempDetails.deliveryAddress,
      city: tempDetails.city,
      state: tempDetails.state,
      pincode: tempDetails.pincode,
      addressType:  "home" ,
      medicineDeliveryEnabled : true,
      testCollectionEnabled : false
      }
      console.log("obj: ",obj);
      
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
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  }

  const payNow = () =>{

    let obj = {
    id: userDetails.id,
    medicinePrescription: userDetails.medicinePrescription,
    testPrescription: [],
    deliveryAddress: userDetails.deliveryAddress,
    city: userDetails.city,
    state: userDetails.state,
    pincode: userDetails.pincode,
    addressType:  "home" ,
    medicineDeliveryEnabled : true,
    testCollectionEnabled : false
    }
    console.log("obj: ",obj);
    
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
      props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
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
      props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
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
                props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
                setLoader(false);
              });
              props.setView(4)
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
    <div className="pageView confirmOrder">
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={(e)=>props.backBtnClick("2")}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Confirm Order</div>
        </DialogTitle>
        {userDetails.id && <div>
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
            <div style={{margin:"15px 30px",fontSize:"20px", fontWeight:"bold"}}>Medicines</div>
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
              </div>
              }
              <div style={{padding:"10px 0", borderTop:"1px solid"}}>
                <div style={{display:"inline-block", fontWeight:"bold", fontSize:"18px",color:"#000"}}>
                  Sub Total
                </div>
                <div style={{display:"inline-block", float:"right",fontWeight:"bold", fontSize:"16px",color:"#000"}}>
                  ₹ {(userDetails.medicineTotalAmountInINR).toFixed(2)}
                </div>
              </div>
            </div>
              
            <div className="totalAmount">
              <div>
                Total
              </div>
              <div style={{float:"right"}}>
                ₹ {(userDetails.totalAmountInINR).toFixed(2)}
              </div>
            </div>

            <div style={{margin:"15px 30px",fontSize:"20px", fontWeight:"bold"}}>Address</div>
            <div className="addressSec">
              <div className="addressType">
                <div>Address*</div>
                <div>{userDetails.deliveryAddress}</div>
              </div>
              <div className="addressType">
                <div>City*</div>
                <div>{userDetails.city}</div>
              </div>
              <div className="addressType">
                <div>State*</div>
                <div>{userDetails.state}</div>
              </div>
              <div className="addressType">
                <div>Pin*</div>
                <div>{userDetails.pincode}</div>
              </div>
            </div>
            <div style={{textAlign:"center", marginTop:"30px"}}>
              <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="submitSlotBtn"
                onClick={payNow}
              >
                PAY NOW
              </Button>
            </div>
          </div>
        </div>
      }
      </div>
      
  )
}

export default OrderMedicineCaseSheet
