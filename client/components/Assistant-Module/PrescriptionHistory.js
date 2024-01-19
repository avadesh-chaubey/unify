import React from "react";
import { Typography } from "@material-ui/core";

export default function PrescriptionHistory(props) {
  const { PrescriptionListData } = props;
  return (
    <>
      <div>
        <Typography>History:</Typography>
      </div>
      <div style={{ marginTop: "10px" }}>
        <span>Medical History: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
          {PrescriptionListData && PrescriptionListData.medicalHistory}
        </span>
      </div>
      <div>
        <span>Surgical History: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
          {PrescriptionListData && PrescriptionListData.surgicalHistory}
        </span>
      </div>
      <div>
        <span>Diet Allergies: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "27px" }}>
          {PrescriptionListData && PrescriptionListData.dietAllergies}
        </span>
      </div>
      <div>
        <span>Drug Allergies: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
          {PrescriptionListData && PrescriptionListData.drugAllergies}
        </span>
      </div>
      <div>
        <span>Personal History: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
          {PrescriptionListData && PrescriptionListData.personalHistory}
        </span>
      </div>
      <div>
        <span>Lifestyle: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "64px" }}>
          {PrescriptionListData && PrescriptionListData.lifestyle}
        </span>
      </div>
      <div>
        <span>Habits: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "78px" }}>
          {PrescriptionListData && PrescriptionListData.habits}
        </span>
      </div>
      <div>
        <span>Family History: {""}</span>
        <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
          {PrescriptionListData && PrescriptionListData.familyHistory}
        </span>
      </div>
      <div>
        <span>Pregnancy Details: {""}</span>
        <span style={{ fontWeight: "bold" }}>
          {PrescriptionListData && PrescriptionListData.pregnancyDetails}
        </span>
      </div>
      <div style={{ marginTop: "25px" }}>
        <span style={{ fontWeight: "bold" }}>Tests Prescribed: {""}</span>
        <span>
          {PrescriptionListData && PrescriptionListData.testsPrescribed}
        </span>
      </div>
      <div style={{ marginTop: "25px" }}>
        <span>Prescribed on {""}</span>
        <span>{PrescriptionListData && PrescriptionListData.prescribedOn}</span>
      </div>
      <div>
        <Typography style={{ marginTop: "25px" }}>Test Reports:</Typography>
        <div style={{ marginTop: "10px", display: "flex" }}>
          <div style={{ width: "90px", height: "90px", marginRight: "40px" }}>
            <img src="/Assistant/PrescriptionReport1.png" />
          </div>
          <div style={{ width: "90px", height: "90px", marginRight: "40px" }}>
            <img src="/Assistant/PrescriptionReport1.png" />
          </div>
          <div style={{ width: "90px", height: "90px", marginRight: "40px" }}>
            <img src="/Assistant/PrescriptionReport1.png" />
          </div>
          <div style={{ width: "90px", height: "90px", marginRight: "40px" }}>
            <img src="/Assistant/PrescriptionReport1.png" />
          </div>
          <div style={{ width: "90px", height: "90px", marginRight: "40px" }}>
            <img src="/Assistant/PrescriptionReport1.png" />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "50px" }}>
        <span>Referals: {""}</span>
        <span style={{ fontWeight: "bold" }}>
          {PrescriptionListData && PrescriptionListData.referals}
        </span>
      </div>
    </>
  );
}
