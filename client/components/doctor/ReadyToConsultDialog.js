import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogContentText,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  Typography ,
} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  changeBorderRadius: {
    borderRadius: 0,
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ReadyToConsultDialog = (params) => {
  const { open, closeDialog, updateList, appointment, setMsgData } = params;
  const [cookies, setCookies] = useState('');
  // const cookies = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  const handleReadyForConsult = (e) => {
    e.preventDefault();
    const headers = {
      authtoken: cookies,
    };Pall

    const rescheduleData = {
      appointmentId: appointment.id,
      appointmentDate: appointment.appointmentDate,
      consecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
      newAppointmentState: 'ready:for:doctor:consultation'
    };

    /*
    ---------------- Keeping this for reference ---------------------
    UpdateAppointmentSlotPending = 'update:appointment:slot:pending',
    CaseHistoryPending = 'case:history:pending',
    AwaitingTestResults = 'awaiting:test:results',
    Ready For Consult = 'ready:for:doctor:consultation ',
    AssistantNotRequired = 'assistant:not:required'
    -----------------------------------------------------------------
    */
    axios
      .post(
        `${ config.API_URL }/api/appointment/updateassistantappointment`,
        rescheduleData,
        { headers }
      )
      .then(res => {
        const patientObj = appointment;
        patientObj.appointmentStatus = res.data.appointmentStatus;

        // Update appointment status for current appointment list
        updateList(patientObj, 'ready:for:doctor:consultation');
        handleCloseDialog(e);
      })
      .catch(err => {
        setMsgData({
          message: 'Error Occurred while Updating Status. Please try again later',
          type: "error",
        });
      });
  };

  const handleCloseDialog = (e) => {
    e.preventDefault();
    closeDialog();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ paddingBottom: 0, paddingLeft: 25 }}
          onClose={handleCloseDialog}
        >
          Confirm ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              Are you sure to update the Patient's Status to 'Ready for Consult' ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-consult-btn-group">
          <Button
            id="no"
            autoFocus
            className="ready-for-consult-dialog"
            variant="contained"
            color="secondary"
            onClick={handleCloseDialog}
        >
            No
          </Button>
          <Button
            id="yes"
            autoFocus
            className="loginBtn primary-button"
            variant="contained"
            color="primary"
            onClick={handleReadyForConsult}
        >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ReadyToConsultDialog;