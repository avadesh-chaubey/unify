import React, { useState, useEffect } from "react";
import { Typography, Grid, Divider, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { doctorStyle } from "./DoctorDetailStyle";
import config from "../../../../app.constant";
import axios from "axios";
const useStyles = makeStyles((theme) => doctorStyle);
const timeList = [
  { showSlotTime: "12:00 PM" },
  { showSlotTime: "01:00 PM" },
  { showSlotTime: "02:00 PM" },
  { showSlotTime: "03:00 PM" },
  { showSlotTime: "04:00 PM" },
  { showSlotTime: "05:00 PM" },
];
export default function AvailableSlot(props) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState("panel2");
  const [selectedBtn, setSelectedBtn] = useState(0);
  const [slotDetails, setSlotDetails] = useState({});

  useEffect(() => {
    let query = window.location.search;
    let queryParams = new URLSearchParams(query);
    const sessionUID = queryParams.get("sessionUID");
    console.log("sessionUID: ", sessionUID);
    axios
      .get(
        `${config.API_URL}/api/patient/doctorslots?sessionUID=${sessionUID}&date=2021-12-31`
      )
      .then((res) => {
        console.log("res: ", res.data.data);
        let showData = res.data.data;
        let temp = res.data.data.slots;
        temp.map((item) => {
          let time = item.slotTime;
          let index = time.indexOf("T");
          let str = time.substr(index + 1, 5);
          item.showSlotTime = str;
        });
        showData.slots = temp;
        console.log("temp: ", temp);
        // console.log("tempArr: ",tempArr);
        console.log("showData: ", showData);
        setSlotDetails(showData.slots);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleBtnClick = (i) => {
    setSelectedBtn(i);
  };

  return (
    <Grid item xs={11}>
      <Typography className={classes.slotMainHeading}>
        Available Slots, 09 Dec 2021
      </Typography>
      <div>
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          style={{ boxShadow: "none" }}
        >
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            className={classes.AccordionSummary}
            expandIcon={
              expanded === "panel1" ? <ExpandLessIcon /> : <ChevronRightIcon />
            }
          >
            <Typography className={classes.dayTextEven}>Morning</Typography>
          </AccordionSummary>
          <Divider style={{ marginTop: "-10px", marginBottom: "10px" }} />
          <AccordionDetails>
            {/* {slotTimeList.map((item, i) => {
              return (
                <Button
                  className={
                    selectedBtn == i
                      ? classes.morningSlotBtnActive
                      : classes.morningSlotBtn
                  }
                  onClick={() => handleBtnClick(i)}
                >
                  {item.showSlotTime}
                </Button>
              );
            })} */}
          </AccordionDetails>
        </Accordion>
      </div>
      <Divider style={{ marginTop: "20px" }} />
      <div>
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          style={{ boxShadow: "none" }}
        >
          <AccordionSummary
            aria-controls="panel2d-content"
            id="panel2d-header"
            className={classes.AccordionSummary}
            expandIcon={
              expanded === "panel2" ? <ExpandLessIcon /> : <ChevronRightIcon />
            }
          >
            <Typography className={classes.dayText}>Afternoon</Typography>
          </AccordionSummary>
          <Divider style={{ marginTop: "-10px", marginBottom: "10px" }} />
          <AccordionDetails>
            {slotDetails.length > 0 &&
              slotDetails.map((item, i) => {
                return (
                  <Button
                    className={
                      selectedBtn == i
                        ? classes.morningSlotBtnActive
                        : classes.morningSlotBtn
                    }
                    onClick={() => handleBtnClick(i)}
                  >
                    {item.showSlotTime}
                  </Button>
                );
              })}
          </AccordionDetails>
        </Accordion>
      </div>
      <Divider />
      <div>
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
          style={{ boxShadow: "none" }}
        >
          <AccordionSummary
            aria-controls="panel3d-content"
            id="panel3d-header"
            className={classes.AccordionSummary}
            expandIcon={
              expanded === "panel3" ? <ExpandLessIcon /> : <ChevronRightIcon />
            }
          >
            <Typography className={classes.dayTextEven}>Evening</Typography>
          </AccordionSummary>
          <Divider style={{ marginTop: "-10px", marginBottom: "10px" }} />
          <AccordionDetails></AccordionDetails>
        </Accordion>
      </div>
    </Grid>
  );
}
