import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
function Specilizations(props) {
  // console.log("setSpecializationList props : ", props);
  const { specializationList } = props;
  const [openUpdateSpec, setOpenUpdateSpec] = useState(false);
  const closeUpdateSpec = () => {
    console.log("closeUpdateSpec: ");
    setOpenUpdateSpec(false);
  };
  const updateSpecSubmit = () => {
    console.log("updateSpecSubmit");
  };
  const onSpecializationClick = () => {
    console.log("onSpecializationClick");
    setOpenUpdateSpec(true);
  };
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
            Specializations
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          style={{ display: "block" }}
          // onClick={onSpecializationClick}
        >
          {specializationList.map((item, index) => {
            return <div key={index}>{item}</div>;
          })}
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={openUpdateSpec}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update Specialization</DialogTitle>
        <DialogContent>
          <div className="fullDiv"></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateSpec} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateSpecSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Specilizations;
