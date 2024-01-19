import React from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import router from "next/router";
import CMS from "../../cms";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    backgroundColor: "#E4FBFA",
    padding: "20px 35px",
    marginLeft: "20px",
    border: "1px solid #00B2A9",
  },
  text1: {
    textAlign: "center",
    fontSize: "14px",
    padding: "10px 50px",
    color: "#545454",
  },
  contactInfo: {
    fontFamily: "Avenir_heavy !important",
    textAlign: "center",
    fontSize: "14px",
    padding: "4px 0px",
    color: "#545454",
  },
}));
function CancelInfo() {
  const classes = useStyles();
  const onReschedule = () => {
    router.push("/payment-conformation");
  };
  const {
    bill_cancel_about,
    bill_cancel_contact_info,
    bill_cancel_contact_mail,
    bill_cancel_button,
  } = CMS;
  return (
    <>
      <Grid item xs={4} className={classes.root}>
        <div className={classes.text1}>{bill_cancel_about}</div>
        <div className={classes.contactInfo}>{bill_cancel_contact_info}</div>
        <div className={classes.contactInfo}>{bill_cancel_contact_mail}</div>
        <div
          style={{
            // display: "flex",
            // justifyContent: "center",
            textAlign: "center",
            marginTop: "130px",
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
            onClick={onReschedule}
          >
            {bill_cancel_button}
          </Button>
        </div>
      </Grid>
    </>
  );
}

export default CancelInfo;
