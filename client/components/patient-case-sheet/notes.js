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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

function PregnancyDetails({ notes, handleNotes, disableFlag}) {
  const [gDiabetes, setGDiabetes] = useState("no");
  const [gDiabetesType, setGDiabetesType] = useState("");
  const [pregnancydetails, setPregnancyDetails] = useState("");
  const [noofpregnancies, setNoofpregnancies] = useState("");
  const [noofchildren, setNoofchildren] = useState("");
  const [natureofdelivery, setNatureofdelivery] = useState("Normal");

  const handleGDiabetesChange = (event) => {
    setGDiabetes(event.target.value);
  };

  const handleGDiabetesTypeChange = (event) => {
    setGDiabetesType(event.target.value);
  };

  const handleNatureofDeliveryChange = (event) => {
    setNatureofdelivery(event.target.value);
  };
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
            Notes
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "59px",
              }}
            >
              Junior Doctor Notes
            </p>
            <div>
              <TextField
                disabled = {disableFlag}
                // label="Medical Conditions"
                style={{ margin: 8, width: "100%", marginRight: "390px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={notes.juniorDoctorNotes}
                onChange={(e) =>
                  handleNotes("juniorDoctorNotes", e.target.value)
                }
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "45px",
              }}
            >
              Diagnostic Test Result
            </p>
            <div>
              <TextField
                disabled = {disableFlag}
                // label="Medical Conditions"
                style={{ margin: 8, width: "100%", marginRight: "390px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={notes.diagnosticTestResult}
                onChange={(e) =>
                  handleNotes("diagnosticTestResult", e.target.value)
                }
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
              Clinical Observations/Notes
            </p>
            <div>
              <TextField
                disabled = {disableFlag}
                // label="Medical Conditions"
                style={{ margin: 8, width: "100%", marginRight: "390px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={notes.clinicalObservations}
                onChange={(e) =>
                  handleNotes("clinicalObservations", e.target.value)
                }
              />
            </div>
          </div>
          <div style={{ display: "flex", padding: "10px", width: "96%" }}>
            <p
              style={{
                minWidth: "100px",
                textAlign: "left",
                marginRight: "87px",
              }}
            >
              Personal Notes
            </p>
            <div>
              <TextField
                disabled = {disableFlag}
                // label="Medical Conditions"
                style={{ margin: 8, width: "100%", marginRight: "390px" }}
                margin="normal"
                // variant="filled"
                // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                value={notes.personalNotes}
                onChange={(e) => handleNotes("personalNotes", e.target.value)}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default PregnancyDetails;
