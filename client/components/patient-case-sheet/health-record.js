import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/EditOutlined";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PdfPopOver from '../doctor/PdfPopOver';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 650,
    maxWidth: 700,
    float: "left",
  },
}));

function HealthRecord({
  reports,
  myreports,
  reportChange,
  uploads,
  FileName,
  deleteFile,
  value,
  disableFlag,
  csid,
  setMsgData,
  isFullScreen,
  showVideoSec
}) {
  const classes = useStyles();
  const [cookies, getCookie] = useCookies(["name"]);
  const [reportvalue, setReportvalue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = useState("");
  const [tempIndex, setTempIndex] = useState("");
  const [tempArr,setTempArr] = useState([]);
  const [fileLink, setFileLink] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleClickOpen = (value, index) => {
    // value = value.substring(0,value.length - 4)
    setFileName(value)
    setOpen(true);
    setTempIndex(index);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if(reports.length > 0){
      setTempArr(reports);
    }
  }, [reports])
  const handleClickUpdate = () =>{
    if(fileName === ""){
      setMsgData({
        message: "Please enter document name",
        type: "error",
      });
      // setOpen(false);
      return false;
    }
    tempArr[tempIndex].documentName = fileName;
   
    let url = config.API_URL + "/api/patient/updatehealthrecordincasesheet";
      let obj ={
        id: csid,
        healthRecords: {patientReports: tempArr}
      }
      console.log("obj: ",obj);
      // return false;
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
    axios
      .post(url, obj, { headers })
      .then((response) => {
        console.log("add-response: ", response);
        setOpen(false);
        setMsgData({
          message: "Test report renamed successfully",
          type: "success",
        });
        console.log("Test report renamed successfully");
      })
      .catch((error) => {
        console.log("error: ",error);
        // setLoader(false);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  const openPopUp = (report) => {
    setFileLink(report.documentURL);
    setFileTitle(report.documentName);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (isFullScreen) {
      // Close the dialog when call screen is full screen
      handleCloseDialog();
    }
  }, [isFullScreen]);

  return (
    <>
      <PdfPopOver
        file={fileLink}
        openModal={openDialog}
        modalFunc={handleCloseDialog}
        docName={fileTitle}
        showVideoSec={showVideoSec}
        fileType="file"
      />
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            Test Reports
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div className="cs-patientDocs" style={{ paddingBottom: "15px" }}>
            {reports.map((report, index) => (
              <div style={{position:"relative"}}>
                <Link href="#" onClick={() => openPopUp(report)}>
                  <div className="cs-report">
                    <img src="pdf_icon.svg" height="90" />
                    <br />

                    <Tooltip title={report.documentName}>
                      <p>{report.documentName}</p>
                    </Tooltip>
                    
                  </div>
                </Link>
                {csid != "" && <EditIcon
                  onClick={() => handleClickOpen(report.documentName, index)}
                  style={{ color: "#00888a", cursor: "pointer", marginRight: "10px", position:"absolute", bottom:"40px", right:"10px" }}
                />}
              </div>
            ))}
          </div>
          <br />
          <div>
            <div>
              <label
                for="file-upload"
                style={{
                  float: "left",
                  color: disableFlag ? "#a2a2a2" : "#152a75",
                  fontWeight: 600,
                  cursor: disableFlag ? "not-allowed" : "pointer",
                  marginBottom: "20px",
                }}
              >
                + ADD TEST REPORTS
              </label>
            </div>
            <input
              type="file"
              className="choose"
              id="file-upload"
              accept=".pdf"
              // multiple
              onChange={reportChange}
              style={{ display: "none" }}
              disabled = {disableFlag}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      {/* <Dialog open={open} aria-labelledby="form-dialog-title" >
        <DialogContent style={{width:"400px"}}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            // label="Email Address"
            type="email"
            fullWidth
            value = {fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>handleClickUpdate(fileName)} color="primary">
            Update
          </Button>
        </DialogActions>
        <DialogActions
          style={{ margin: "5px", marginBottom: "15px" }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            className="back cancelBtn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClickUpdate}
            color="#fff"
            className="primary-button forward saveBtn"
            style={{ marginRight: "18px", color:"#fff" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog> */}


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="arhDialog video-call-end-dialog"
      >
        <DialogTitle
          id="form-dialog-title"
          style={{ marginTop: "10px", marginLeft: "-5px" }}
        >
          <span>Rename Test Report</span>
          <img
            style={{
              height: "20px",
              cursor: "pointer",
              float: "right",
              marginTop: "8px",
              marginRight: "1px",
            }}
            src="crossIcon.png"
            onClick={handleClose}
          />
        </DialogTitle>
        <DialogContent>
          {/* {loader && (
            <div className="loader">
              <CircularProgress color="secondary" />
              <div className="text"></div>
            </div>
          )} */}
          <div className="full-div arh-dialog">
            <TextField
              autoFocus
              required
              // label="ARH Id"
              style={{
                width: "100%",
                marginLeft: "-6px",
              }}
              margin="normal"
              variant="filled"
              value = {fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions
          style={{ margin: "5px", marginBottom: "15px" }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            className="back cancelBtn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClickUpdate}
            color="#fff"
            className="primary-button forward saveBtn"
            style={{ marginRight: "18px" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    
    </>

  );
}

export default HealthRecord;
