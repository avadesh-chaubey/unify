import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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
import FormLabel from "@material-ui/core/FormLabel";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import CloseIcon from "@material-ui/icons/Close";
import config from "../../app.constant";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles((theme) => ({
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

function PatientSocioEconomy({
  setMsgData,
  removeTests,
  addTests,
  tests,
  handleTests,
  valuelab,
  handleLab,
  disableFlag,
  onTestArrowClic
}) {
  const [testdata, setTestData] = useState([]);
  const [testdataOpt, setTestDataOpt] = useState([]);
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
  //     .get(config.API_URL + "/api/utility/diagnostictest", { headers })
  //     .then((response) => {
  //       temp = response.data;
  //       setTestData(temp);
  //       const serviceTypeList = [];
  //       temp.forEach(element => {
  //         serviceTypeList.push(element.serviceType);

  //       });
  //       setTestDataOpt(serviceTypeList);
  //       // setTestsList(response.data);
  //       // setLoader(false);
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
  useEffect(() => {
    let temp = [];
      setTestDataOpt(temp);
  }, [handleTests])
  const onTestChange = (e) => {
    console.log("valuelab: ",valuelab);
    let tempVal = e.target.value;
    let temp = [];
    if (tempVal.length < 1) {
      setTestDataOpt(temp);
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
      .get(config.API_URL + "/api/utility/diagnostictest?lab="+valuelab+"&serviceType=" + e.target.value, { headers })
      .then((response) => {
        temp = response.data;
        setTestData(temp);
        const serviceTypeList = [];
        temp.forEach((element) => {
          serviceTypeList.push(element.serviceType);
        });
        setTestDataOpt(serviceTypeList);
      })
      .catch((error) => {
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });

  }
  const testclick = (e)=>{
    let temp = [];
    setTestDataOpt(temp);
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
            Test Prescription
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          {/* <div className="empTable"> */}
          <div className="elements radio-cutom" style={{ marginLeft: "5px" }}>
            <FormLabel component="legend" style={{ fontWeight: "600" }}>
              Lab
            </FormLabel>
            <RadioGroup
              row
              aria-label="position"
              className="radio-exe"
              name="position"
              value={valuelab}
              // value={tests.lab}
              className="cs-radio"
              onChange={(e) => handleLab(e.target.value)}
              style={{
                display: "inline-block",
                marginLeft: "6px",
                marginTop: "-5px",
              }}
            >
              <FormControlLabel value="ARH" control={<Radio />} label="ARH" disabled= {disableFlag}/>

              <FormControlLabel
                style={{ visibility: "hidden" }}
                value="Bio"
                control={<Radio />}
                label="Bio"
              />
              <FormControlLabel value="BIO" control={<Radio />} label="BIO" disabled= {disableFlag}/>
            </RadioGroup>
          </div>

          <TableContainer component={Paper}>
            <Table
              stickyHeader
              aria-label="simple table"
              size="small"
              className="table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date Added</TableCell>
                  <TableCell align="center">Test Name</TableCell>
                  <TableCell align="center">Cost</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              {tests.map((x, index) => {
                return (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        align="left"
                        style={{
                          textTransform: "capitalize",
                          width: "400px",
                          maxWidth: "400px",
                        }}
                      >
                        { tests.length > 1 &&
                        <div style={{display:"inline-block", width:"90px",marginTop:"10px"}}>
                          <Button 
                            onClick = {(e) => onTestArrowClic("UP",index)} 
                            className = {classes.arrowBtn}
                            disabled = {index === 0}
                          >
                            <ArrowDropUpIcon 
                              className={classes.arrow} 
                            />
                          </Button>
                          <Button  
                            onClick = {(e) => onTestArrowClic("DOWN",index)} 
                            className={classes.arrowBtn}
                            disabled = {index === (tests.length - 1)}
                          >
                            <ArrowDropDownIcon className={classes.arrow} />
                          </Button>
                        </div>
                        }
                        <TextField
                          type="date"
                          style={{ margin: 8, width: "55%" }}
                          value={x.date}
                          onChange={(e) =>
                            handleTests("date", e.target.value, index)
                          }
                          disabled= {disableFlag}

                        />
                      </TableCell>

                      <TableCell align="center" style={{ width: "600px" }}>
                        <Autocomplete
                          id={index}
                          options={testdataOpt.map((type) => type)}
                          getOptionLabel={(option) => option}
                          getOptionSelected={(option, value) =>
                            option === value
                          }
                          style={{ marginTop: "-7px", width:"90%" }}
                          onChange={(event, newValue) =>
                            handleTests("serviceType", newValue, index)
                          }
                          value={x.serviceType}
                          disabled= {disableFlag}
                          renderInput={(params) => (
                            <TextField
                             {...params} 
                             margin="normal" 
                             onChange={(e)=>onTestChange(e)} 
                             onClick={(e)=>testclick(e)}
                             disabled= {disableFlag}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center" style={{width:"100px"}}>
                        <TextField
                          disabled
                          style={{ margin: 8, width: "100%", textAlign:"center" }}
                          value={x.cost}
                          onChange={(e) =>
                            handleTests("cost", e.target.value, index)
                          }
                          className = "costInput"
                        />
                      </TableCell>
                      <TableCell align="center" style={{ display: "none" }}>
                        <TextField
                          style={{ margin: 8, width: "50%" }}
                          value={x.preCondition}
                          onChange={(e) =>
                            handleTests("preCondition", e.target.value, index)
                          }
                          disabled= {disableFlag}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ display: "none" }}>
                        <TextField
                          style={{ margin: 8, width: "50%" }}
                          value={x.reportWaitingTime}
                          onChange={(e) =>
                            handleTests(
                              "reportWaitingTime",
                              e.target.value,
                              index
                            )
                          }
                          disabled= {disableFlag}
                        />
                      </TableCell>
                      <TableCell>
                        {tests.length !== 1 && (
                          <p
                            style={{
                              // width: "125px",
                              color: disableFlag ? "#a2a2a2" : "#152a75",
                              fontWeight: 600,
                              cursor: disableFlag ? "not-allowed" : "pointer",
                            }}
                            onClick={() => removeTests(index)}
                          >
                            {/* - REMOVE */}
                            <CloseIcon />
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                    <br />
                    <div
                      style={{
                        float: "left",
                        marginLeft: "-40px",
                        // marginBottom: "20px",
                        cursor: disableFlag ? "not-allowed" : "pointer",
                      }}
                    >
                      {tests.length - 1 === index && (
                        <p
                          onClick={addTests}
                          // variant="contained"
                          style={{
                            width: "200px",
                            color: disableFlag ? "#a2a2a2" : "#152a75",
                            fontWeight: 600,
                            float: "left",
                            paddingBottom: "20px",
                          }}
                        >
                          + ADD TEST
                        </p>
                      )}
                    </div>
                  </TableBody>
                );
              })}
            </Table>
          </TableContainer>
          {/* </div> */}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default PatientSocioEconomy;
