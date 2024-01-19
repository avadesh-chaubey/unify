import React, {useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
  } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import moment from "moment";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import AssistantTableView from './AssistantTableView';

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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#fff",
    width: '34.5rem',
    "&.Mui-focused fieldset": {
      borderColor: "unset",
      // borderWidth: "2px"
    }
  }
}))

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

const AssistantListDialog = (params) => {
  const {
    open,
    closeDialog,
    updateList,
    appointment,
    showVideoSec,
    isFullScreen,
    setMsgData,
    userDetails
  } = params;
  const classes = useStyles();
  const [cookies] = useCookies(["name"]);
  const [assistantList, setAssistantList] = useState([]);
  const [newAssistantId, setNewAssistantId] = useState(0);

  const headers = {
    authtoken: cookies["express:sess"],
    "Content-type": "application/json",
  };

  useEffect(() => {
    // Get follow up date from case sheet api
    if (open) {
      axios
        .get(
          `${config.API_URL}/api/partner/assistants`,
          { headers }
        )
        .then((res) => {
          // Filter the assistants from the response
          let empList = res.data;
          empList = empList.filter(d => d.emailId !== userDetails.emailId);
          setAssistantList(empList);
        })
        .catch(err => {
          // Set the default follow up date
          setMsgData({
            message: 'Error occurred while getting assistant list',
            type: 'error'
          });
        });
    }
  }, [open]);

  const handleComplete = (e) => {
    e.preventDefault();

    const dataParam = {
      appointmentId: appointment.id,
      newAssistantId: newAssistantId[0]
    };

    // Assisgn for the current appointment
    const transferAssist = axios.post(
      `${config.API_URL}/api/appointment/transfertonewassistant`,
      dataParam,
      { headers }
    );

    transferAssist
      .then(res => {
        console.log('transfer res', res.data);
        window.location.reload();
      })
      .catch(err => {
        setMsgData({
          message: "Error occurred while transferring to new assistant",
          type: "error",
        });
      })
  };

  const handleCloseDialog = () => {
    closeDialog();
  };

  useEffect(() => {
    // Close the Dialog on fullscreen
    if (isFullScreen) {
      handleCloseDialog();
    }
  }, [isFullScreen])

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        className={`${showVideoSec && "pdf-dialog-neil"} video-call-end-dialog`}
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ paddingBottom: 0, paddingLeft: 25 }}
          onClose={handleCloseDialog}
        >
          Select the New Assistant
        </DialogTitle>
        <DialogContent>
          <AssistantTableView list={ assistantList } setNewAssistantId={setNewAssistantId} />
        </DialogContent>
        <DialogActions style={{ paddingRight: 22, marginTop: 12 }}>
          <Button
            id="cancel"
            className="loginBtn complete-consult-btn default-assistant-dialog-btn"
            variant="contained"
            onClick={handleCloseDialog}
            color="default"
          >
            Cancel
          </Button>
          <Button
            id="assign-to-new-assistant"
            className="loginBtn primary-button complete-consult-btn"
            variant="contained"
            onClick={handleComplete}
            color="secondary"
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AssistantListDialog;