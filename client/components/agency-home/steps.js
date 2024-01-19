import React, { useState, useEffect, useContext } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Icon from "@material-ui/core/Icon";
import { loadCSS } from "fg-loadcss";
import { StepUpdateContext } from "../../context/registerStep";

function getSteps() {
  // 'Primary Contact', 'Email Verification',
  return [
    "Establishment Details",
    "Authorized Signatory",
    "Bank Account",
    "Logo and Prescription",
  ];
}

function Steps({ name, type }) {
  // console.log("name: ",name)
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const { step, newStep } = useContext(StepUpdateContext);
  // { key: 'register', num: 0 }, { key: 'verification', num: 1 },
  const allSteps = [
    { key: "companydetails", num: 0 },
    { key: "authority", num: 1 },
    { key: "bankdetails", num: 2 },
    { key: "logoprescription", num: 3 },
    { key: "finalpage", num: 4 },
  ];

  useEffect(() => {
    if (name) {
      const getNum = allSteps.findIndex((v) => v.key === name);
      setActiveStep(allSteps[getNum].num);
      newStep(allSteps[getNum].num);
    } else {
      setActiveStep(parseInt(step));
    }
  }, [step, name]);

  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <>
      <div className="logo">
        {/* <img src="logo.svg" /> */}
        <img src="/logo/unifycare_form_logo.png" width="80%" />
      </div>
      <div className="menu">
        {activeStep < 4 ? (
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            className="steps"
          >
            {steps.map((label, index) => (
              <Step
                key={label}
                className={activeStep >= index ? "active" : null}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <div className="final">
            {/* <Icon className="fa fa-check-circle"></Icon> */}
            <img src="correct.svg" />
          </div>
        )}
      </div>
    </>
  );
}

export default Steps;
