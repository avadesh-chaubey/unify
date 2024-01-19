import React, { useState, useEffect } from "react";
import {
  Paper,
  Card,
  Typography,
  makeStyles,
  TablePagination,
  FormControlLabel,
  InputBase,
  Button,
  Grid,
  CardContent,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Popover,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import { DataGrid } from "@material-ui/data-grid";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import Header from "./Header";
import Sidenavbar from "../dashboard/Sidenavbar";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import ListPagination from "./ListPagination";

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
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginLeft: "10px",
    marginRight: "5px",
    marginTop: "2px",
    padding: "15px",
    color: "#fff",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#152A75",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
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
  Completed: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.65rem",
      width: "0.65rem",
      marginRight: "0.5rem",
      backgroundColor: "#bdbdbd",
    },
  },
  panding: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.65rem",
      width: "0.65rem",
      marginRight: "0.5rem",
      backgroundColor: "#D7243B",
    },
  },
  ready: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.65rem",
      width: "0.65rem",
      marginRight: "0.5rem",
      backgroundColor: "#00C11F",
    },
  },
  completeError: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.65rem",
      width: "0.65rem",
      marginRight: "0.5rem",
      backgroundColor: "#393939",
    },
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
    id: "0001",
    customerName: "Swati Singh",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0002",
    customerName: "Master.HAYAN SAI REDDY ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-12-2021",
    apptTime: "2:00 PM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0003",
    customerName: "Baby Of.SWATHI ",
    patientAge: "36 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-10-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0004",
    customerName: "Master.ANIRUDH.A ",
    patientAge: "46 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-09-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0005",
    customerName: "Master.VADADA REYANSH SAI",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "06-11-2021",
    apptTime: "7:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0006",
    customerName: "Master.ABDUR RAHMAN SHAREEF",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "06-12-2021",
    apptTime: "5:00 PM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0007",
    customerName: "Master.DAKSH CHEVURI ",
    patientAge: "25 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "06-10-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0008",
    customerName: "Master.MD. AYAAN ",
    patientAge: "20 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "07-09-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0009",
    customerName: "Master.JAYESH RAKESH DESAI",
    patientAge: "56 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "08-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0010",
    customerName: "Master.J.RAPHAEL",
    patientAge: "30 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "09-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0011",
    customerName: "Master.MOHD. TALAL FASAHAT",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-11-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Completed",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0012",
    customerName: "Master.DHRUV YEMULA",
    patientAge: "31 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "10-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0013",
    customerName: "Master.T.CHARITH",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "10-12-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0014",
    customerName: "Master.P.NIKITH REDDY",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "10-10-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0015",
    customerName: "Baby Of.MAMTA SHARMA",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-08-2021",
    apptTime: "1:00 PM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0016",
    customerName: "Master.A. VARSHITH REDDY",
    patientAge: "32 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "03-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0017",
    customerName: "Master.Y ROOHAN KUMAR",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "03-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "0018",
    customerName: "Master.Y.LOKESH ",
    patientAge: "33 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "03-10-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "0019",
    customerName: "Master.B.Goutham ",
    patientAge: "24 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "15-11-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0020",
    customerName: "Master.MD. AHYAN ALI",
    patientAge: "24 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "15-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0021",
    customerName: "Master.ABBU SAI ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "15-01-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0022",
    customerName: "Baby Of.SWATHI ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "11-11-2021",
    apptTime: "8:00 PM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0023",
    customerName: "Master.SAMALA.SATHYA SHIVANSH",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "11-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0024",
    customerName: "Master.T. PRAGUN KUMAR REDDY",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "12-12-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0025",
    customerName: "Master.B.NITISH RAO ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "12-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0026",
    customerName: "Master.N ADITHYA ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "14-11-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0027",
    customerName: "Master.VEDH VIHAAN ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "14-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0028",
    customerName: "Master.Y.LOKESH ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "20-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0029",
    customerName: "Master.ATHARV PANDIT",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "20-12-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0030",
    customerName: "Master.SUHAAN BAIG",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "21-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0031",
    customerName: "Master.KOMAL MADDUKURI ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "21-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0032",
    customerName: "Master.DIVYAM PRASAD ",
    patientAge: "26 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "22-11-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0033",
    customerName: "Master.VEDH VIHAAN ",
    patientAge: "66 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "22-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0034",
    customerName: "Master.ARRABOJJU RAKSHIT ",
    patientAge: "46 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "23-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0035",
    customerName: "Master.DEEPANSH SANGSHETTY ",
    patientAge: "36 Years",
    patientSex: "M",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "23-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0036",
    customerName: "Master.MD ARHAM",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "24-11-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Ready For Consult",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0037",
    customerName: "Master.AYAN SHAIK ",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "24-12-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0038",
    customerName: "Master.B.GOUTHAM ",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "25-12-2021",
    apptTime: "9:00 AM",
    consultationType: "Follow UP",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
  {
    id: "RCWH.0039",
    customerName: "Master.SD SHOAIB",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "25-11-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Completed with Error",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Ortho",
    patientDeceased: "No",
    bookingMode: "Walk in",
    remarks: "",
  },
  {
    id: "RCWH.0040",
    customerName: "Master.HEMANSH",
    patientAge: "26 Years",
    patientSex: "F",
    parentPhoneNumber: "9871156743",
    consultantName: "Dr. Sanjeev Kapoor",
    payor: "Self Pay",
    apptDate: "05-07-2021",
    apptTime: "9:00 AM",
    consultationType: "New",
    appointmentStatus: "Case Sheet Panding",
    unit: "Children Hospital, Subhash Nagar, Delhi",
    department: "Pediatrics",
    patientDeceased: "Yes",
    bookingMode: "Online App",
    remarks: "",
  },
];
const TITLE = "Unify Care - Appointment List";
export default function AppointmentList(props) {
  const [appointmentsList, setAppointmentsList] = useState([...rows]);
  const [allAppointmentCount, setAllAppointmentCount] = useState(0);
  const [newAppointmentCount, setNewAppointmentCount] = useState(0);
  const [activeAppointmentCount, setActiveAppointmentCount] = useState(0);
  const [labOrderRaisedRevenue, setLabOrderRaisedRevenue] = useState(0);
  const [pharmacyOrderRaised, setPharmacyOrderRaised] = useState(0);
  const [revenueGenerated, setRevenueGenerated] = useState(0);
  const [cookies] = useCookies(["name"]);
  const router = useRouter();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [totalRow, setTotalRow] = useState(rows.length);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const addnewAppointmentHandler = () => {
    router.push("/addnewappointment");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;
  const columns = [
    { field: "id", headerName: "UHID", width: 130 },
    { field: "customerName", headerName: "Patient Name", width: 180 },
    { field: "patientAge", headerName: "Age", width: 120 },
    { field: "patientSex", headerName: "Sex", width: 110 },
    { field: "parentPhoneNumber", headerName: "Contact", width: 130 },
    { field: "consultantName", headerName: "Assigned Dr.", width: 190 },
    { field: "payor", headerName: "Payor", width: 130 },
    { field: "apptDate", headerName: "Appt. Date", width: 150 },
    { field: "apptTime", headerName: "Appt. Time", width: 150 },
    { field: "consultationType", headerName: "Appt. Type", width: 150 },
    { field: "appointmentStatus", headerName: "Status", width: 190 },
    { field: "unit", headerName: "Unit", width: 250 },
    { field: "department", headerName: "Department", width: 160 },
    { field: "patientDeceased", headerName: "Patient Deceased", width: 190 },
    { field: "bookingMode", headerName: "Booking Mode", width: 190 },
    { field: "remarks", headerName: "Remarks", width: 180 },
  ];
  const [list, setList] = useState([...rows]);

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
  //     const url = config.API_URL + "/api/patient/appointmentlistdashboard";
  //     const response = await axios.get(url, { headers });
  //     setAppointmentsList(response.data.patients);
  //     setAllAppointmentCount(response.data.allAppointmentCount);
  //     setNewAppointmentCount(response.data.newAppointmentCount);
  //     setActiveAppointmentCount(response.data.activeAppointmentCount);
  //     setLabOrderRaisedRevenue(response.data.labOrderRaisedRevenue);
  //     setPharmacyOrderRaised(response.data.pharmacyOrderRaised);
  //     setRevenueGenerated(response.data.revenueGenerated);
  //   } catch (err) {}
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };
  const handleCalendar = () => {
    setAnchorEl(true);
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
    const temp = appointmentsList.filter((ele) => {
      let d = ele.apptDate.split("-");
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

  const searchHeandler = (value) => {
    const filter = appointmentsList.filter((item) => {
      if (!value) true;
      const status =
        item.customerName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.parentPhoneNumber
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.consultantName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.consultationType
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.appointmentStatus
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      return status;
    });
    setList(filter);
  };

  const handlePageChange = (e) => {
    const newPage = e.selected;
    setPage(newPage);
    let temp = [...appointmentsList];
    const start = newPage * rowsPerPage;
    setList([...temp.splice(start, rowsPerPage + 10)]);
  };
  // console.log("=========>setList", list)
  // console.log("==========>Rows", rows)
  return (
    <>
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
          <Header title="Appointment List" rows={list} columns={columns} />
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
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={appDateRange}
                          direction="horizontal"
                        />
                      </Popover>
                    </div>
                    {/* <Button
                    onClick={addnewAppointmentHandler}
                    variant="contained"
                    className={classes.button2}
                  >
                    <AddOutlinedIcon />
                    New Appointment
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
                        {/* {allAppointmentCount} */}150
                      </Typography>
                      <Typography className={classes.typotext2}>
                        All Appointments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {newAppointmentCount} */}30.5 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        New Appointments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {activeAppointmentCount} */}100 K
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Active Appointments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {labOrderRaisedRevenue} */}110 K
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
                        {/* {pharmacyOrderRaised.toFixed(2)} */}57 K
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
                        {/* {revenueGenerated.toFixed(2)} */}135.5 L
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
                rowHeight={30}
                headerHeight={45}
                //checkboxSelection
                disableSelectionOnClick
                getCellClassName={(params) => {
                  if (params.field === "appointmentStatus") {
                    if (params.value == "Completed") {
                      return classes.Completed;
                    }
                    if (params.value == "Case Sheet Panding") {
                      return classes.panding;
                    }
                    if (params.value == "Completed with Error") {
                      return classes.completeError;
                    }
                    if (params.value == "Ready For Consult") {
                      return classes.ready;
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
                      return (<TableCell>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size='small'
                              color='#979797'
                            />
                          }
                          label={item.fieldName}
                        /></TableCell>)
                    }
                    return <TableCell align="left">{item.fieldName}</TableCell>
                  })}
                </TableRow>
              </TableHead> */}
            {/* <TableBody >
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                  return (
                    <TableRow key={item.id}  >
                      <TableCell >
                        <FormControlLabel
                          control={
                            <Checkbox
                              size='small'
                              color='#979797'
                            />
                          } */}
            {/* label={item.id}
                        /> */}
            {/* </TableCell> */}
            {/* <TableCell align="left">{item.id}</TableCell> */}
            {/* <TableCell align="left">{item.patientName}</TableCell>
                      <TableCell align="left">{item.assignedDoctor}</TableCell>
                      <TableCell align="left">{item.contact}</TableCell>
                      <TableCell align="left">{item.apptDate}</TableCell>
                      <TableCell align="left">{item.apptTime}</TableCell>
                      <TableCell align="left">{item.apptType}</TableCell>
                      <TableCell align="left"> */}
            {/* {getStatus(item.status)}
                      </TableCell>
                    </TableRow>)
                })} */}
            {/* </TableBody>
            </Table>
          </TableContainer> */}
            {/* <TablePagination 
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
