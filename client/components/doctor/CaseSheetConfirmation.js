import React from 'react';
import axios from 'axios';
import config from '../../app.constant';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * Purpose of this modal to update case sheet when
 * consultation is completed and it is only used my doctor / PA
 * @param props 
 */
export default function CaseSheetConfirmation (props) {
  const {
    setLoader,
    handleClose,
    open,
    updateObj,
    headers,
    appointmentObj,
    setMsgData
  } = props;

  const updateCaseSheet = (e) => {

    const url = config.API_URL + "/api/patient/updatepatientcasesheet";
    setLoader(true);

    axios
      .post(url, updateObj, { headers })
      .then((response) => {
        setLoader(true);
        console.log("up-response: ", response);
        
        setLoader(false);
        setMsgData({
          message: `Case Sheet Saved for ${appointmentObj.customerName}`,
          type: "success",
        });
        handleClose(e);
      })
      .catch((error) => {
        setLoader(false);
        handleClose(e);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  return (
    <div>
      {/* <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this Case Sheet ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateCaseSheet} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
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
          <span>Update Prescription PDF</span>
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
          <DialogContentText style={{color:"#000"}}>
            Do you want to send an updated prescription PDF to the patient?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ margin: "5px", marginBottom: "15px" }}
        >
          <Button
            onClick={handleClose}
            color="primary"
            className="back cancelBtn"
          >
            no
          </Button>
          <Button
            onClick={updateCaseSheet}
            color="#fff"
            className="primary-button forward saveBtn"
            style={{ marginRight: "18px" }}
          >
            yes
          </Button>
        </DialogActions>
      </Dialog>
    
    </div>
  );
}