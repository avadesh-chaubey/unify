import React from "react";
import Header from "../components/consultationServices/Header";
import HomeScreen from "../components/consultationServices/components/HomeScreen/HomeScreen";

function homescreen() {
  return (
    <div>
      <Header />
      <div>
        <HomeScreen />
      </div>
    </div>
  );
}

export default homescreen;
