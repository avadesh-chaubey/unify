import React, { useState, useEffect } from "react";
import DoctorResult from "../components/consultationServices/DoctorResult";
import Header from "../components/consultationServices/Header";
import SlotBook from "../components/consultationServices/SlotBook";
import ConfirmBooking from "../components/consultationServices/ConfirmBooking";
import PaymentConformation from "../components/consultationServices/PaymentConformation";
import { useCookies } from "react-cookie";
import config from "../app.constant";
import axios from "axios";
import router from "next/router";
function doctorresult() {
  const [view, setView] = useState("1");
  const [cookies, setCookie] = useCookies(["name"]);
  const [doctorId, setDoctorID] = useState();
  const headers = {
    authtoken: cookies["cookieVal"],
  };
  
  useEffect(() => {
    console.log("view: ", view);
  }, [view]);

  const docSelect = (item, type) => {
    setDoctorID(item);
    console.log("docSelect: ", item, type,);
    router.push(`bookSlot?sessionUID=${item}`);

  };
  console.log("======>doctorIdDoctorResult", doctorId)
  return (
    <div>
      <Header />
      <div>
        {view == "1" && (
          <DoctorResult docSelect={docSelect} setView={setView} />
        )}
        {view == "2" && (
          <SlotBook
            setView={setView}
            id={doctorId}
          />
        )}
        {view == "3" && (
          <ConfirmBooking setView={setView}/>
        )}
        {view == "4" && <PaymentConformation />}
      </div>
    </div>
  );
}
export default doctorresult;
