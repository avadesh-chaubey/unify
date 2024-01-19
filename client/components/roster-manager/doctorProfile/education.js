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
import VideoThumbnail from "react-video-thumbnail";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import Checkbox from "@material-ui/core/Checkbox";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import educationnames from "../../../data/educationName.json";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 650,
    float: "left",
    width: "97%",
    margin: "0 14px",
    textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  label: {
    margin: 6,
  },
}));
function Education(props) {
  // console.log("Education props : ", props);
  const { qualificationList, setQualificationList, doctorProfileId } = props;
  const classes = useStyles();

  const [openUpdateEdu, setOpenUpdateEdu] = useState(false);
  const closeUpdateEdu = () => {
    // console.log("closeUpdateEdu: ");
    setOpenUpdateEdu(false);
  };
  const updateEduSubmit = () => {
    // console.log("updateEduSubmit");
  };
  const onEducationClick = () => {
    // console.log("onEducationClick");
    setOpenUpdateEdu(true);
  };

  return (
    <div>
      <div className="accordianDiv">
        <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
          <AccordionSummary
            expandIcon={
              // <ExpandMoreIcon style={{ color: "#343434", fontWeight: 600 }} />
              <img
                src="../arrowUp.svg"
                style={{ width: "20px", height: "10px" }}
              />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ color: "#343434", fontWeight: 600 }}>
              Education
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "block",
              cursor: doctorProfileId == "" ? "pointer" : "default",
            }}
            onClick={doctorProfileId == "" ? onEducationClick : ""}
          >
            {qualificationList.map((item, index) => {
              return <div key={index}>{item}</div>;
            })}
          </AccordionDetails>
        </Accordion>
      </div>
      <Dialog
        open={openUpdateEdu}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update Education</DialogTitle>
        <DialogContent>
          <div className="fullDiv">
            <div className="full" style={{ width: "97%" }}>
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel
                  id="education"
                  style={{ marginTop: "1px", marginLeft: 0 }}
                >
                  Educations&nbsp;
                </InputLabel>
                <Select
                  // required
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  // required={

                  // }
                  multiple
                  value={qualificationList}
                  onChange={(e) => setQualificationList(e.target.value)}
                  // MenuProps={MenuProps}
                  className="languages_field"
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                >
                  {educationnames.map((name, index) => (
                    <MenuItem key={index} value={name}>
                      {/* {name} */}
                      <Checkbox
                        checked={qualificationList.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateEdu} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateEduSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Education;
