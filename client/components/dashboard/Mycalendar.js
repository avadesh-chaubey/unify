import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  Resources,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { appointments, resources } from "./demo-data/tasks";
import {
  DayScaleCell,
  CellBase,
  TimeTableCell,
  Appointment,
  Appointment2,
  AppointmentContent,
  AppointmentContent2,
  ExternalViewSwitcher,
} from "./demo-data/helper";

const useStyles = makeStyles((theme) => ({
  calanderButtonActive: {
    marginRight: "10px",
    borderRadius: "20px",
    height: "35px",
    padding: "12px",
    backgroundColor: "#452D7B",
    color: "#fff",
    border: "1px solid #322CD8",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      padding: "15px",
    },
    "&:hover": {
      backgroundColor: "#00000029",
      color: "#000000",
    },
  },
  calanderButton: {
    marginRight: "10px",
    borderRadius: "20px",
    height: "35px",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#152A75",
    border: "1px solid #322CD8",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      padding: "15px",
    },
  },
  divText: {
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "18px",
    backgroundColor: "#fff",
    paddingLeft: "20px",
    zIndex: 1,
  },
}));

const Mycalendar = (props) => {
  const [currentViewName, setCurrentViewName] = useState("Month");
  const [data, setData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [cookies, getCookie] = useCookies(["name"]);
  const classes = useStyles();
  const { appointmentData, setAppointmentData } = props;

  const currentViewNameChange = (value) => {
    setCurrentViewName(value);
  };
  const getTime = (slotId) => {
    let hours = Math.floor(slotId / 4);
    let min = (slotId % 4) * 15;
    return getTime2(hours, min);
  };
  const getTime2 = (hh, mm) => {
    let z = hh < 12 ? "AM" : "PM";
    let h = hh > 12 ? hh : hh;
    let hours = h < 10 ? "0" + h : h;
    let min = mm == 0 ? "00" : mm;
    return hours + ":" + min;
  };
  const transformData = (data) => {
    const update = data.map((item) => {
      console.log("==========>item", item);
      const { date, details } = item;
      const startDate = date + " 9:30:00";
      const endDate = date + " 9:45:00";
      const title = details.length + " Appt";

      return {
        startDate,
        endDate,
        title,
        details,
        date,
      };
    });

    var dataArr = update.map((item) => {
      return [item.startDate, item];
    }); // creates array of array
    var maparr = new Map(dataArr); // create key value pair from array of array

    var result = [...maparr.values()]; //converting back to array from mapobject

    setData(result);
  };

  const transformDataDay = (data) => {
    let update = [];
    data.forEach((dItem) => {
      const { date, details } = dItem;
      details.forEach((item) => {
        const startTime = getTime(item.slotId);
        const endSlotId = Number(item.slotId + 1);
        const endTime = getTime(endSlotId);
        const startDate = date + " " + startTime;
        const endDate = date + " " + endTime;
        const title = item.customerName;
        update.push({
          startDate,
          endDate,
          title,
          details,
          date,
        });
      });
    });
    console.log("==========>update", update);
    var dataArr = update.map((item) => {
      return [item.startDate, item];
    }); // creates array of array
    var maparr = new Map(dataArr); // create key value pair from array of array

    var result = [...maparr.values()]; //converting back to array from mapobject

    setDayData(result);
  };

  const getData = async () => {
    console.log("==========>getData");
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      const getYear = () => new Date().getFullYear();
      console.log("===========>new date", getYear);
      let obj = {
        startDate: "2021-07-01",
        endDate: "2021-09-30",
      };
      let headers = {
        authtoken: cookie,
      };
      console.log("=============>");
      const url =
        config.API_URL +
        "/api/patient/appointmentsofthemonth/610292b4d7772a001addb3d4";
      await axios
        .post(url, obj, { headers })
        .then((response) => {
          transformData(response.data);
          transformDataDay(response.data);
          console.log("=========>response", response.data);
        })
        .catch((error) => {
          console.log("=============>", error);
        });
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);

  const onAppointmentClick = (e) => {
    setAppointmentData(e.data);
    console.log("=====================> click", e);
  };

  const Appointment = ({ children, style, ...restProps }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        height: "40%",
        width: "95%",
        textAlign: "center",
        fontFamily: "Bahnschrift SemiBold",
        fontSize: "12px",
        borderRadius: "20px",
        marginTop: "25px",
        paddingTop: "4px",
        marginLeft: "2px",
        backgroundColor: "#CEEEFF",
        position: "center",
      }}
      onClick={(e) => onAppointmentClick(e)}
      className={classes.appointment}
    >
      {children}
    </Appointments.Appointment>
  );
  console.log("=========>dayData", dayData);
  return (
    <>
      <ExternalViewSwitcher
        currentViewName={currentViewName}
        onClick={currentViewNameChange}
        classes={classes}
      />
      <Paper>
        <Scheduler data={currentViewName == "Month" ? data : dayData}>
          <ViewState
            defaultCurrentDate="2021-09-01"
            currentViewName={currentViewName}
          />
          <MonthView
            dayScaleCellComponent={DayScaleCell}
            timeTableCellComponent={TimeTableCell}
          />
          <DayView startDayHour={0} endDayHour={24} />
          <Appointments
            appointmentComponent={
              currentViewName == "Month" ? Appointment : Appointment2
            }
            appointmentContentComponent={
              currentViewName == "Month"
                ? AppointmentContent
                : AppointmentContent2
            }
          />
          <Resources data={resources} />
          <Toolbar />
          <DateNavigator />
          {/* <EditRecurrenceMenu /> */}
          {/* <AppointmentTooltip
              showOpenButton
              showCloseButton
            /> */}
          {/* <AppointmentForm readOnly /> */}
          {/* <DragDropProvider /> */}
        </Scheduler>
      </Paper>
    </>
  );
  ///}
};

export default Mycalendar;
