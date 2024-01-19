import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect } from "react";
import { useAlert, types } from "react-alert";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { useRouter } from "next/router";
import PendingAppDialog from "./PendingAppDialog";

function EmployeeTable(props) {
  const [empList, setEmpList] = useState([]);
  const alert = useAlert();
  const router = useRouter();
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [statusUsername, setStatusUsername] = useState("");
  const [statusName, setStatusName] = useState("");
  const [openConfirmStatus, setOpenConfirmStatus] = useState(false);
  const [statusUserid, setStatusUserid] = useState("");
  const [tempEmpList, setTempEmpList] = useState([]);
  const [pendingAppList, setPendingAppList] = useState([]);
  const [openPendingDialog, setOpenPendingDialog] = useState(0);
  const [selectedEmp, setEmp] = useState("");
  const [headers, setHeaders] = useState("");

  const closeConfirmStatus = () => {
    setOpenConfirmStatus(false);
  };
  const openChangeStatus = (e, val, id) => {
    setStatusName(val);
    setStatusUserid(id);
    empList.map((item) => {
      if (item.id === id) {
        setEmp(item);
        setStatusUsername(item.userFirstName + " " + item.userLastName);
      }
    });
    setOpenConfirmStatus(true);
  };

  useEffect(() => {
    setHeaders({
      authtoken: JSON.parse(localStorage.getItem("token")),
      "Content-type": "application/json",
    });
  }, []);

  const handleUpdate = (empId, type) => {
    // setLoader(true);

    axios
      .get(config.API_URL + `/api/partner/employee/${empId}`, {
        headers,
      })
      .then((response) => {
        // setLoader(true);
        console.log("eachemp", response);
        localStorage.setItem("updateEmp", JSON.stringify(response.data));
        localStorage.setItem("uservalue", type);
        router.push("/addDoctor");
      })
      .catch((error) => {
        console.log(error);
        // setLoader(false);
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  function getEmpData() {
    let temp = [];
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/partner/employee", { headers })
      .then((response) => {
        console.log("response: ", response);
        temp = response.data.data;
        temp.map((item) => {
          let dateObj = new Date(item.onboardingDate);
          let month = dateObj.toLocaleString("en-us", { month: "short" }); //months from 1-12
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          if (day < 10) {
            day = "0" + day;
          }
          let newdate = day + "-" + month + "-" + year;
          item.showOnboardingDate = newdate;
        });
        setEmpList(temp);
        setTempEmpList(temp);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        if (error.response.data[0].message === "Not authorized") {
          router.push("/login");
        } else {
          props.setMsgData({
            message: error.response.data[0].message,
            type: "error",
          });
          setLoader(false);
        }
      });
  }
  useEffect(() => {
    getEmpData();
  }, [props.updateList]);

  useEffect(() => {
    console.log("desigFilterVal ", props.desigFilterVal);
    console.log("empList: ", empList);
    let tempData;
    if (tempEmpList.length > 0) {
      if (props.desigFilterVal === "all") {
        tempData = tempEmpList;
      } else {
        tempData = tempEmpList.filter(
          (t) => t.userType === props.desigFilterVal
        );
      }
      setEmpList(tempData);
    }
    console.log("tempVal");
  }, [props.desigFilterVal]);
  // const changeStatus = (e, val, id) => {
  const changeStatus = (e) => {
    e.preventDefault();
    // return false;

    // const ins = empList.findIndex((v) => v.id === id);
    // const value = [...empList];
    // if (ins >= 0) {
    //   value[ins].userStatus = val;
    //   console.log("value: ", value);
    // }

    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    let obj = {
      id: statusUserid,
      userStatus: statusName,
    };
    setLoader(true);

    // Api to make user active / suspend
    axios
      .put(config.API_URL + "/api/partner/employeestatus", obj, { headers })
      .then((response) => {
        // console.log("response: ", response);
        setOpenConfirmStatus(false);
        props.setMsgData({
          message: "Status updated successfully",
          type: "success",
        });
        setLoader(false);
        const ins = empList.findIndex((v) => v.id === statusUserid);
        const value = [...empList];
        if (ins >= 0) {
          value[ins].userStatus = statusName;
          console.log("value: ", value);
        }
        setEmpList(value);
        setTempEmpList(value);
      })
      .catch((error) => {
        console.log("Employee status err", error.response);

        // Close confirmation dialog before opening appointment list dialog
        closeConfirmStatus();
        setLoader(false);

        if (error.response.data.length) {
          const pendingApp = error.response.data;

          // Set the pending list reverse to get the latest date
          setPendingAppList(pendingApp.reverse());
          openDialog();
        } else {
          alert.show(error.response.data.errors[0].message, { type: "error" });
          props.setMsgData({
            message: error.response.data.errors[0].message,
            type: "error",
          });
        }
      });
    // setEmpList(value);
    // setTempEmpList(value);
  };

  // Open pending appointment dialog
  const openDialog = () => {
    setOpenPendingDialog(1);
  };

  const closePendingDialog = () => {
    setOpenPendingDialog(0);
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <hr />
      <PendingAppDialog
        open={openPendingDialog}
        list={pendingAppList}
        closeDialog={closePendingDialog}
        setMsgData={props.setMsgData}
        selectedEmp={selectedEmp}
      />
      <div className="empTable">
        {empList.length > 0 ? (
          <TableContainer component={Paper} style={{ maxHeight: "72vh" }}>
            <Table stickyHeader aria-label="simple table" className="table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">User Name</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Onboarding Date</TableCell>
                  <TableCell align="center">Department</TableCell>
                  <TableCell align="center">Designation</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empList.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell
                      align="center"
                      style={{ textTransform: "capitalize" }}
                    >
                      {" "}
                      {emp.userFirstName + " " + emp.userLastName}
                    </TableCell>
                    <TableCell align="center">{emp.phoneNumber}</TableCell>
                    <TableCell align="center">{emp.emailId}</TableCell>
                    <TableCell align="center">
                      {emp.showOnboardingDate
                        ? emp.showOnboardingDate
                        : "01-10-2020"}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.department !== undefined
                        ? emp.department.indexOf("-department") > -1
                          ? emp.department
                              .replace("-", " ")
                              .slice(0, emp.department.indexOf("-department"))
                          : emp.department.replace("-", " ").replace("-", " ")
                        : ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.userType === "dietician"
                        ? "Dietitian"
                        : emp.userType.indexOf(":") > -1
                        ? emp.userType.replace(":", " ").replace("facility", "")
                        : emp.userType === "addDoctor"
                        ? "Doctor"
                        : emp.userType.replace("-", " ")}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: "capitalize" }}
                    >
                      <span>
                        <TextField
                          select
                          key={emp.id}
                          label=""
                          id="Department"
                          value={
                            emp.userStatus != "suspended"
                              ? "active"
                              : "suspended"
                          }
                          // value = {emp.userStatus}
                          required
                          margin="normal"
                          variant="filled"
                          // onChange={(e) =>
                          //   changeStatus(e, e.target.value, emp.id)
                          // }
                          onChange={(e) =>
                            openChangeStatus(e, e.target.value, emp.id)
                          }
                          // openMarkLeave
                          // className={(addDept === '' ? 'err1' : '')}
                        >
                          {/* <MenuItem value="unverified">Unverified</MenuItem>
                          <MenuItem value="verified">Verified</MenuItem> */}
                          <MenuItem value="active">Active</MenuItem>
                          {/* <MenuItem value="inactive">Inactive</MenuItem> */}
                          <MenuItem value="suspended">Suspended</MenuItem>
                        </TextField>
                      </span>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <IconButton
                        // className={classes.btnPostion}
                        onClick={() => handleUpdate(emp.id, emp.userType)}
                      >
                        <img
                          src="../doctor/arrow.svg"
                          alt="show-casesheet"
                          height="18"
                          width="18"
                        />
                      </IconButton>
                      {/* <EditIcon
                        onClick={() => handleUpdate(emp.id, emp.userType)}
                        style={{ color: "#00888a", cursor: "pointer" }}
                      /> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              Tap on "Add New" button to add new employee.
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={openConfirmStatus}
        // onClose={closeRefund}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="cancelAndRefund"
      >
        <DialogTitle id="alert-dialog-title">
          <span>
            Do you want to {statusName === "suspended" ? "suspend" : "activate"}{" "}
            {statusUsername} account?
          </span>
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={closeConfirmStatus}
            color="primary"
            color="primary"
            className="back cancelBtn"
          >
            cancel
          </Button>
          <Button
            // onClick={changeStatus}
            onClick={(e) => changeStatus(e)}
            color="primary"
            className="primary-button forward saveBtn"
            style={{ marginRight: "30px" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default EmployeeTable;
