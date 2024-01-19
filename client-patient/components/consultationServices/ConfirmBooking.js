import React from "react";
import HeadBreadcrumbs from "../common/headBreadcrumbs";
import ConsultationCard from "./components/ConfirmBooking/ConsultationCard";

export default function ConfirmBooking(props) {
  const {setView,currentLink,setPage} = props;

  return (
    <>
      <HeadBreadcrumbs
         titleArr={["Home","Book Appointment", "Consultation Services","Select Doctor","Select Slot"]}
         lastTitle = {"Confirm Booking"}
         mainTitle={"Confirm Booking"}
      />
      <ConsultationCard setView = {setView} currentLink ={currentLink} setPage = {setPage}/>
    </>
  );
}
