import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect, useRef} from "react";
import { useAlert } from "react-alert";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteTestDialog from './DeleteTestDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import AlphabateSearch from "../../utils/alphabateSearch";

// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import CheckIcon from "@material-ui/icons/Check";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import { TextFieldsSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

function TestsTable(props) {
  const [testList, setTestsList] = useState([]);

  const alert = useAlert();
  const classes = useStyles();
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [testname, setTestName] = useState("");
  const [servicetypes, setServiceTypes] = useState("");
  const [costs, setCosts] = useState("");
  const [costError, setCostError] = useState("");
  const [testsid, setTestsid] = useState("");
  const [Lab, setLab] = useState("ARH");
  const [condition, setCondition] = useState("");
  const [waittime, setWaitTime] = useState("");
  const [additional, setAdditional] = useState(false);
  const [stypes, setSTypes] = useState([]);
  const [stypesError, setSTypesError] = useState("");
  const [tempTestList, setTempTestList] = useState([]);
  const [openDelDialog, setOpenDelDialog] = useState(0);
  const [testId, setTestId] = useState('');
  const [highlightChar, setHighlighChar] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const scrollRef = useRef(null);

  function validateCost(inputtxt) {
    setCosts(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setCostError({ costs: "" });
    setCosts(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setCostError({ costs: "Please enter a value of cost" });
    }
  }

  const handleAdditionalCharge = (event) => {
    setAdditional(event.target.checked);
  };

  function validateSType(inputtxt) {
    setSTypesError({ servicetypes: "" });
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
  }

  const clearAddForm = () => {
    setServiceType("");
    setCost("");
    setCondition("");
    setWaitTime("");
  };

  const onInputChange = (e) => {
    setTests({ ...tests, [e.target.name]: e.target.value });
  };

  // function getMedData() {
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
  //     .get(config.API_URL + "/api/utility/diagnostictest", { headers })
  //     .then((response) => {
  //       console.log("response: ", response);
  //       temp = response.data;

  //       // setTestsList(temp);
  //       setLoader(false);
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.log(error);
  //       // alert.show(error.response.data.errors[0].message, { type: "error" });
  //       props.setMsgData({
  //         message: error.response.data.errors[0].message,
  //         type: "error",
  //       });
  //     });
  // }
  // useEffect(() => {
  //   getMedData();
  // }, [props.updateList]);

  const handleTestSelected = (e,val) => {
    let tempArr = [];

    if (val === null) {
      const lastSelectedChar = localStorage.hasOwnProperty('test')
        ? localStorage.getItem('test')
        : 'A';

      setCharValue(lastSelectedChar);
      setHighlighChar(false);
    } else if(val !== null){
      tempArr.push(val);
      setCharValue(val.serviceType[0]);
      setHighlighChar(true);
    }

    setTempTestList([]);
    setTestsList(tempArr);
  };

  const onTestChange = (e)=>{
    let tempVal = e.target.value;
    let temp = [];
    if(tempVal.length === 0){
      setTempTestList(temp);
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
      .get(config.API_URL + "/api/utility/diagnostictest?serviceType=" + e.target.value, { headers })
      .then((response) => {
        temp = response.data.data;
        setTempTestList(temp);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });

  }
  useEffect(() => {
    let temp = [];
    if(props.updateList.data && props.updateList.data.id){
      temp.push(props.updateList.data);
      setTestsList(temp);
    }
    // getMedData();
  }, [props.updateList]);

  let documentarr = [];
  // submit new tests details function
  const submitNewDetails = (testid) => {
    // e.preventDefault();
    setErrMsg(false);
    if (servicetypes === "" || costs === "") {
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
      addNewTest(testid);
    }
  };

  // to add new employee main function
  function addNewTest(testid) {
    setErrMsg(false);
    if (servicetypes === "" || costs === "") {
      setErrMsg(true);
      // alert("All fields are required");
      props.setMsgData({
        message: "Service Type and Cost are required",
        type: "error",
      });
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
      id: testid,
      serviceType: servicetypes,
      addCollectionCharges: additional,
      cost: costs,
      preCondition: condition,
      reportWaitingTime: waittime,
      lab: Lab,
    };
    let tempData = [];
    console.log("obj: ", obj);
    // return false;
    const url = config.API_URL + `/api/utility/diagnostictest/${testid}`;
    setLoader(true);
    axios
      .put(url, obj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("response: ", response);
        handleClose();
        tempData.push(response.data.data);
        setTestsList(tempData);
        props.update(response); //to update list
        setLoader(false);
        // alert.show("Tests added successfully", { type: "success" });
        props.setMsgData({
          message: "Test Updated Successfully",
          type: "success",
        });
        // router.push("tests");
      })
      .catch((error) => {
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        // props.setMsgData({
        //   message: error.response.data.errors[0].message,
        //   type: "error",
        // });
        console.log(error, "error");
      });
  }
  const headers = {
    authtoken: cookies["express:sess"],
    "Content-type": "application/json",
  };

  const handleClickOpen = (testId) => {
    setOpen(true);
    setLoader(true);
    axios
      .get(config.API_URL + `/api/utility/diagnostictest?id=${testId}`, {
        headers,
      })
      .then((response) => {
        setLoader(true);
        console.log("eachtest", response);
        setTestsid(response.data.data.id);
        setLab(response.data.data.lab);
        setServiceTypes(response.data.data.serviceType);
        setCosts(response.data.data.cost);
        setCondition(response.data.data.preCondition);
        setWaitTime(response.data.data.reportWaitingTime);
        setAdditional(response.data.data.addCollectionCharges);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
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

  const handleDelDialog = (testRecId) => {
    setTestId(testRecId);
    setOpenDelDialog(!openDelDialog);
  };

  const closeDialog = () => {
    setOpenDelDialog(!openDelDialog);
  };
  const [charValue, setCharValue] = useState("");
  useEffect(() => {
    if (localStorage.getItem("test")) {
      setCharValue(localStorage.getItem("test"));
    } else {
      setCharValue("A");
    }
    
  }, [])
  useEffect(() => {
    if(props.addTestFlag === true){
      setCharValue(null);
      props.setAddTestFlag(false);
    }
  }, [props.addTestFlag])

  useEffect(() => {
    if (highlightChar) {
      return ;
    }

    if(charValue != null){
      if(charValue ===""){
        if (localStorage.getItem("test")) {
          setCharValue(localStorage.getItem("test"));
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
      
      let tempchar = charValue;
      if(charValue === "#"){
        tempchar = "0";
      }
      if(charValue !=""){
        axios
        .get(config.API_URL + "/api/utility/diagnostictest?serviceType=" + tempchar, { headers })
        .then((response) => {
          temp = response.data.data;
          setTestsList(temp);
          setLoader(false);
          if(scrollRef.current){
            scrollRef.current.scrollIntoView();
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
          // alert.show(error.response.data.errors[0].message, { type: "error" });
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
        });
      }else{
        setLoader(false);
      }
    }
    
  }, [charValue, highlightChar]);
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <hr />

      <AlphabateSearch
        setCharValue = {setCharValue}
        charValue = {charValue}
        from = {"test"}
      />
      <DeleteTestDialog
        open={openDelDialog}
        id={testId}
        closeDialog={closeDialog}
        // resetTestList={setTestsList}
        setMessage={props.setMsgData}
        setCharValue = {setCharValue}
      />
      <div className="medicineSearch">
          <Autocomplete
            freeSolo
            key = {tempKey}
            className="medicine-search"
            options={tempTestList}
            getOptionLabel={(option) => option.serviceType}
            getOptionSelected={(option, value) => option === value}
            onChange={(event, newValue) => handleTestSelected(event, newValue)}
            style={{ marginTop: "-7px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                placeholder="Enter name to search"
                variant="outlined"
                onChange={(e)=>{
                  let reg = new RegExp(/^[A-Za-z0-9][^]*$/).test(e.target.value);
                  if (reg) {
                    onTestChange(e)
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
      <div className="empTable" >
        {testList.length > 0 ? (
          <TableContainer component={Paper} className="test-table-height">
            <Table stickyHeader aria-label="simple table" className="table">
              <TableHead ref={scrollRef}>
                <TableRow>
                  <TableCell align="left">Lab</TableCell>
                  <TableCell align="left">Service Type</TableCell>
                  <TableCell align="left">Cost</TableCell>
                  <TableCell align="left">Pre-Condition</TableCell>
                  <TableCell align="left">Report wait-time</TableCell>
                  <TableCell align="left">Is Additional Charge</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testList.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell align="left">{emp.lab}</TableCell>
                    <TableCell align="left" style={{ width: "400px" }}>
                      {emp.serviceType}
                    </TableCell>
                    <TableCell align="left">
                      {emp.cost === "" || emp.cost === undefined
                        ? "-"
                        : `₹ ${emp.cost}`}
                    </TableCell>
                    <TableCell align="left">
                      {emp.preCondition === "" ? "-" : emp.preCondition}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.reportWaitingTime === ""
                        ? "-"
                        : emp.reportWaitingTime}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.addCollectionCharges === true ? "YES" : "-"}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <EditIcon
                        onClick={() => handleClickOpen(emp.id)}
                        style={{ color: "#00888a", cursor: "pointer", marginRight:"10px" }}
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
                <span>Edit Diagnostic Test</span>
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
                <TextField
                  // value={servicetype}
                  style={{ display: "none" }}
                />
                <div
                  className="elements radio-cutom"
                  style={{ marginLeft: "5px" }}
                >
                  {/* <FormLabel component="legend">Lab*</FormLabel> */}
                  <RadioGroup
                    row
                    aria-label="position"
                    className="radio-exe"
                    name="position"
                    value={Lab}
                    onChange={(e) => setLab(e.target.value)}
                    style={{
                      display: "inline-block",
                      marginLeft: "6px",
                      marginTop: "-5px",
                    }}
                  >
                    <FormControlLabel
                      value="ARH"
                      control={<Radio />}
                      label="ARH"
                    />

                    <FormControlLabel
                      style={{ visibility: "hidden" }}
                      value="BIO"
                      control={<Radio />}
                      label="BIO"
                    />
                    <FormControlLabel
                      value="BIO"
                      control={<Radio />}
                      label="BIO"
                    />
                  </RadioGroup>
                </div>
                <div>
                  <TextField
                    style={{ margin: 8, width: "94%", display: "none" }}
                    value={testsid}
                  />
                </div>
                <div>
                  <TextField
                    autoFocus
                    required
                    label="Service Type"
                    style={{ margin: 8, width: "94%" }}
                    margin="normal"
                    variant="filled"
                    error={Boolean(stypesError?.servicetypes)}
                    helperText={stypesError?.servicetypes}
                    className={
                      "half-div " + (errMsg && servicetypes === "" ? "err" : "")
                    }
                    value={servicetypes}
                    onChange={(e) => setServiceTypes(e.target.value)}
                    // onChange={validateSType}
                  />
                </div>
                <TextField
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
                  error={Boolean(costError?.costs)}
                  helperText={costError?.costs}
                  className={
                    "half-div " + (errMsg && costs === "" ? "err" : "")
                  }
                  value={costs}
                  onChange={validateCost}
                />
                <TextField
                  // required
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
                        // disabled
                        checked={additional}
                        onChange={handleAdditionalCharge}
                      />
                    }
                    style={{
                      margin: "auto",
                      marginTop: "10px",
                      fontSize: "10px",
                    }}
                    label={"Additional home collection charges may apply"}
                  />
                </div>{" "}
              </DialogContent>
              <DialogActions style={{ margin: "5px", marginBottom: "15px" }}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  className="back cancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => submitNewDetails(testsid)}
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
              Tap on "Add New Test" button to add new tests.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default TestsTable;
