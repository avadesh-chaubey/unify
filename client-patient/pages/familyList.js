import React, { useState, useEffect } from "react";

import FamilyMember from "../components/bookApmt/familyMember";
import Header from "../components/consultationServices/Header";
import MessagePrompt from "../components/messagePrompt";

function familyList() {
  const [selectedMember, setSelectedMember] = useState({});
  const [msgData, setMsgData] = useState({});

  return (
    <div>
         <MessagePrompt msgData={msgData} />
         <Header />
         <FamilyMember 
            setSelectedMember ={setSelectedMember}
            setMsgData = {setMsgData}
         />
    </div>
  )
}

export default familyList