import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppointmentDetails from "./AppointmentDetails";
import BillDetails from "./BillDetails";
// const useStyles = makeStyles((theme) => styleobj);

export default function ConsultationCard(props) {
  const {setView,currentLink, setPage} = props;
  // const classes = useStyles();

  return (
    <>
      <Grid container justifyContent="center">
        <AppointmentDetails />

        <BillDetails setView = {setView} currentLink ={currentLink} setPage = {setPage}/>
      </Grid>
    </>
  );
}
