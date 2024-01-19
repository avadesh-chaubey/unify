import React from "react";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import { useRouter } from "next/router";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import CloseIcon from "@material-ui/icons/Close";
import config from "../../app.constant";
import Input from "@material-ui/core/Input";
import { CenterFocusStrong, ImportantDevices } from "@material-ui/icons";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
const food = [
  "NA",
  "Before food",
  "With food",
  "After Food",
  "On empty stomach",
  "At fixed time",
  "At bed time",
  "To chew",
  "With bed coffee",
  "1/2 hr before breakfast",
  "1/2 hr before lunch",
  "1/2 hr before dinner",
  "1/2 hr before breakfast & dinner",
  "1/2 hr before lunch & dinner",
  "1/2 hr before breakfast & lunch",
  "1/2 hr before breakfast & lunch & dinner",
  "1 hr before breakfast",
  "1 hr before lunch",
  "1 hr before dinner",
  "1 hr before breakfast & dinner",
  "1 hr before lunch & dinner",
  "1 hr before breakfast & lunch",
  "1 hr before breakfast & Lunch & Dinner",
  "10 min before food",
  "15 min before food",
  "45 min before food",
  "Dinner",
  "30 min before food",
  "1 hr before food",
  "Just with food",
  "Stat",
];

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#152a75",
    color: "#fff",
    maxWidth: 220,
    padding: 15,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #fff",
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  head: {
    backgroundColor: "#eee",
    minWidth: "180px",
    borderBottom: "none",
  },
  tableContainer: {
    maxHeight: "400px",
  },
  cell: {
    minWidth: "220px",
    borderBottom: "none",
  },
  dnamecell: {
    minWidth: "290px",
    borderBottom: "none",
  },
  freqcell: {
    minWidth: "108px",
    borderBottom: "none",
  },
  daycell: {
    minWidth: "120px",
    borderBottom: "none",
  },
  arrowCell:{
    borderBottom: "none",
    minWidth: "90px",
  },
  arrow: {
    // cursor: "pointer",
    fontSize: "30px",
    // border: "1px solid #3f51b5",
    // marginRight: "10px",
    // color: "#3f51b5"
  },
  arrowBtn: {
    border: "1px solid #3f51b5",
    width: "34px",
    padding: "0",
    minWidth: "10px",
    marginRight: "10px",
    color: "#3f51b5",
    "&:disabled":{
      border: "1px solid gray",
    },
    "&:hover": {
      background:"#dadada"
    }
  }
}));

const StickyTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#fff",
    color: theme.palette.common.white,
    left: 0,
    position: "sticky",
    zIndex: theme.zIndex.appBar + 2,
    borderBottom: "none",
  },
  body: {
    backgroundColor: "#C0C0C0",
    minWidth: "100px",
    left: 0,
    position: "sticky",
    zIndex: theme.zIndex.appBar + 1,
    borderBottom: "none",
  },
}))(TableCell);

const StickyRightTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#fff",
    color: theme.palette.common.white,
    right: 0,
    position: "sticky",
    zIndex: theme.zIndex.appBar + 2,
    borderBottom: "none",
  },
  body: {
    backgroundColor: "#fff",
    minWidth: "50px",
    right: 0,
    position: "sticky",
    zIndex: theme.zIndex.appBar + 1,
    borderBottom: "none",
  },
}))(TableCell);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#fff",
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
    textAlign: "center",
    padding: "0px 0px 0px 0px !important",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function MedicalPrescription({
  hanldeMedicines,
  medicines,
  addMedicines,
  removeMedicines,
  setMsgData,
  disableFlag,
  onArrowClic
}) {
  const [medicinedata, setMedicineData] = useState([]);
  const [medicinedataOpt, setMedicineDataOpt] = useState([]);
  const [cookies, getCookie] = useCookies(["name"]);

  const classes = useStyles();

  // function getMedData() {
  //   let temp = [];
  //   let cookie = "";
  //   for (const [key, value] of Object.entries(cookies)) {
  //     if (key === "express:sess") {
  //       cookie = value;
  //     }
  //   }
  //   let headers = {
  //     authtoken: cookie,
  //   };
  //   // setLoader(true);
  //   axios
  //     .get(config.API_URL + "/api/utility/medicine", { headers })
  //     .then((response) => {
  //       console.log("resmedi- ", response.data);
  //       temp = response.data;
  //       setMedicineData(temp);
  //       const medicineNameList = [];
  //       temp.forEach((element) => {
  //         medicineNameList.push(element.medicineName);
  //       });
  //       setMedicineDataOpt(medicineNameList);
  //     })
  //     .catch((error) => {
  //       // setLoader(false);
  //       console.log(error);
  //       // alert.show(error.response.data.errors[0].message, { type: "error" });
  //       setMsgData({
  //         message: error.response.data.errors[0].message,
  //         type: "error",
  //       });
  //     });
  // }
  // useEffect(() => {
  //   getMedData();
  // }, [setMsgData.updatelist]);

  const onMedicineChange = (e) => {
    let tempVal = e.target.value;
    let temp = [];
    if (tempVal.length === 0) {
      setMedicineDataOpt(temp);
      return false;
    }
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: cookie,
    };
    // setLoader(true);
    axios
      .get(config.API_URL + "/api/utility/medicine?medicineName=" + tempVal, {
        headers,
      })
      .then((response) => {
        console.log("response: ", response);
        temp = response.data;
        setMedicineData(temp);
        const medicineNameList = [];
        temp.forEach((element) => {
          medicineNameList.push(element.medicineName);
        });
        setMedicineDataOpt(medicineNameList);
      })
      .catch((error) => {
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  };
  // useEffect(() => {
  //   getMedData();
  // }, [setMsgData.updatelist]);

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/\d/, "-", /\d/, "-", /\d/]}
        // placeholderChar={"\u2000"}
        showMask
      />
    );
  }

  function oddOrEven(x) {
    return x & 1 ? "odd" : "even";
  }
  return (
    <>
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            Medicine Prescription
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block", padding: "15px" }}>
          <TableContainer component={Paper}>
            <Table
              stickyHeader
              aria-label="simple table"
              size="small"
              className="table"
            >
              <TableHead>
                <TableRow>
                  <StickyTableCell className={classes.head}>
                  <StyledTableCell
                      className={classes.head}
                      numeric
                      align="center"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.head}
                      numeric
                      align="left"
                    >
                      Drug Name
                    </StyledTableCell>
                  </StickyTableCell>
                  <StyledTableCell
                    style={{ minWidth: "50px" }}
                    className={classes.head}
                    numeric
                    align="center"
                  >
                    Frequency
                    <br />
                    M-A-N
                  </StyledTableCell>
                  <StyledTableCell
                    className={classes.head}
                    numeric
                    align="center"
                  >
                    Food
                  </StyledTableCell>
                  <StyledTableCell
                    className={classes.head}
                    numeric
                    align="center"
                  >
                    Remarks
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ minWidth: "120px" }}
                    className={classes.head}
                    numeric
                    align="center"
                  >
                    Days
                  </StyledTableCell>
                  <StyledTableCell />
                  {/* <StickyRightTableCell> */}
                  {/* <StyledTableCell className={classes.head} /> */}
                  {/* </StickyRightTableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {medicines.map((x, index) => {
                  return (
                    <>
                      <>
                        <StyledTableRow key={index}>
                          <StickyTableCell
                            style={{
                              background:
                                oddOrEven(index) === "even"
                                  ? "#E8E8E8"
                                  : "#fff",
                            }}
                          > 
                          {medicines.length > 1 &&
                            <StyledTableCell numeric className={classes.arrowCell}>
                                  {/* index != 0 &&  */}
                                  <Button 
                                    onClick = {(e) => onArrowClic("UP",index)} 
                                    className = {classes.arrowBtn}
                                    disabled = {index === 0}
                                  >
                                    <ArrowDropUpIcon 
                                      className={classes.arrow} 
                                    />
                                  </Button>
                                  {/* {index != (medicines.length - 1) &&  */}
                                  <Button  
                                    onClick = {(e) => onArrowClic("DOWN",index)} 
                                    className={classes.arrowBtn}
                                    disabled = {index === (medicines.length - 1)}
                                  >
                                    <ArrowDropDownIcon className={classes.arrow} />
                                  </Button>
                            </StyledTableCell>
                          }  
                            <StyledTableCell
                              style={{ minWidth: "320px" }}
                              numeric
                              align="right"
                              className={classes.dnamecell}
                            >
                              <Autocomplete
                                id={index}
                                value={x.nameOfTheDrug}
                                options={medicinedataOpt.map((type) => type)}
                                getOptionLabel={(option) => option}
                                getOptionSelected={(option, value) =>
                                  option === value
                                }
                                disabled = {disableFlag}
                                onChange={(event, newValue) =>
                                  hanldeMedicines(
                                    "nameOfTheDrug",
                                    newValue,
                                    index
                                  )
                                }
                                style={{ marginTop: "-7px" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    margin="normal"
                                    onChange={(e) => onMedicineChange(e)}
                                    disabled = {disableFlag}
                                    // value={x.nameOfTheDrug}
                                  />
                                )}
                              />
                            </StyledTableCell>
                          </StickyTableCell>
                          <StyledTableCell numeric className={classes.freqcell}>
                            <HtmlTooltip
                              enterDelay={100}
                              leaveDelay={0}
                              title={
                                <React.Fragment>
                                  <Typography color="inherit">
                                    Hint to fill Frequency
                                  </Typography>
                                  <u>1-0-1</u>
                                  <em>
                                    like for Morning-Afternoon-Night(M-A-N)
                                  </em>
                                </React.Fragment>
                              }
                            >
                              {/* <Input
                                value={x.intakeFrequency}
                                onChange={(e) =>
                                  hanldeMedicines(
                                    "intakeFrequency",
                                    e.target.value,
                                    index
                                  )
                                }
                                name="textmask"
                                style={{ width: "36%" }}
                                id="formatted-text-mask-input"
                                inputComponent={TextMaskCustom}
                              /> */}
                              <TextField
                                style={{ width: "36%" }}
                                value={x.intakeFrequency}
                                onChange={(e) =>
                                  hanldeMedicines(
                                    "intakeFrequency",
                                    e.target.value,
                                    index
                                  )
                                }
                                disabled = {disableFlag}
                              />
                            </HtmlTooltip>
                          </StyledTableCell>
                          <StyledTableCell
                            numeric
                            align="center"
                            className={classes.cell}
                          >
                            <TextField
                              select
                              style={{ width: "100%", paddingRight: "17px" }}
                              value={x.food}
                              onChange={(e) =>
                                hanldeMedicines("food", e.target.value, index)
                              }
                              disabled = {disableFlag}
                            >
                              {food.map((name) => (
                                <MenuItem key={name} value={name}>
                                  {name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </StyledTableCell>
                          <StyledTableCell
                            numeric
                            align="center"
                            className={classes.dnamecell}
                          >
                            <TextField
                              style={{ width: "100%", paddingLeft: "17px" }}
                              value={x.otherNotes}
                              onChange={(e) =>
                                hanldeMedicines(
                                  "otherNotes",
                                  e.target.value,
                                  index
                                )
                              }
                              disabled = {disableFlag}
                            />
                          </StyledTableCell>

                          <StyledTableCell
                            numeric
                            align="center"
                            className={classes.daycell}
                          >
                            <HtmlTooltip
                              enterDelay={100}
                              leaveDelay={0}
                              title={
                                <React.Fragment>
                                  <Typography color="inherit">
                                    Hint to fill Days
                                  </Typography>
                                  <em>You can type only numbers.</em>
                                </React.Fragment>
                              }
                            >
                              <TextField
                                style={{ width: "40%" }}
                                type="number"
                                value={x.durationInDays}
                                onChange={(e) =>
                                  hanldeMedicines(
                                    "durationInDays",
                                    e.target.value,
                                    index
                                  )
                                }
                                disabled = {disableFlag}
                              />
                            </HtmlTooltip>
                          </StyledTableCell>

                          {/* <StyledTableCell
                            numeric
                            align="center"
                            className={classes.daycell}
                          >
                            <TextField
                              style={{
                                margin: 8,
                                width: "20%",
                                display: "none",
                              }}
                              value={x.MRP}
                              // onChange={(e) => hanldeMedicines("MRP")}
                            />
                          </StyledTableCell>   */}
                          {/* <StickyRightTableCell> */}
                          <StyledTableCell
                            numeric
                            align="center"
                            className={classes.daycell}
                          >
                            {medicines.length !== 1 && (
                              <p
                                style={{
                                  width: "20%",
                                  color: disableFlag ? "#a2a2a2" : "#152a75",
                                  fontWeight: 600,
                                  cursor: disableFlag ? "not-allowed" : "pointer",
                                  margin: "auto",
                                }}
                                onClick={() => removeMedicines(index)}
                              >
                                <CloseIcon />
                              </p>
                            )}
                          </StyledTableCell>
                          {/* </StickyRightTableCell> */}
                        </StyledTableRow>
                      </>
                      <div
                        style={{
                          float: "left",
                          marginTop: "10px",
                          cursor: disableFlag ? "not-allowed" : "pointer",
                          position: "sticky",
                          left: 0,
                        }}
                      >
                        {medicines.length - 1 === index && (
                          <p
                            onClick={addMedicines}
                            // variant="contained"
                            style={{
                              width: "200px",
                              color:disableFlag ? "#a2a2a2" :  "#152a75",
                              fontWeight: 600,
                              float: "left",
                              paddingBottom: "20px",
                            }}
                          >
                            + ADD MEDICINE
                          </p>
                        )}
                      </div>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* </div> */}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default MedicalPrescription;
