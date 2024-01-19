import React, { useEffect, useState } from "react";

import ForgotPasswordForm from "../components/agency-home/ForgotPassword";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import MessagePrompt from "../components/messagePrompt";

// const options = {
//     position: positions.TOP_CENTER,
//     timeout: 5000,
//     offset: '10px',
//     transition: transitions.SCALE
//  }

const forgotPassword = () => {
  const [msgData, setMsgData] = useState({});
  return (
    <>
      <MessagePrompt msgData={msgData} />
      <ForgotPasswordForm setMsgData={setMsgData} />
    </>
  );
};

export default forgotPassword;
