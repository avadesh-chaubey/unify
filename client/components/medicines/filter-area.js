import Menu from "@material-ui/core/Menu";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import config from "../../app.constant";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAlert, types } from "react-alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import DrugTypeCollection from "../../types/drug-type";
import percentageField from "../../utils/percentageField";
import indianCurrencyField from "../../utils/indianCurrencyField";

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
  const [net, setNet] = useState("");
  const [type, setType] = useState("CAPSULE");
  const [medicinename, setMedicineName] = useState("");
  const [brandname, setBrandName] = useState("");
  const [power, setPower] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [stax, setSTax] = useState("");
  const [ptax, setPTax] = useState("");
  const [costError, setCostError] = useState("");
  const [staxError, setSTaxError] = useState("");
  const [ptaxError, setPTaxError] = useState("");
  const [code, setCode] = useState("");
  const [medicineError, setMedicineError] = useState("");
  const drugType = DrugTypeCollection;

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    clearAddForm();
    setErrMsg(false);
    setOpen(false);
  };
  function validateName (inputText){
    setMedicineName(inputText.target.value);
    setMedicineError({name: ""})
    const {
      target: { value },
    } = event;
    let reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(value);
    if (!reg) {
      setMedicineError({ name: "Special Character should not be on first place" });
    }
  }
  function validateCost(inputtxt) {
    setCost(inputtxt.target.value);
    setCostError({ cost: "" });
    setCost(inputtxt.target.value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(inputtxt.target.value);
    if (!reg) {
      setCostError({ cost: "Please enter a value in MRP" });
    }
  }
  // function validatePTax(inputtxt) {
  //   setPTax(inputtxt.target.value);
  //   const {
  //     target: { value },
  //   } = event;
  //   setPTaxError({ ptax: "" });
  //   setPTax(value);
  //   let reg = new RegExp(/^\d*$/).test(value);
  //   if (!reg) {
  //     setPTaxError({ ptax: "Please enter numbers for ptax" });
  //   }
  // }
  function validateSTax(inputtxt) {
    setSTax(inputtxt.target.value);
    setSTaxError({ stax: "" });
    setSTax(inputtxt.target.value);

    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(inputtxt.target.value);
    if (!reg) {
      setSTaxError({ stax: "Please enter value IN GST" });
    }
  }

  let documentarr = [];
  // submit new employee details function
  const submitNewDetails = (e) => {
    e.preventDefault();
    setErrMsg(false);
    documentarr = [];
    if (documentarr.length > 0) {
      // uploadImages(0);
    } else {
      addNewEmp();
    }
  };

  // to add new employee main function
  const addNewEmp = (imageUrl) => {
    setErrMsg(false);
    if (
      type === "" ||
      medicinename === "" ||
      quantity === "" ||
      cost === "" ||
      stax === "" ||
      code === ""
    ) {
      setErrMsg(true);
      // alert.show("All fields are required");
      props.setMsgData({ message: "All fields are required", type: "error" });

      return false;
    }
    let reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(medicinename);
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
      medicineType: type,
      medicineName: medicinename,
      packOf: quantity,
      MRP: cost,
      gstInPercentage: stax,
      hsnCode: code,
      lab: "lab",
    };
    console.log("obj: ", obj);
    // return false;
    const url = config.API_URL + "/api/utility/medicine";
    setLoader(true);
    axios
      .post(url, obj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("response: ", response);
        handleClose();
        props.updateList(response.data);
        props.setAddMedFlag(true);
        // getEmpData();
        setLoader(false);
        // alert.show("Medicines added successfully", { type: "success" });
        props.setMsgData({
          message: "Medicine added successfully",
          type: "success",
        });
      })
      .catch((error) => {
        setLoader(false);
        alert.show(error.response.data.errors[0].message, { type: "error" });
        console.log(error);
      });
  };
  // to clear add new form after closing
  const clearAddForm = () => {
    setMedicineName("");
    setType("CAPSULE");
    setQuantity("");
    setCost("");
    setSTax("");
    setCode("");
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      {/* <div id="add-new-medicine" className="medicine-btn addnew" onClick={handleClickOpen}>
        + ADD NEW MEDICINE
      </div> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="addDialog addMedcine"
      >
        <DialogTitle
          id="form-dialog-title"
          style={{ marginTop: "10px", marginLeft: "7px" }}
        >
          <span>Add New Medicine</span>
          <img
            style={{
              height: "20px",
              cursor: "pointer",
              float: "right",
              marginTop: "5px",
              marginRight: "13px",
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
          <TextField
            required
            // autoFocus
            id="drug-type"
            select
            label="Drug Type"
            style={{ margin: 8, width: "25%" }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            className={"half-div " + (errMsg && type === "" ? "err" : "")}
            // value={type}
            defaultValue="select"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem disabled value="select">
              Select Drug Type
            </MenuItem>
            {drugType.map((data, index) => (
              <MenuItem key={index} value={data}>
                {data}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="drug-name"
            required
            label="Drug Name"
            style={{ margin: 8, width: "68.8%" }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            error={Boolean(medicineError?.name)}
            helperText={medicineError?.name}
            className={
              "half-div " + (errMsg && medicinename === "" ? "err" : "")
            }
            value={medicinename}
            onChange={validateName}
          />

          {/* <div className="break"></div> */}
          <div>
            <TextField
              id="pack-of"
              required
              label="Pack Of"
              style={{ margin: 8, width: "47%" }}
              margin="normal"
              variant="filled"
              // className={"half-div"}
              className={"half-div " + (errMsg && quantity === "" ? "err" : "")}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              id="sac-code"
              required
              label="HSN/SAC Code"
              style={{ margin: 8, width: "47%" }}
              margin="normal"
              variant="filled"
              className={"half-div " + (errMsg && code === "" ? "err" : "")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* <div className="break"></div> */}
          <div style={{ width: "100%" }}>
            <TextField
              ud="mrp"
              required
              label="MRP"
              style={{ margin: 8, width: "47%" }}
              margin="normal"
              variant="filled"
              error={Boolean(costError?.cost)}
              helperText={costError?.cost}
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              // className={"half-div"}
              className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={cost}
              onChange={validateCost}
            />
            <TextField
              id="gst"
              required
              label="GST"
              style={{ margin: 8, width: "47%" }}
              margin="normal"
              variant="filled"
              error={Boolean(staxError?.stax)}
              helperText={staxError?.stax}
              InputProps={{
                inputComponent: percentageField,
              }}
              className={"half-div " + (errMsg && stax === "" ? "err" : "")}
              value={stax}
              onChange={validateSTax}
            />
            <TextField
              id="ptax"
              // required
              label="PTAX(GST)"
              style={{ margin: 8, width: "33%", visibility: "hidden" }}
              margin="normal"
              variant="filled"
            />
          </div>
        </DialogContent>
        <DialogActions>
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
      {/* <div className="filter-area">
        <div className="searchBar">
          <div className="search">
            <div className="searchIcon">
              <SearchIcon />
            </div>
            <InputBase
              className="inputStyle"
              placeholder="Search By Employee Name"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="midPart">
          <span>Status &nbsp;&nbsp;</span>
          <span>
            <FormControl className="selectBox">
              <Select
                // native
                value={status}
                onChange={handleStatusChange}
                inputProps={{
                  name: "Status",
                }}
              >
                <MenuItem value={"any"}>Any</MenuItem>
                <MenuItem value={"verified"}>verified</MenuItem>
                <MenuItem value={"unverified"}>Unverified</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>
        <div className="midPart">
          <span>Department &nbsp;&nbsp;</span>
          <span>
            <FormControl>
              <Select
                // native
                value={dept}
                onChange={handleDeptChange}
                inputProps={{
                  name: "Department",
                }}
              >
                <MenuItem value={"any"}>Any</MenuItem>
                <MenuItem value={"medical-department"}>Medical</MenuItem>
                <MenuItem value={"security"}>Security</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>
        <div className="midPart">
          <span>Sort By &nbsp;&nbsp;</span>
          <span>
            <FormControl>
              <Select
                // native
                value={sort}
                onChange={handleSortChange}
                inputProps={{
                  name: "Sort",
                }}
              >
                <MenuItem value={"recent"} disabled>
                  Recent
                </MenuItem>
              </Select>
            </FormControl>
          </span>
        </div> */}
      {/* </div> */}
    </>
  );
}
export default FilterArea;
