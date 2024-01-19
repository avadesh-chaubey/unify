import React, { useState, useEffect } from "react";
import config from "../../../app.constant";
import StarIcon from "@material-ui/icons/Star";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";

function Podcast(props) {
  const {
    workshopLink,
    setWorkshopLink,
    buttonCaption,
    setButtonCaption,
    setMsgData,
  } = props;

  return (
    <div className="accordianDiv">
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <img
              src="../arrowUp.svg"
              style={{ width: "20px", height: "10px" }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#343434", fontWeight: 600 }}>
            Podcast / Workshop
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div>
            <TextField
              value={workshopLink}
              id="outlined-basic"
              placeholder="Podcast / Workshop Link"
              variant="outlined"
              style={{ margin: "10px 0", width: "40%" }}
              onChange={(e) => setWorkshopLink(e.target.value)}
            />
          </div>
          <div>
            <TextField
              value={buttonCaption}
              id="outlined-basic"
              placeholder="Button Caption"
              variant="outlined"
              style={{ margin: "10px 0", width: "40%" }}
              onChange={(e) => setButtonCaption(e.target.value)}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Podcast;
