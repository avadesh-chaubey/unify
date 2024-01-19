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
// import PendingAppDialog from './PendingAppDialog';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import { createImageFromInitials } from "../../utils/nameDP";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
function DocList(props) {
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
  let doctorSelected = props.doctorSelected;
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

  const headers = {
    authtoken: cookies["express:sess"],
    "Content-type": "application/json",
  };

  const handleUpdate = (empId, type) => {
    // setLoader(true);

    axios
      .get(config.API_URL + `/api/partner/employee/${empId}`, {
        headers,
      })
      .then((response) => {
        // setLoader(true);
        // console.log("eachemp", response);
        localStorage.setItem("updateEmp", JSON.stringify(response.data.data));
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
    // let headers = {
    //   authtoken: cookie,
    // };
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    console.log("headers: ", headers);
    axios
      .get(config.API_URL + "/api/partner/doctors", { headers })
      .then((response) => {
        console.log("response: ", response);
        temp = response.data.data;
        temp.map((item) => {
          let dateObj = new Date(item.onboardingDate);
          let month = dateObj.toLocaleString("en-us", { month: "short" }); //months from 1-12
          let day = dateObj.getUTCDate();
          let year = dateObj.getUTCFullYear();
          // let hours = dateObj.getUTCHours();
          // let minutes = dateObj.getUTCMinutes();
          const appStartDate = moment(dateObj).format("LT");
          if (day < 10) {
            day = "0" + day;
          }
          let newdate = day + "-" + month + "-" + year;
          item.showOnboardingDate = newdate;
          // let newtime = hours + ":" + minutes;
          item.showOnboardingTime = appStartDate;
        });
        setEmpList(temp);
        setTempEmpList(temp);
        // if (props.dataDraft === false) {
        props.setDoctorSelected(temp[0]);
        // }
        // else{
        //   props.setMsgData({
        //     message: "Please Save the Data or It will be Deleted",
        //     type: "error",
        //   });
        // }
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        if (error.response.data.errors[0].message === "Not authorized") {
          router.push("/login");
        } else {
          props.setMsgData({
            message: error.response.data.errors[0].message,
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
      authtoken: cookie,
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
  const onDocterSelect = (e, doct, i) => {
    // console.log("onDocterSelect,", doct);
    // if (props.dataDraft === false) {
    props.setDoctorSelected(doct);
    // }
    // else{
    //   props.setMsgData({
    //     message: "Please Save the Data or It will be Deleted",
    //     type: "error",
    //   });
    // }
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
      {/* <hr /> */}
      <div className="empTable">
        <div className="searchField">
          <img src="../Icon_search.svg" className="searchIcon" />
          <img src="../Icon_filter.svg" className="searchIcon" />
        </div>
        {empList.length > 0 ? (
          <div className="mainView">
            <div className="doctorList doctor-list-scroll">
              {empList.map((doct, i) => (
                <Card
                  id={`doc-list-${doct.id}`}
                  className={
                    "doctorcard" +
                    (doct.id === doctorSelected.id ? " active" : "")
                  }
                  key={doct.id}
                >
                  <CardActionArea
                    onClick={(e) => onDocterSelect(e, doct, i)}
                    style={{ height: "100%" }}
                  >
                    <CardContent>
                      <div className="docImage">
                        <img
                          // src={
                          //   `${config.API_URL}/api/utility/download/` +
                          //   doct.profileImageName
                          // }
                          src={
                            doct.profileImageName &&
                            doct.profileImageName != "NA"
                              ? `${config.API_URL}/api/utility/download/` +
                                doct.profileImageName
                              : createImageFromInitials(
                                  100,
                                  `${
                                    doct.userFirstName + " " + doct.userLastName
                                  }`,
                                  "#00888a"
                                )
                          }
                        />
                      </div>
                      <div className="docDetails titleSection">
                        <div className="time">{doct.showOnboardingTime}</div>
                        <Tooltip
                          title={`${doct.userFirstName} ${doct.userLastName}`}
                          placement="right-start"
                          arrow
                        >
                          <span
                            className="docName"
                            style={{ fontWeight: "bold" }}
                          >
                            {doct.userFirstName + " " + doct.userLastName}
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={`${doct.specialization}
                        (Exp: ${doct.experinceInYears} Y)`}
                          placement="right-start"
                          arrow
                        >
                          <span className="qualifyName">
                            {doct.specialization && doct.specialization != "NA"
                              ? doct.specialization
                              : ""}{" "}
                            (Exp: {doct.experinceInYears} Y)
                          </span>
                        </Tooltip>
                        <span className="main-qualification">
                          {doct.qualificationList.map((item) => (
                            <span className="qualification">
                              {item}
                              <span>,</span>
                            </span>
                          ))}
                        </span>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>

            {/* <DoctorsDetails
              doctorSelected={doctorSelected}
              consultFeeUpdate={setConsultFeeUpdate}
              setMsgData={setMsgData}
            /> */}
          </div>
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
export default DocList;
