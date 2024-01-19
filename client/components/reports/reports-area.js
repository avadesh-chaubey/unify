import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

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

function ReportArea(props) {
  const alert = useAlert();
  const classes = useStyles();
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [testReport, setTestReport] = useState("");
  const [testReportFileName, setTestReportFileName] = useState("");
  const [corporateIdUrl, setCorporateIdUrl] = useState("");
  const currentlyEditting = useState();

  const submitReports = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (testReport === "") {
      setErrMsg(true);
      // alert.show("All fields are required", { type: "error" });
      props.setMsgData({
        message: "All fields are required",
        type: "error",
      });
      return false;
    }

    let documentarr = [];

    if (testReport !== "") {
      documentarr.push({
        name: "Corporate ID",
        id: "corporateId",
        key: testReport,
        filename: testReportFileName,
      });
    }

    console.log(documentarr);
    setLoader(true);
    if (documentarr.length > 0) {
      // uploadImages();
    } else {
      finalsave(corporateIdUrl);
    }
  };

  const testReportFile = (e) => {
    e.preventDefault();
    let newVal = e.target.value.replace(/^.*[\\\/]/, "");
    setTestReport(newVal);

    let file = document.getElementById("testreportId").files[0];
    let timestamp = new Date().getTime();
    // let fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    let filename = "";
    // filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;
    setTestReportFileName(filename);
  };

  const deleteTestReport = (e) => {
    e.preventDefault();
    setTestReport("");
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
      <div
        style={{
          textAlign: "center",
          marginTop: "10%",
          lineHeight: "1.5",
          wordSpacing: "1px",
        }}
        className="noData"
      >
        <div>
          <div style={{ width: "43%", float: "left", marginTop: "-106px" }}>
            <div className="full-div">
              <TextField
                id="standard-search"
                label="Enter Name / Phone Number / ARH ID to search "
                type="search"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                style={{ width: "96%" }}
              />
            </div>
            <br />
            <div
              className="doctorList doctorcard"
              style={{ width: "96%", marginLeft: "11px" }}
            >
              {/* {doctors.map((doct, i) => ( */}
              <Card
                style={{ border: "1px solid #DEDEDE" }}
                //   className={
                //     "doctorcard" +
                //     (doct.id === doctorSelected.id ? " active" : "")
                //   }
                //   key={doct.id}
              >
                <CardActionArea
                  onClick={(e) => onDocterSelect(e, doct, i)}
                  style={{ height: "100%" }}
                >
                  <CardContent>
                    <div className="patientTestReportCard">
                      <img src="user.png" />
                    </div>
                    <div className="patientReportDetails">
                      <span style={{ fontSize: "16px" }}>
                        <strong>KSBK TEJA</strong>
                        &nbsp;&nbsp;&nbsp;35 M
                      </span>
                      <span>+91-9971193277</span>
                      <span style={{ display: "inline-flex" }}>
                        ARH7482374827
                      </span>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
              {/* ))} */}
            </div>
          </div>

          <form
            className="form-input"
            autoComplete="off"
            onSubmit={submitReports}
          >
            <div className="upload-reports">
              <input
                required
                type="file"
                className="choose"
                id="testreportId"
                onChange={testReportFile}
              />
              <label
                htmlFor="testreportId"
                className={
                  "dragContentReports" +
                  (errMsg && testReport === "" ? "err" : "")
                }
              >
                <img src="upload.svg" />
                {testReport === "" ? (
                  <span>
                    <p>Drag and drop to upload Test Reports</p>
                    <p style={{ fontSize: "10px" }}>
                      Each test report should have separate test pdf file.
                    </p>
                    <p style={{ fontSize: "10px" }}>
                      Test Report File Name should be combination of Patient ID
                      and Test ID.
                    </p>
                  </span>
                ) : (
                  <div className="change-reports-file">
                    Test Reports
                    <p>Please upload only pdf file</p>
                    <p>{testReport}</p>
                    <p style={{ visibility: "hidden" }}>
                      Test Report File Name should be combination of Patient ID
                      and Test ID.
                    </p>
                    <div
                      className="delete-reports-opt"
                      onClick={deleteTestReport}
                    >
                      <Grid item xs={8}>
                        <DeleteOutlinedIcon />
                      </Grid>
                    </div>
                  </div>
                )}
              </label>
            </div>
            <div className="action ">
              <Button
                size="small"
                variant="contained"
                //   color="secondary"
                className="primary-button forward"
                type="submit"
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "6px 28px",
                  marginRight: "-32px",
                }}
              >
                UPLOAD
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default ReportArea;
