import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  makeStyles,
  Grid,
  InputBase,
  Button,
  CardContent,
  Checkbox,
  TablePagination,
  Popover,
} from "@material-ui/core";
import { DataGrid, gridColumnsSelector } from "@material-ui/data-grid";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import Header from "./Header";
import Sidenavbar from "../dashboard/Sidenavbar";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { UpdateModeEnum } from "chart.js";
import { FormatBold } from "@material-ui/icons";
import AddnewPatient from "./AddnewPatient";
import ListPagination from "./ListPagination";
import { useRouter } from "next/router";
import Head from "next/head";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  margin: {
    margin: theme.spacing(4),
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
  button: {
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginLeft: "20px",
    paddingRight: "15px",
    color: "#555555",
    fontSize: "14px",
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
    marginRight: "10px",
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
    id: "BAH-00463068",
    patientName: "Mrs.KARRA DIVYA SREE",
    patientNumber: "7382673788",
    age: "28 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "3",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-11-2021",
    memberSince: "2003",
    remarks: "Good",
  },
  {
    id: "BAH-00456395",
    patientName: "Mrs.PRAVALLIKA VEMULAVADA",
    patientNumber: "9959073299",
    age: "32 Years",
    sex: "F",
    noOfAppts: "2",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "2001",
    familyMembers: "5 Members",
    upcomingApptDate: "06-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00345168",
    patientName: "Mrs.AKANKSHA CHATURVEDI",
    patientNumber: "8331803684",
    age: "33 Years",
    sex: "F",
    noOfAppts: "1",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "06-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00466920",
    patientName: "Mrs.G.HARI PRIYA",
    patientNumber: "6302008017",
    age: "23 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00390334",
    patientName: "Mrs.M RUPINI YADAV",
    patientNumber: "9848491758",
    age: "34 Years",
    sex: "F",
    noOfAppts: "8",
    activeAppointmets: "4",
    labOrders: "5000",
    medicineOrders: "3001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00461915",
    patientName: "Mrs.LEKHANA NANDYALA",
    patientNumber: "9912379378",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "7",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "07-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00453995",
    patientName: "Mrs.AYESHA TABRI",
    patientNumber: "9392967792",
    age: "23 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "3",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "09-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00447594",
    patientName: "Mrs.RANJANA SINGH",
    patientNumber: "9818759194",
    age: "30 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "4",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00390534",
    patientName: "Mrs.KOLA SIVA ",
    patientNumber: "9644989999",
    age: "29 Years",
    sex: "F",
    noOfAppts: "3",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00440316",
    patientName: "Mrs.ANJUM HIRA",
    patientNumber: "7032903976",
    age: "28 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "3",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00447783",
    patientName: "Dr.MOUNIKA VANGA",
    patientNumber: "8179858896",
    age: "28 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "5",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "10-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00477776",
    patientName: "Mrs.SOMA MOITRA",
    patientNumber: "8969988470",
    age: "41 Years",
    sex: "F",
    noOfAppts: "9",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-10-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00461018",
    patientName: "Ms.KHANSA AIMAN",
    patientNumber: "9550128974",
    age: "25 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "20-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00477776",
    patientName: "Mrs.SOMA MOITRA",
    patientNumber: "8969988470",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "21-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00468456",
    patientName: "Mrs.SIRI KALLUR ",
    patientNumber: "9963396555",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "22-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00389323",
    patientName: "Mrs.K SIRISHA ",
    patientNumber: "9000557895",
    age: "33 Years",
    sex: "F",
    noOfAppts: "1",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-09-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00475421",
    patientName: "Mrs.T PRATHYUSHA ",
    patientNumber: "9492009911",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "30-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00334215",
    patientName: "Ms.MALAVIKA ADIGA ",
    patientNumber: "9177970919",
    age: "25 Years",
    sex: "F",
    noOfAppts: "2",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "30-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00418411",
    patientName: "Mrs.TALLAPALLY BHAGYA",
    patientNumber: "9912300345",
    age: "34 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-10-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00404061",
    patientName: "Mrs.BATTULA MANASA",
    patientNumber: "9848428892",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-10-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00479540",
    patientName: "Mrs.KOVA ASHWINI",
    patientNumber: "9703953936",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "30-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.0000076343",
    patientName: "Mrs.FATIMA FAROOQ ",
    patientNumber: "9951874810",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "11-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00368789",
    patientName: "Mrs.D. SWATHI LAKSHMI",
    patientNumber: "9000141595",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "3",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "11-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00480767",
    patientName: "Mrs.SHAIMA FATIMA",
    patientNumber: "8801057811",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "10-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00354171",
    patientName: "Mrs.NASREEN SULTANA",
    patientNumber: "9820516511",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "10-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00479540",
    patientName: "Mrs. KOVA ASHWINI",
    patientNumber: "9703953936",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "09-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "MAH-00331903",
    patientName: "Mrs.S. NAVALATHA ",
    patientNumber: "9010810803",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "09-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00475421",
    patientName: "Mrs.T PRATHYUSHA ",
    patientNumber: "9492009911",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "2000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "21-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00477856",
    patientName: "Mrs.NAZAHATH FARHANA",
    patientNumber: "7799469239",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "4",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "21-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00361407",
    patientName: "Mrs.P SUGANYA",
    patientNumber: "9666144646",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "26-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00416574",
    patientName: "Mrs.PREEDHI RAJU ",
    patientNumber: "9914932405",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "26-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00453090",
    patientName: "Mrs.KALYANI THOTA ",
    patientNumber: "9640424241",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "27-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00483454",
    patientName: "Mrs.SRI VALLI ",
    patientNumber: "9490672233",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "3000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "27-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00416574",
    patientName: "Mrs.PREEDHI RAJU ",
    patientNumber: "9914932405",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "28-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.0000131983",
    patientName: "Mrs.K. KRISHNAVENI ",
    patientNumber: "9701778244",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "28-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00447832",
    patientName: "Ms.KAJAL SINGH",
    patientNumber: "7386831228",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "29-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00452573",
    patientName: "Baby Of.SRUTHI M",
    patientNumber: "6362306190",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "29-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00307879",
    patientName: "Baby.A.TEJASRI ",
    patientNumber: "7993339467",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "31-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00465003",
    patientName: "Mrs.GANGAMMA",
    patientNumber: "8790152729",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "4000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "31-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "MAH-00312668",
    patientName: "Mrs.A SWAPNA ",
    patientNumber: "9063741075",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "2",
    labOrders: "3000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-06-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00467141",
    patientName: "Mrs.SUPRAJA",
    patientNumber: "7489802653",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "1",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-06-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00453995",
    patientName: "Mrs.AYESHA TABRI",
    patientNumber: "8790152729",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "05-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00441568",
    patientName: "Mrs.ANITA LODHA",
    patientNumber: "9752033388",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "2001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.0000220786",
    patientName: "Mrs.INDRAJA GADDE",
    patientNumber: "9866554451",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "7 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00307879",
    patientName: "Baby.A.TEJASRI ",
    patientNumber: "8790152729",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.0000187605",
    patientName: "Mrs.MANJU KUMARI ",
    patientNumber: "8008099409",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00469863",
    patientName: "Baby Of.DR SANDHYA RAO",
    patientNumber: "9989607711",
    age: "20 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00349488",
    patientName: "Mrs.DIVYA VANI ",
    patientNumber: "9177965550",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00481466",
    patientName: "Mrs.SANDHYA A",
    patientNumber: "9533773769",
    age: "32 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "4000",
    medicineOrders: "4001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00477733",
    patientName: "Mrs.J.PAVANI ",
    patientNumber: "8688568342",
    age: "33 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "1001",
    familyMembers: "8 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00468852",
    patientName: "Mrs.AYAN KHALID DAUD ",
    patientNumber: "7386165763",
    age: "24 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00344320",
    patientName: "Mrs.SANKU MANJULA",
    patientNumber: "9666158031",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00468544",
    patientName: "Mrs.A VARALAKSHMI",
    patientNumber: "7989612245",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00458069",
    patientName: "Mrs.OBA.SUSHMA",
    patientNumber: "9987595328",
    age: "32 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "3000",
    medicineOrders: "3001",
    familyMembers: "3 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00466542",
    patientName: "Mrs.SRIVANI RAVURI",
    patientNumber: "9676776953",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00387731",
    patientName: "Mrs.B PRIYADARSHINI ",
    patientNumber: "8121979191",
    age: "41 Years",
    sex: "F",
    noOfAppts: "9",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "4 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00469379",
    patientName: "Mrs.M GEETHANJALI",
    patientNumber: "9177857077",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "7000",
    medicineOrders: "7001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00436365",
    patientName: "Mrs.NEHA CHAUBEY",
    patientNumber: "8099022651",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00438625",
    patientName: "Mrs.MANSI GUPTA",
    patientNumber: "9121162586",
    age: "46 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-00411175",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0046733175",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0041165344175",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },

  {
    id: "RCWH.00001",
    patientName: "Mrs.INDRAJA GADDE",
    patientNumber: "9866554451",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "7 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-002",
    patientName: "Baby.A.TEJASRI ",
    patientNumber: "8790152729",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.00003",
    patientName: "Mrs.MANJU KUMARI ",
    patientNumber: "8008099409",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-004",
    patientName: "Baby Of.DR SANDHYA RAO",
    patientNumber: "9989607711",
    age: "20 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-005",
    patientName: "Mrs.DIVYA VANI ",
    patientNumber: "9177965550",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-006",
    patientName: "Mrs.SANDHYA A",
    patientNumber: "9533773769",
    age: "32 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "4000",
    medicineOrders: "4001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-007",
    patientName: "Mrs.J.PAVANI ",
    patientNumber: "8688568342",
    age: "33 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "1001",
    familyMembers: "8 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-008",
    patientName: "Mrs.AYAN KHALID DAUD ",
    patientNumber: "7386165763",
    age: "24 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-009",
    patientName: "Mrs.SANKU MANJULA",
    patientNumber: "9666158031",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0010",
    patientName: "Mrs.A VARALAKSHMI",
    patientNumber: "7989612245",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0011",
    patientName: "Mrs.OBA.SUSHMA",
    patientNumber: "9987595328",
    age: "32 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "3000",
    medicineOrders: "3001",
    familyMembers: "3 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0012",
    patientName: "Mrs.SRIVANI RAVURI",
    patientNumber: "9676776953",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0013",
    patientName: "Mrs.B PRIYADARSHINI ",
    patientNumber: "8121979191",
    age: "41 Years",
    sex: "F",
    noOfAppts: "9",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "4 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0014",
    patientName: "Mrs.M GEETHANJALI",
    patientNumber: "9177857077",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "7000",
    medicineOrders: "7001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0015",
    patientName: "Mrs.NEHA CHAUBEY",
    patientNumber: "8099022651",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0016",
    patientName: "Mrs.MANSI GUPTA",
    patientNumber: "9121162586",
    age: "46 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0017",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0018",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0019",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.000020",
    patientName: "Mrs.INDRAJA GADDE",
    patientNumber: "9866554451",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "7 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0020",
    patientName: "Baby.A.TEJASRI ",
    patientNumber: "8790152729",
    age: "29 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "RCWH.000021",
    patientName: "Mrs.MANJU KUMARI ",
    patientNumber: "8008099409",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0022",
    patientName: "Baby Of.DR SANDHYA RAO",
    patientNumber: "9989607711",
    age: "20 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0023",
    patientName: "Mrs.DIVYA VANI ",
    patientNumber: "9177965550",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0024",
    patientName: "Mrs.SANDHYA A",
    patientNumber: "9533773769",
    age: "32 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "4000",
    medicineOrders: "4001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0025",
    patientName: "Mrs.J.PAVANI ",
    patientNumber: "8688568342",
    age: "33 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "2000",
    medicineOrders: "1001",
    familyMembers: "8 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0026",
    patientName: "Mrs.AYAN KHALID DAUD ",
    patientNumber: "7386165763",
    age: "24 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "01-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0027",
    patientName: "Mrs.SANKU MANJULA",
    patientNumber: "9666158031",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0028",
    patientName: "Mrs.A VARALAKSHMI",
    patientNumber: "7989612245",
    age: "45 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0029",
    patientName: "Mrs.OBA.SUSHMA",
    patientNumber: "9987595328",
    age: "32 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "3000",
    medicineOrders: "3001",
    familyMembers: "3 Members",
    upcomingApptDate: "02-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0030",
    patientName: "Mrs.SRIVANI RAVURI",
    patientNumber: "9676776953",
    age: "35 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0031",
    patientName: "Mrs.B PRIYADARSHINI ",
    patientNumber: "8121979191",
    age: "41 Years",
    sex: "F",
    noOfAppts: "9",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "4 Members",
    upcomingApptDate: "02-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0032",
    patientName: "Mrs.M GEETHANJALI",
    patientNumber: "9177857077",
    age: "25 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "7000",
    medicineOrders: "7001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0033",
    patientName: "Mrs.NEHA CHAUBEY",
    patientNumber: "8099022651",
    age: "41 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0034",
    patientName: "Mrs.MANSI GUPTA",
    patientNumber: "9121162586",
    age: "46 Years",
    sex: "F",
    noOfAppts: "5",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-11-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0035",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0036",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
  {
    id: "BAH-0037",
    patientName: "Mrs.BHAVA GEETHIKA",
    patientNumber: "8790610868",
    age: "41 Years",
    sex: "F",
    noOfAppts: "6",
    activeAppointmets: "0",
    labOrders: "1000",
    medicineOrders: "1001",
    familyMembers: "5 Members",
    upcomingApptDate: "03-12-2021",
    memberSince: "2021",
    remarks: "Good",
  },
];
const TITLE = "Unify Care - Patient List";
export default function PatientList(props) {
  const [patientList, setPatientList] = useState([...rows]);
  const [patientData, setPatientData] = useState({});
  const [activepatientCount, setActivePatientCount] = useState(0);
  const [newPatientCount, setNewPatientCount] = useState(0);
  const [totalPatientCount, setTotalPatientCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalRow, setTotalRow] = useState(rows.length);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [cookies, getCookie] = useCookies(["name"]);
  const classes = useStyles();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([...rows]);

  // const transformData = (data) => {
  //   return data.map((item) => {
  //     // getPatientData(item.parentId)
  //     return {
  //       id: item.mhrId,
  //       patientName: 'HARI PRIYA',// patientName: item.userFirstName + " " + item.userLastName,
  //       patientNumber: item.phoneNumber,
  //       noOfAppts: "15",
  //       activeAppointmets: "4",
  //       labOrders: "1001",
  //       medicineOrders: "2000",
  //       familyMembers: "5 Members",
  //       upcomingApptDate: "20-12-2021",
  //       age: "40",
  //       sex: "Male",
  //       memberSince: "2003",
  //       parentId: item.parentId,
  //     };
  //   });
  // };

  // const getData = async () => {
  //   try {
  //     let cookie = "";
  //     for (const [key, value] of Object.entries(cookies)) {
  //       if (key === "express:sess") {
  //         cookie = value;
  //       }
  //     }
  //     let headers = {
  //       authtoken: JSON.parse(localStorage.getItem("token")),
  //     };

  //     const url = config.API_URL + "/api/patient/patientlist";
  //     const response = await axios.get(url, { headers });
  //     if (response.data[0].patientsList) {
  //       getAllPatientData(response.data[0].patientsList);
  //       const plist = transformData(response.data[0].patientsList);
  //       setPatientList(plist);
  //       setList(plist);
  //       setTotalPatientCount(response.data[1].totalPatientCount);
  //       setActivePatientCount(response.data[2].activePatientCount);
  //       setNewPatientCount(response.data[3].newPatientCount);
  //     }
  //   } catch (err) {}
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  // useEffect(() => {
  //   const list = patientList.map((item) => ({
  //     ...item,
  //     //phoneNumber: (patientData && patientData[`${item.parentId}`] &&  patientData[`${item.parentId}`].phoneNumber) || '',
  //     noOfAppts:
  //       (patientData &&
  //         patientData[`${item.parentId}`] &&
  //         patientData[`${item.parentId}`].noOfAppts) ||
  //       "",
  //     activeAppointmets:
  //       (patientData &&
  //         patientData[`${item.parentId}`] &&
  //         patientData[`${item.parentId}`].activeAppointmets) ||
  //       "",
  //     labOrders:
  //       (patientData &&
  //         patientData[`${item.parentId}`] &&
  //         patientData[`${item.parentId}`].labOrders) ||
  //       "",
  //     medicineOrders:
  //       (patientData &&
  //         patientData[`${item.parentId}`] &&
  //         patientData[`${item.parentId}`].medicineOrders) ||
  //       "",
  //     upcomingAppointmentDate:
  //       (patientData &&
  //         patientData[`${item.parentId}`] &&
  //         patientData[`${item.parentId}`].upcomingAppointmentDate) ||
  //       "",
  //   }));
  //   console.log("======>List", list);
  //   setPatientList(list);
  //   setList(list);
  // }, [patientData]);

  // const getAllPatientData = async (plist) => {
  //   let promises = [];
  //   let pData = [];
  //   const configURL = config.API_URL + "/api/patient/patientstat/";
  //   let cookie = "";
  //   for (const [key, value] of Object.entries(cookies)) {
  //     if (key === "express:sess") {
  //       cookie = value;
  //     }
  //   }
  //   let headers = {
  //     authtoken: JSON.parse(localStorage.getItem("token")),
  //   };
  //   for (const item of plist) {
  //     const url = config.API_URL + "/api/patient/patientstat/" + item.parentId;
  //     promises.push(
  //       axios.get(url, { headers }).then((response) => {
  //         pData.push(response);
  //       })
  //     );
  //   }
  //   Promise.all(promises).then(() => {
  //     const userData = {};
  //     pData.forEach((item) => {
  //       const parentId = item.config.url.replace(configURL, "");
  //       const data = item.data;
  //       const patientName = data[0].patientName;
  //       const noOfAppts = data[2].noOfAppts;
  //       const activeAppointmets = data[3].activeAppointmets.toFixed();
  //       const labOrders = data[4].labOrders.toFixed();
  //       const medicineOrders = "₹ " + data[5].medicineOrders.toFixed();
  //       const upcomingAppointmentDate = data[6].upcomingAppointmentDate;
  //       const tempData = {
  //         patientName,
  //         noOfAppts,
  //         activeAppointmets,
  //         labOrders,
  //         medicineOrders,
  //         upcomingAppointmentDate,
  //         parentId,
  //       };
  //       userData[parentId] = tempData;
  // console.log('==================>data[4].medicineOrders', data[5].medicineOrders)
  // console.log('==================>Number(data[4.medicineOrders])', Number(data[5].medicineOrders))
  //     });
  //     setPatientData(userData);
  //   });
  // };

  // calendedr
  const [appDateRange, setAppDateRange] = useState([
    {
      endDate: new Date(),
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
    setAnchorEl(true);
  };
  // end calender

  const columns = [
    { field: "id", headerName: "UHID", width: 120 },
    {
      field: "",
      headerName: "Name",
      width: 200,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        console.log("===========> params", params);
        const { patientName, patientNumber } = params.row;

        return (
          <div style={{ lineHeight: "18px" }}>
            <div className={classes.Grid}>{patientName}</div>
            <div>({patientNumber})</div>
          </div>
        );
      },
    },
    { field: "age", headerName: "Age", width: 120 },
    { field: "sex", headerName: "Sex", width: 120 },
    // { field: "patientNumber", headerName: "Contact", width: 130 },
    { field: "noOfAppts", headerName: "Appt#", width: 120 },
    { field: "activeAppointmets", headerName: "Active Appt#", width: 150 },
    { field: "labOrders", headerName: "Lab Order#", width: 150 },
    { field: "medicineOrders", headerName: "Rx Order#", width: 150 },
    { field: "familyMembers", headerName: "Family#", width: 130 },
    { field: "upcomingApptDate", headerName: "Last Appt Done", width: 190 },
    { field: "memberSince", headerName: "Member Since", width: 180 },
    { field: "remarks", headerName: "Remarks", width: 140 },
  ];

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
    const temp = patientList.filter((ele) => {
      let d = ele.upcomingApptDate.split("-");
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
  // const dateHeandler = () => {
  //   const startDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].startDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
  //   const endDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].endDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
  //   console.log("startDate: ",startDate)
  //   console.log("endDate: ",endDate)
  //   let patientList = [...list];
  //   let tempArr = [];
  //   patientList.map((item)=>{
  //     console.log("==========>upcomingApptDate:-", new Date(item.upcomingApptDate));
  //     if(new Date(item.upcomingApptDate) <= new Date(endDate) && new Date(item.upcomingApptDate) >= new Date(startDate)){
  //       tempArr.push(item);
  //     }
  //   });
  //   setList(tempArr);
  //   console.log("=============>patientList: ",patientList);
  //   console.log("============>tempArr: ",tempArr);
  // },

  const searchHeandler = (value) => {
    const filter = patientList.filter((item) => {
      if (!value) true;
      const status =
        item.patientNumber
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.patientName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.id
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      return status;
    });
    setList(filter);
    //setPatientList(filter)
  };

  // const searchHeandler = (value) => {
  //   const filter = patientList.filter((item) => {
  //     if (!value) true;
  //     const status =
  //       item.labOrders
  //         .toString()
  //         .toLowerCase()
  //         .includes(value.toString().toLowerCase()) ||
  //       item.patientName
  //         .toString()
  //         .toLowerCase()
  //         .includes(value.toString().toLowerCase());
  //     return status;
  //   });
  //   setList(filter);
  // };
  const addnewPatientHandler = () => {
    router.push("/addnewpatient");
  };

  const handlePageChange = (e) => {
    const newPage = e.selected;
    setPage(newPage);
    setLoader(true);
    let temp = [...patientList];
    const start = newPage * rowsPerPage;
    setList([...temp.splice(start, rowsPerPage + 10)]);
    setLoader(false);
  };

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
          <Header title="Patient List" rows={list} columns={columns} />
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
                        <img
                          src="/search.svg"
                          height="15"
                          width="15"
                          style={{ marginRight: "4px" }}
                        />
                      }
                      // <img src="/search.svg" className={classes.icon} />
                    />
                    <Button
                      variant="Filter"
                      color="default"
                      className={classes.button}
                      endIcon={<FilterListIcon />}
                    >
                      Filter
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{
                    fontFamily: "Bahnschrift SemiBold",
                    fontSize: "13px",
                    paddingRight: "0px",
                    marginLeft: "180px",
                  }}
                >
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
                </Grid>
                {/* <Grid item>
                <Button
                  onClick={addnewPatientHandler}
                  variant="contained"
                  className={classes.button2}
                >
                  + PATIENT
                </Button>
              </Grid> */}
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
                        {/* {totalPatientCount} */} 195
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Total Patients
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {newPatientCount} */}189
                      </Typography>
                      <Typography className={classes.typotext2}>
                        New Patients
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>
                        {/* {activepatientCount} */}150
                      </Typography>
                      <Typography className={classes.typotext2}>
                        Active Patients
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>888</Typography>
                      <Typography className={classes.typotext2}>
                        Lab Orders Raised
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }} spacing={1}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>666</Typography>
                      <Typography className={classes.typotext2}>
                        Pharmacy Orders Raised
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item sm={2} style={{ textAlign: "center" }}>
                  <Card className={classes.Card}>
                    <CardContent style={{ padding: "10px" }}>
                      <Typography className={classes.typotext}>555</Typography>
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
                pageSize={rowsPerPage}
                rowHeight={40}
                headerHeight={45}
                //GridSortDirection={null}
                //checkboxSelection
                disableSelectionOnClick
              />
              {/* <Typography>Page: {page}</Typography> */}
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
          </div>
        </Grid>
      </Grid>
    </>
  );
}
