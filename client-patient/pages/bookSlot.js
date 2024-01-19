import React, { useState, useEffect } from "react";
import Header from "../components/consultationServices/Header";
import SlotBook from "../components/consultationServices/SlotBook";
import LoginPage from "../components/Register/loginPage";
import FamilyMember from "../components/bookApmt/familyMember";
import ConfirmBooking from "../components/consultationServices/ConfirmBooking";
import MessagePrompt from "../components/messagePrompt";
import PaymentConformation from "../components/consultationServices/PaymentConformation";

function bookSlot({firebase}) {
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState({});
  const [msgData, setMsgData] = useState({});
  const [showFamList, setShowFamList] = useState(true);
  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem("showFamList"))
    console.log("temp showFamList: ",temp)
    setShowFamList(temp);
  }, [])
  useEffect(() => {
    console.log("page: ",page)
  }, [page])
  
  return (
    <div>
      <MessagePrompt msgData={msgData} />
      <Header />
      {page == 1 && <div>
        <SlotBook setPage = {setPage} showFamList = {showFamList} />
      </div>}
      {page == 2 && <LoginPage firebase = {firebase} setPage = {setPage}/>}
      {page ===3 &&  <FamilyMember 
          setPage = {setPage}
          setSelectedMember ={setSelectedMember}
          setMsgData = {setMsgData}
      />
   }
      {page == 4 && <ConfirmBooking setPage = {setPage}/>}
      {page == 5 && <PaymentConformation />}

    </div>
  );
}
export default bookSlot;