import React from 'react';
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

const DeleteMedicineDialog = (params) => {
  const { open, closeDialog, id, setMessage,setCharValue } = params;
  const [cookies] = useCookies(["name"]);

  const removeMedicine = (e) => {
    e.preventDefault();
    const headers = {
      authtoken: cookies['express:sess'],
    };

    axios.get(`${config.API_URL}/api/utility/deletemedicine/${id}`, { headers })
      .then(res => {
        // resetMedList([]);
        setCharValue("")
        closeDialog();
        setMessage({
          message: "Deleted Medicine Successfully"
        });
        console.log('Delete medicine successfully');
      })
      .catch(err => setMessage({
        message: "Error occurred while deleting medicine",
        type: 'error'
      }));
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
              Are you sure to delete this medicine ?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-consult-btn-group">
          <Button
            autoFocus
            className="ready-for-consult-dialog"
            variant="contained"
            color="secondary"
            onClick={closeDialog}
          >
            No
          </Button>
          <Button
            autoFocus
            className="loginBtn primary-button"
            variant="contained"
            color="primary"
            onClick={removeMedicine}
        >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DeleteMedicineDialog;