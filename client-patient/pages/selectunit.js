import React, { useState, useEffect } from "react";
import Header from "../components/consultationServices/Header";
import SelectUnit from "../components/consultationServices/SelectUnit";
import MessagePrompt from "../components/messagePrompt";

const App = () => {
  const [msgData, setMsgData] = useState({});
  
  return (
    <div>
      <MessagePrompt msgData={msgData} />
      <Header />
      <div>
      <SelectUnit setMsgData = {setMsgData} />
      </div>
    </div>
  );
};
export default App;
