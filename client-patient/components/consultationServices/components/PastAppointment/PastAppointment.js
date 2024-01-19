import React, { useState, useEffect } from "react";
import HeadBreadcrumbs from "../../../common/headBreadcrumbs";
import PastApptList from "./PastApptList";
import { useCookies } from "react-cookie";
import config from "../../../../app.constant";
import axios from "axios";

export default function PastAppointment(props) {
  const [cookies, setCookie] = useCookies(["name"]);
  const [pastAppointment, setPastAppointment] = useState([]);

  const getData = async () => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: cookie,
      };
      const url =
        config.API_URL +
        "/api/patient/v1/opd/pastappointments?patientUID=2077930&date=2021-12-01";
      const response = await axios.get(url, { headers });
      setPastAppointment(response.data.data);
      console.log("======response", response.data.data);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <HeadBreadcrumbs
        titleArr={["Consults"]}
        lastTitle={"Past Appointments"}
        mainTitle={"Past Appointments"}
      />
      <div>
        <PastApptList pastAppointment={pastAppointment} />
      </div>
      <br />
      <br />
    </>
  );
}
