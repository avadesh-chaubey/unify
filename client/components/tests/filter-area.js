import React, { useState, useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "@material-ui/core/Menu";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Dialog from "@material-ui/core/Dialog";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAlert, types } from "react-alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { MenuItem } from '@material-ui/core';
import test from '../../data/labTest.json';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

function FilterArea(props) {
  const [open, setOpen] = useState(false);
  const alert = useAlert();
  const [cookies, getCookie] = useCookies(["name"]);
  const [errMsg, setErrMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const [testname, setTestName] = useState("");
  const [servicetype, setServiceType] = useState("");
  const [cost, setCost] = useState("");
  const [costError, setCostError] = useState("");
  const [labTest, setLab] = useState("ARH");
  const [condition, setCondition] = useState("");
  const [waittime, setWaitTime] = useState("");
  const [additional, setAdditional] = useState(false);
  // to open add new employee dialog
  const handleClickOpen = (e) => {
    setOpen(true);
  };
  // for fliter
  function applyFilter(type, data) {}

  const handleClose = () => {
    clearAddForm();
    setErrMsg(false);
    setOpen(false);
    // router.push("/tests");
  };
  const handleAdditionalCharge = (event) => {
    setAdditional(event.target.checked);
  };

  function validateCost(inputtxt) {
    setCost(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setCostError({ cost: "" });
    setCost(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setCostError({ cost: "Please enter a value of cost" });
    }
  }

  const [stypes, setSTypes] = useState([]);
  const [stypesError, setSTypesError] = useState("");
  const getDrugtypes = () => {
    // setCity("");
    let url = config.API_URL + "/api/utility/diagnostictest";
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setSTypes(response.data);
          // console.log("stype-", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDrugtypes();
  }, []);

  function validateSType(inputtxt) {
    setSTypesError({ servicetype: "" });
    stypes.map((ser) => {
      if (ser.serviceType !== inputtxt) {
        setServiceType(inputtxt.target.value);
      } else if (ser.serviceType === inputtxt) {
        props.setMsgData({
          message: "This Service is already avaliable",
          type: "error",
        });
      }
    });
    const {
      target: { value },
    } = event;
    let reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(value);
    if (!reg) {
      setSTypesError({ servicetype: "Special Character should not be on first place" });
    }
    
  }

  let documentarr = [];
  // submit new tests details function
  const submitNewDetails = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (servicetype === "" || cost === "") {
      setErrMsg(true);
      // alert.show("All fields are required", { type: "error" });
      props.setMsgData({
        message: "Service Type and Cost are required",
        type: "error",
      });
      return false;
    }

    documentarr = [];
    if (documentarr.length > 0) {
      // uploadImages(0);
    } else {
      addNewTest();
    }
  };

  // to add new employee main function
  function addNewTest() {
    setErrMsg(false);
    if (servicetype === "" || cost === "") {
      setErrMsg(true);
      // alert("All fields are required");
      props.setMsgData({
        message: "Service Type and Cost are required",
        type: "error",
      });
      return false;
    }
    let reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(servicetype);
    if (!reg) {
      setErrMsg(true);
      // alert.show("All fields are required");
      props.setMsgData({ message: "Special Character should not be on first place", type: "error" });
      return false;
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    let obj = {
      serviceType: servicetype,
      addCollectionCharges: additional,
      cost: cost,
      preCondition: condition,
      reportWaitingTime: waittime,
      lab: labTest,
    };
    console.log("obj: ", obj);
    // return false;
    const url = config.API_URL + "/api/utility/diagnostictest";
    setLoader(true);
    axios
      .post(url, obj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("response: ", response);
        handleClose();
        props.updateList(response);
        setLoader(false);
        props.setAddTestFlag(true);
        // alert.show("Tests added successfully", { type: "success" });
        props.setMsgData({
          message: "Tests added successfully",
          type: "success",
        });
        // router.push("tests");
      })
      .catch((error) => {
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: "Service Type should be unique",
          type: "error",
        });
        // console.log(error, "error");
      });
  }
  // to clear add new form after closing
  const clearAddForm = () => {
    setServiceType("");
    setCost("");
    setCondition("");
    setWaitTime("");
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      {/* <div className="test-btn addnew" onClick={handleClickOpen}>
        + ADD NEW TEST
      </div> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="addDialog addtest"
      >
        <DialogTitle
          id="form-dialog-title"
          style={{ marginTop: "10px", marginLeft: "7px" }}
        >
          <span>Add New Diagnostic Test</span>
          <img
            style={{
              height: "20px",
              cursor: "pointer",
              float: "right",
              marginTop: "8px",
              marginRight: "12px",
            }}
            src="crossIcon.png"
            onClick={handleClose}
          />
        </DialogTitle>
        <DialogContent>
          {loader && (
            <div className="loader">
              <CircularProgress color="secondary" />
              <div className="text"></div>
            </div>
          )}
          <div className="elements" style={{ marginLeft: "5px" }}>
            <TextField
              required
              style={{ width: '95%' }}
              className="test-dropdown admin-test-dropdown"
              error={errMsg && labTest === ''}
              label="Lab"
              select
              margin="normal"
              variant="filled"
              size="small"
              value={labTest}
              onChange={(e) => {
                e.preventDefault();
                setLab(e.target.value);
              }}
            >
              {
                test.map((d, index) => (
                  <MenuItem key={index} value={d.test_type}>{ d.test_type }</MenuItem>
                ))
              }
            </TextField>
          </div>

          <div>
            <TextField
              id="service-type"
              autoFocus
              required
              label="Service Type"
              style={{ margin: 8, width: "94%" }}
              margin="normal"
              variant="filled"
              error={Boolean(stypesError?.servicetype)}
              helperText={stypesError?.servicetype}
              className={
                "half-div " + (errMsg && servicetype === "" ? "err" : "")
              }
              value={servicetype}
              // onChange={(e) => setServiceType(e.target.value)}
              onChange={validateSType}
            />
          </div>
          <TextField
            id="cost-test"
            required
            label="Cost"
            style={{ margin: 8, width: "94%" }}
            margin="normal"
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            error={Boolean(costError?.cost)}
            helperText={costError?.cost}
            className={"half-div " + (errMsg && cost === "" ? "err" : "")}
            value={cost}
            onChange={validateCost}
          />

          <TextField
            // required
            id="pre-condition"
            label="Pre-Condition"
            style={{ margin: 8, width: "94%" }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            className={"half-div "}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
          <div>
            <TextField
              // required
              id="report-wait-time"
              label="Report wait time"
              style={{ margin: 8, width: "94%" }}
              margin="normal"
              variant="filled"
              // className={"half-div"}
              className={"half-div "}
              value={waittime}
              onChange={(e) => setWaitTime(e.target.value)}
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  id="additional-charges"
                  icon={
                    <CheckBoxOutlineBlankOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checkedIcon={
                    <CheckBoxOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checked={additional}
                  onChange={handleAdditionalCharge}
                />
              }
              style={{ margin: "auto", marginTop: "10px", fontSize: "10px" }}
              label={"Additional home collection charges may apply"}
            />
          </div>
        </DialogContent>
        <DialogActions style={{ margin: "5px", marginBottom: "15px" }}>
          <Button
            id="cancel-btn"
            onClick={handleClose}
            color="primary"
            className="back cancelBtn test-btn-curve"
          >
            Cancel
          </Button>
          <Button
            id="save-btn"
            onClick={submitNewDetails}
            color="#fff"
            className="primary-button forward saveBtn test-btn-curve"
            style={{ marginRight: "30px" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
      <br />
    </>
  );
}
export default FilterArea;
