import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import AppointmentTableView from './AppointmentTableView';

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

const PendingAppDialog = (params) => {
  const {
    open,
    closeDialog,
    list,
    selectedEmp
  } = params;

  const handleCloseDialog = () => {
    closeDialog();
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="pending-app-dialog"
        className="video-call-end-dialog"
      >
        <DialogTitle
          id="patient-dialog-title"
          onClose={handleCloseDialog}
        >
          Please complete all the pending appointments before suspending account
        </DialogTitle>
        <DialogContent>
          <AppointmentTableView list={ list } selectedEmp={selectedEmp} />
        </DialogContent>
        <DialogActions style={{ paddingRight: 22, marginTop: 12 }}>
          <Button
            id="cancel"
            className="loginBtn complete-consult-btn default-assistant-dialog-btn"
            variant="contained"
            onClick={handleCloseDialog}
            color="default"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default PendingAppDialog;