import React, { useState, useEffect } from "react";
import { Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { doctorStyle } from "./DoctorDetailStyle";
import Slot from "./Slot";

const useStyles = makeStyles((theme) => doctorStyle);

export default function SlotDatePicker() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateList, setDateList] = useState([]);

  const getFormateDate = (value) => {
    const monthNames = [
      "JAN.",
      "FEB.",
      "MAR.",
      "APR.",
      "May",
      "June",
      "July",
      "AUG.",
      "SEP.",
      "OCT.",
      "NOV.",
      "DEC.",
    ];
    let newdate = new Date(value);
    const dd = newdate.getDate();
    const mm = newdate.getMonth();
    const month = parseInt(mm) + 1;
    const monthNum = month < 10 ? "0" + month : month;

    const y = newdate.getFullYear();
    const formattedDate = dd + "-" + monthNum + "-" + y;
    return formattedDate;
  };

  const getDateList = () => {
    const list = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
      return getDate(item);
    });
    setDateList(list);
  };
  useEffect(() => {
    getDateList();
  }, [selectedDate]);

  const getDate = () => {
    const startDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].startDate
    ).toLocaleString("en-GB", {
      day: "numeric",
      year: "numeric",
      month: "short",
    });
    const endDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].endDate
    ).toLocaleString("en-GB", {
      day: "numeric",
      year: "numeric",
      month: "short",
    });
    return startDate + " - " + endDate;
  };
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;
  // Function to close the calender popover and reset values
  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };
  const handleCalendar = () => {
    // e.preventDefault();
    console.log("==========================>");
    setAnchorEl(true);
  };
  const calendarClickhandler = (value) => {
    setSelectedDate(value);
  };

  return (
    <>
      <div className={classes.selectWrapper}>
        <NavigateBeforeIcon className="date-range-expand-icon" />
        <p
          onClick={handleCalendar}
          style={{
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          {getDate()}
        </p>

        <NavigateNextIcon className="date-range-expand-icon" />

        <Popover
          style={{ marginTop: "90px" }}
          id={id}
          open={openCalendar}
          anchorEl={anchorEl}
          onClose={onClosePopOver}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          className="dateRange"
        >
          <DateRangePicker
            onChange={(e) => calendarClickhandler(e)}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            value={selectedDate}
            months={2}
            ranges={appDateRange}
            direction="horizontal"
          />
        </Popover>
      </div>
      <div style={{ display: "flex" }}>
        <Slot />
      </div>
    </>
  );
}
