import React,{useEffect, useState} from 'react';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';

import ChatSection from "../appointmentetails/chatSection";
import CaseSheetDetails from "../appointmentetails/caseSheetDetails";
import OrderLabTest from "../appointmentetails/orderLabTest";
import ConfirmationMsg from "../appointmentetails/confirmationMsg";
import OrderMedicineCaseSheet from "../appointmentetails/orderMedicineCaseSheet";
import MessagePrompt from "../messagePrompt";
 

function AppoinmentDetails(props) {
  console.log("props in AppoinmentDetails: ",props);
  const [appointmentData, setAppointmentData] = useState({});
  const [view, setView] = useState(0);
  const [caseSheetData, setCaseSheetData] = useState({});
  const [msgData, setMsgData] = useState({});

  const backBtnClick = (val) =>{
    if(val === "0"){
      // if(props.from === "patientDetails"){
      //   props.setShowAppmtSec(false)
      // }else{
      //   router.push("/home");
      // }
      props.setShowAppmtSec(false)
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
  // let apptData = localStorage.getItem("appointmentData");
  // setAppointmentData(JSON.parse(apptData));
  // console.log("apptdata: ", JSON.parse(apptData));
  setAppointmentData(props.appointmentData);

  
  }, []);
  const buyMedicine = () =>{
    console.log("buyMedicine")
    setView(2);
  }
  const bookLabTest = () =>{
    console.log("bookLabTest:")
    setView(3);
  }
  
  return (
    <div className="mainDiv" style={{background:"#cfcfcf"}}>
      <MessagePrompt msgData={msgData} />

      {view === 0 && <div>
        <ChatSection 
          appointmentData = {appointmentData} 
          setCaseSheetData = {setCaseSheetData} 
          setView = {setView} 
          backBtnClick = {backBtnClick}
          setMsgData = {setMsgData}
          firebase = {props.firebase}
          />
        {/*  */}
      </div>}
      
      {view === 1 && <div>
        <CaseSheetDetails
          appointmentData = {appointmentData} 
          caseSheetData = {caseSheetData}
          buyMedicine = {buyMedicine}
          bookLabTest = {bookLabTest}
          backBtnClick = {backBtnClick}
        />
      </div>}
      {view === 2 && <div>
        <OrderMedicineCaseSheet 
          caseSheetData = {caseSheetData}
          setView = {setView} 
          backBtnClick = {backBtnClick}
          setMsgData = {setMsgData}
        />
      </div>}
      {view === 3 && <div>
         <OrderLabTest
          // appointmentData = {appointmentData} 
          caseSheetData = {caseSheetData}
          // userDetails = {userDetails}
          setView = {setView} 
          backBtnClick = {backBtnClick}
          setMsgData = {setMsgData}
        />
      </div>}
      {view === 4 && <div>
         <ConfirmationMsg
          setView = {setView} 
          backBtnClick = {backBtnClick}
      
        />
      </div>}
    </div>
  )
}

export default AppoinmentDetails
