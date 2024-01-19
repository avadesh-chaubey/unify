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
import TextField from "@material-ui/core/TextField";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  fullDiv: {
    width: "100%",
    position: "relative",
  },
  plusIcon: {
    position: "absolute",
    right: "8px",
    fontSize: "30px",
    border: "1px solid",
    padding: "0px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#5839d5",
  },
  addDiv: {
    border: "1px solid",
    display: "inline-block",
    padding: "5px 15px",
    borderRadius: "3px",
    marginTop: "10px",
    // background: "#e1e1e1",
    cursor: "pointer",
  },
}));
function About(props) {
  const { about, setAbout, doctorProfileId } = props;
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [openUpdateAbout, setOpenUpdateAbout] = useState(false);
  const closeUpdateAbout = () => {
    console.log("closeUpdateAbout: ");
    setOpenUpdateAbout(false);
    setValue(about);
  };
  useEffect(() => {
    setValue(about);
  }, [about]);
  const updateAboutSubmit = () => {
    console.log("updateAboutSubmit");
    setAbout(value);
    setOpenUpdateAbout(false);
  };
  const onAboutClick = () => {
    console.log("onAboutClick");
    setOpenUpdateAbout(true);
  };

  return (
    <div>
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
              About
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block", minHeight: "50px" }}>
            <div className="about">{about}</div>
            {doctorProfileId == "" && (
              <div className={classes.addDiv} onClick={onAboutClick}>
                + Add
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
      <Dialog
        open={openUpdateAbout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update About</DialogTitle>
        <DialogContent>
          <div className="fullDiv">
            <TextField
              id="outlined-multiline-flexible"
              // label="Multiline"
              placeholder="Type here ....."
              multiline
              maxRows={6}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateAbout} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateAboutSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default About;
