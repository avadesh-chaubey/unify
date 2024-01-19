import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Typography,
  Button,
  InputBase,
  Card,
  CardContent,
  IconButton,
  Input,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import Sidenavbar from "../dashboard/Sidenavbar";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import Icon from "@material-ui/core/Icon";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import Header from "../header/header";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  MainContainer: {
    "& h5, & h6": {
      color: "#000000A1",
      fontFamily: "Bahnschrift SemiBold",
    },
  },
  SearchInputPatient: {
    border: "1px ",
    borderColor: "#979797",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "470px",
    height: "35px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },

  uploadInput: {
    border: "1px ",
    borderColor: "1px solid #979797",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "300px",
    height: "35px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },

  uploadButton: {
    border: "1px ",
    borderColor: "#979797",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "300px",
    height: "35px",
    backgroundColor: "#FFFFFF",
    justifyContent: "left",
    textTransform: "capitalize",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#555555",
      textAlign: "left",
    },
  },
  addInput: {
    border: "1px ",
    borderColor: "#979797",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "0px",
    marginRight: "80px",
    opacity: "1",
    padding: `0px ${theme.spacing(4)}px`,
    fontSize: "0.8rem",
    width: "150px",
    height: "35px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },
  searchInput: {
    border: "1px ",
    borderColor: "#979797",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
    width: "470px",
    height: "35px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },
  "&:hover": {
    backgroundColor: "#E4F4FF",
  },
  Card: {
    borderRadius: "5px",
    fontFamily: "Bahnschrift SemiBold",
    border: "none",
    boxShadow: "none",
  },
  Card2: {
    borderRadius: "5px",
    fontFamily: "Bahnschrift SemiBold",
    border: "none",
    boxShadow: "none",
    width: "150px",
    marginLeft: "30px",
  },
  typotext1: {
    color: "#20CA00",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
  },
  typotext: {
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "12px",
  },
  typotextmain: {
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "15px",
  },
  typotextplus: {
    color: "red",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "15px",
    marginTop: "-10px",
  },
  typotext2: {
    paddingTop: "0",
    color: "#EC1D3C",
    fontFamily: "Bahnschrift SemiBold",
    fontWeight: "normal",
    fontSize: "10px",
  },
  formsectionpayment: {
    minWidth: "70%",
    "& div": {
      marginTop: "3px",
      marginLeft: "10px",
      // marginRight: '35px',
      "& label": {
        fontFamily: "Bahnschrift SemiBold",
        marginLeft: "10px",
      },
      "& div": {
        width: "450px",
      },
    },
  },
  Button2: {
    border: "1px solid #979797",
    boxShadow: "none",
    width: "150px",
    borderRadius: "35px",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
    },
  },
  Button: {
    border: "1px solid #979797",
    backgroundColor: "#152A75",
    boxShadow: "none",
    width: "150px",
    borderRadius: "35px",
    marginLeft: "20px",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#FFFFFF",
    },
  },
  removelButton: {
    marginTop: "20px",
    border: "1px solid #979797",
    borderRadius: "35px",
    paddingRight: "25px",
    paddingLeft: "25px",
    paddingTop: "5px",
    paddingBottom: "5px",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "12px",
      color: "#000000",
    },
  },
  listbox: {
    width: 450,
    marginTop: "1px",
    marginLeft: "15px",
    paddingLeft: "10px",
    zIndex: 2,
    fontSize: "14px",
    position: "absolute",
    listStyle: "none",
    backgroundColor: "#FFF",
    overflow: "auto",
    maxHeight: 200,
    textTransform: "capitalize",
    '& li[data-focus="true"]': {
      backgroundColor: "#F1EFEF",
      color: "#000000",
      cursor: "pointer",
    },
    "& li:active": {
      backgroundColor: "#4a8df6",
      color: "white",
    },
    "& li": {
      padding: "10px",
      fontFamily: "Bahnschrift SemiBold",
    },
  },
}));

