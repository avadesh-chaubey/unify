import React from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CMS from "../../cms";
const useStyles = makeStyles((theme) => ({
  billMainHeading: {
    fontWeight: "bold",
    fontFamily: "Avenir_heavy !important",
    fontSize: "20px",
    color: "#545454",
  },
}));

function BillDetails(props) {
  const classes = useStyles();
  const {setView, currentLink,setPage} = props;

  const goPaymentConfirm = () => {
    console.log("goPaymentConfirm",currentLink);
    // if(currentLink === "bookAppointment"){
    //   setView("6")
    // }
    // if(currentLink === "doctorresult"){
    //   setView("4")
    // }
    setPage(5)
    // router.push("/payment-conformation");
  };
  const {
    bill_details_title,
    bill_details_consultfee_tex,
    bil_details_consultr_Rs,
    bill_details_GST,
    bill_details_GST_Rs,
    bill_details_total,
    bill_details_total_Rs,
    bill_details_button_text,
  } = CMS;

  return (
    <>
      <Grid
        item
        xs={4}
        style={{
          marginTop: "20px",
          backgroundColor: "#F9F9F9",
          padding: "20px 35px",
          marginLeft: "20px",
        }}
      >
        <Typography className={classes.billMainHeading}>
          {bill_details_title}
        </Typography>
        <div style={{ display: "flex", marginTop: "30px" }}>
          <Typography style={{ marginRight: "70px", color: "#545454" }}>
            {bill_details_consultfee_tex}
          </Typography>
          <Typography style={{ marginLeft: "70px", color: "#545454" }}>
            {bil_details_consultr_Rs}
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <Typography style={{ marginRight: "115px", color: "#545454" }}>
            {bill_details_GST}
          </Typography>
          <Typography style={{ marginLeft: "120px", color: "#545454" }}>
            {bill_details_GST_Rs}
          </Typography>
        </div>
        <hr />
        <div style={{ display: "flex", marginTop: "15px" }}>
          <Typography
            style={{
              marginRight: "50px",
              color: "#545454",
              fontFamily: "Avenir_heavy !important",
              fontWeight: "bold",
            }}
          >
            {bill_details_total}
          </Typography>
          <Typography
            style={{
              marginLeft: "120px",
              color: "#545454",
              fontFamily: "Avenir_heavy !important",
              fontWeight: "bold",
            }}
          >
            {bill_details_total_Rs}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          <Button
            style={{
              border: "1px solid #502E92",
              alignItems: "center",
              padding: "10px",
              width: "290px",
              color: "#502E92",
              textTransform: "capitalize",
            }}
            onClick={goPaymentConfirm}
          >
            {bill_details_button_text}
          </Button>
        </div>
      </Grid>
    </>
  );
}

export default BillDetails;
