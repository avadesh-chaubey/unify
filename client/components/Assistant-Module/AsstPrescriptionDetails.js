import React, { useState, useEffect } from "react";
import { Typography, Divider } from "@material-ui/core";
import { useCookies } from "react-cookie";
import fetchPrescriptionData from "../Assistant-Module/fetch/PrescriptionDataHandler";
import PrescriptionTable from "./PrescriptionTable";
import PrescriptionHistory from "./PrescriptionHistory";
import CMS from "./cms/AsstPrescriptionDetailsText";

export default function AsstPrescriptionDetails(props) {
  const [cookies, setCookie] = useCookies(["name"]);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const { PrescriptionListData, doctorDetails } = props;
  console.log("=====>data", doctorDetails);
  const {
    prescriptionDetails_vitals,
    vitals_bp,
    vitals_pulse,
    vitals_height,
    vitals_weight,
    vitals_temperature,
    vitals_bmi,
    prescription_complaints,
    prescription_diagnosis,
    prescription_advice,
  } = CMS;

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
      const response = fetchPrescriptionData();
      setPrescriptionList(response.data);
      console.log("=====>fetchPrescriptionData", response.data);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <Typography style={{ color: "#000000", fontWeight: "bold" }}>
          {doctorDetails &&
            doctorDetails.userFirstName + " " + doctorDetails.userLastName}
        </Typography>
      </div>
      <Divider />
      <div style={{ marginTop: "10px", marginBottom: "15px" }}>
        <Typography>
          {/* Last visited: {""} */}
          {PrescriptionListData && PrescriptionListData.visit} {":"}
          <span style={{ fontWeight: "bold" }}>
            {PrescriptionListData && PrescriptionListData.visitDate}
          </span>
        </Typography>
      </div>
      <div>
        <Typography>{prescriptionDetails_vitals}</Typography>
      </div>
      <div style={{ display: "-webkit-box" }}>
        <div style={{ marginRight: "150px" }}>
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {vitals_bp} {""}
          </span>
          <span>{PrescriptionListData && PrescriptionListData.bp}</span>
        </div>
        <div style={{ marginRight: "150px" }}>
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {vitals_pulse} {""}
          </span>
          <span>{PrescriptionListData && PrescriptionListData.pulse}</span>
        </div>
        <div style={{ marginRight: "150px" }}>
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {vitals_height} {""}
          </span>
          <span>{PrescriptionListData && PrescriptionListData.height}</span>
        </div>
      </div>
      <div style={{ display: "-webkit-box" }}>
        <div style={{ marginRight: "175px" }}>
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {vitals_weight} {""}
          </span>
          <span>{PrescriptionListData && PrescriptionListData.weight}</span>
        </div>
        <div style={{ marginRight: "120px" }}>
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {vitals_temperature} {""}
          </span>
          <span>
            {PrescriptionListData && PrescriptionListData.temperature}
          </span>
        </div>
        <div style={{ marginRight: "150px" }}>
          <span style={{ fontWeight: "bold" }}>
            {vitals_bmi} {""}
          </span>
          <span>{PrescriptionListData && PrescriptionListData.bmi}</span>
        </div>
      </div>
      <div>
        <div style={{ marginTop: "20px" }}>
          <span>
            {prescription_complaints}
            {""}
          </span>
          <span style={{ fontWeight: "bold" }}>
            {PrescriptionListData && PrescriptionListData.complaints}
          </span>
        </div>
        <div style={{ marginTop: "20px" }}>
          <span>
            {prescription_diagnosis} {""}
          </span>

          <span style={{ fontWeight: "bold" }}>
            {PrescriptionListData && PrescriptionListData.diagnosis}
          </span>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <PrescriptionTable PrescriptionListData={PrescriptionListData} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <span>
          {prescription_advice}
          {""}
        </span>
        <span>{PrescriptionListData && PrescriptionListData.advice}</span>
      </div>
      <div style={{ marginTop: "20px" }}>
        <PrescriptionHistory PrescriptionListData={PrescriptionListData} />
      </div>
    </>
  );
}
