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

export default function WarningDialog(props) {
  const { type, open, setOpen, unitDetails, actionUrl, handleDeleteHospUnit } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAction = (e) => {
    e.preventDefault();
    handleDeleteHospUnit(e);
  };

  return (
    <div className="warning-dialog">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="warning-dialog"
        aria-aria-describedby="warning-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {type === 'edit' ? `Edit ${unitDetails?.legalName} Details` : `Delete unit ${unitDetails?.legalName}`} 
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description">
            Are you sure you want to {type === 'edit' ? 'edit details of ' : 'delete this '}
              {unitDetails?.legalName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            NO
          </Button>
          { type === 'edit'
            ? (
                <Link
                  href={actionUrl}
                  style={{ textDecoration: 'none', float: 'right' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                  >
                    YES
                  </Button>
                </Link>
              )
            : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteAction}
                >
                  YES
                </Button>
              )
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}
