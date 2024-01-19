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

function FollowUp({ handleFollow, followup, followupError,disableFlag }) {
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
            Follow Up Appointment Days
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div style={{ display: "flex", padding: "10px", width: "90%" }}>
            <p
              style={{
                // minWidth: "100px",
                textAlign: "left",
                marginRight: "25px",
              }}
            >
              Set your patient follow up Appointment days
            </p>
            <div>
              <TextField
                // multiline
                // placeholder="Please enter only Number"
                error={Boolean(followupError?.followup)}
                helperText={followupError?.followup}
                // type="number"
                type="date"
                style={{
                  margin: 8,
                  width: "100%",
                  textAlign: "center",
                  marginRight: "0px",
                }}
                // onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                margin="normal"
                value={followup}
                onChange={handleFollow}
                disabled = {disableFlag}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default FollowUp;
