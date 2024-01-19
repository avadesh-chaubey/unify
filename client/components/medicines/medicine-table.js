import React, { useState, useEffect, useRef} from "react";
import { useAlert } from "react-alert";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteMedicineDialog from './DeleteMedicineDialog';
import AlphabateSearch from "../../utils/alphabateSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  InputAdornment,
  TextField,
  MenuItem
} from "@material-ui/core";

function MedicineTable(props) {
  const [medList, setMedList] = useState([]);
  const alert = useAlert();
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [medicineId, setMedicineId] = useState("");
  const [type, setType] = useState("CAPSULE");
  const [medicinename, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [stax, setSTax] = useState("");
  const [costError, setCostError] = useState("");
  const [staxError, setSTaxError] = useState("");
  const [code, setCode] = useState("");
  const [tempMedList, setTempMedList] = useState([]);
  const [openDelDialog, setOpenDelDialog] = useState(0);
  const [medId, setMedId] = useState('');
  const [highlightChar, setHighlighChar] = useState(false);
  const scrollRef = useRef(null);

  function validateCost(inputtxt) {
    setCost(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setCostError({ cost: "" });
    setCost(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setCostError({ cost: "Please enter a value in MRP" });
    }
  }

  function validateSTax(inputtxt) {
    setSTax(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setSTaxError({ stax: "" });
    setSTax(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setSTaxError({ stax: "Please enter value IN GST" });
    }
  }

  // function getMedData() {
  //   //listing medicine data
  //   let temp = [];
  //   let cookie = "";
  //   for (const [key, value] of Object.entries(cookies)) {
  //     if (key === "express:sess") {
  //       cookie = value;
  //     }
  //   }
  //   let headers = {
  //     authtoken: cookie,
  //   };
  //   setLoader(true);
  //   axios
  //     .get(config.API_URL + "/api/utility/medicine", { headers })
  //     .then((response) => {
  //       // console.log("response: ", response);
  //       temp = response.data;
  //       // setMedList(temp);
  //       // setMedList(response.data);
  //       console.log("temp : ",temp);
  //       setTempMedList(temp);
  //       setLoader(false);
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //       // alert.show(error.response.data.errors[0].message, { type: "error" });
  //     });
  // }
  // useEffect(() => {
  //   getMedData();
  // }, [props.updateList]);

  const handleMedcineSelected = (e,val) =>{
    let tempArr = [];

    if(val === null) {
      const lastSelectedChar = localStorage.hasOwnProperty('med')
        ? localStorage.getItem('med')
        : 'A';

      setCharValue(lastSelectedChar);
      setHighlighChar(false);
    } else if(val !== null){
      tempArr.push(val);
      setCharValue(val.medicineName[0]);
      setHighlighChar(true);
    }

    setMedList(tempArr);
    setTempMedList([]);
  }
  const onMedicineChange =(e)=>{
    let tempVal = e.target.value;
    let temp = [];
    if(tempVal.length === 0){
      setTempMedList(temp);
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
    // setLoader(true);
    axios
      .get(config.API_URL + "/api/utility/medicine?medicineName=" + tempVal, { headers })
      .then((response) => {
        // console.log("response: ", response);
        temp = response.data.data;
        setTempMedList(temp);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  }
  useEffect(() => {
    let temp = [];
    if(props.updateList.id){
      temp.push(props.updateList);
      setMedList(temp);
    }
    // getMedData();
  }, [props.updateList]);

  let documentarr = [];
  // submit new employee details function
  const submitNewDetails = (medId) => {
    // e.preventDefault();
    setErrMsg(false);
    documentarr = [];
    if (documentarr.length > 0) {
      // uploadImages(0);
    } else {
      addNewEmp(medId);
    }
  };

  // to add new employee main function
  const addNewEmp = (medId) => {
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
      id: medId,
      medicineType: type,
      medicineName: medicinename,
      packOf: quantity,
      MRP: cost,
      gstInPercentage: stax,
      hsnCode: code,
      lab: "lab",
    };
    let tempData = [];
    const url = config.API_URL + `/api/utility/medicine/${medId}`;
    setLoader(true);
    axios
      .put(url, obj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("response: ", response);
        handleClose();
        tempData.push(response.data.data);
        console.log("tempdata: ",tempData);
        setMedList(tempData);
        setCharValue(null)
        props.update(response.data); //to update list
        setLoader(false);
        props.setMsgData({
          message: "Medicine Updated Successfully",
          type: "success",
        });
      })
      .catch((error) => {
        setLoader(false);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        console.log(error);
      });
  };

  const [drugType, setdrugType] = useState([]);
  const getDrugtypes = () => {
    // setCity("");
    let url = config.API_URL + "/api/utility/medicinetypes?medicineType";
    axios
      .get(url)
      .then((response) => {
        if (response.data.data) {
          setdrugType(response.data.data);
          // console.log("type-", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDrugtypes();
  }, []);

  const headers = {
    authtoken: cookies["express:sess"],
    "Content-type": "application/json",
  };

  const handleClickOpen = (medId) => {
    setOpen(true);
    setLoader(true);
    axios
      .get(config.API_URL + `/api/utility/medicine?id=${medId}`, {
        headers,
      })
      .then((response) => {
        setLoader(true);
        console.log("eachmed", response);
        const Medicine =response.data.data
        setMedicineId(Medicine.id);
        setType(Medicine.medicineType);
        setMedicineName(Medicine.medicineName);
        setCost(Medicine.MRP);
        setCode(Medicine.hsnCode);
        setSTax(Medicine.gstInPercentage);
        setQuantity(Medicine.packOf);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  const handleClose = () => {
    // clearAddForm();
    setErrMsg(false);
    setOpen(false);
  };

  const handleDelDialog = (medId) => {
    setMedId(medId);
    setOpenDelDialog(!openDelDialog);
  };

  const closeDialog = () => {
    setOpenDelDialog(!openDelDialog);
  };
  const [charValue, setCharValue] = useState("");
  useEffect(() => {
    if (localStorage.getItem("med")) {
      setCharValue(localStorage.getItem("med"));
    } else {
      setCharValue("A");
    }
  }, [])
  useEffect(() => {
    if(props.addMedFlag === true){
      setCharValue(null);
      props.setAddMedFlag(false);
    }
  }, [props.addMedFlag])
  const [tempKey, setTempKey] = useState("");
  useEffect(() => {
    if (highlightChar) {
      return ;
    }

    if(charValue != null){
      if(charValue ===""){
        if (localStorage.getItem("med")) {
          setCharValue(localStorage.getItem("med"));
        } else {
          setCharValue("A");
        }
      }
      setTempKey(charValue);
      let temp = [];
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: cookie,
      };
      setLoader(true);
      if(charValue !=""){
        axios
        .get(config.API_URL + "/api/utility/medicine?medicineName=" + charValue, { headers })
        .then((response) => {
          console.log("response: ", response);
          temp = response.data.data;
          setMedList(temp);
          setLoader(false);
          if(scrollRef.current){
            scrollRef.current.scrollIntoView();
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
          // alert.show(error.response.data.errors[0].message, { type: "error" });
        });
      }else{
      setLoader(false);
      }
    }
  }, [charValue, highlightChar])
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <DeleteMedicineDialog
        open={openDelDialog}
        id={medId}
        closeDialog={closeDialog}
        // resetMedList={setMedList}
        setMessage={props.setMsgData}
        setCharValue = {setCharValue}
      />
      <div className="medicineSearch med">
        <Autocomplete
          freeSolo
          className="medicine-search"
          key={tempKey}
          options={tempMedList}
          getOptionLabel={(option) => option.medicineName}
          getOptionSelected={(option, value) => option === value}
          onChange={(event, newValue) => handleMedcineSelected(event, newValue)}
          style={{ marginTop: "-7px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              placeholder="Enter name to search"
              variant="outlined"
              onChange={(e)=>{
                const reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(e.target.value);
                if (reg) {
                  onMedicineChange(e);
                }
              }}
            />
          )}
        />
        <img
          src="/search.svg"
          alt="search"
          className="search-bar-icon"
        />
      </div>
      <hr />
      <AlphabateSearch
        setCharValue = {setCharValue}
        charValue = {charValue}
        from = "med"
      />
      <div className="empTable">
        {medList.length > 0 ? (
          <TableContainer component={Paper} style={{ height: "67vh" }}>
            <Table stickyHeader aria-label="simple table" className="table">
              <TableHead ref={scrollRef}>
                <TableRow>
                  <TableCell align="left">Drug Type</TableCell>
                  <TableCell align="left">Drug Name</TableCell>
                  <TableCell align="left">Pack of</TableCell>
                  <TableCell align="left">MRP</TableCell>
                  <TableCell align="left">GST</TableCell>
                  <TableCell align="left">HSN/SAC Code</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medList.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.medicineType}
                    </TableCell>
                    <TableCell align="left" style={{ width: "20%" }}>
                      {emp.medicineName}
                    </TableCell>
                    <TableCell align="left">{emp.packOf}</TableCell>
                    <TableCell align="left">₹&nbsp;{emp.MRP}</TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.gstInPercentage}&nbsp;%
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.hsnCode}
                    </TableCell>
                    <TableCell>
                      <EditIcon
                        onClick={() => handleClickOpen(emp.id)}
                        style={{ color: "#00888a", cursor: "pointer", marginRight: "10px" }}
                      />
                      <DeleteIcon
                        onClick={() => handleDelDialog(emp.id)}
                        style={{ color: "#00888a", cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              className="addDialog"
            >
              <DialogTitle
                id="form-dialog-title"
                style={{ marginTop: "10px", marginLeft: "7px" }}
              >
                <span>Edit Medicine</span>
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
                <div>
                  <TextField
                    style={{ margin: 8, width: "94%", display: "none" }}
                    value={medicineId}
                  />
                </div>
                <TextField
                  required
                  // autoFocus
                  select
                  label="Drug Type"
                  style={{ margin: 8, width: "25%" }}
                  margin="normal"
                  variant="filled"
                  // className={"half-div"}
                  className={"half-div " + (errMsg && type === "" ? "err" : "")}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {drugType.map((dept) => (
                    <MenuItem key={dept.id} value={dept.medicineType}>
                      {dept.medicineType}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  label="Drug Name"
                  style={{ margin: 8, width: "68.8%" }}
                  margin="normal"
                  variant="filled"
                  // className={"half-div"}
                  className={
                    "half-div " + (errMsg && medicinename === "" ? "err" : "")
                  }
                  value={medicinename}
                  onChange={(e) => setMedicineName(e.target.value)}
                />

                {/* <div className="break"></div> */}
                <div>
                  <TextField
                    required
                    label="Pack Of"
                    style={{ margin: 8, width: "47%" }}
                    margin="normal"
                    variant="filled"
                    // className={"half-div"}
                    className={
                      "half-div " + (errMsg && quantity === "" ? "err" : "")
                    }
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <TextField
                    required
                    label="HSN/SAC Code"
                    style={{ margin: 8, width: "47%" }}
                    margin="normal"
                    variant="filled"
                    className={
                      "half-div " + (errMsg && code === "" ? "err" : "")
                    }
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                {/* <div className="break"></div> */}
                <div style={{ width: "100%" }}>
                  <TextField
                    required
                    label="MRP"
                    style={{ margin: 8, width: "47%" }}
                    margin="normal"
                    variant="filled"
                    error={Boolean(costError?.cost)}
                    helperText={costError?.cost}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    // className={"half-div"}
                    className={
                      "half-div " + (errMsg && cost === "" ? "err" : "")
                    }
                    value={cost}
                    onChange={validateCost}
                  />
                  <TextField
                    required
                    label="GST"
                    style={{ margin: 8, width: "47%" }}
                    margin="normal"
                    variant="filled"
                    error={Boolean(staxError?.stax)}
                    helperText={staxError?.stax}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                    }}
                    className={
                      "half-div " + (errMsg && stax === "" ? "err" : "")
                    }
                    value={stax}
                    onChange={validateSTax}
                  ></TextField>
                  <TextField
                    // required
                    label="PTAX(GST)"
                    style={{ margin: 8, width: "33%", visibility: "hidden" }}
                    margin="normal"
                    variant="filled"
                  />
                </div>
              </DialogContent>
              <DialogActions
                style={{
                  margin: "5px",
                  marginBottom: "15px",
                  marginTop: "-40px",
                }}
              >
                <Button
                  onClick={handleClose}
                  color="primary"
                  className="back cancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => submitNewDetails(medicineId)}
                  color="#fff"
                  className="primary-button forward saveBtn"
                  style={{ marginRight: "30px" }}
                >
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "10%",
              lineHeight: "1.5",
              wordSpacing: "1px",
            }}
            className="noData"
          >
            <div className="title">
              "Search for the recently added medicine" or Tap on "Add New Medicine" button to add new medicine.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default MedicineTable;
