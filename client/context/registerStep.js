import React, { useState, createContext, useEffect } from 'react'

export const StepUpdateContext = createContext({
  step: 0,
  setStep: () => { }
});

const StepUpdateProvider = props => {

  const [step, setStep] = useState(0);

  const newStep = (newcity) => {
    setStep(newcity);
  }

  useEffect(() => {
    (async () => {
      if (process.browser) {
        if (localStorage.getItem('stepNumber')) {
          newStep(localStorage.getItem('stepNumber'));
        } else {
          newStep(0);
        }
      }
    })()
  }, [])

  return (
    <StepUpdateContext.Provider value={{ step, newStep }}>
      {props.children}
    </StepUpdateContext.Provider>
  );
};

export default StepUpdateProvider;