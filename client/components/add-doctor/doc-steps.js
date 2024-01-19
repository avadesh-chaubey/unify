import React, { useState, useEffect, useContext } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Icon from "@material-ui/core/Icon";
import { loadCSS } from "fg-loadcss";
import { StepUpdateContext } from "../../context/registerStep";

function getSteps() {
  return [
    "Basic Details",
    // "Professional Details",
    // "Availibility Slots",
    // "Consultation Fees",
    // "Bank Details",
  ];
}

function Steps({ name, type }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const { step, newStep } = useContext(StepUpdateContext);
  const allSteps = [
    { key: "basicdetails", num: 0 },
    // { key: "profDetails", num: 1 },
    // { key: "availibilitySlots", num: 2 },
    // { key: "consultFee", num: 3 },
    // { key: "bankDetails", num: 4 },
    // { key: "finalpage", num: 6 },
  ];

  useEffect(() => {
    if (name) {
      const getNum = allSteps.findIndex((v) => v.key === name);
      // setActiveStep(allSteps[getNum].num);
      // newStep(allSteps[getNum].num);
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
