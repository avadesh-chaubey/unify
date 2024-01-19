import React, { useState, useEffect } from "react";
import {
  Typography,
  InputLabel,
  MenuItem,
  ListSubheader,
  FormControlLabel,
  Select,
  SvgIcon,
  Breadcrumbs,
  Link,
  Grid,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  Paper,
  Button,
} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import router from "next/router";
import { useCookies } from "react-cookie";
import config from "../../app.constant";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MessagePrompt from "../messagePrompt";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  unitBtn: {
    //backgroundColor: "red",
    width: "300px",
    color: "#707070",
    display: "inline-flex",
    flexDirection: "column",
    marginTop: "15px",
  },
  head: {
    backgroundColor: "#f6f7fa",
    padding: " 15px 60px",
  },
  title: {
    color: "#4B2994",
    fontSize: "16px",
    fontWeight: "bold",
  },
  breadCrum: {
    color: "#4B2994",
  },
  popupIndicator: {
    // backgroundColor: "blue",
    "& span": {
      "& svg": {
        "& path": {
          d: 'path("M 16.59 8.59 L 12 13.17 L 7.41 8.59 L 6 10 l 6 6 l 6 -6 Z")', // your svg icon path here
        },
      },
    },
  },
}));

export default function SelectUnit({ setMsgData }) {
  const [selectedUnit, setSelectedUnit] = useState({});
  const [selectedSpec, setSelectedSpec] = useState({});
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["name"]);
  const [hosUnitArr, setHosUnitArr] = useState([]);
  const [specialityArr, setSpecialityArr] = useState([]);
  const item = [
    {
      title: "Childcare",
      icon: "Childcare.svg",
    },
    {
      title: "Women Care",
      icon: "Women care.svg",
    },
    {
      title: "Fertility Care",
      icon: "Fertility care.svg",
    },
    {
      title: "Speciality Care",
      icon: "Speciality care.svg",
    },
  ];

  const headers = {
    authtoken: cookies["cookieVal"],
  };
  useEffect(() => {
    axios
      .get(config.API_URL + "/api/patient/hospitalunit", { headers })
      .then((res) => {
        console.log("res hospitalunit: ", res);
        setHosUnitArr(res.data.data);
      })
      .catch((err) => {
        console.log("err hospitalunit", err);
      });
  }, []);

  const hospitalClick = (item) => {
    console.log("item: ", item);
    setSelectedUnit(item);
    if (item != null || item != undefined) {
      axios
        .get(
          `${config.API_URL}/api/patient/speciality?hospitalUID=${item.ownerOrganisationUID}`,
          { headers }
        )
        .then((res) => {
          console.log("res speciality: ", res);
          setSpecialityArr(res.data.data);
          if (res.data.data.length < 1) {
            setMsgData({
              message:
                "Do not have any speciality related to this hospital, Please select different hospital",
              type: "error",
            });
            // return false;
          }
        })
        .catch((err) => {
          console.log("err speciality ", err);
        });
    } else {
      setSpecialityArr([]);
    }
  };

  const specialityClick = (item) => {
    console.log("item: ", item);
    setSelectedSpec(item);
  };

  function goBack() {
    window.history.back();
  }
  function handleClick(event) {
    event.preventDefault();
    console.info("Clicked a breadcrumb.");
  }
  const onSelectDoctor = () => {
    console.log("selectedSpec: ", selectedSpec);
    if (selectedUnit == null || !selectedUnit.id) {
      setMsgData({ message: "Please Select Hospital Unit", type: "error" });
      return false;
    } else if (specialityArr.length < 1) {
      console.log("go");

      setMsgData({
        message:
          "Do not have any speciality related to this hospital, Please select different hospital",
        type: "error",
      });
      return false;
      // router.push("/doctorresult");
    } else if (selectedSpec == undefined || !selectedSpec.id) {
      setMsgData({ message: "Please select any specialty", type: "error" });
      return false;
    } else {
      router.push("/doctorresult?hospitalUID=1&specailityUID=28");
    }
  };

  function CustomSvgIcon(props) {
    return (
      <SvgIcon {...props} style={{ marginRight: "20px" }}>
        {/* <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /> */}
        <ExpandMoreIcon
          style={{
            top: "calc(50% - 12px)",
            color: "#555555",
            position: "absolute",
            pointerEvents: "none",
          }}
        />
      </SvgIcon>
    );
  }

  return (
    <>
      {/* <MessagePrompt msgData={msgData} /> */}
      <HeadBreadcrumbs
        titleArr={["Home", "Book Appointment"]}
        lastTitle={"Consultation Services"}
        mainTitle={"Consultation Services"}
      />
      <div className="main selectUnit">
        <Grid container>
          <Typography
            style={{
              marginLeft: "210px",
              marginTop: "50px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#555555",
              width: "100%",
            }}
          >
            Select Hospital Unit
          </Typography>
          <Grid item style={{ marginLeft: "210px" }}>
            <FormControl
              sx={{ m: 1, minWidth: "500px" }}
              style={{
                //border: "1px solid #2b2b2a",
                minwidth: "600px",
                display: "inline-flex",
                flexDirection: "column",
                marginTop: "15px",
              }}
            >
              <InputLabel
                //htmlFor="grouped-native-select"
                id="selectUnit"
                // style={{ marginLeft: "10px" }}
                className="selectWrapper"
              >
                {/* Select Unit */}
              </InputLabel>
              <Autocomplete
                id="grouped-demo"
                options={hosUnitArr.sort(
                  (a, b) => -b.city.localeCompare(a.city)
                )}
                groupBy={(option) => option.city}
                getOptionLabel={(option) => option.branch}
                style={{ width: 825 }}
                onChange={(event, newValue) => {
                  hospitalClick(newValue);
                }}
                classes={{
                  popupIndicator: classes.popupIndicator,
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    variant="outlined"
                    placeholder="Select Hospital"
                  />
                )}
              />
              {/* <Select
                defaultValue={1}
                id="selectUnit"
                labelId="selectUnit"
                className="selectWrapper"
                style={{ fontWeight: "bold" }}
                IconComponent={CustomSvgIcon}
              >
                <MenuItem value={1} disabled style={{ fontWeight: "bold" }}>
                  Select Hospital 
                </MenuItem>
                {hosUnitArr.map((item)=>(
                  <MenuItem value={item.id} onClick={(e)=>hospitalClick(item)}>{item.branch}</MenuItem>
                ))}
              </Select> */}
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ flexGrow: "1" }}>
          {/* , margin: "15px"  */}
          {/* {specialityArr.length > 0 && ( */}
          <div>
            <Typography
              style={{
                marginLeft: "210px",
                marginTop: "50px",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#555555",
              }}
            >
              Select Speciality
            </Typography>
            <Grid container style={{ marginTop: "20px" }}>
              <Grid item style={{ marginLeft: "210px" }}>
                <FormControl
                  sx={{ m: 1, minWidth: "500px" }}
                  style={{
                    //border: "1px solid #2b2b2a",
                    minwidth: "600px",
                    display: "inline-flex",
                    flexDirection: "column",
                    marginTop: "15px",
                  }}
                >
                  <InputLabel
                    //htmlFor="grouped-native-select"
                    id="selectUnit"
                    style={{ color: "#c1c2c2" }}
                    className="selectWrapper"
                  >
                    Select Speciality
                  </InputLabel>
                  <Select
                    defaultValue={1}
                    id="selectUnit"
                    labelId="selectUnit"
                    className="selectWrapper"
                    style={{ fontWeight: "bold", color: "#c1c2c2" }}
                    IconComponent={CustomSvgIcon}
                  >
                    <MenuItem value={1} disabled style={{ fontWeight: "bold" }}>
                      Select Speciality
                    </MenuItem>
                    {specialityArr.map((item) => (
                      <MenuItem
                        value={item.id}
                        onClick={(e) => specialityClick(item)}
                      >
                        {item.specialityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
          {/* )} */}
          {/* <Grid container justifyContent="center" spacing={1}>
            {item.map((ele, i) => {
              return (
                <Grid item xs={3} sm={2}>
                  <Paper
                    className={
                      selectedCard == i ? "cardStyle2Active" : "cardStyle2"
                    }
                    style={{ backgroundColor: "#F3F3F3", boxShadow: "none" }}
                    onClick={() => handleCardClick(i)}
                  >
                    <img src={ele.icon} />
                    <div>{ele.title}</div>
                  </Paper>
                </Grid>
              );
            })}
          </Grid> */}
          <div>
            <Button
              style={{
                // float: "right",
                borderRadius: "4px",
                border: "1px solid #152a75",
                color: "#152a75",
                marginRight: "70px",
                marginTop: "70px",
                width: "120px",
                position: "absolute",
                bottom: "40px",
                right: "0",
              }}
              onClick={onSelectDoctor}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
