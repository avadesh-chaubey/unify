import React, {useState, useEffect} from 'react';
import Header from "../../components/consultationServices/Header";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import PdfPopOver from "../../components/appointmentetails/PdfPopOver";

const useStyles = makeStyles((theme) => ({
  rootDiv:{
    padding: "10px 65px",
  },
  title:{
    color: "#424242",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "10px 0",
    fontFamily: "'Avenir_heavy' !important"
  },
  details:{
    background: "#F8F6F6",
    padding: "20px",
  },
  name:{
    color: "#424242",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
    fontFamily: "'Avenir_heavy' !important"
  },
  uhid:{
    color: "#7b7b7b",
    fontSize: "15px",
  },
  spec:{
    color: "#7b7b7b",
    fontSize: "14px",
  },
  appointmentText: {
    color: "#7b7b7b",
    fontSize: "20px",
    WebkitTextFillColor: "transparent",
    WebkitTextStrokeWidth: "0.8px",
    WebkitTextStrokeColor: "#7b7b7b",
  },
  appointmentDate:{
    color: "#7b7b7b",
    fontSize: "15px",
    fontFamily: "'Avenir_heavy' !important"
  },
  chiefComplaints:{
    color: "#7b7b7b",
    fontSize: "16px",
    fontWeight:"500",
    lineHeight:"22px",
    width: "225px",
  },
  diagnosis:{
    color: "#7b7b7b",
    fontSize: "14px",
    fontWeight:"500",
    lineHeight:"22px",
    width: "265px",
  },
  pdfDiv:{
    display: "inline-block",
    padding: "20px 10px",
  },
  pdf: {
    float:"left",
    cursor:"pointer"
  },
  pdfDetails:{
    float: "left",
    padding: "20px 30px",
  },
  pdfName:{
    color: "#424242",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "5px",
  },
  pdfDate:{
    color: "#7b7b7b",
    fontSize: "13px",
    fontWeight:"500",
  },
}));
function caseSheet() {
  const classes = useStyles();
  const [fileLink, setFileLink] = useState('');
  const [docName, setDocName] = useState('');
  const [showPdf, setShowPdf] = useState(0);
  
  const handlePopOver = (file, documentName) => {
    setShowPdf(!showPdf);
    setFileLink(file);
    setDocName(documentName);
  };
  const onPdfClick = (name) =>{
    console.log("pdf name: ",name);
    handlePopOver("../pdfTemplate/sample2.pdf",name)
  }

  return (
    <div>
      <Header />
      <HeadBreadcrumbs title1={"Consults"} title2 = {"Past Appointment"} title3 = {"Casesheet"} mainTitle = {"Casesheet"} />
      {/* Patient Details */}
      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Patients Details
        </div>
        <div className={classes.details}>
          <div className={classes.name}>
            Aryan Sharma, 3M
          </div>
          <div className={classes.uhid}>
            UHID: AR346578908877
          </div>
        </div>
      </div>

      {/* Doctor Details */}
      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Doctor Details
        </div>
        <div className={classes.details}>
          <div className={classes.name}>
            Dr. Pritee Chopra
          </div>
          <div className={classes.spec}>
            (Pediatrician)
          </div>
          <div className={classes.uhid}>
            MBBS, MD, 12 Years
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Appointment Details
        </div>
        <div className={classes.details}>
          <div className={classes.appointmentDate}>
            26 Sep 2021, 09:00AM
          </div>
          {/* <div className={classes.appointmentText}>
            26 Sep 2021, 09:00AM
          </div> */}
        </div>
      </div>

      {/* Chief Complaints */}
      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Chief Complaints
        </div>
        <div className={classes.details}>
          <div className={classes.chiefComplaints}>
            Severe headache since 3 days
          </div>
          <div className={classes.chiefComplaints}>
            Dry cough, Fatigue, Facing Problem in breathing
          </div>
          
        </div>
      </div>

      {/* Diagnosis */}
      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Diagnosis
        </div>
        <div className={classes.details}>
          <div className={classes.diagnosis}>
            ACTS long 600mg 1 tablet 1 time / day 10 - 14 days after meals.
          </div>
          <div className={classes.diagnosis}>
            Paracetamole 500 mg 1 tablet at a temperature of 38 degrees and above
          </div>
        </div>
      </div>

      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Prescription:
        </div>
        <div style={{display:"inline-block"}}>
          <img src='../pdfIcon.svg' className={classes.pdf} onClick={(e)=>onPdfClick("Prescription pdf")}/>
          <div className={classes.pdfDetails}>
            <div className={classes.pdfName}>
              Prescription.pdf
            </div>
            <div className={classes.pdfDate}>
              5 Nov 2021
            </div>
          </div>
        </div>
      </div>

      <div className={classes.rootDiv}>
        <div className={classes.title}>
          Lab Test:
        </div>
        <div style={{display:"inline-block"}}>
          <img src='../pdfIcon.svg' className={classes.pdf} onClick={(e)=>onPdfClick("Lab pdf")}/>
          <div className={classes.pdfDetails}>
            <div className={classes.pdfName}>
              Blood_Tests.pdf
            </div>
            <div className={classes.pdfDate}>
              5 Nov 2021
            </div>
          </div>
        </div>
      </div>

      {fileLink !== "" && (
        <PdfPopOver
          file={fileLink}
          docName={docName}
          openModal={showPdf}
          modalFunc={setShowPdf}
          // showVideoSec={showVideoSec}
          fileType="file"
        />
      )}
    </div>
  )
}

export default caseSheet
