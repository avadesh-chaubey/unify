import React from 'react'
import HeadBreadcrumbs from "../components/common/headBreadcrumbs";
import Header from "../components/consultationServices/Header";
import AppointmentDetails from "../components/consultationServices/components/ConfirmBooking/AppointmentDetails";
import CancelInfo from "../components/consultationServices/components/ConfirmBooking/CancelInfo";
import {
    Grid,
  } from "@material-ui/core";

function cancelApmt() {
    return (
        <div>
            <Header />
            <HeadBreadcrumbs title1={"Consults"} title2 = {"Upcoming Appointment"} title3 = {"Cancel Appointment"} mainTitle = {"Cancel Appointment"} />
            <Grid container justifyContent="center">
                <AppointmentDetails />

                <CancelInfo />
            </Grid>
        </div>
    )
}

export default cancelApmt
