import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  Button,
  InputBase,
  Card,
  CardContent,
  TextField,
} from "@material-ui/core";
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined";
import Sidenavbar from "./Sidenavbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  textAreaForm: {
    marginLeft: "198px",
    "& div": {
      marginTop: "3px",
      width: "100%",
      // marginRight: '35px',
      "& label": {
        fontFamily: "Bahnschrift SemiBold",
      },
      "& div": {
        width: "100%",
        height: "150px",
      },
    },
  },
}));

export default function AddnewAppointments() {
  const classes = useStyles();
  const [file, setFile] = useState("");
  const [open, setOpen] = useState(false);

  const fileUploadHandler = (event) => {
    setFile([...file, URL.createObjectURL(event.target.files[0])]);
    console.log("===============>file", file);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={1}>
          <Sidenavbar />
        </Grid>
        <Grid
          item
          xs={11}
          style={{ height: "100vh", overflow: "hidden", overflowY: "scroll" }}
        >
          <Typography
            variant="h5"
            style={{ color: "#000000A1", fontFamily: "Bahnschrift SemiBold" }}
          >
            Add New Doctor
          </Typography>
          <br />
          <Grid container justify="space-around" style={{ marginLeft: "0px" }}>
            <Grid item>
              <div
                style={{
                  backgroundColor: "#D6D3D3",
                  border: "1px solid #707070",
                  borderRadius: "80px",
                  height: "130px",
                  width: "130px",
                }}
              >
                <input
                  accept="image/*"
                  id="uploadProfileImage"
                  //multiple
                  type="file"
                  hidden
                  onChange={fileUploadHandler}
                />
                <label htmlFor="uploadProfileImage">
                  <PhotoCameraOutlinedIcon
                    onClick={handleClickOpen}
                    style={{
                      margin: "40px",
                      fontSize: "50px",
                      color: "555555",
                    }}
                  />
                </label>
                <Typography style={{ marginLeft: "20px" }}>
                  Upload photo
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Frist Name*"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  label="Date of Birth*"
                  id="Date"
                  type="date"
                  placeholder=""
                  size="large"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Last Name*"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  label="Gender*"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
            </Grid>
            <Grid
              container
              className={classes.textAreaForm}
              justifyContent="space-around"
            >
              <div style={{ paddingRight: "20px" }}>
                <TextField
                  label="About"
                  placeholder="write anything about yourself"
                  id="standard-size-small"
                  size="small"
                  variant="filled"
                />
              </div>
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid container justify="space-around" style={{ marginLeft: "0px" }}>
            <Grid item>
              <div>
                <Typography style={{ marginLeft: "20px" }}>
                  Contact Details
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Phone"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Address"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  select
                  label="City"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  label="Postal / PIN Code"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Email"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Address2"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  select
                  label="State"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  select
                  label="Country"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid container justify="space-around" style={{ marginLeft: "0px" }}>
            <Grid item>
              <div>
                <Typography style={{ marginLeft: "20px" }}>
                  Other Details
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  label="Qualification"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  label="Availability"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ width: "450px", height: "55px", marginBottom: "15px" }}
              >
                <TextField
                  select
                  label="Experience"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
              <div style={{ width: "450px", height: "55px" }}>
                <TextField
                  select
                  label="Consultation Charges"
                  id="standard-size-small"
                  placeholder=""
                  size="large"
                  variant="filled"
                  fullWidth
                />
              </div>
            </Grid>
          </Grid>
          <br />
        </Grid>
      </Grid>
    </div>
  );
}
