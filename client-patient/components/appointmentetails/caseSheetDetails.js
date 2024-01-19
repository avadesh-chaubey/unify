import React,{useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import router from 'next/router';
import moment from 'moment';
import time from "../../data/timeRoster.json";
import Button from "@material-ui/core/Button";

function CaseSheetDetails(props) {
  let appointmentData = props.appointmentData;
  let caseSheetData = props.caseSheetData;
  const timeData = time;

  
  return (
    <>
      <div className="orderTitle">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute", top:"17px", left:"10px"}} onClick={(e)=>props.backBtnClick("1")}/>
          <div style={{marginLeft: "40px"}}>
            {appointmentData.customerName}'s Case Sheet
          </div>
        </div>

        <div>
          {/* Patients details */}
          <div className="details"> 
              <div className="patientDetails">
                <div className="title">
                  Patient Details
                </div>
                <div className="name">
                  {appointmentData.customerFirstName + " " +appointmentData.customerLastName}
                </div>
                <div>
                  {appointmentData.customerDateOfBirth}, {appointmentData.customerGender}
                </div>
                <div>
                  ARH ID: {appointmentData.patientARHId}
                </div>
              </div>
              <div className="docDetails">
                <div className="title">
                  Doctor Details
                </div>
                <div className="name">
                  {appointmentData.consultantName}
                </div>
                <div>
                  {appointmentData.consultantQualification}
                </div>
              </div>
              <div className="apptDetails">
                <div className="title">
                  Appointment Details
                </div>
                <div className="name">
                  {moment(appointmentData.appointmentDate).format('DD-MMM-YYYY')}
                </div>
                <div>
                {timeData.map((data)=>{
                  if(appointmentData.appointmentSlotId === data.value){
                    return data.label
                    }
                  })
                }
                </div>
              </div>
            </div>
          
          {/* vitals */}
          <div className="caseSheetData">
            <div className="secTitle">Vitals </div>

            <div className="details"> 
              <div className="vitalName">Height</div>
              <div className="vitalValue">{caseSheetData.vitals.heigthInCms == "" ? "-": caseSheetData.vitals.heigthInCms +" cm"}</div>
            </div>
            <div className="details"> 
              <div className="vitalName">Weight</div>
              <div className="vitalValue">{caseSheetData.vitals.weigthInKgs == "" ? "-": caseSheetData.vitals.weigthInKgs +" kg"}</div>
            </div>
            <div className="details"> 
              <div className="vitalName">BMI</div>
              <div className="vitalValue">{caseSheetData.vitals.bmi == ""? "-": caseSheetData.vitals.bmi}</div>
            </div>
            <div className="details"> 
              <div className="vitalName">Waist Circumference</div>
              <div className="vitalValue">{caseSheetData.vitals.waistCircumference == ""? "-": caseSheetData.vitals.waistCircumference+" cm"}</div>
            </div>
            <div className="details"> 
              <div className="vitalName">Blood Pressure</div>
              <div className="vitalValue">{caseSheetData.vitals.bloodPressureDiastolic == ""? "-": caseSheetData.vitals.bloodPressureDiastolic}</div>
            </div>
            <div className="details"> 
              <div className="vitalName">Pulse</div>
              <div className="vitalValue">{caseSheetData.vitals.pulse == ""? "-": caseSheetData.vitals.pulse+" beats/min"}</div>
            </div>
          </div>
        
          {/* Chief Complaint */}
          
          <div className="caseSheetData">
            <div className="secTitle">Chief Complaint</div>

            {caseSheetData.chiefComplaints.length >0 && caseSheetData.chiefComplaints[0].symptoms !="" ?  caseSheetData.chiefComplaints.map((item)=>(
              <div key={item.id}>
                <div className="details">
                  {item.severity} {item.symptoms} since {item.since} {item.sinceUnit}
                </div>
              </div>
            )) :
              <div>
                <div className="details">
                  No Complaint
                </div>
              </div>
            }
            
          </div>
          
          {/* Diagnosis */}
          <div className="caseSheetData">
            <div className="secTitle">Diagnosis</div>

            {caseSheetData.diagnosis.length >0 && caseSheetData.diagnosis[0] != "" ?  caseSheetData.diagnosis.map((item)=>(
              <div key={item.id}>
                <div className="details">
                  {item}
                </div>
              </div>
            )) :
              <div>
                <div className="details">
                  No Diagnosis
                </div>
              </div>
            }
          </div>
            
          {/* Advice Instruction */}
          <div className="caseSheetData">
            <div className="secTitle">Advice/Instruction</div>

            {caseSheetData.adviceInstruction.length >0 && caseSheetData.adviceInstruction[0] != "" ?  caseSheetData.adviceInstruction.map((item)=>(
              <div key={item.id}>
                <div className="details">
                  {item}
                </div>
              </div>
            )) :
              <div>
                <div className="details">
                  No Advice/Instruction
                </div>
              </div>
            }
            
          </div>
        
          {/* Follow Up Appointment */}
          <div className="caseSheetData">
            <div className="secTitle">Advice/Instruction</div>
              <div>
                <div className="details">
                  {moment(caseSheetData.followUpChatDays).format('DD-MMM-YYYY')}
                </div>
              </div>
            
          </div>
        
          <div className="secTitle" style={{paddingBottom:"10px", borderBottom:"1px solid", fontSize:"24px"}}>Prescriptions</div>
          <div className="secTitle" style={{marginTop:"20px"}}>Medcines</div>

          <div className="caseSheetData">
            {caseSheetData.medicinePrescription.length >0 && caseSheetData.medicinePrescription[0] != "" ?  caseSheetData.medicinePrescription.map((item,index)=>(
              <div key={item.hsnCode}>
                <div className="details">
                  <div>{index+1}. {item.nameOfTheDrug}</div>
                  <div><span style={{fontSize:"18px", color:"#676767"}}>Frequency:</span> {item.intakeFrequency} </div>
                  <div><span style={{fontSize:"18px", color:"#676767"}}>Food:</span> {item.food} </div>
                  <div><span style={{fontSize:"18px", color:"#676767"}}>Comments:</span> {item.otherNotes} </div>
                </div>
              </div>
            )) :
              <div>
                <div className="details">
                  No Medicine Prescribed
                </div>
              </div>
            }

            {caseSheetData.medicinePrescription.length >0 && <div style={{textAlign:"center", marginTop:"30px"}}>
              <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="submitSlotBtn"
                onClick={props.buyMedicine}
              >
                BUY MEDICINE
              </Button>
            </div>}
          </div>


          <div className="secTitle" style={{marginTop:"20px"}}>Lab Tests</div>

          <div className="caseSheetData">
            {caseSheetData.testPrescription.length >0 && caseSheetData.testPrescription[0] != "" ?  caseSheetData.testPrescription.map((item,index)=>(
              <div key={index}>
                <div className="details">
                  <div>{index+1}. {item.serviceType}</div>
                </div>
              </div>
            )) :
              <div>
                <div className="details">
                  No Lab Test Prescribed.
                </div>
              </div>
            }

            {caseSheetData.testPrescription.length >0 && <div style={{textAlign:"center", marginTop:"30px", marginBottom:"50px"}}>
              <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="submitSlotBtn"
                onClick={props.bookLabTest}
              >
                BOOK LAB TEST
              </Button>
            </div>}
          </div>


        </div>
      
    </>
  )
}

export default CaseSheetDetails
