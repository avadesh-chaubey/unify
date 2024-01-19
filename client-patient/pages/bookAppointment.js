import React, { useState, useEffect } from "react";
import FamilyMember from "../components/bookApmt/familyMember";
import SelectUnit from "../components/consultationServices/SelectUnit";
import Header from "../components/consultationServices/Header";
import MessagePrompt from "../components/messagePrompt";
import DoctorResult from "../components/consultationServices/DoctorResult";
import SlotBook from "../components/consultationServices/SlotBook";
import ConfirmBooking from "../components/consultationServices/ConfirmBooking";
import PaymentConformation from "../components/consultationServices/PaymentConformation";
import { useCookies } from "react-cookie";
import config from "../app.constant";
import axios from "axios";
import router from 'next/router';
import moment from 'moment';

function bookAppointment() {
  const [view, setView] = useState("2");
  const [cookies, setCookie] = useCookies(["name"]);
  const [selectedMember, setSelectedMember] = useState({});
  const [msgData, setMsgData] = useState({});
  const [selectedUnit, setSelectedUnit] = useState({});
  const [selectedSpec, setSelectedSpec] = useState({});
  const [slotDetails, setSlotDetails] = useState({});
  const [currentLink, setCurrentLink] = useState("");
  const [doctorId, setDoctorId]=useState();
  const headers = {
    authtoken: cookies["cookieVal"],
  };
 
  useEffect(() => {
    console.log("view: ", view);
  }, [view]);

  useEffect(() => {
    if (router.asPath === "/bookAppointment") {
      setCurrentLink("bookAppointment");
    }
    if (router.asPath === "/doctorresult") {
      setCurrentLink("doctorresult");
    }
  },[])
   
   const docSelect = (item, type) =>{
    setDoctorId(item)
     console.log("docSelect: ",item,type);
     axios
     .get(`${config.API_URL}/api/patient/doctorslots?sessionUID=${item}&date=${moment(new Date()).format('YYYY-MM-DD')}`, { headers })
    //  .get(config.API_URL+"/api/patient/doctorslots?sessionUID=15157&date=2021-12-23", { headers })
     // .get(config.API_URL + "/api/partner/doctors"+query, { headers })
     .then((res) => {
       console.log("res: ", res.data.data);
       let showData = res.data.data;
       let temp = res.data.data.slots;
       temp.map((item)=>{
         let time = item.slotTime;
         let index = time.indexOf("T");
         let str = time.substr(index+1, 5);
         item.showSlotTime = str;
       })
       showData.slots = temp;
       console.log("temp: ",temp);
       // console.log("tempArr: ",tempArr);
       console.log("showData: ",showData);
       setSlotDetails(showData);
      //  setTimeout(()=>{
      //    setView("4");
      //  },1000)
       setView("4");
       
     })
     .catch((err) => {
       console.log("err", err);
       setMsgData({ message: err.response.data[0].message, type: "error" });

     });
   }
return <>
   <MessagePrompt msgData={msgData} />
   <Header />
   {view ==="1" && <FamilyMember 
         setView ={setView} 
         setSelectedMember ={setSelectedMember}
         setMsgData = {setMsgData}
      />
   }
   {view ==="2" && <SelectUnit 
         setView ={setView} 
         setMsgData = {setMsgData}
         selectedUnit = {selectedUnit}
         setSelectedUnit = {setSelectedUnit}
         selectedSpec = {selectedSpec}
         setSelectedSpec = {setSelectedSpec}
      />
   }
   {view == "3" && <DoctorResult 
      docSelect = {docSelect} 
      setView = {setView}
      selectedUnit = {selectedUnit}
      selectedSpec = {selectedSpec}
      currentLink = {currentLink}
      />}
   {view == "4" && <SlotBook slotDetails = {slotDetails} setView = {setView} currentLink = {currentLink} id={doctorId}/>}
   {view == "5" && <ConfirmBooking setView = {setView} currentLink = {currentLink}/>}
   {view == "6" && <PaymentConformation />}
   {/* bookAppointment */}
</>;
}

export default bookAppointment;
