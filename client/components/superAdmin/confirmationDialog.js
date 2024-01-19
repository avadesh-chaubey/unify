import React from 'react';
import {
  Link,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@material-ui/core';

export default function ConfirmationDialog(props) {
  const {
    open,
    setOpen,
    handleAction,
    selectedUser
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="warning-dialog">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="warning-dialog"
        aria-describedby="warning-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Warning 
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description">
            Are you sure you want to {selectedUser.row.userStatus !== 'active' ? 'Activate' : 'Deactivate'} {selectedUser.row.empName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="action-btn-no" variant="contained" color="secondary" onClick={handleClose}>
            NO
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleAction(e, selectedUser)}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
