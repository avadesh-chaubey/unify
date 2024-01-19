import React, { useEffect } from "react";
import HomeScreen from "../components/consultationServices/components/HomeScreen/HomeScreen";
import Header from "../components/consultationServices/Header";
import PaymentComp from "../components/common/paymentComp";
function home() {
  return (
    <div>
      <Header />
      <HomeScreen />
      {/* <PaymentComp /> */}
    </div>
  );
}

export default home;
