import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";

function Vitals({ handleVital, vital, disableFlag}) {
  const [height, setHeight] = useState({
    height: "",
    weight: "",
  });
  const [weight, setWeight] = useState();
  const [bmi, setBmi] = useState("");
  const [waist, setWaist] = useState("");
  const [bp, setBp] = useState("");
  const [pulse, setPulse] = useState("");
  const [temp, setTemp] = useState("");
  const [other, setOther] = useState("");
  const [bmiDate, setBmiDate] = useState("");
  // const finalState = {
  //   height: height,
  //   weight: weight,
  // };

  // const compareDate = () => {
  //   // const input = "yyyy-mm-dd"
  //   const [year, month, day] = vital.weigthInKgsDate.split("-");
  //   const [yearhe, monthhe, dayhe] = vital.heigthInCmsDate.split("-");
  //   // result = dd-mm-yyyy
  //   const we = `${day}-${month}-${year}`;
  //   // const we = 23 - 12 - 2020;
  //   // const he = 28 - 12 - 2020;
  //   const he = `${dayhe}-${monthhe}-${yearhe}`;
  //   if (he <= we) {
  //     setBmiDate(we);
  //     console.log(we, "if");
  //   } else if (we <= he) {
  //     setBmiDate(he);
  //     console.log(he, "elseif");
  //   } else {
  //     setBmiDate(we);
  //     console.log(we, "else");
  //   }
  //   // return inputDate;
  //   // if()
  // };
  // const computebmi = () => {
  //   if (vital.heigthInCms && vital.weigthInKgs) {
  //     let heighInMeter = vital.heigthInCms / 10;
  //     let heighInMeterSquare = Math.pow(heighInMeter, 2);

  //     let calbmi = Math.floor(
  //       vital.weigthInKgs / heighInMeterSquare
  //     ).toString();
  //     setBmi(calbmi);
  //   }
  // };
useEffect(() => {
  if (vital.heigthInCms !=="" && vital.weigthInKgs !=="") {
    let heighInMeter = vital.heigthInCms / 100;
    let heighInMeterSquare = Math.pow(heighInMeter, 2);
    let calbmi = (
      vital.weigthInKgs / heighInMeterSquare
    ).toFixed(2).toString();
    // let calbmi = Math.floor(
    //   vital.weigthInKgs / heighInMeterSquare
    // ).toString();
    setBmi(calbmi);
  }
  else{
    setBmi("")
  }
  if(vital.weigthInKgsDate !== "" && vital.heigthInCmsDate !== ""){
    if(vital.weigthInKgsDate > vital.heigthInCmsDate){
      setBmiDate(vital.weigthInKgsDate);
    }else{
      setBmiDate(vital.heigthInCmsDate);
    }
  }
  
}, [vital])
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
            Vitals
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ display: "flex", padding: "10px", width: "100%" }}>
              <p
                style={{
                  minWidth: "179px",
                  textAlign: "left",
                }}
              >
                Weight(Kg)
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "66px",
                  marginTop: "-7px",
                }}
              >
                <TextField
                  style={{ margin: 8, width: "100%" }}
                  value={vital.weigthInKgs}
                  onChange={(e) => {
                    let reg = new RegExp(/^(-?\d{0,3})((\.(\d{0,2})?)?)$/i).test(e.target.value);
                    if(reg){
                     handleVital("weigthInKgs", e.target.value)
                    }
                  }}
                  disabled = {disableFlag}
                />
              </div>
              &nbsp;
              <TextField
                type="date"
                value={vital.weigthInKgsDate}
                onChange={(e) => handleVital("weigthInKgsDate", e.target.value)}
                disabled = {disableFlag}
              />
            </div>

            <div style={{ display: "flex", padding: "10px", width: "100%" }}>
              <p
                style={{
                  minWidth: "179px",
                  textAlign: "left",
                }}
              >
                Height(cms)
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "65px",
                  marginTop: "-7px",
                }}
              >
                <TextField
                  style={{ margin: 8, width: "100%" }}
                  value={vital.heigthInCms}
                  onChange={(e) => {
                    let reg = new RegExp(/^(-?\d{0,3})((\.(\d{0,2})?)?)$/i).test(e.target.value);
                    if(reg){
                      handleVital("heigthInCms", e.target.value);
                    }
                    if (vital.heigthInCms && vital.weigthInKgs) {
                      // computebmi();
                      // compareDate();
                    } else {
                    }
                  }}
                  disabled = {disableFlag}
                />
              </div>
              &nbsp;
              <TextField
                type="date"
                value={vital.heigthInCmsDate}
                onChange={(e) => handleVital("heigthInCmsDate", e.target.value)}
                disabled = {disableFlag}
              />
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px",
                width: "100%",
                minWidth: "44%",
              }}
            >
              <p
                style={{
                  minWidth: "179px",
                  textAlign: "left",
                }}
              >
                BMI{" "}
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "70px",
                  marginTop: "-7px",
                }}
              >
                <TextField
                  style={{ margin: 8, width: "100%" }}
                  disabled
                  value={ bmi }
                />
              </div>
              <TextField
                type="date"
                disabled
                value={ bmiDate }
                // onChange={(e) => handleVital("bmiDate", e.target.value)}
                onChange={(e) => {
                  let reg = new RegExp(/^(-?\d{0,3})((\.(\d{0,2})?)?)$/i).test(e.target.value);
                  if(reg){
                   handleVital("bmiDate", e.target.value)
                  }
                }}
              />
            </div>

            <div style={{ display: "flex", padding: "10px", width: "100%" }}>
              <p
                style={{
                  minWidth: "135px",
                  textAlign: "left",
                  // marginRight: "10px",
                }}
              >
                Waist Circumference(cm){" "}
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "70px",
                  marginTop: "-7px",
                  marginLeft: "17px",
                }}
              >
                <TextField
                  label=""
                  style={{ margin: 8, width: "100%" }}
                  margin="normal"
                  value={vital.waistCircumference}
                  // onChange={(e) =>
                  //   handleVital("waistCircumference", e.target.value)
                  // }
                  onChange={(e) => {
                    let reg = new RegExp(/^(-?\d{0,3})((\.(\d{0,2})?)?)$/i).test(e.target.value);
                    if(reg){
                     handleVital("waistCircumference", e.target.value)
                    }
                  }}
                  disabled = {disableFlag}
                />
              </div>
              <TextField
                type="date"
                value={vital.waistCircumferenceDate}
                onChange={(e) =>
                  handleVital("waistCircumferenceDate", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>
            <div style={{ display: "flex", padding: "10px", width: "100%" }}>
              <p
                style={{
                  minWidth: "179px",
                  textAlign: "left",
                }}
              >
                Blood Pressure
                {/* <br /> */}
                (mmHg){" "}
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "70px",
                  marginTop: "-7px",
                }}
              >
                <TextField
                  // label=""
                  style={{ margin: 8, width: "100%" }}
                  margin="normal"
                  value={vital.bloodPressureDiastolic}
                  onChange={(e) =>
                    handleVital("bloodPressureDiastolic", e.target.value)
                  }
                  disabled = {disableFlag}
                />
              </div>
              <TextField
                type="date"
                value={vital.bloodPressureDiastolicDate}
                onChange={(e) =>
                  handleVital("bloodPressureDiastolicDate", e.target.value)
                }
                disabled = {disableFlag}
              />
            </div>

            <div style={{ display: "flex", padding: "10px", width: "100%" }}>
              <p
                style={{
                  minWidth: "179px",
                  textAlign: "left",
                }}
              >
                Pulse(beats/min)
              </p>
              <div
                style={{
                  width: "46%",
                  marginRight: "70px",
                  marginTop: "-7px",
                }}
              >
                <TextField
                  style={{ margin: 8, width: "100%" }}
                  margin="normal"
                  // className={"half-div"}
                  // className={"half-div " + (errMsg && fName === '' ? 'err' : '')}
                  value={vital.pulse}
                  // onChange={(e) => handleVital("pulse", e.target.value)}
                  onChange={(e) => {
                    let reg = new RegExp(/^(-?\d{0,3})((\.(\d{0,2})?)?)$/i).test(e.target.value);
                    if(reg){
                     handleVital("pulse", e.target.value)
                    }
                  }}
                  disabled = {disableFlag}
                />
              </div>
              <TextField
                type="date"
                value={vital.pulseDate}
                onChange={(e) => handleVital("pulseDate", e.target.value)}
                disabled = {disableFlag}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
export default Vitals;
