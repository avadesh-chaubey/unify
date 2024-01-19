import React, { useState, useEffect } from "react";
import {
  Dialog,
  makeStyles,
  DialogContent,
  Typography,
  DialogTitle,
  Divider,
  Button,
  IconButton,
} from "@material-ui/core";
import PhotoOutlinedIcon from "@material-ui/icons/PhotoOutlined";
import AddIcon from "@material-ui/icons/Add";
import Uploadfile from "./Uploadfile";
import FileUploadProgress from "./FileUploadProgress";
import FileUploadingProgress from "./FileUploadingProgress";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles((theme) => ({
  uploadButton: {
    border: "1px solid #707070",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "140px",
    height: "150px",
    marginTop: "10px",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "capitalize",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#555555",
      textAlign: "left",
    },
  },
  btnIcon: {
    width: "80px",
    height: "80px",
    color: "#BBBABA",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    // top: theme.spacing(1),
    color: "#565454",
  },
  uploadHeading: {
    fontFamily: "Avenir_heavy !important",
    color: "#000000",
    fontSize: "20px",
  },
  completUplo: {
    fontWeight: "bold",
    fontFamily: "Avenir_heavy !important",
  },
  uploadingText: {
    fontWeight: "bold",
    fontFamily: "Avenir_heavy !important",
  },
  photoNameUploaded: {
    marginRight: "20px",
    fontSize: "13px",
    color: "#565454",
    fontFamily: "Avenir_heavy !important",
  },
  photoNameUploading: {
    marginRight: "20px",
    fontSize: "13px",
    color: "#565454",
    fontFamily: "Avenir_heavy !important",
  },
  uploadingCloseButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(25),
    color: "#565454",
  },
}));

export default function UploadInformationform() {
  const classes = useStyles();
  const [dialogopen, setDialogOpen] = useState(false);

  const handleClickDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleClickDialogClose = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        component="span"
        onClick={handleClickDialogOpen}
        className={classes.uploadButton}
        //startIcon={<PublishOutlinedIcon fontSize="small" />}
      >
        <AddIcon className={classes.btnIcon} />
      </Button>
      <Dialog
        fullWidth
        open={dialogopen}
        // onClose={handleClickDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography className={classes.uploadHeading}>
            {" "}
            {"File Upload"}
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClickDialogClose}
        >
          <CloseIcon />
        </IconButton>
        <Divider />
        <div style={{ display: "flex" }}>
          <div>
            <DialogContent style={{ alignItems: "center" }}>
              <Uploadfile />
            </DialogContent>
          </div>
          <div
            style={{
              float: "left",
              textAlign: "left",
              width: "300px",
            }}
          >
            <div style={{ marginTop: "10px", marginBottom: "5px" }}>
              <Typography className={classes.completUplo}>Uploaded</Typography>
            </div>
            <div>
              <img
                src="photoicon.svg"
                style={{
                  width: "50px",
                  height: "50px",
                  float: "left",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              />
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <Typography className={classes.photoNameUploaded}>
                Photo.png
              </Typography>
              <Typography
                style={{
                  fontSize: "13px",
                  color: "#565454",
                }}
              >
                7.5 mb
              </Typography>
            </div>
            <FileUploadProgress />
            <Divider style={{ marginTop: "20px" }} />
            <div style={{ marginTop: "15px", marginBottom: "10px" }}>
              <Typography className={classes.uploadingText}>
                Uploading
              </Typography>
            </div>
            <div>
              <img
                src="photoicon.svg"
                style={{
                  width: "50px",
                  height: "50px",
                  float: "left",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              />
            </div>
            <div style={{ display: "flex", marginBottom: "5px" }}>
              <Typography className={classes.photoNameUploading}>
                Photo.png
              </Typography>
              <Typography
                style={{
                  fontSize: "13px",
                  color: "#565454",
                }}
              >
                7.5 mb
              </Typography>
              <IconButton
                aria-label="close"
                className={classes.uploadingCloseButton}
                onClick={handleClickDialogClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <FileUploadingProgress />
          </div>
        </div>
      </Dialog>
    </>
  );
}
