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
import CloseIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";

function Advice({
  handleAdvice,
  advices,
  handleRemoveAdvice,
  handleAddAdvice,
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
            Advice Instruction
          </Typography>
        </AccordionSummary>
        {advices.map((x, index) => {
          return (
            <AccordionDetails
              style={{ display: "block", borderTop: "1px solid #e6e6e6" }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "10px",
                  width: "100%",
                }}
              >
                <div>
                  <TextField
                    style={{ margin: 8, width: "100%", marginRight: "500px" }}
                    margin="normal"
                    value={x}
                    onChange={(e) => handleAdvice(e.target.value, index)}
                    disabled = {disableFlag}
                  />
                </div>
                <div>
                  {advices.length !== 1 && (
                    <p
                      // variant="contained"
                      style={{
                        width: "125px",
                        color: disableFlag ? "#a2a2a2" : "#152a75",
                        fontWeight: 600,
                        cursor: disableFlag ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleRemoveAdvice(index)}
                    >
                      <CloseIcon />
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  float: "left",
                  marginLeft: "-10px",
                  // marginBottom: "20px",
                  cursor: disableFlag ? "not-allowed" : "pointer",
                }}
              >
                {advices.length - 1 === index && (
                  <p
                    onClick={handleAddAdvice}
                    // variant="contained"
                    style={{
                      width: "200px",
                      color: disableFlag ? "#a2a2a2" : "#152a75",
                      fontWeight: 600,
                      float: "left",
                      paddingBottom: "20px",
                    }}
                  >
                    + ADD INSTRUCTION
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

export default Advice;
