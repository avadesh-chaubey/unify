import React, { useEffect, useState } from "react";
import { Grid, Divider, Button } from "@material-ui/core";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import router from "next/router";
import DoctorDetails from "./components/SlotBook/DoctorDetails";
import ConsultationType from "./components/SlotBook/ConsultationType";
import SlotDatePicker from "./components/SlotBook/SlotDatePicker";
import AvailableSlot from "./components/SlotBook/AvailableSlot";
import BillDetails from "./components/SlotBook/BillDetails";
import { useRouter } from "next/router";

export default function SlotBook(props) {
  const { setView, slotDetails, id,setPage,showFamList  } = props;

  // const router2 = useRouter();
  // const { id } = router2.query;
  console.log("======>propsSlotbook", props, id);

  const confirmBookingBtn = () => {
    let temp = JSON.parse(localStorage.getItem('userDetails'));
    console.log("temp: ",temp);
    console.log("showFamList: ",showFamList)
    if(temp && temp.id != ""){
      if(showFamList === false){
        setPage(4);
      }else{
        setPage(3);
      }
    }else{
      setPage(2);
    }
  };
  return (
    <div>
      <HeadBreadcrumbs
        titleArr={
          [
            "Home",
            "Book Appointment",
            "Consultation Services",
            "Select Doctor",
          ]
        }
        lastTitle={ "Select Slot"}
        mainTitle={"Book Slot"}
      />
      <Grid container justifyContent="center">
        <Grid item xs={11} style={{ marginTop: "20px" }}>
          <DoctorDetails doctorId={id} />
        </Grid>
        <Grid item xs={11} spacing={1}>
          <ConsultationType />
        </Grid>
        <Grid item xs={11}>
          <SlotDatePicker />
          <Divider style={{ marginTop: "20px" }} />
        </Grid>
        <AvailableSlot />
        <BillDetails />
        <Grid item xs={11}>
          <Button
            style={{
              border: "1px solid rgb(80, 46, 146)",
              color: "rgb(80, 46, 146)",
              width: "250px",
              height: "30px",
              alignItems: "center",
              float: "right",
              textAlign: "center",
              marginTop: "20px",
              borderRadius: "5px",
              fontSize: "13px",
              textTransform: "capitalize",
            }}
            onClick={confirmBookingBtn}
          >
            Confirm Appointment
          </Button>
        </Grid>
      </Grid>
      <br />
    </div>
  );
}
