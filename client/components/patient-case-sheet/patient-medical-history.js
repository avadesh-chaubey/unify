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
import { useState } from "react";

function PatientMedicalHistory({ handleMedical, history, disableFlag}) {
  const [medicalcondition, setMedicalcondition] = useState("");
  const [duration, setDuration] = useState("");
  const [drugname, setDrugname] = useState("");
  const [frequency, setFrequency] = useState("");
  const [dosage, setDosage] = useState("");
  const [surgery, setSurgery] = useState("");
  const [durgallergy, setDurgallergy] = useState("");
  const [dietallergy, setDietallergy] = useState("");
  const [dietrestrict, setDietrestrict] = useState("");
  const [smoking, setSmoking] = useState("no smoke");
  const [alcohol, setAlochol] = useState("NonDrinker");
  const [active, setActive] = useState("Low");
  const [diet, setDiet] = useState("Vegetarian");
  const [other, setOther] = useState("");
  const [date, setDate] = useState(new Date());

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
            Patient Medical & Family History{" "}
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "145px",
              }}
            >
              Medical History
            </p>
            <div>
              <TextField
                // label="Medical Conditions"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.medicalHistory}
                onChange={(e) =>
                  handleMedical("medicalHistory", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>

          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "125px",
              }}
            >
              Medication History
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.medicationHistory}
                onChange={(e) =>
                  handleMedical("medicationHistory", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>

          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "145px",
              }}
            >
              Surgical History
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.surgicalHistory}
                onChange={(e) =>
                  handleMedical("surgicalHistory", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "145px",
              }}
            >
              Drug Allergies
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.drugAllergies}
                onChange={(e) => handleMedical("drugAllergies", e.target.value)}
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "90px",
              }}
            >
              Diet Allergies/Restriction
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.dietAllergiesOrRestrictions}
                onChange={(e) =>
                  handleMedical("dietAllergiesOrRestrictions", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "35px",
              }}
            >
              Personal History, Lifestyle, Habits
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.personalLifestyle}
                onChange={(e) =>
                  handleMedical("personalLifestyle", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "10px",
              }}
            >
              Environmental & Occupational History
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.environmentalAndOccupationalHistory}
                onChange={(e) =>
                  handleMedical(
                    "environmentalAndOccupationalHistory",
                    e.target.value
                  )
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "107px",
              }}
            >
              Family Medical History
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.familyMedicalHistory}
                onChange={(e) =>
                  handleMedical("familyMedicalHistory", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "134px",
              }}
            >
              Pregnancy Details
            </p>
            <div>
              <TextField
                // label="Name of The Drug"
                style={{ margin: 8, width: "100%", marginRight: "330px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={history.pagnencyDetails}
                onChange={(e) =>
                  handleMedical("pagnencyDetails", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default PatientMedicalHistory;
