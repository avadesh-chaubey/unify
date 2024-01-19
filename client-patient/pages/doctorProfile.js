import React from "react";
import Header from "../components/consultationServices/Header";
import DoctorProfileandImage from "../components/doctor_Profile/doctorProfileandImage";

function doctorProfile() {
  return (
    <div>
      <Header />
      {/* <div style={{ padding: " 15px 60px" }}> */}
      <DoctorProfileandImage />
      {/* </div> */}
    </div>
  );
}

export default doctorProfile;
