import React, {useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    Typography ,
  } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import moment from "moment";
import axios from "axios";
import config from "../../app.constant";

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

const ConsultationDialog = (params) => {
  const {
    open,
    closeDialog,
    updateList,
    appointment,
    showVideoSec,
    isFullScreen
  } = params;
  const classes = useStyles();
  const [content, setContent] = useState('');
  const [cookies, setCookies] = useState('');
  const [completeWithErr, setCompleteWithErr] = useState(false);
  const [getFollowUpDate, setFollowUpDate] = useState(
    moment(new Date()).add(90, 'days').format('YYYY-MM-DD')
  );
  const headers = {
    authtoken: cookies,
    "Content-type": "application/json",
  };

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  useEffect(() => {
    // Prevent api call unless cookies is having token
    if (cookies === '') {
      return ;
    }

    // Get follow up date from case sheet api
    if (open) {
      axios
        .get(
          `${config.API_URL}/api/patient/appointmentcasesheet/${appointment.id}`,
          { headers }
        )
        .then((res) => {
          // Set follow up date from case sheet api
          const { followUpChatDays } = res.data;
          setFollowUpDate(followUpChatDays);
        })
        .catch(err => {
          // Set the default follow up date
          setFollowUpDate(
            moment(new Date()).add(90, 'days').format('YYYY-MM-DD')
          );
        });
    }
  }, [open, cookies]);

  const handleChange = (e) => {
    e.preventDefault();
    setContent(e.target.value);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    setCompleteWithErr(e.target.checked);
  }

  const handleComplete = (e) => {
    e.preventDefault();
    let header = {
      authtoken: cookies,
    };

    axios.post(
      `${config.API_URL}/api/appointment/completed`,
      {
        appointmentId: appointment.id,
        followupConsultationDate: getFollowUpDate,
        remarks: content,
        successfullyCompleted: !completeWithErr,
      },
      {
        headers: {
          ...header,
        },
      }
    )
      .then((res) => {
        if (
          res.data.appointmentStatus === "successfully:completed" ||
          res.data.appointmentStatus === "completed:with:error"
        ) {
          // Close the dialog
          updateList(res.data);
          handleCloseDialog(e);

        }
      })
      .catch((err) => console.log("err consultation", err));
  };

  const handleCloseDialog = () => {
    setContent('');
    setCompleteWithErr(false);

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
          Complete Consultation
        </DialogTitle>
        <DialogContent>
          <TextField
            id="add-notes"
            autoFocus={true}
            className={`${classes.root} consultation-field`}
            id="outlined-multiline-static"
            multiline
            rows={4}
            placeholder="Enter your remark here..."
            variant="outlined"
            value={content}
            onChange={handleChange}
            color="primary"
            InputProps={{
              classes: {
                 focused: 'consultation-field',
              }
           }}
          />
          <FormControlLabel
            style={{ color: '#d8243c' }}
            control={
              <Checkbox
                id="check-with-error"
                className="complete-with-error"
                color="secondary"
                checked={completeWithErr}
                onChange={handleCheck}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Complete with Error"
          />
        </DialogContent>
        <DialogActions style={{ paddingRight: 22}}>
          <Button
            id="complete-consultation"
            className="loginBtn primary-button complete-consult-btn"
            variant="contained"
            onClick={handleComplete}
            color="secondary"
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ConsultationDialog;