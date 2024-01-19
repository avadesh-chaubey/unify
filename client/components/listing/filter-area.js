import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import config from "../../app.constant";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAlert, types } from "react-alert";
import Router from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

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
  const [status, setStatus] = useState("any");
  const [dept, setDept] = useState("any");
  const [sort, setSort] = useState("recent");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [addDept, setAddDept] = useState("");
  const [addDesignation, setAddDesignation] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [specialization, setSpecialization] = useState([]);
  const [newelements, setNewElements] = useState("");
  // const element = newelements.map((add) => add);
  const [isdCode, setIsdCode] = useState("+91");
  const [userStatus, setUserStatus] = useState("unverified");
  const [profileImage, setUserProfileImage] = useState("");
  const [profileImageFileName, setUserProfileImageFileName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const SpecializationType = [
    { name: "Medicine", value: "medicine" },
    { name: "Surgery", value: "surgery" },
    { name: "Gynaecology", value: "gynaecology" },
    { name: "Obstetrics", value: "obstetrics" },
    { name: "Paediatrics", value: "paediatrics" },
    { name: "Eye", value: "eye" },
    { name: "ENT", value: "ENT" },
    { name: "Dental", value: "dental" },
    { name: "Orthopaedics", value: "orthopaedics" },
    { name: "Neurology", value: "neurology" },
    { name: "Cardiology", value: "cardiology" },
    { name: "Psychiatry", value: "psychiatry" },
    { name: "Skin", value: "skin" },
    { name: "VD", value: "vd" },
    { name: "PlasticSurgery", value: "plastic-surgery" },
    { name: "NuclearMedicine", value: "nuclear-medicine" },
    { name: "InfectiousDisease", value: "infectious-disease" },
    { name: "Diabetic", value: "diabetic" },
    { name: "Physiotherapy", value: "physiotherapy" },
    { name: "HealthEducation", value: "health-education" },
    { name: "Counseling", value: "counseling" },
    { name: "Nutritionist", value: "nutritionist" },
  ];

  const dropTypes = [
    { name: "DIABETOLOGIST", value: "diabetologist" },
    { name: "PHYSICIAN ASSISTANT", value: "physician:assistant" },
    { name: "DIETITIAN", value: "dietician" },
    { name: "EDUCATOR", value: "educator" },
    { name: "ROASTER MANAGER", value: "roster:manager" },
  ];
  const departmentType = [
    { name: "Medical", value: "medical-department" },
    { name: "Pathology", value: "pathology-department" },
    { name: "Pharmacy", value: "pharmacy-department" },
    { name: "Radiology", value: "radiology-department" },
    { name: "Dietary", value: "dietary-department" },
    { name: "Customer Support", value: "customer-support" },
    { name: "House Keeping", value: "house keeping-department" },
    { name: "Medical Record", value: "medical-record-department" },
    { name: "Admin", value: "admin" },
  ];
  const designationType = {
    medicaldepartment: [{ name: "Doctor", value: "doctor" }],
    customersupport: [
      {
        name: "Customer Support Executive",
        value: "customer-support-executive",
      },
    ],
    admin: [
      { name: "Roster Manager", value: "roster:manager" },
      { name: "Employee Admin", value: "employee:admin" },
    ],
    other: [
      { name: "Superuser", value: "facility:superuser" },
      { name: "Manager", value: "facility:manager" },
      { name: "Nutritionist", value: "nutritionist" },
      { name: "Educator", value: "educator" },
      { name: "Patient", value: "patient" },
    ],
  };
  const handleSearchChange = (e) => {
    // console.log("text:",e.target.value);
    // return empList.map((list)=>list.userFirstName.toLowerCase().indexOf(e.target.value) > -1);
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    applyFilter("userStatus", event.target.value);
  };
  // for department filter
  const handleDeptChange = (event) => {
    setDept(event.target.value);
  };
  const [designation, setDesignation] = useState("all");
  const handleDesigChange = (event) =>{
    console.log("event ", event.target.value)
    setDesignation(event.target.value);
    props.setDesigFilterVal(event.target.value);
  }
  // for sort filter
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };
  // to open add new employee dialog
  const handleClickOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };
  // for fliter
  function applyFilter(type, data) {}

  const handleClose = () => {
    // clearAddForm();
    setErrMsg(false);
    setAnchorEl(null);
  };
  const handleAddMemeber = (value) => {
    setAnchorEl(null);
    Router.push("/addDoctor");
    localStorage.setItem("uservalue", value);
    console.log(value, "value");
  };

  // to get profile picture name function
  const uploadProfile = (e) => {
    e.preventDefault();
    let newVal = e.target.value.replace(/^.*[\\\/]/, "");
    setUserProfileImage(newVal);
    let file = document.getElementById("profilePic").files[0];
    let timestamp = new Date().getTime();
    let fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    let filename = "";
    filename = "empProfile/" + timestamp + "_" + fileRe;
    setUserProfileImageFileName(filename);
  };
  let documentarr = [];
  // submit new employee details function
  const submitNewDetails = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (profileImage === "") {
      setErrMsg(true);
      alert.show("All fields are required", { type: "error" });
      return false;
    }

    documentarr = [];

    if (profileImage !== "") {
      documentarr.push({
        name: "Employee Profile Pic",
        id: "profilePic",
        key: profileImage,
        filename: profileImageFileName,
      });
    }
    setLoader(true);
    if (documentarr.length > 0) {
      uploadImages(0);
    } else {
      addNewEmp(profileImageUrl);
    }
  };
  // to upload image to the server
  const uploadImages = (a) => {
    let imageUrl = null;
    console.log("documentarr: ", documentarr);
    var model = {
      file: document.getElementById(documentarr[a].id).files[0],
    };
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    var configs = {
      headers: { authtoken: cookie },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
    };
    setLoader(true);
    axios
      .post(config.API_URL + "/api/utility/upload", model, configs)
      .then((response) => {
        console.log(response.data);
        imageUrl = response.data.fileName;
        setProfileImageUrl(response.data.fileName);
        addNewEmp(imageUrl);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  };
  const [designationList, setDesignationList] = useState("");
  // to set designation
  const getDesignation = () => {
    if (addDept === "medical-department") {
      setDesignationList(designationType.medicaldepartment);
    } else if (addDept === "customer-support") {
      setDesignationList(designationType.customersupport);
    } else if (addDept === "admin") {
      setDesignationList(designationType.admin);
    } else {
      setDesignationList(designationType.other);
    }
  };
  useEffect(() => {
    getDesignation();
  }, [addDept]);

  // to add new employee main function
  const addNewEmp = (imageUrl) => {
    setErrMsg(false);
    if (
      fName === "" ||
      lName === "" ||
      mobile === "" ||
      email === "" ||
      addDept === "" ||
      addDesignation === "" ||
      profileImageFileName === ""
    ) {
      setErrMsg(true);
      alert("All fields are required");
      return false;
    }
    // return false;
    let spec = "NA";
    if (specialization.length > 0) {
      spec = specialization.map((x) => {
        return x.value;
      });
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    let obj = {
      userFirstName: fName,
      userLastName: lName,
      emailId: email,
      phoneNumber: mobile,
      userType:
        addDesignation === "customer-support-executive"
          ? "customer:support"
          : addDesignation,
      dateOfBirth: "2020-10-10",
      experinceInYears: "10",
      highestQualification: "NA",
      department: addDept,
      specialization: spec,
      profileImageName: imageUrl,
      designation: addDesignation,
    };
    // ==='customer-support-executive' ? 'customer:support': addDesignation,
    // console.log("obj: ",obj);
    // return false;
    const url = config.API_URL + "/api/partner/employee";
    setLoader(true);
    axios
      .post(url, obj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("response: ", response);
        handleClose();
        props.updateList(response);
        // getEmpData();
        setLoader(false);
        alert.show("Employee added successfully", { type: "success" });
      })
      .catch((error) => {
        setLoader(false);
        alert.show(error.response.data.errors[0].message, { type: "error" });
        console.log(error);
      });
  };
  // to clear add new form after closing
  const clearAddForm = () => {
    setfName("");
    setlName("");
    setMobile("");
    setEmail("");
    setAddDept("");
    setAddDesignation("");
    setSpecialization([]);
    setUserProfileImage("");
    setIsdCode("+91");
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <div style={{position:"absolute", left:"17px", top:"103px"}}>
        <div>
          <span style={{fontSize:"18px", fontWeight:"bold", color:"#777777"}}>Designation &nbsp;&nbsp;</span>
          <span>
            <FormControl style={{marginTop:'-8px'}}>
              <Select
                // native
                value={designation}
                onChange={handleDesigChange}
                inputProps={{
                  name: "Department",
                }}
                style={{padding:"0px 5px", minWidth:"70px", textAlign:"center"}}
              >
                <MenuItem value={"all"}>ALL</MenuItem>
                <MenuItem value={"diabetologist"}>DIABETOLOGIST</MenuItem>
                <MenuItem value={"physician:assistant"}>PHYSICIAN ASSISTANT</MenuItem>
                <MenuItem value={"dietician"}>DIETITIAN</MenuItem>
                <MenuItem value={"educator"}>EDUCATOR</MenuItem>
                <MenuItem value={"roster:manager"}>ROASTER MANAGER</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>
      </div>
      {/* <div className="filter-area"> */}
      {/* <div id="add-new-btn" className="action-bttn addnew" onClick={handleClickOpen}>
        + ADD NEW
      </div> */}
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {dropTypes.map((address,index) => (
          <div key={index}>
            <MenuItem
              onClick={() => handleAddMemeber(address.value)}
              value={address.value}
            >
              {address.name}
            </MenuItem>

            <Divider />
          </div>
        ))}
        {/* <MenuItem onClick={handleAddMemeber}>DIABETOLOGIST</MenuItem>
        <hr />
        <MenuItem onClick={handleAddMemeber}>PHYSICIAN ASSISTANT</MenuItem>
        <hr />
        <MenuItem onClick={handleAddMemeber}>DIETICIAN</MenuItem>
        <hr />
        <MenuItem onClick={handleAddMemeber}>EDUCATOR</MenuItem>
        <hr />
        <MenuItem onClick={handleAddMemeber}>ROASTER MANAGER</MenuItem> */}
      </StyledMenu>
      <br />
      <br />
      <br />
      {/* </div> */}
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
        </div>
        {/* <div
          className="pull-right action-bttn addnew"
          onClick={handleClickOpen}
        >
          + ADD NEW
        </div> 
      </div> */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="addDialog"
      >
        <DialogTitle id="form-dialog-title">
          <span>Add New Employee</span>
          <span style={{ marginLeft: "40px" }}>
            <Button
              onClick={addDoctorBtn}
              color="primary"
              className="back cancelBtn"
            >
              Add Doctor
            </Button>
          </span>
          <span style={{ marginLeft: "40px" }}>
            <Button
              onClick={addEmployeeBtn}
              color="primary"
              className="back cancelBtn"
            >
              Add Employee
            </Button>
          </span>
          <img
            style={{
              height: "20px",
              cursor: "pointer",
              float: "right",
              marginTop: "0px",
              marginRight: "-10px",
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
            autoFocus
            label="First Name"
            style={{ margin: 8 }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            className={"half-div " + (errMsg && fName === "" ? "err" : "")}
            value={fName}
            onChange={(e) => setfName(e.target.value)}
          />
          <TextField
            required
            label="Last Name"
            style={{ margin: 8 }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            className={"half-div " + (errMsg && lName === "" ? "err" : "")}
            value={lName}
            onChange={(e) => setlName(e.target.value)}
          />
          <div className="half-div mobsec" style={{ margin: 8 }}>
            <TextField
              select
              // labelId="country-label"
              style={{ width: "30%" }}
              label="Country Code"
              id="Country_code"
              value={isdCode}
              required
              margin="normal"
              variant="filled"
              // className={"half-div"}
              onChange={(e) => setIsdCode(e.target.value)}
              // displayEmpty
              //   mar-left-10 newblock
              // className={(addDept === '' ? 'err1' : '')}
            >
              <MenuItem value="+91">+91</MenuItem>
            </TextField>
            <TextField
              required
              label="Mobile"
              style={{ width: "66%", float: "right" }}
              margin="normal"
              variant="filled"
              // className={"half-div"}
              className={errMsg && mobile === "" ? "err" : ""}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <TextField
            required
            label="Work Email"
            style={{ margin: 8 }}
            margin="normal"
            variant="filled"
            // className={"half-div"}
            className={"half-div " + (errMsg && email === "" ? "err" : "")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            select
            // labelId="country-label"
            style={{ margin: 8 }}
            label="Department"
            id="Department"
            value={addDept}
            required
            margin="normal"
            variant="filled"
            // className={"half-div"}
            onChange={(e) => setAddDept(e.target.value)}
            // displayEmpty
            //   mar-left-10 newblock
            className={"half-div " + (addDept === "" ? "err1" : "")}
          >
            {departmentType.map((dept) => (
              <MenuItem key={"st-" + dept.name} value={dept.value}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            // labelId="country-label"
            label="Designation"
            id="Designation"
            style={{ margin: 8 }}
            value={addDesignation}
            required
            margin="normal"
            variant="filled"
            // className={"half-div"}
            onChange={(e) => setAddDesignation(e.target.value)}
            // displayEmpty
            //   mar-left-10 newblock
            className={"half-div " + (addDesignation === "" ? "err1" : "")}
          >
            <MenuItem value="" disabled></MenuItem>
            {designationList.length > 0 &&
              designationList.map((des) => (
                <MenuItem key={"st-" + des.name} value={des.value}>
                  {des.name}
                </MenuItem>
              ))}
          </TextField>
          <div className={"select-div spec"} style={{ margin: "8px" }}>
            <Autocomplete
              multiple
              required
              id="tags-standard"
              style={{ width: "99%", backgroundColor: "rgba(0, 0, 0, 0.09)" }}
              limitTags={2}
              options={SpecializationType}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              // defaultValue={[top100Films[13]]}
              onChange={(event, newValue) => {
                let values = [...specialization];
                values = newValue;
                setSpecialization(values);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Specialization"
                />
              )}
            />
          </div>
          <div className="profileImage">
            <div className="upload-option">
              <input
                type="file"
                className="choose"
                style={{ margin: 8 }}
                id="profilePic"
                onChange={uploadProfile}
              />
              <label htmlFor="profilePic" className="dragContent">
                <img src="upload.svg" />
                <span className="uploadText">
                  Click here to upload profile picture. &nbsp;&nbsp;&nbsp;
                  {profileImage}
                </span>
                {/* <span className='uploadText'>Drag and drop to upload profile picture. &nbsp;&nbsp;&nbsp;{profileImage}</span> 
              </label>
            </div>
          </div>
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
            onClick={submitNewDetails}
            color="primary"
            className="primary-button forward saveBtn"
            style={{ marginRight: "30px" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
export default FilterArea;
