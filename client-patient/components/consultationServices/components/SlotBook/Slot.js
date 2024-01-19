import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { doctorStyle } from "./DoctorDetailStyle";
const useStyles = makeStyles((theme) => doctorStyle);

export default function Slot() {
  const classes = useStyles();
  const [selectedSlotBtn, setSelectedSlotBtn] = useState(0);
  const slotDate = [
    {
      date: "Dec 10",
      text: "11 slot",
    },
    {
      date: "Dec 11",
      text: "11 slot",
    },
    {
      date: "Dec 12",
      text: "10 slot",
    },
    {
      date: "Dec 13",
      text: "12 slot",
    },
    {
      date: "Dec 14",
      text: "15 slot",
    },
    {
      date: "Dec 15",
      text: "10 slot",
    },
    {
      date: "Dec 16",
      text: "12 slot",
    },
    {
      date: "Dec 17",
      text: "15 slot",
    },
    {
      date: "Dec 18",
      text: "10 slot",
    },
    {
      date: "Dec 19",
      text: "12 slot",
    },
  ];
  const handleSlotBtn = (i) => {
    setSelectedSlotBtn(i);
  };
  return (
    <>
      {slotDate.map((item, i) => {
        return (
          <div
            className={
              selectedSlotBtn == i ? classes.slotBtnActive : classes.slotBtn
            }
            onClick={() => handleSlotBtn(i)}
          >
            {item.date}
            <Typography style={{ fontSize: "12px", paddingTop: "5px" }}>
              {item.text}
            </Typography>
          </div>
        );
      })}
    </>
  );
}