export default function AddnewAppointments() {
  const [selectedValue, setSelectedValue] = useState("card");
  const [file, setFile] = useState([]);
  const [open, setOpen] = useState(false);
  const [cookies, getCookie] = useCookies(["name"]);
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [prescriptionImageUrl, setPrescriptionImageUrl] = useState("");
  const [search, setSearch] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const classes = useStyles();
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "",
    options: search,
    getOptionLabel: (option) =>
      option.userFirstName +
      " " +
      option.userLastName +
      " " +
      option.phoneNumber,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const fileUploadHandler = (event) => {
    setFile([...file, URL.createObjectURL(event.target.files[0])]);
    console.log("file", file);
  };

  const deleteFileHandler = (idx) => {
    const s = file.filter((item, index) => index !== idx);
    setFile(s);
    console.log(s);
  };

  const uploadPrescriptionImages = () => {
    let imageUrl = null;
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };

    setLoader(true);
    axios
      .post(config.API_URL + "/api/utility/upload", { headers })
      .then((response) => {
        console.log("===========>response", response.data);
        imageUrl = response.data.fileName;
        setPrescriptionImageUrl(response.data.fileName);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  useEffect(() => {
    uploadPrescriptionImages();
  }, []);

  const getSearch = async () => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let obj = {
        patientName: "",
      };
      let headers = {
        authtoken: cookie,
      };
      const url = config.API_URL + "/api/patient/searchpatient";
      const response = await axios.get(url + "? =" + obj, { headers });
      const data = response.data;
      setSearch(data);
    } catch (err) {}
  };
  useEffect(() => {
    getSearch();
  }, []);

  const selectOnClick = (option) => {
    console.log("=========>", option.id);
    setPatientId(option.id);
    setPatientName(option.userFirstName + " " + option.userLastName);
    setPhone(option.phoneNumber);
  };

  return (
    <div>
      <Grid
        container
        style={{ height: "100vh", overflow: "hidden", overflowY: "scroll" }}
      >
        <Grid item xs={1}>
          <Sidenavbar />
        </Grid>
        <Grid item xs={11} className={classes.MainContainer}>
          <Header name="Add New Pharmacy Order" />
          {/* <Typography variant="h5" style={{ color: "#000000A1" }}>
            Add New Pharmacy Order
          </Typography> */}
          <br />
          <Grid container justify="space-between">
            <Grid item style={{ marginRight: "40px" }}>
              <InputBase
                placeholder="Search By Patient name and mobile"
                className={classes.SearchInputPatient}
                startAdornment={<PersonIcon fontSize="small" />}
                {...getInputProps()}
              />
              {groupedOptions.length > 0 ? (
                <ul className={classes.listbox} {...getListboxProps()}>
                  {groupedOptions.map((option, index) => {
                    return (
                      <li {...getOptionProps({ option, index })}>
                        <div onClick={() => selectOnClick(option)}>
                          {option.userFirstName + " " + option.userLastName}
                          <br />
                          {option.phoneNumber}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </Grid>
            {/* <Button variant="outlined">
                        Banjara Hills, Hyderabad
                        </Button> */}
          </Grid>
          <br />
          <Grid container justify="space-between">
            <Grid item>
              {/* <Input
                                placeholder="Upload Prescription"
                                //className={classes.uploadInput}
                                id="contained-button-file"
                                accept="image/*"
                                multiple
                                type="file"
                                hidden
                                startAdornment={<PublishOutlinedIcon fontSize="small" />}
                            /> */}
              <input
                accept="image/*, application/pdf"
                id="UploadTestReports"
                multiple
                type="file"
                hidden
                onChange={fileUploadHandler}
              />
              <label htmlFor="UploadTestReports">
                <Button
                  variant="outlined"
                  component="span"
                  onClick={handleClickOpen}
                  className={classes.uploadButton}
                  startIcon={<PublishOutlinedIcon fontSize="small" />}
                >
                  Upload Prescription
                </Button>
              </label>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Add New Diagnostic Test
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    variant="filled"
                    margin="dense"
                    id="name"
                    label="Doctor Name"
                    type="Doctor Name"
                    fullWidth
                  />
                  <TextField
                    required
                    label="Date Of Birth"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    id="standard-size-small"
                    size="small"
                    variant="filled"
                    fullWidth
                  />
                  <br />
                  <Typography
                    style={{
                      fontFamily: "Bahnschrift SemiBold",
                      textAlign: "center",
                      marginTop: "10px",
                      color: "#979797",
                    }}
                  >
                    OR
                  </Typography>
                  <input
                    accept="image/*, application/pdf"
                    id="UploadTestReports"
                    multiple
                    type="file"
                    hidden
                    onChange={fileUploadHandler}
                  />
                </DialogContent>
                <label htmlFor="UploadTestReports">
                  <div
                    style={{
                      background: "#D6D3D3",
                      border: "2px dashed rgba(0, 0, 0, 0.14)",
                      borderRadius: "5px",
                      color: "black",
                      cursor: "pointer",
                      display: "inline-block",
                      fontFamily: "Bahnschrift SemiBold",
                      fontSize: "inherit",
                      marginBottom: "1rem",
                      outline: "none",
                      padding: "1rem 20px",
                      position: "relative",
                      verticalAlign: "center",
                      width: "70%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "150px",
                      marginLeft: "70px",
                      textAlign: "center",
                    }}
                    onClick={handleClickOpen}
                  >
                    <CloudUploadIcon fontSize="large" color="primary" />
                    <Typography
                      style={{
                        marginTop: "20px",
                        fontFamily: "Bahnschrift SemiBold",
                      }}
                    >
                      {" "}
                      Upload Prescription
                    </Typography>
                  </div>
                </label>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    style={{
                      borderRadius: "30px",
                      width: "140px",
                      padding: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{
                      borderRadius: "30px",
                      width: "140px",
                      padding: "8px",
                      marginBottom: "20px",
                      marginRight: "20px",
                    }}
                  >
                    SAVE
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            {/* <Grid item style={{ marginRight: '40px', }}>
                            <InputBase
                                placeholder="Add New"
                                className={classes.addInput}
                                startAdornment={<AddOutlinedIcon fontSize="small" />}
                            />
                        </Grid> */}
            <Grid item style={{ marginRight: "40px" }}>
              <InputBase
                placeholder="Search By Medicine Name"
                className={classes.searchInput}
                startAdornment={<SearchIcon fontSize="small" />}
              />
            </Grid>
          </Grid>
          <Grid container>
            {file.length > 0 &&
              file.map((item, index) => {
                return (
                  <Grid
                    item
                    style={{
                      width: "100px",
                      height: "80px",
                      marginTop: "10px",
                      border: "2px solid #D6D3D3",
                      marginLeft: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={item}
                        alt=""
                        style={{
                          width: "96px",
                          height: "76px",
                          marginLeft: "0px",
                          borderRadius: "10px",
                          borderRadius: "10px",
                        }}
                      />
                      <CloseIcon
                        type="button"
                        onClick={() => deleteFileHandler(index)}
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                          padding: "4px",
                          marginBottom: "28px",
                          color: "#00000080",
                          position: "absolute",
                          right: "0px",
                          background: "#D6D3D3",
                          borderRadius: "20px",
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </Grid>
                );
              })}
          </Grid>
          <br />
          <Grid
            container
            style={{
              border: "1px solid #979797",
              width: "95%",
              marginLeft: "20px",
              borderRadius: "5px",
            }}
          >
            {/* <Card style={{border:'1px solid black', boxShadow:'none', width:'95%'}}>
                    <CardContent>
                    <Typography>
                    Covid Antibody IgG (Quantitative )
                    </Typography>
                    <Typography style={{color:'red',}}>
                    Prescription Required
                    </Typography>
                    </CardContent>
                    </Card> */}
            <Grid item sm={4} style={{ textAlign: "left" }}>
              <Card className={classes.Card}>
                <CardContent>
                  <Typography className={classes.typotextmain}>
                    Paracetamol
                  </Typography>
                  <Card
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginLeft: "90px",
                      marginTop: "-15px",
                      fontFamily: "Bahnschrift SemiBold",
                      fontSize: "10px",
                      color: "#979797",
                    }}
                  >
                    (15 tablets)
                  </Card>
                  <Typography className={classes.typotext}>
                    Cipla Ltd
                  </Typography>
                  <Typography className={classes.typotext2}>
                    Prescription Required
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.Card2}>
                <CardContent>
                  <Typography className={classes.typotext}>
                    Mfg: 3 March 2021{" "}
                  </Typography>
                  <Typography className={classes.typotext}>
                    Exp: 3 March 2023
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.Card2}>
                <CardContent>
                  <Typography className={classes.typotext}>
                    Rs. 21.13
                  </Typography>
                  <Typography className={classes.typotext2}>
                    MRP Rs. 30.19
                  </Typography>
                  <Typography className={classes.typotext1}>70% off</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card className={classes.Card}>
                <CardContent>
                  <IconButton>
                    <RemoveCircleOutlineIcon style={{ color: "#9E2D6B" }} />
                  </IconButton>
                  1
                  <IconButton>
                    <AddCircleIcon style={{ color: "#9E2D6B" }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Button className={classes.removelButton}>Remove</Button>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            style={{
              border: "1px solid #979797",
              width: "95%",
              marginLeft: "20px",
              borderRadius: "5px",
            }}
          >
            {/* <Card style={{border:'1px solid black', boxShadow:'none', width:'95%'}}>
                    <CardContent>
                    <Typography>
                    Covid Antibody IgG (Quantitative )
                    </Typography>
                    <Typography style={{color:'red',}}>
                    Prescription Required
                    </Typography>
                    </CardContent>
                    </Card> */}
            <Grid item sm={4} style={{ textAlign: "left" }}>
              <Card className={classes.Card}>
                <CardContent>
                  <Typography className={classes.typotextmain}>
                    Paracetamol
                  </Typography>
                  <Card
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginLeft: "90px",
                      marginTop: "-15px",
                      fontFamily: "Bahnschrift SemiBold",
                      fontSize: "10px",
                      color: "#979797",
                    }}
                  >
                    (15 tablets)
                  </Card>
                  <Typography className={classes.typotext}>
                    Cipla Ltd
                  </Typography>
                  <Typography className={classes.typotext2}>
                    Prescription Required
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.Card2}>
                <CardContent>
                  <Typography className={classes.typotext}>
                    Mfg: 3 March 2021{" "}
                  </Typography>
                  <Typography className={classes.typotext}>
                    Exp: 3 March 2023
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card className={classes.Card2}>
                <CardContent>
                  <Typography className={classes.typotext}>
                    Rs. 21.13
                  </Typography>
                  <Typography className={classes.typotext2}>
                    MRP Rs. 30.19
                  </Typography>
                  <Typography className={classes.typotext1}>70% off</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card className={classes.Card}>
                <CardContent>
                  <IconButton>
                    <RemoveCircleOutlineIcon style={{ color: "#9E2D6B" }} />
                  </IconButton>
                  1
                  <IconButton>
                    <AddCircleIcon style={{ color: "#9E2D6B" }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Button className={classes.removelButton}>Remove</Button>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            style={{
              border: "1px solid #979797",
              borderRadius: "5px",
              padding: "10px",
              width: "95%",
              marginLeft: "20px",
            }}
          >
            <Grid item>
              <Typography
                style={{
                  fontFamily: "Bahnschrift SemiBold",
                  fontSize: "15px",
                  color: "#555555",
                  marginLeft: "15px",
                }}
              >
                Choose Your Payment Details
              </Typography>
              <Typography
                style={{
                  fontFamily: "Bahnschrift SemiBold",
                  fontSize: "13px",
                  marginLeft: "15px",
                  color: "#555555",
                }}
              >
                Add the Payment details below.
                <div
                  style={{
                    marginLeft: "0px",
                    marginTop: "10px",
                    fontFamily: "Bahnschrift SemiBold",
                    fontSize: "15px",
                  }}
                >
                  <Radio
                    checked={selectedValue === "card"}
                    onChange={handleChange}
                    value="card"
                    inputProps={{ "aria-label": "Card" }}
                  />{" "}
                  Card
                  <Radio
                    checked={selectedValue === "cash"}
                    onChange={handleChange}
                    value="cash"
                    inputProps={{ "aria-label": "Cash" }}
                  />{" "}
                  Cash
                  <Radio
                    checked={selectedValue === "upi"}
                    onChange={handleChange}
                    value="upi"
                    inputProps={{ "aria-label": "UPI" }}
                  />{" "}
                  UPI
                </div>
              </Typography>
              <Grid container>
                <Grid item className={classes.formsectionpayment}>
                  <TextField
                    label="Transaction Number"
                    id="standard-size-small"
                    placeholder="999999999999"
                    size="small"
                    variant="filled"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginLeft: "700px", marginTop: "10px" }}>
            <Button className={classes.Button2}>SAVE ORDER</Button>
            <Button className={classes.Button} variant="contained">
              CREATE ORDER
            </Button>
          </Grid>
          <Grid item style={{ marginTop: "10px" }}></Grid>
        </Grid>
      </Grid>
    </div>
  );
}
