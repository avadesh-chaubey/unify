import React, { useState, useEffect } from "react";
import {
  Paper,
  Card,
  Typography,
  makeStyles,
  Grid,
  Select,
  FormControlLabel,
  InputBase,
  Button,
  CardContent,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  TableCell,
  Popover,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { DataGrid } from "@material-ui/data-grid";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import Header from "./Header";
import Sidenavbar from "../dashboard/Sidenavbar";
import ListPagination from "./ListPagination";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  "& .MuiSvgIcon-root": {
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(4),
  },
  selectBox: {
    width: "190px",
    height: "45px",
    border: "0px",
    outline: "none",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
  },
  IconButton: {
    padding: "3px",
    paddingRight: "10px",
    overflow: "hidden",
    textAlign: "center",
  },
  searchInput: {
    border: "1px ",
    borderColor: "#B2AEAE",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(1)}px`,
    fontSize: "0.7rem",
    width: "300px",
    height: "45px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },
  "&:hover": {
    backgroundColor: "#f2f2f2",
  },
  buttonFilter: {
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    paddingRight: "15px",
    marginLeft: "20px",
    color: "#555555",
    fontSize: "12px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  button2: {
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginRight: "30px",
    color: "#fff",
    fontFamily: "Bahnschrift SemiBold",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#152A75",
    padding: "10px",
    borderRadius: "30px",
    width: "145px",
    marginRight: "-10px",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  selectWrapper: {
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #cccccc",
    paddingLeft: "8px",
    paddingRight: "15px",
    marginRight: "10px",
    fontFamily: "Avenir LT 65",
    color: "#555555",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
  },
  selectBox: {
    width: "190px",
    height: "45px",
    border: "0px",
    outline: "none",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
  },
  Card: {
    width: "160px",
    height: "60px",
    borderRadius: "5px",
    fontFamily: "Bahnschrift SemiBold",
  },
  icon: {
    width: "40px",
    height: "40px",
    opacity: "1",
  },
  typotext: {
    color: "#161616",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "15px",
  },
  typotext2: {
    paddingTop: "0",
    color: "#979797",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "11px",
    paddingBottom: "15px",
  },
  table: {
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "14px",
    borderCollapse: "separate",
    borderSpacing: "0 0px",
    "& th": {
      fontFamily: "Bahnschrift SemiBold",
      fontWeight: "600",
      fontSize: "15px",
      color: "#000000",
      paddingTop: ".2em",
      paddingBottom: ".2em",
      "& span": {
        fontFamily: "Bahnschrift SemiBold",
        fontSize: "14px",
        color: "#000000",
      },
    },
    IconButton: {
      "& span": {
        width: "12px",
        height: "12px",
        backgroundColor: "#F1F1F1",
        borderColor: "#979797",
      },
    },
    "& td": {
      fontFamily: "Bahnschrift SemiBold",
      fontWeight: "600",
      fontSize: "14px",
      color: "#555555",
      paddingTop: ".2em",
      paddingBottom: ".2em",
      "& span": {
        fontFamily: "Bahnschrift SemiBold",
        fontSize: "14px",
        color: "#555555",
      },
    },
  },
  appointments: {
    backgroundColor: "#BFFBD7",
    padding: "5px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555555",
    fontSize: "12px",
  },
  noschudle: {
    border: "1.5px solid #B2AEAE",
    borderColor: "#d9d9d9",
    fontSize: "18px",
    borderRadius: "5px",
  },
  Grid: {
    fontFamily: "Bahnschrift SemiBold",
    "& .MuiDataGrid-cell": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "13px",
      textAlign: "left",
      color: "#555555",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#000000",
      overFlow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "inherit",
      fontSize: "15px",
    },
    "& .MuiTablePagination-actions": {
      display: "none",
    },
    "& .makeStyles-caption-34[id]": {
      display: "none",
    },
    "& .makeStyles-input-35": {
      display: "none",
    },
    "& .MuiTablePagination-caption": {
      display: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      display: "none",
    },
  },
  contentPagination: {
    float: "left !important",
    color: "grey",
    position: "absolute",
    left: "8px",
    padding: "3px",
    bottom: "12px",
    fontFamily: "Bahnschrift SemiBold",

    "& li": {
      border: "1px solid #D7DAE2",
      padding: "10px 15px",
      outline: "none",
      cursor: "pointer",
    },
  },
}));

const rows = [
  {
    id: "UT0001",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "01-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0002",
    consultantName: "Dr. Rajeev Singh",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "01-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0003",
    consultantName: "Dr. Surendra Verma",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0004",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0005",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "03-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0006",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "03-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0007",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "04-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0008",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "04-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0009",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "05-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0010",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "05-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0011",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Orthopedics",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "06-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0012",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "06-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0013",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "07-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0014",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "07-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0015",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "08-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0016",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Anesthesia",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "08-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0017",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "09-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0018",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "09-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0019",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Dermatology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "10-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0020",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "10-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0021",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Radiology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "11-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0022",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Radiology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "11-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0023",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "01-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0024",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "01-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0025",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0026",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0027",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "03-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0028",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Ophthalmology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "03-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0029",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Ophthalmology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "04-11-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0030",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Ophthalmology",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "04-12-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT031",
    consultantName: "Dr. Sumitra Yadav",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0032",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Anesthesia",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0033",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Anesthesia",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0034",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0035",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0036",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Abhimanu Rathore",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0037",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0038",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0039",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "No Schedule",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
    assistantNumber: "9982345671",
  },
  {
    id: "UT0040",
    consultantName: "Dr. Sanjeev Kapoor",
    doctorNumber: "(99887777)",
    assistantName: "Rajeev Singh",
    assistantNumber: "9982345671",
    specialization: "Physician",
    completedAppointmentCount: "5 Appointments",
    scheduledAppointementCount: "3 Appointments",
    consultantLabOrder: "1000",
    consultantPharmacyOrder: "1000",
    revenueConsultation: "02-04-2021",
  },
];
const TITLE = "Unify Care - Doctor List";
export default function DoctorList(props) {
  const [doctorList, setDoctorList] = useState([...rows]);
  const [cookies] = useCookies(["name"]);
  const [totalDoctorCount, setTotalDoctorCount] = useState(0);
  const [labOrderRaisedRevenue, setLabOrderRaisedRevenue] = useState(0);
  const [pharmacyOrderRaised, setPharmacyOrderRaised] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [page, setPage] = useState(0);
  const [totalRow, setTotalRow] = useState(rows.length);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [list, setList] = useState([...rows]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const classes = useStyles();

  const addnewDoctorHandler = () => {
    router.push("/addnewdoctor");
  };

  const getDate = () => {
    const startDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].startDate
    ).toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const endDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].endDate
    ).toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    return startDate + " - " + endDate;
  };

  const dateHeandler = (item) => {
    const appDateRange = item.selection;
    setAppDateRange([appDateRange]);
    const startDate = new Date(appDateRange && appDateRange.startDate);
    const endDate = new Date(appDateRange && appDateRange.endDate);
    console.log("===========> startDate: ", startDate);
    console.log("===========> end Date: ", endDate);
    console.log("===========> dateRange: ", appDateRange);
    const temp = doctorList.filter((ele) => {
      let d = ele.revenueConsultation.split("-");
      let rowDate = new Date(d[2] + "/" + d[1] + "/" + d[0]);
      // const rowDate = new Date(dat.toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', }));
      console.log("===========> rowDate: ", rowDate);
      return (
        rowDate.getTime() >= startDate.getTime() &&
        rowDate.getTime() <= endDate.getTime()
      );
    });
    setList(temp);
  };

  const handlePageChange = (e) => {
    const newPage = e.selected;
    setPage(newPage);
    setLoader(true);
    let temp = [...doctorList];
    const start = newPage * rowsPerPage;
    setList([...temp.splice(start, rowsPerPage + 10)]);
    setLoader(false);
  };

  // calendedr
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
  // end calender

  const columns = [
    { field: "id", headerName: "Doctor ID", width: 150, sortable: false },
    { field: "consultantName", headerName: "Doctor Name", width: 180 },
    {
      field: "",
      headerName: "Assistant Name",
      width: 200,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        console.log("===========> params", params);
        const { assistantName, assistantNumber } = params.row;

        return (
          <div style={{ lineHeight: "18px" }}>
            <div className={classes.Grid}>{assistantName}</div>
            <div>({assistantNumber})</div>
          </div>
        );
      },
    },
    // { field: "assistantName", headerName: "Assistant Name", width: 190 },
    { field: "specialization", headerName: "Specialization", width: 180 },
    {
      field: "completedAppointmentCount",
      headerName: "Completed Appts.",
      width: 180,
    },
    {
      field: "scheduledAppointementCount",
      headerName: "Scheduled Appts",
      width: 195,
    },
    { field: "consultantLabOrder", headerName: "Lab Orders", width: 160 },
    {
      field: "consultantPharmacyOrder",
      headerName: "Pharmacy Orders",
      width: 200,
    },
    { field: "revenueConsultation", headerName: "Revenue", width: 140 },
  ];

  // const getData = async () => {
  //   try {
  //     let cookie = "";
  //     for (const [key, value] of Object.entries(cookies)) {
  //       if (key === "express:sess") {
  //         cookie = value;
  //       }
  //     }
  //     let headers = {
  //       authtoken: cookie,
  //     };
  //     const url = config.API_URL + "/api/patient/doctorlistdashboard";
  //     const response = await axios.get(url, { headers });
  //     const data = response.data.doctorData.map((item) => {
  //       return {
  //         id: item.consultantData[0].id,
  //         consultantName:
  //           (item.appointmentData && item.appointmentData.consultantName) || "",
  //         doctorNumber: item.consultantData[0].phoneNumber,
  //         assistantName:
  //           (item.appointmentData && item.appointmentData.assistantName) || "",
  //         specialization: item.consultantData[0].specialization,
  //         completedAppointmentCount: item.completedAppointmentCount,
  //         scheduledAppointementCount: item.scheduledAppointementCount,
  //         consultantLabOrder: item.consultantLabOrder.length,
  //         consultantPharmacyOrder: item.consultantPharmacyOrder.length,
  //         revenueConsultation: item.revenueConsultation.length,
  //       };
  //     });
  //     console.log("============>response", response.data);
  //     setDoctorList(data);
  //     setList(data);
  //     setTotalDoctorCount(response.data.totalDoctorCount);
  //     setLabOrderRaisedRevenue(response.data.labOrderRaisedRevenue);
  //     setPharmacyOrderRaised(response.data.pharmacyOrderRaised);
  //     setTotalRevenue(response.data.totalRevenue);
  //   } catch (err) {}
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  // const { } = props;
  // console.log("======>doctorList", doctorList);
  // console.log("========>columns", columns);

  const searchHeandler = (value) => {
    const filter = doctorList.filter((item) => {
      if (!value) true;
      const status =
        item.consultantName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.assistantName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.specialization
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.revenueConsultation
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      return status;
    });
    setList(filter);
    //setDoctorList(filter)
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{TITLE}</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Grid container>
        <Grid item xs={1}>
          <Sidenavbar />
        </Grid>
        <Grid
          item
          xs={11}
          style={{ height: "100vh", overflow: "hidden", overflowY: "scroll" }}
        >
          <Header title="Doctor List" rows={list} columns={columns} />
          <div>
            <div>
              <Grid
                container
                justify="space-between"
                style={{ backgroundColor: "#F6FBF8", padding: "10px 10px" }}
              >
                <Grid item>
                  <Grid container>
                    <InputBase
                      onChange={(e) => searchHeandler(e.target.value)}
                      placeholder="Search Here"
                      className={classes.searchInput}
                      startAdornment={
                        <SearchIcon
                          fontSize="small"
                          style={{ marginRight: "4px" }}
                        />
                      }
                    />
                    <Button
                      variant="Filter"
                      color="default"
                      className={classes.buttonFilter}
                      endIcon={<FilterListIcon />}
                    >
                      Filter
                    </Button>
                  </Grid>
                </Grid>
                <Grid item style={{ paddingRight: "25px" }}>
                  <Grid container>
                    <div className={classes.selectWrapper}>
                      <img src="/calender icon.svg" className={classes.icon} />
                      <p
                        onClick={handleCalendar}
                        style={{
                          fontFamily: "Bahnschrift SemiBold",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        {getDate()}
                      </p>
                      {anchorEl !== null ? (
                        <ExpandLess className="date-range-expand-icon" />
                      ) : (
                        <ExpandMore className="date-range-expand-icon" />
                      )}
                      <Popover
                        style={{ marginTop: "105px" }}
                        id={id}
                        open={openCalendar}
                        anchorEl={anchorEl}
                        onClose={onClosePopOver}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <DateRangePicker
                          onChange={(item) => dateHeandler(item)}
                          // onClick={dateHeandler}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={appDateRange}
                          direction="horizontal"
                        />
                      </Popover>
                    </div>
                    {/* <Button
                    onClick={addnewDoctorHandler}
                    variant="contained"
                    className={classes.button2}
                  >
                    <AddOutlinedIcon />
                    DOCTOR
                  </Button> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                style={{ paddingLeft: "20px", paddingTop: "10px" }}
                spacing={1}
              >
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {totalDoctorCount} */} 40
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Total Doctor
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        2.5 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Scheduled Doctors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        4.5 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        On Leave Doctors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {labOrderRaisedRevenue} */}6 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Lab Orders Raised
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }} spacing={1}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {pharmacyOrderRaised.toFixed(2)} */}15 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Pharmacy Orders Raised
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {totalRevenue.toFixed(2)} */}13 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Revenue Generated
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
            <br />
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                className={classes.Grid}
                rows={list}
                columns={columns}
                pageSize={15}
                rowHeight={45}
                headerHeight={45}
                setLoader={setLoader}
                //checkboxSelection
                disableSelectionOnClick
                getCellClassName={(params) => {
                  if (params.field === "scheduledAppointementCount") {
                    if (params.value == "3 Appointments") {
                      return classes.appointments;
                    }
                    if (params.value == "No Schedule") {
                      return classes.noschudle;
                    }
                  }
                }}
              />
              <TablePagination
                className="content-table-pagination"
                //className={classes.contentPagination}
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={totalRow}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handlePageChange}
                labelDisplayedRows={({ from, to, count }) => (
                  <strong className={classes.contentPagination}>
                    Showing {from} to {to} of {count} entries
                  </strong>
                )}
                ActionsComponent={ListPagination}
              />
            </div>

            {/* <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((item, index) => {
                                        if (index == 0) {
                                            return (<TableCell >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            color='#979797'
                                                        />
                                                    }
                                                    label={item.fieldName}
                                                /></TableCell>)
                                        } */}
            {/* return <TableCell align="left">{item.fieldName}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.table}>
                                {rows.map((item) => {
                                    return (
                                        <TableRow key={item.doctorName}>
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            color='#979797'
                                                        />
                                                    }
                                                    label={item.doctorName}
                                                />
                                            </TableCell> */}
            {/* <TableCell align="left">{item.doctorName}<br/>{item.doctorNumber}</TableCell> */}
            {/* <TableCell align="left">{item.assistantName}</TableCell>
                                            <TableCell align="left">{item.specialization}</TableCell>
                                            <TableCell align="left">{item.completedAppts}</TableCell>
                                            <TableCell align="left">
                                                <div className={item.scheduledAppts == 'No Schedule' ? classes.noschudle : classes.appontment} >
                                                    {item.scheduledAppts}
                                                </div>
                                            </TableCell>
                                            <TableCell align="left">{item.labOrders}</TableCell>
                                            <TableCell align="left">{item.pharmacyOrders}</TableCell>
                                            <TableCell align="left">{item.revenue}</TableCell>
                                        </TableRow>)
                                })} */}
            {/* </TableBody>
                        </Table>
                    </TableContainer> */}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
