import React from "react";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import { useRouter } from "next/router";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useState, useEffect } from "react";
import config from "../../app.constant";

const speciality = [
  "--Select--",
  "Allergy and Clinical Immunology",
  "Bariatrics",
  "Cardiology",
  "Cardiothoric & Vascular Surgery",
  "Clinical Psychology",
  "Critical Care",
  "Dentist",
  "Dermatology",
  "Diabetology",
  "Dietetics",
  "Endocrine Surgery",
  "Endocrinology",
  "Endodontics",
  "ENT",
  "Family Physician",
  "Gastroenterology Medicine",
  "General Physician",
  "General Surgeon",
  "Gynecologic Oncology",
  "Haemato Oncology",
  "Head & Neck Surgical Oncology",
  "Hepatology",
  "Infectious Disease",
  "Infertility",
  "Internal Medicine",
  "Interventional Radiology",
  "Laparoscopic Surgeon",
  "Liver Transplant",
  "Maxillofacial Surgery",
  "Medical Oncology",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics & Gynaecology",
  "Oncology",
  "Oral & Maxillofacial Surgery",
  "Orthopaedics",
  "Paediatrics",
  "Periodontics",
  "Physiotherapy",
  "Plastic Surgery",
  "Podiatry",
  "Prosthodontics",
  "Psychiatry",
  "Psychology",
  "Pulmonology/ Respiratory Medicine",
  "Radiation Oncology",
  "Radiology",
  "Rheumatology",
  "Spin Surgery",
  "Surgical Gastroenterology",
  "Surgical Oncology",
  "Thoracic Surgery",
  "Transplant Surgery",
  "Urogynaecology",
  "Urology",
  "Vascular & Endovascular Surgery",
  "Vascular Surgery",
];
function Referral({ handleRefferal, refferral,disableFlag }) {
  const [lang, setLang] = useState([]);
  const getLanguages = () => {
    let url = config.API_URL + `/api/utility/specialityType?speciality=`;
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          // console.log("res", response.data);
          const langnames = [];
          response.data.forEach((element) => {
            langnames.push(element.name);
          });
          setLang(langnames);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <>
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            Referrals
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div style={{ display: "flex", padding: "10px", width: "100%" }}>
            <p
              style={{
                // minWidth: "100px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Which speciality patient should consult?
            </p>
            <div>
              <TextField
                select
                disabled = {disableFlag}
                // label="Select a Specialty"
                // multiline
                placeholder="Select a Specialty"
                style={{ margin: 8, width: "100%" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={refferral.consultSpecialty}
                // defaultValue={"---Select a Speciality---"}

                onChange={(e) =>
                  handleRefferal("consultSpecialty", e.target.value)
                }
              >
                {speciality.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "90%" }}>
            <p
              style={{
                // minWidth: "100px",
                textAlign: "left",
                marginRight: "215px",
              }}
            >
              Reason
            </p>
            <div>
              <TextField
                disabled = {disableFlag}
                // multiline
                // placeholder="Low/Medium/High"
                style={{ margin: 8, width: "100%", marginRight: "270px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={refferral.reason}
                onChange={(e) => handleRefferal("reason", e.target.value)}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default Referral;
