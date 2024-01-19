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
    // right: "8px",
    marginTop: "20px",
    left: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: "20px",
    border: "1px solid",
    padding: "6px",
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

function Experience(props) {
  const { experienceList, setExperienceList } = props;
  const classes = useStyles();

  const [openUpdateExp, setOpenUpdateExp] = useState(false);
  const [expList, setExpList] = useState(experienceList);
  useEffect(() => {
    setExpList(experienceList);
  }, [experienceList]);
  const closeUpdateExp = () => {
    console.log("closeUpdateExp: ");
    setOpenUpdateExp(false);
    setExpList(experienceList);
  };
  const updateExpSubmit = () => {
    console.log("updateExpSubmit", expList);
    let tempArr = expList.filter((item) => {
      return item != "";
    });
    console.log("tempArr filtered: ", tempArr);
    setExperienceList(tempArr);
    closeUpdateExp();
  };
  const onExperienceClick = () => {
    console.log("onExperienceClick");
    setOpenUpdateExp(true);
  };
  const onExpChange = (val, i) => {
    let tempArr = [...expList];
    tempArr[i] = val;
    setExpList(tempArr);
  };
  const handelExp = () => {
    let tempArr = [...expList];
    tempArr.push("");
    setExpList(tempArr);
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
              Experience
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
            {experienceList.map((item, index) => {
              return <div key={index}>{item}</div>;
            })}
            <div className={classes.addDiv} onClick={onExperienceClick}>
              + Add
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <Dialog
        open={openUpdateExp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update Experience</DialogTitle>
        <DialogContent style={{ padding: "40px" }}>
          <div className={classes.fullDiv}>
            {/* {console.log("expList: ", expList)} */}
            {expList.map((item, i) => {
              return (
                <div style={{ padding: "10px" }} key={i}>
                  <TextField
                    id="outlined-basic"
                    // label="Outlined"
                    variant="outlined"
                    value={item}
                    style={{ width: "100%" }}
                    onChange={(e) => onExpChange(e.target.value, i)}
                  />
                </div>
              );
            })}
            <div className={classes.plusIcon} onClick={handelExp}>
              + Add Experience
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateExp} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateExpSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Experience;
