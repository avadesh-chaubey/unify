import React, {useEffect, useState} from 'react';

function Vitals(props) {
  console.log("props: ",props);
  const [vitals, setVital] = useState([]);
  useEffect(() => {
    console.log("object")
    if(props.vitals.length > 0){
      setVital(props.vitals[0].vitals);
    }
  }, [props.vitals])
  return (
    <div className="caseSheetData">
      <div className="secTitle">Vitals </div>

      <div className="details"> 
        <div className="vitalName">Height</div>
        <div className="vitalValue">{vitals.heigthInCms == "" || vitals.heigthInCms == undefined ? "-": vitals.heigthInCms +" cm"}</div>
      </div>
      <div className="details"> 
        <div className="vitalName">Weight</div>
        <div className="vitalValue">{vitals.weigthInKgs == "" || vitals.heigthInCms == undefined ? "-": vitals.weigthInKgs +" kg"}</div>
      </div>
      <div className="details"> 
        <div className="vitalName">BMI</div>
        <div className="vitalValue">{vitals.bmi == "" || vitals.heigthInCms == undefined? "-": vitals.bmi}</div>
      </div>
      <div className="details"> 
        <div className="vitalName">Waist Circumference</div>
        <div className="vitalValue">{vitals.waistCircumference == "" || vitals.heigthInCms == undefined? "-": vitals.waistCircumference+" cm"}</div>
      </div>
      <div className="details"> 
        <div className="vitalName">Blood Pressure</div>
        <div className="vitalValue">{vitals.bloodPressureDiastolic == "" || vitals.heigthInCms == undefined? "-": vitals.bloodPressureDiastolic}</div>
      </div>
      <div className="details"> 
        <div className="vitalName">Pulse</div>
        <div className="vitalValue">{vitals.pulse == "" || vitals.heigthInCms == undefined? "-": vitals.pulse+" beats/min"}</div>
      </div>
    </div>
  
  )
}

export default Vitals
