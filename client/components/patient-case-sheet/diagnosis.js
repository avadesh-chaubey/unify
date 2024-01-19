import React from "react";
import { useState } from "react";
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
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function Diagnosis({
  diagnosis,
  handleDiagnosis,
  handleRemoveDiagnosis,
  handleAddDiagnosis,
  disableFlag
}) {
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
            Diagnosis
          </Typography>
        </AccordionSummary>
        {diagnosis.map((val, index) => {
          return (
            <AccordionDetails style={{ display: "block" }}>
              <div className={"full-div"}>
                <TextField
                  placeholder="Diagnosed Medical Condition (Should be strictly as per ICD- 10
                  Nomenclature)"
                  style={{
                    margin: 8,
                    width: "80%",
                    textAlign: "left",
                    float: "left",
                  }}
                  value={val}
                  margin="normal"
                  // variant="filled"
                  onChange={(e) => handleDiagnosis(e.target.value, index)}
                  disabled = {disableFlag}
                />
                <div>
                  {diagnosis.length !== 1 && (
                    <p
                      // variant="contained"
                      style={{
                        width: "80px",
                        color: disableFlag ? "#a2a2a2" : "#152a75",
                        fontWeight: 600,
                        cursor: disableFlag ? "not-allowed" : "pointer",
                        float: "right",
                        marginRight: "37px",
                      }}
                      onClick={() => handleRemoveDiagnosis(index)}
                    >
                      <CloseIcon />
                    </p>
                  )}
                </div>
              </div>
              <div
                style={{
                  float: "left",
                  marginLeft: "-20px",
                  // marginBottom: "20px",
                }}
              >
                {diagnosis.length - 1 === index && (
                  <p
                    onClick={handleAddDiagnosis}
                    style={{
                      width: "200px",
                      color: disableFlag ? "#a2a2a2" : "#152a75",
                      fontWeight: 600,
                      float: "left",
                      paddingBottom: "20px",
                      cursor:  disableFlag ? "not-allowed" : "pointer",
                    }}
                  >
                    + ADD DIAGNOSIS
                  </p>
                )}
              </div>
            </AccordionDetails>
          );
        })}
      </Accordion>
    </>
  );
}

export default Diagnosis;
