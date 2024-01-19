import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function PdfPopOver(params) {
  const {
    file,
    openModal,
    modalFunc,
    docName,
    showVideoSec,
    fileType=''
  } = params;

  const handleClose = () => {
    modalFunc(false);
  };

  return (
  <React.Fragment>
    <div className="pdf-dialog">
      <Dialog
        fullWidth
        className={`${showVideoSec && "pdf-dialog-neil"} pdf-dialog-container video-call-end-dialog`}
        onClose={handleClose}
        aria-labelledby="pop-dialog-title"
        open={openModal}
      >
        <DialogTitle id="file-dialog-title" onClose={handleClose}>
          File Name: { docName }  
            <a href={file} target="_blank" noreferrer>
              <img
                src="../doctor/new_window_icon.svg"
                alt="fullscreen"
                height="10"
                width="14"
              />
            </a>
          
        </DialogTitle>
        <DialogContent dividers className="pdf-popup-content">
          <div className="pdf-popover-content">
            <div className={ file.fileType !== 'file' && 'preview-image-div' }>
              { !!(fileType === 'image' || fileType === 'photo') && (
                <img
                  className="center-line-preview-image pdf-popup-image"
                  src={file}
                />
              )}
              { !!(fileType === 'file') && (
                <iframe src={`${file}#zoom=50`} className="pdf-popover-iframe" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </React.Fragment>
  );
}