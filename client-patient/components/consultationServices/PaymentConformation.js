import React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import Header from "./Header";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import router from "next/router";

export default function PaymentConformation() {

  const goHome = () =>{
    router.push("/home")
  }
  return (
    <Grid container justifyContent="center" spacing={1}>
      {/* <Grid item xs={12}>
        <Header />
      </Grid> */}
      <Grid
        item
        style={{
          backgroundColor: "#F6F7FA",
          width: "400px",
          height: "410px",
          marginTop: "30px",
        }}
      >
        <CheckCircleIcon
          style={{
            width: "60px",
            height: "60px",
            alignItems: "center",
            marginLeft: "150px",
            marginTop: "25px",
            color: "#00B5AF",
          }}
        />
        <div style={{ marginLeft: "90px" }}>
          <Typography
            style={{ color: "#424242", fontWeight: "bold", fontSize: "20px" }}
          >
            Payment Successful!
          </Typography>
        </div>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <div style={{ color: "#555555" }}>You Booked an appointment for</div>
          <div style={{ fontWeight: "bold" }}>
            Aryan Sharma, 3M (RBH13158546)
          </div>
          <div style={{ color: "#555555" }}>on Mon 26 Sep 2021,9:30 AM</div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Typography style={{ fontWeight: "bold", color: "#424242" }}>
            Dr. Priti Chopra
          </Typography>
          <Typography style={{ fontSize: "12px" }}>Pediatrician</Typography>
        </div>
        <div style={{ marginLeft: "30px", marginTop: "30px" }}>
          <Typography
            style={{
              color: "#555555",
              fontSize: "13px",
              //   textTransform: "capitalize",
              marginLeft: "15px",
              marginRight: "50px",
              wordBreak: "break-word",
              width: "calc(100% - 100px)",
              display: "flex",
              marginTop: "5px",
              textAlign: "center",
            }}
          >
            <LocationOnIcon
              style={{
                border: "#555555",
                width: "26px",
                height: "25px",
                marginTop: "5px",
                marginRight: "7px",
              }}
            />
            Madhukar Rainbow Children Hospital & Birth Right, Delhi
          </Typography>
        </div>
        <Button
          style={{
            marginTop: "20px",
            display: "flex",
            border: "1px solid #502E92",
            color: "#502E92",
            width: "120px",
            padding: "3px",
            textAlign: "center",
            marginLeft: "130px",
          }}
          onClick={goHome}
        >
          Done
        </Button>
      </Grid>
    </Grid>
  );
}
