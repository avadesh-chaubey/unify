import Button from "@material-ui/core/Button";
import axios from "axios";
import { useRouter } from "next/router";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import config from "../app.constant";
import { Avatar } from "@material-ui/core";
import { useState, useEffect } from "react";
import time from "../data/time.json";
import CircularProgress from "@material-ui/core/CircularProgress";
import PastConsultations from "../components/patient-case-sheet/past-consultations";
import Vitals from "../components/patient-case-sheet/vitals";
import ChiefComplaints from "../components/patient-case-sheet/chief-complaints";
import PatientMedicalHistory from "../components/patient-case-sheet/patient-medical-history";
import TestsPrescription from "../components/patient-case-sheet/testprescription";
import Notes from "../components/patient-case-sheet/notes";
import FamilyMedicalHistory from "../components/patient-case-sheet/family-medical-history";
import TestReports from "../components/patient-case-sheet/health-record";
import Diagnosis from "../components/patient-case-sheet/diagnosis";
import MedicalPrescription from "../components/patient-case-sheet/medicalprescription";
import PhotosbyPatient from "../components/patient-case-sheet/petient-documents";
import FollowUp from "../components/patient-case-sheet/follow-up";
import Advice from "../components/patient-case-sheet/advice";
import Referral from "../components/patient-case-sheet/referral";
import EditIcon from "@material-ui/icons/EditOutlined";
import moment from 'moment';
import CaseSheetConfirmation from '../components/doctor/CaseSheetConfirmation';

function DoctorHomePage({
  patientName,
  appointmentObj,
  setMsgData,
  firebase,
  listOfAppointment,
  getAvatarColor,
  userDetails,
  showVideoSec,
  isFullScreen
}) {
  const router = useRouter();
  const [cookies, setCookie] = useState('');
  const [patient, setPatient] = useState([]);
  const [loader, setLoader] = useState(false);
  const [csid, setCsid] = useState("");
  const [login, setLogin] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    if (cookies === '') {
      setCookie(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  const dateNow = new Date(); // Creating a new date object with the current date and time
  const year = dateNow.getFullYear(); // Getting current year from the created Date object
  const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
  const month = // Setting current Month number from current Date object
    monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 if not to adjust for date input.
      ? `0${monthWithOffset}`
      : monthWithOffset;
  const date =
    dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
      ? `0${dateNow.getUTCDate()}`
      : dateNow.getUTCDate();

  const DateInput = `${year}-${month}-${date}`; // combining to format for defaultValue or value attribute of material <TextField>

  useEffect(() => {
    if (process.browser) {
      setUid(localStorage.getItem("agencyuserId"));
    }
  }, []);
  const [disableFlag, setDisableFlag] = useState(false);
  const [disableAdvise, setDisableAdvise] = useState(false);
  const [disableTestReport, setDisableTestReport] = useState(false);
  useEffect(() => {
    if(
        (appointmentObj.appointmentStatus === "completed:with:error" ||
        appointmentObj.appointmentStatus === "successfully:completed") && 
        (userDetails.userType === "dietician" || userDetails.userType === "educator")
      ) {
      setDisableFlag(true);
      setDisableAdvise(true);
    } else {
      // Allow doctor / assistant to modify case-sheet after consultation complete
      setDisableFlag(false);
      setDisableAdvise(false);
      setDisableTestReport(false);
    }

    if(userDetails.userType === "dietician" || userDetails.userType === "educator"){
      setDisableFlag(true);
      setDisableTestReport(true);
    }
  }, [appointmentObj])
  const [consultations, setConsultations] = useState([]);

  const [vitals, setVitals] = useState({
    weigthInKgs: "",
    weigthInKgsDate: "",
    heigthInCms: "",
    heigthInCmsDate: "",
    bloodPressureDiastolic: "", //bp
    bloodPressureDiastolicDate: "", //bp
    // tempratureInFernite: "",
    // tempratureInFerniteDate: "",
    waistCircumference: "",
    waistCircumferenceDate: "",
    pulse: "",
    pulseDate: "",
    bmi: "",
    bmiDate: "",
  });
  const [chiefComplaints, setchiefComplaints] = useState([
    {
      symptoms: "",
      since: "",
      sinceUnit: "day",
      howOften: "",
      severity: "None",
      details: "",
    },
  ]);

  const [medicalHistory, setmedicalHistory] = useState({
    medicalHistory: "",
    medicationHistory: "",
    surgicalHistory: "",
    drugAllergies: "",
    dietAllergiesOrRestrictions: "",
    personalLifestyle: "",
    personalHabits: "",
    environmentalAndOccupationalHistory: "",
    familyMedicalHistory: "",
    pagnencyDetails: "",
  });

  const [notes, setNotes] = useState({
    juniorDoctorNotes: "",
    diagnosticTestResult: "",
    clinicalObservations: "",
    personalNotes: "",
  });

  const [diagnosis, setDiagnosis] = useState([""]);

  const [medicinePrescription, setMedicinePrescription] = useState([
    {
      nameOfTheDrug: "",
      medicineType: "",
      intakeFrequency: "",
      food: "Before food",
      otherNotes: "",
      durationInDays: "",
      administrationRoute: "",
      enabled: false,
      numberOfUnits: 1,
      packOf: 0,
      MRP: 0,
      gstInPercentage: 0,
      hsnCode: "",
    },
  ]);
  const onArrowClic = (value,index) =>{
    let tempMedArr = [...medicinePrescription];
    
    if(value ==="UP"){
      var temp = tempMedArr[index-1];
      tempMedArr[index-1] = tempMedArr[index];
      tempMedArr[index] = temp;
    }
    
    if(value ==="DOWN"){
      var temp = tempMedArr[index+1];
      tempMedArr[index+1] = tempMedArr[index];
      tempMedArr[index] = temp;
    }
    setMedicinePrescription(tempMedArr)
  }
  const [lab, setLab] = useState("ARH");
  const [testPrescription, setTestPrescription] = useState([
    {
      date: DateInput,
      lab: "",
      serviceType: "",
      enabled: false,
      cost: 0,
      preCondition: "",
      reportWaitingTime: "",
      addCollectionCharges: false,
    },
  ]);
  const onTestArrowClic = (value,index) =>{
    let tempTestArr = [...testPrescription];
    
    if(value ==="UP"){
      var temp = tempTestArr[index-1];
      tempTestArr[index-1] = tempTestArr[index];
      tempTestArr[index] = temp;
    }
    
    if(value ==="DOWN"){
      var temp = tempTestArr[index+1];
      tempTestArr[index+1] = tempTestArr[index];
      tempTestArr[index] = temp;
    }
    setTestPrescription(tempTestArr)
  }
  const [report, setReport] = useState([]);

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        //console.log(resolve(xhr.response));
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      // this helps us get a blob
      xhr.responseType = "blob";

      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadDataToFirebase = async (chatData) => {
    console.log("chatData: ",chatData)
    setLoader(true);
    let attachment = [];
    console.log("data", chatData.target.files[0]);
    if(chatData.target.files[0] === undefined){
      setLoader(false);
      return false;
    }
    const filedata = chatData.target.files[0];
    const storageRef = firebase.storage().ref();
    const doctorId = appointmentObj.consultantId;
    const currentTime = new Date().getTime();
    const fileName = filedata.name;
    const fileExt = fileName.split(".")[1];
    const filePath = "chatData/" + doctorId + "/" + currentTime + "." + fileExt;

    await uriToBlob(URL.createObjectURL(filedata))
      .then((blob) => {
        const data = {
          blob: blob,
          uri: filedata,
          metadata: filedata.type,
          type: "file",
          fileExtension: fileExt,
        };
        attachment = data;
        return data;
        console.log("attach01", attachment);
      })
      .then((attachment) => {
        filedata.fileType = attachment.type;
        let uploadTask = storageRef
          .child(filePath)
          .put(attachment.blob, attachment.metaData);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
          },
          function (error) {
            setLoader(false);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;

              case "storage/canceled":
                // User canceled the upload
                break;
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log("File available at", downloadURL);
                // Upload file from here
                // uploadDocToServer(downloadURL, filedata);
                setLoader(false);
                // let chatDetails = chatData;
                // chatDetails.downloadURL = downloadURL;
                ReportsChange(downloadURL, filedata);
                setLoader(false);
              });
          }
        );
      });
  };

  const uploadDocToServer = (fileUrl, filedata) => {
    axios
      .post(
        `${config.API_URL}/api/patient/addpatientdocument`,
        {
          title: filedata.name,
          category: "TEST_REPORT",
          date: DateInput,
          url: fileUrl,
          patientId: appointmentObj.customerId,
          fileType: "file",
        },
        { headers }
      )
      .then((res) => console.log("Uploaded document to server", res))
      .catch((err) =>
        console.log("Error occurred while uploading doc to server", err)
      );
  };

  const ReportsChange = (fileUrl, filedata) => {
    // console.log(event.target.files, "file-reports");
    // const files = event.target.files;
    let tempArr = [];
    // let filesArr = event.target.files;
    // delete filesArr.length;
    const currentTime = new Date().getTime();
    // for (let item of filesArr) {
    tempArr.push({
      documentName: filedata.name,
      documentURL: fileUrl,
      documentType: "report",
      documentDated: filedata.lastModifiedDate,
      uploadDate: DateInput,
      refferredByDiahome: false,
    });
    // }
    setPatientDocument([...PatientDocument, ...tempArr]);
    setHealthRecords({
      ...HealthRecords,
      // patientPhotos: [...PatientDocument, ...tempArr],
      patientReports: [...PatientDocument, ...tempArr],
      // pastConsultations: [...PatientDocument, ...tempArr],
    });
    // setReport(tempArr);
    // console.log(tempArr, report,? "temp");
  };
  const deleteCancelChequevalue = (e) => {
    e.preventDefault();
  };

  const [PatientDocument, setPatientDocument] = useState([]);

  const [patientUploads, setPatientUploads] = useState([]);

  const [HealthRecords, setHealthRecords] = useState({
    // patientPhotos: PatientDocument,
    patientReports: PatientDocument,
    // pastConsultations: PatientDocument,
  });

  const [followUpChatDays, setfollowUpChatDays] = useState(moment(new Date()).add(90, 'days').format('YYYY-MM-DD'));
  const [followError, setFollowError] = useState("");

  const [adviceInstructions, setadviceInstructions] = useState([""]);

  const [refferral, setRefferral] = useState({
    consultSpecialty: "--Select--",
    reason: "",
  });

  const reportChange = (data) => {
    console.log(data, "File");
    console.log(data.length, data.File, "File");
  };
  const handleVital = (prop, val) => {
    setVitals({
      ...vitals,
      [prop]: val,
    });
  };
  const handleComplaints = (prop, val, index) => {
    // const { name, value } = e.target;
    const list = [...chiefComplaints];
    list[index][prop] = val;
    setchiefComplaints(list);
  };

  const handleRemoveComplaints = (index) => {
    if(disableFlag === true){
      return false;
    }
    const list = [...chiefComplaints];
    list.splice(index, 1);
    setchiefComplaints(list);
  };

  const handleAddComplaints = () => {
    if(disableFlag === true){
      return false;
    }
    setchiefComplaints([
      ...chiefComplaints,
      {
        symptoms: "",
        since: "",
        sinceUnit: "day",
        howOften: "",
        severity: "Low",
        details: "",
      },
    ]);
  };

  const handlePatientMedicalHistory = (prop, val) => {
    setmedicalHistory({
      ...medicalHistory,
      [prop]: val,
    });
  };
  const handleNotes = (prop, val) => {
    setNotes({
      ...notes,
      [prop]: val,
    });
  };
  const handleDiagnosis = (val, index) => {
    // const { name, value } = e.target;
    const list = [...diagnosis];
    list[index] = val;
    setDiagnosis(list);
  };

  const handleRemoveDiagnosis = (index) => {
    if(disableFlag === true){
      return false;
    }
    const list = [...diagnosis];
    list.splice(index, 1);
    setDiagnosis(list);
  };

  const handleAddDiagnosis = () => {
    if(disableFlag === true){
      return false;
    }
    setDiagnosis([...diagnosis, ""]);
  };

  const [medicinePriceData, setMedicinePriceData] = useState([]);
  function getMedData() {
    let temp = [];
    let headers = {
      authtoken: cookies,
    };
    // setLoader(true);
    axios
      .get(config.API_URL + "/api/utility/medicine", { headers })
      .then((response) => {
        temp = response.data;
        setMedicinePriceData(temp);
      })
      .catch((error) => {
        // setLoader(false);
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  }
  useEffect(() => {
    getMedData();
  }, [setMsgData.updatelist]);

  const handleMedicines = (prop, val, index) => {
    const list = [...medicinePrescription];
    if (prop === "nameOfTheDrug") {
      medicinePriceData.forEach((element) => {
        if (element.medicineName == val) {
          list[index]["MRP"] = element.MRP;
          list[index]["gstInPercentage"] = element.gstInPercentage;
          list[index]["hsnCode"] = element.hsnCode;
          list[index]["medicineType"] = element.medicineType;
          list[index]["packOf"] = element.packOf;
        }
      });
    }
    list[index][prop] = val;

    setMedicinePrescription(list);
  };

  const handleRemoveMedicines = (index) => {
    if(disableFlag === true){
      return false;
    }
    const list = [...medicinePrescription];
    list.splice(index, 1);
    setMedicinePrescription(list);
  };

  const handleAddMedicines = () => {
    if(disableFlag === true){
      return false;
    }
    setMedicinePrescription([
      ...medicinePrescription,
      {
        nameOfTheDrug: "",
        medicineType: "",
        intakeFrequency: "",
        food: "Before food",
        otherNotes: "",
        durationInDays: "",
        administrationRoute: "",
        enabled: false,
        numberOfUnits: 1,
        packOf: 0,
        MRP: 0,
        gstInPercentage: 0,
        hsnCode: "",
      },
    ]);
  };

  const [medicineTestCostData, setMedicineTestCostData] = useState([]);
  function getMedTestData() {
    let temp = [];
    let headers = {
      authtoken: cookies,
    };
    // setLoader(true);
    axios
      .get(config.API_URL + "/api/utility/diagnostictest", { headers })
      .then((response) => {
        temp = response.data;
        // const testCostList = [];
        // temp.forEach(element => {
        //   testCostList.push(element.cost);

        // });
        setMedicineTestCostData(response.data);
        // setTestsList(response.data);
        // setLoader(false);
      })
      .catch((error) => {
        // setLoader(false);
        console.log(error);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
      });
  }
  useEffect(() => {
    getMedTestData();
  }, []);

  const handleTests = (prop, val, index) => {
    const list = [...testPrescription];
    list[index][prop] = val;
    if (prop === "lab") {
      setLab(list);
    }
    if(val === null){
      list[index]["cost"] = "";
    }
    if (prop === "serviceType") {
      medicineTestCostData.forEach((element) => {
        if (element.serviceType == val) {
          list[index]["cost"] = element.cost;
          list[index]["lab"] = element.lab;
          list[index]["addCollectionCharges"] = element.addCollectionCharges;
          list[index]["preCondition"] = element.preCondition;
          list[index]["reportWaitingTime"] = element.reportWaitingTime;
          list[index]["enabled"] = true;
        }
      });
    }
    setTestPrescription(list);
  };
  const handleLab = (input) => {
    setLab(input);
  };

  const handleRemoveTests = (index) => {
    if(disableFlag === true){
      return false;
    }
    const list = [...testPrescription];
    list.splice(index, 1);
    setTestPrescription(list);
  };

  const handleAddTests = () => {
    if(disableFlag === true){
      return false;
    }
    setTestPrescription([
      ...testPrescription,
      {
        date: DateInput,
        lab: lab,
        serviceType: "",
        enabled: false,
        cost: 0,
        preCondition: "",
        reportWaitingTime: "",
        addCollectionCharges: false,
      },
    ]);
  };

  const handleFollow = (input) => {
    setfollowUpChatDays(input.target.value);
    const {
      target: { value },
    } = event;
    setFollowError({ followUpChatDays: "" });
    setfollowUpChatDays(value);
    let reg = new RegExp(/^-?\d*(\.\d+)?$/).test(value);
    if (!reg) {
      setFollowError({
        followUpChatDays: "Please enter a value for Follow up days",
      });
    }
  };

  const handleAdvice = (val, index) => {
    const list = [...adviceInstructions];
    list[index] = val;
    setadviceInstructions(list);
  };
  const handleRemoveAdvice = (index) => {
    if(disableFlag === true && disableAdvise === true){
      return false;
    }
    const list = [...adviceInstructions];
    list.splice(index, 1);
    setadviceInstructions(list);
  };

  const handleAddAdvice = () => {
    if(disableFlag === true && disableAdvise === true){
      return false;
    }
    setadviceInstructions([...adviceInstructions, ""]);
  };

  const handleRefferal = (prop, val) => {
    setRefferral({
      ...refferral,
      [prop]: val,
    });
  };

  const getInitialsOfGender = (gender) => {
    let name = gender;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(rgx)] || [];

    initials = (initials.shift()?.[1] || "").toUpperCase();

    return initials;
  };

  const getDates = (date) => {
    // const input = "yyyy-mm-dd"
    const [year, month, day] = date.split("-");
    // result = dd-mm-yyyy
    const inputDate = `${day}-${month}-${year}`;
    return inputDate;
  };

  const getSlot = (slot) => {
    const getTime = time.filter((t) => t.value === slot);
    return getTime[0].label;
  };

  const headers = {
    authtoken: cookies,
    "Content-type": "application/json",
  };
  const [testreports, setTestreports] = useState([]);
  const testdata = [];
  patientUploads.map((reports) => {
    // console.log("reports", reports.category === "TEST_REPORT");
    if (reports.category === "TEST_REPORT") {
      testdata.push(reports);
    }
    // setTestreports(testdata);
  });
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setLogin(userDetails["id"]);
  }, []);
  const [tempTestData, setTempTestData] = useState([]);
  const [tempMedData, setTempMedData] = useState([]);
  const [csData, setCSData] = useState({});

  const handleDownloadCS = () => {
    if (appointmentObj.status === 'completed' || appointmentObj.status === 'error') {
      downloadCS();
    } 
    // else if (appointmentObj.status === 'error') {
    //   setMsgData({
    //     message: "Prescription not available",
    //     type: "error",
    //   });
    // } 
    else {
      setMsgData({
        message: `You can download this case sheet after consultation complete`,
        type: "error",
      });
    }
  };

  const downloadCS = () => {
    axios.get(`${config.API_URL}/api/patient/download/prescription?appointmentId=${appointmentObj.id}`,
      {
        authtoken: cookies,
        responseType: 'blob',
      }
    ).then(res => {
      const response = res.data;
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appointmentObj.customerFirstName}${appointmentObj.customerLastName}.pdf`;
      a.click();
    })
    .catch(err => {
      setMsgData({
        message: `Error occurred while downloading case sheet`,
        type: "error",
      });
    });
  };
  function fillCaseSheet(csData2){
    setTempTestData(csData2.testPrescription);
    setTempMedData(csData2.medicinePrescription);
    setVitals({
      weigthInKgs: csData2.vitals.weigthInKgs,
      weigthInKgsDate: csData2.vitals.weigthInKgsDate,
      heigthInCms: csData2.vitals.heigthInCms,
      heigthInCmsDate: csData2.vitals.heigthInCmsDate,
      bmi: csData2.vitals.bmi,
      bmiDate: csData2.vitals.bmiDate,
      bloodPressureDiastolic: csData2.vitals.bloodPressureDiastolic, //bp
      bloodPressureDiastolicDate:
        csData2.vitals.bloodPressureDiastolicDate, //bpdate
      waistCircumference: csData2.vitals.waistCircumference,
      waistCircumferenceDate: csData2.vitals.waistCircumferenceDate,
      pulse: csData2.vitals.pulse,
      pulseDate: csData2.vitals.pulseDate,
    });
    const datacc = csData2.chiefComplaints.map((eachcomplaint) => {
      return {
        symptoms: eachcomplaint.symptoms,
        since: eachcomplaint.since,
        sinceUnit: eachcomplaint.sinceUnit,
        howOften: eachcomplaint.howOften,
        severity: eachcomplaint.severity,
        details: eachcomplaint.details,
      };
    });
    setchiefComplaints(datacc);
    setmedicalHistory({
      medicalHistory: csData2.medicalHistory.medicalHistory,
      medicationHistory: csData2.medicalHistory.medicationHistory,
      surgicalHistory: csData2.medicalHistory.surgicalHistory,
      drugAllergies: csData2.medicalHistory.drugAllergies,
      dietAllergiesOrRestrictions:
        csData2.medicalHistory.dietAllergiesOrRestrictions,
      personalLifestyle: csData2.medicalHistory.personalLifestyle,
      personalHabits: csData2.medicalHistory.personalHabits,
      environmentalAndOccupationalHistory:
        csData2.medicalHistory.environmentalAndOccupationalHistory,
      familyMedicalHistory: csData2.medicalHistory.familyMedicalHistory,
      pagnencyDetails: csData2.medicalHistory.pagnencyDetails,
    });
    setNotes({
      juniorDoctorNotes: csData2.notes.juniorDoctorNotes,
      diagnosticTestResult: csData2.notes.diagnosticTestResult,
      clinicalObservations: csData2.notes.clinicalObservations,
      personalNotes: csData2.notes.personalNotes,
    });

    setDiagnosis(csData2.diagnosis);
    let datamedicine;
    if(csData2.medicinePrescription.length > 0){
      console.log("in if")
      datamedicine = csData2.medicinePrescription.map(
        (eachmedicine) => {
          return {
            nameOfTheDrug: eachmedicine.nameOfTheDrug,
            intakeFrequency: eachmedicine.intakeFrequency,
            food: eachmedicine.food,
            otherNotes: eachmedicine.otherNotes,
            durationInDays: eachmedicine.durationInDays,
            MRP: eachmedicine.MRP,
            medicineType: eachmedicine.medicineType,
            administrationRoute: eachmedicine.administrationRoute,
            enabled: eachmedicine.enabled,
            numberOfUnits: eachmedicine.numberOfUnits,
            packOf: eachmedicine.packOf,
            gstInPercentage: eachmedicine.gstInPercentage,
            hsnCode: eachmedicine.hsnCode,
          };
        }
      );
    } else{
      datamedicine = [
        {
          nameOfTheDrug: "",
          medicineType: "",
          intakeFrequency: "",
          food: "Before food",
          otherNotes: "",
          durationInDays: "",
          administrationRoute: "",
          enabled: false,
          numberOfUnits: 1,
          packOf: 0,
          MRP: 0,
          gstInPercentage: 0,
          hsnCode: "",
        },
      ]
    }
    setMedicinePrescription(datamedicine);
    let datatest;
    if(csData2.testPrescription.length > 0){
      datatest = csData2.testPrescription.map((eachtest) => {
        return {
          date: eachtest.date,
          lab: eachtest.lab,
          serviceType: eachtest.serviceType,
          enabled: eachtest.enabled,
          cost: eachtest.cost,
          preCondition: eachtest.preCondition,
          reportWaitingTime: eachtest.reportWaitingTime,
          addCollectionCharges: eachtest.addCollectionCharges,
        };
      });
    } else{
      datatest = [
        {
          date: DateInput,
          lab: "",
          serviceType: "",
          enabled: false,
          cost: 0,
          preCondition: "",
          reportWaitingTime: "",
          addCollectionCharges: false,
        },
      ]
    }

    setTestPrescription(datatest);
    setLab(csData2.lab);
    setadviceInstructions(csData2.adviceInstruction);
    setfollowUpChatDays(csData2.followUpChatDays);
    setRefferral({
      consultSpecialty: csData2.refferral.consultSpecialty,
      reason: csData2.refferral.reason,
    });

    if (csData2.healthRecords.patientReports) {
      const rt = csData2.healthRecords.patientReports.map((eachhealth) => {
        return {
          documentName: eachhealth.documentName,
          documentURL: eachhealth.documentURL,
          documentType: eachhealth.documentType,
          documentDated: eachhealth.documentDated,
          uploadDate: eachhealth.uploadDate,
          refferredByDiahome: eachhealth.refferredByDiahome,
        };
      });

      setPatientDocument(rt);
      setHealthRecords({
        // patientPhotos: rt,
        patientReports: rt,
        // pastConsultations: rt,
      });
    }
    setLoader(false);
  }
  const getCSDetails = () => {
    axios
      .get(
        `${config.API_URL}/api/patient/appointmentcasesheet/${appointmentObj.id}`,
        { headers }
      )
      .then((res) => {
        setCsid(res.data.id);
        fillCaseSheet(res.data);
      })
      .catch(err => console.log('Error occurred from appointmentcasesheet', err));

    axios
      .get(
        `${config.API_URL}/api/patient/showpatientdetails/${appointmentObj.customerId}`,
        { headers }
      )
      .then((res) => {
        setLoader(true);

        const data = res.data;
        const patient = data.appointments;
        const caseSheet = data.casesheets;
        const patientUploadDocs = data.patientDocuments;
        let csData2 = {}; 

        setPatientUploads(patientUploadDocs);
        
        const csDataFilter = caseSheet.filter((csObj) => csObj.appointmentId === appointmentObj.id);
      
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        var hour = today.getHours();
        var minutes = today.getMinutes();
        const pastdata = [];
        today = yyyy + "-" + mm + "-" + dd;
        
        const appoint = data.appointments;

        const allCons = appoint.map((eachappoint) => {
          eachappoint.sortOption = -1;
          if(eachappoint.id === appointmentObj.id){
            eachappoint.currentAppointment = true;
            eachappoint.sortOption = 1;
          }

          return eachappoint;
        });

        setConsultations(allCons.sort((a, b) => b.sortOption - a.sortOption));

        // if(csDataFilter.length){
        //   csData2 = csDataFilter[csDataFilter.length - 1];
        //   setCSData( csDataFilter[csDataFilter.length - 1] );
        // }

        // setTempTestData(csData2.testPrescription);
        // setTempMedData(csData2.medicinePrescription);
        // setVitals({
        //   weigthInKgs: csData2.vitals.weigthInKgs,
        //   weigthInKgsDate: csData2.vitals.weigthInKgsDate,
        //   heigthInCms: csData2.vitals.heigthInCms,
        //   heigthInCmsDate: csData2.vitals.heigthInCmsDate,
        //   bmi: csData2.vitals.bmi,
        //   bmiDate: csData2.vitals.bmiDate,
        //   bloodPressureDiastolic: csData2.vitals.bloodPressureDiastolic, //bp
        //   bloodPressureDiastolicDate:
        //     csData2.vitals.bloodPressureDiastolicDate, //bpdate
        //   waistCircumference: csData2.vitals.waistCircumference,
        //   waistCircumferenceDate: csData2.vitals.waistCircumferenceDate,
        //   pulse: csData2.vitals.pulse,
        //   pulseDate: csData2.vitals.pulseDate,
        // });
        // const datacc = csData2.chiefComplaints.map((eachcomplaint) => {
        //   return {
        //     symptoms: eachcomplaint.symptoms,
        //     since: eachcomplaint.since,
        //     sinceUnit: eachcomplaint.sinceUnit,
        //     howOften: eachcomplaint.howOften,
        //     severity: eachcomplaint.severity,
        //     details: eachcomplaint.details,
        //   };
        // });
        // setchiefComplaints(datacc);
        // setmedicalHistory({
        //   medicalHistory: csData2.medicalHistory.medicalHistory,
        //   medicationHistory: csData2.medicalHistory.medicationHistory,
        //   surgicalHistory: csData2.medicalHistory.surgicalHistory,
        //   drugAllergies: csData2.medicalHistory.drugAllergies,
        //   dietAllergiesOrRestrictions:
        //     csData2.medicalHistory.dietAllergiesOrRestrictions,
        //   personalLifestyle: csData2.medicalHistory.personalLifestyle,
        //   personalHabits: csData2.medicalHistory.personalHabits,
        //   environmentalAndOccupationalHistory:
        //     csData2.medicalHistory.environmentalAndOccupationalHistory,
        //   familyMedicalHistory: csData2.medicalHistory.familyMedicalHistory,
        //   pagnencyDetails: csData2.medicalHistory.pagnencyDetails,
        // });
        // setNotes({
        //   juniorDoctorNotes: csData2.notes.juniorDoctorNotes,
        //   diagnosticTestResult: csData2.notes.diagnosticTestResult,
        //   clinicalObservations: csData2.notes.clinicalObservations,
        //   personalNotes: csData2.notes.personalNotes,
        // });

        // setDiagnosis(csData2.diagnosis);
        // let datamedicine;
        // if(csData2.medicinePrescription.length > 0){
        //   console.log("in if")
        //   datamedicine = csData2.medicinePrescription.map(
        //     (eachmedicine) => {
        //       return {
        //         nameOfTheDrug: eachmedicine.nameOfTheDrug,
        //         intakeFrequency: eachmedicine.intakeFrequency,
        //         food: eachmedicine.food,
        //         otherNotes: eachmedicine.otherNotes,
        //         durationInDays: eachmedicine.durationInDays,
        //         MRP: eachmedicine.MRP,
        //         medicineType: eachmedicine.medicineType,
        //         administrationRoute: eachmedicine.administrationRoute,
        //         enabled: eachmedicine.enabled,
        //         numberOfUnits: eachmedicine.numberOfUnits,
        //         packOf: eachmedicine.packOf,
        //         gstInPercentage: eachmedicine.gstInPercentage,
        //         hsnCode: eachmedicine.hsnCode,
        //       };
        //     }
        //   );
        // } else{
        //   datamedicine = [
        //     {
        //       nameOfTheDrug: "",
        //       medicineType: "",
        //       intakeFrequency: "",
        //       food: "Before food",
        //       otherNotes: "",
        //       durationInDays: "",
        //       administrationRoute: "",
        //       enabled: false,
        //       numberOfUnits: 1,
        //       packOf: 0,
        //       MRP: 0,
        //       gstInPercentage: 0,
        //       hsnCode: "",
        //     },
        //   ]
        // }
        // setMedicinePrescription(datamedicine);
        // let datatest;
        // if(csData2.testPrescription.length > 0){
        //   datatest = csData2.testPrescription.map((eachtest) => {
        //     return {
        //       date: eachtest.date,
        //       lab: eachtest.lab,
        //       serviceType: eachtest.serviceType,
        //       enabled: eachtest.enabled,
        //       cost: eachtest.cost,
        //       preCondition: eachtest.preCondition,
        //       reportWaitingTime: eachtest.reportWaitingTime,
        //       addCollectionCharges: eachtest.addCollectionCharges,
        //     };
        //   });
        // } else{
        //   datatest = [
        //     {
        //       date: DateInput,
        //       lab: "",
        //       serviceType: "",
        //       enabled: false,
        //       cost: 0,
        //       preCondition: "",
        //       reportWaitingTime: "",
        //       addCollectionCharges: false,
        //     },
        //   ]
        // }

        // setTestPrescription(datatest);
        // setLab(csData2.lab);
        // setadviceInstructions(csData2.adviceInstruction);
        // setfollowUpChatDays(csData2.followUpChatDays);
        // setRefferral({
        //   consultSpecialty: csData2.refferral.consultSpecialty,
        //   reason: csData2.refferral.reason,
        // });

        // if (csData2.healthRecords.patientReports) {
        //   const rt = csData2.healthRecords.patientReports.map((eachhealth) => {
        //     return {
        //       documentName: eachhealth.documentName,
        //       documentURL: eachhealth.documentURL,
        //       documentType: eachhealth.documentType,
        //       documentDated: eachhealth.documentDated,
        //       uploadDate: eachhealth.uploadDate,
        //       refferredByDiahome: eachhealth.refferredByDiahome,
        //     };
        //   });

        //   setPatientDocument(rt);
        //   setHealthRecords({
        //     patientPhotos: rt,
        //     patientReports: rt,
        //     pastConsultations: rt,
        //   });
        // }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log("patient err", err);
      });
  };

  useEffect(() => {
    if (appointmentObj !== undefined && cookies !== '') {
      getCSDetails();
    }
  }, [appointmentObj, patient, cookies]);

  const handleSubmitSheet = async () => {
    console.log("disableFlag:",disableFlag);
    // disableAdvise
    if(disableFlag === true && disableAdvise === false){

      if(csid == ""){
        console.log("case sheet not updated");
        let headers = {
          authtoken: cookies,
        };
          const addobj = {
            appointmentId: appointmentObj.id,
            patientId: appointmentObj.customerId,
            parentId: appointmentObj.parentId,
            lab: lab,
            chiefComplaints: chiefComplaints, //array of obj
            vitals: vitals, //obj
            medicalHistory: medicalHistory, //obj
            healthRecords: HealthRecords, //obj
            notes: notes, //obj
            diagnosis: diagnosis, //array of obj
            medicinePrescription: medicineTempArr, //array of obj
            testPrescription: testTempArr, //array of obj
            followUpChatDays: followUpChatDays, //numer value
            adviceInstruction: adviceInstructions, //array of obj
            refferral: refferral, //obj
          };

          console.log("obj-cs", addobj);
          let url = config.API_URL + "/api/patient/addpatientcasesheet";
          setLoader(true);
          axios
            .post(url, addobj, { headers })
            .then((response) => {
              setLoader(true);
              console.log("add-response: ", response);
              setCsid(response.data.id);
              //handleARH();
              setLoader(false);
              setMsgData({
                message: `Case Sheet Saved for ${appointmentObj.customerName}`,
                type: "success",
              });
              console.log(`Case Sheet Saved for ${appointmentObj.customerName}`);
            })
            .catch((error) => {
              setLoader(false);
              setMsgData({
                message: error.response.data.errors[0].message,
                type: "error",
              });
            });
        
      }else{
        let url = config.API_URL + "/api/patient/addpatientcasesheet";
        let obj ={
          id: csid,
          appointmentId: appointmentObj.id,
          patientId: appointmentObj.customerId,
          parentId: appointmentObj.parentId,
          lab: lab,
          chiefComplaints: chiefComplaints, //array of obj
          vitals: vitals, //obj
          medicalHistory: medicalHistory, //obj
          healthRecords: HealthRecords, //obj
          notes: notes, //obj
          diagnosis: diagnosis, //array of obj
          medicinePrescription: tempMedData, //array of obj
          testPrescription: tempTestData, //array of obj
          followUpChatDays: followUpChatDays, //numer value
          adviceInstruction: adviceInstructions, //array of obj
          refferral: refferral, //obj
        }
        console.log("obj: ",obj)
        setLoader(true);
        axios
          .post(url, obj, { headers })
          .then((response) => {
            setLoader(true);
            console.log("add-response: ", response);
            //handleARH();
            setLoader(false);
            setMsgData({
              message: `Case Sheet Saved for ${appointmentObj.customerName}`,
              type: "success",
            });
            console.log(`Case Sheet Saved for ${appointmentObj.customerName}`);
          })
          .catch((error) => {
            setLoader(false);
            setMsgData({
              message: error.response.data.errors[0].message,
              type: "error",
            });
          });
      }
      
      return false;
    } else if(disableFlag === true){
      console.log("in if");
      if(csid == ""){
        console.log("case sheet not updated")
      }else{
        let url = config.API_URL + "/api/patient/updatehealthrecordincasesheet";
        setLoader(true);
        let obj ={
          id: csid,
          healthRecords: HealthRecords
        }
        axios
          .post(url, obj, { headers })
          .then((response) => {
            setLoader(true);
            console.log("add-response: ", response);
            //handleARH();
            setLoader(false);
            setMsgData({
              message: `Case Sheet Saved for ${appointmentObj.customerName}`,
              type: "success",
            });
            console.log(`Case Sheet Saved for ${appointmentObj.customerName}`);
          })
          .catch((error) => {
            setLoader(false);
            setMsgData({
              message: error.response.data.errors[0].message,
              type: "error",
            });
          });
      }
      
      return false;
    }
    let testTempArr = [];
    testPrescription.map((item)=>{
      if(item.serviceType != ""){
        testTempArr.push(item);
      }
    })
    let medicineTempArr = [];
    medicinePrescription.map((item)=>{
      if(item.nameOfTheDrug != ""){
        medicineTempArr.push(item);
      }
    })
    if (
      ((vitals.weigthInKgs === "" && vitals.weigthInKgsDate === "") ||
        (vitals.weigthInKgs !== "" && vitals.weigthInKgsDate !== "")) &&
      ((vitals.heigthInCms === "" && vitals.heigthInCmsDate === "") ||
        (vitals.heigthInCms !== "" && vitals.heigthInCmsDate !== "")) &&
      ((vitals.pulse === "" && vitals.pulseDate === "") ||
        (vitals.pulse !== "" && vitals.pulseDate !== "")) &&
      ((vitals.waistCircumference === "" &&
        vitals.waistCircumferenceDate === "") ||
        (vitals.waistCircumference !== "" &&
          vitals.waistCircumferenceDate !== "")) &&
      ((vitals.bloodPressureDiastolic === "" &&
        vitals.bloodPressureDiastolicDate === "") ||
        (vitals.bloodPressureDiastolic !== "" &&
          vitals.bloodPressureDiastolicDate !== ""))
    ) {
      let headers = {
        authtoken: cookies,
      };

      if (csid == "") {
        const addobj = {
          appointmentId: appointmentObj.id,
          patientId: appointmentObj.customerId,
          parentId: appointmentObj.parentId,
          lab: lab,
          chiefComplaints: chiefComplaints, //array of obj
          vitals: vitals, //obj
          medicalHistory: medicalHistory, //obj
          healthRecords: HealthRecords, //obj
          notes: notes, //obj
          diagnosis: diagnosis, //array of obj
          medicinePrescription: medicineTempArr, //array of obj
          testPrescription: testTempArr, //array of obj
          followUpChatDays: followUpChatDays, //numer value
          adviceInstruction: adviceInstructions, //array of obj
          refferral: refferral, //obj
        };

        console.log("obj-cs", addobj);
        let url = config.API_URL + "/api/patient/addpatientcasesheet";
        setLoader(true);
        axios
          .post(url, addobj, { headers })
          .then((response) => {
            setLoader(true);
            console.log("add-response: ", response);
            //handleARH();
            setCsid(response.data.id);
            setLoader(false);
            setMsgData({
              message: `Case Sheet Saved for ${appointmentObj.customerName}`,
              type: "success",
            });
            console.log(`Case Sheet Saved for ${appointmentObj.customerName}`);
          })
          .catch((error) => {
            setLoader(false);
            setMsgData({
              message: error.response.data.errors[0].message,
              type: "error",
            });
          });
      } else {

        const updateobj = {
          id: csid,
          appointmentId: appointmentObj.id,
          patientId: appointmentObj.customerId,
          parentId: appointmentObj.parentId,
          lab: lab,
          chiefComplaints: chiefComplaints, //array of obj
          vitals: vitals, //obj
          medicalHistory: medicalHistory, //obj
          healthRecords: HealthRecords, //obj
          notes: notes, //obj
          diagnosis: diagnosis, //array of obj
          medicinePrescription: medicineTempArr, //array of obj
          testPrescription: testTempArr, //array of obj
          followUpChatDays: followUpChatDays, //numer value
          adviceInstruction: adviceInstructions, //array of obj
          refferral: refferral, //obj
        };

        // Add isUpdatePdf param (only for doctor/assistant) when consultation is complete/error
        if (
          (userDetails.userType !== "dietician" || userDetails.userType !== "educator")
          && (appointmentObj.status === 'completed' || appointmentObj.status === 'error')
        ) {
          updateobj.isUpdatePdf = true;
          handleCaseSheetDialog(updateobj);
          return ;
        }

        console.log("obj-cs", updateobj);
        let url = config.API_URL + "/api/patient/updatepatientcasesheet";
        setLoader(true);
        axios
          .post(url, updateobj, { headers })
          .then((response) => {
            setLoader(true);
            console.log("up-response: ", response);
            //handleARH();
            setLoader(false);
            setMsgData({
              message: `Case Sheet Saved for ${appointmentObj.customerName}`,
              type: "success",
            });
            console.log(`Case Sheet Saved for ${appointmentObj.customerName}`);
          })
          .catch((error) => {
            setLoader(false);
            setMsgData({
              message: error.response.data.errors[0].message,
              type: "error",
            });
          });
      }
    } else {
      setMsgData({
        message: `Vitals: Both Value and the Date needs to be filled`,
        type: "error",
      });
    }
  };

  const [selectIndex, setSelectIndex] = useState(0);
  const openPast = (pastId, doctorId, assistantId, index, time, showdate) => {
    setLoader(true);

    axios
      .get(
        `${config.API_URL}/api/patient/appointmentcasesheet/${pastId}`, { headers }
      )
      .then((res) => {
        const pastCsRes = res.data;

        setVitals({
          weigthInKgs: pastCsRes.vitals.weigthInKgs,
          weigthInKgsDate: pastCsRes.vitals.weigthInKgsDate,
          heigthInCms: pastCsRes.vitals.heigthInCms,
          heigthInCmsDate: pastCsRes.vitals.heigthInCmsDate,
          bmi: pastCsRes.vitals.bmi,
          bmiDate: pastCsRes.vitals.bmiDate,
          bloodPressureDiastolic: pastCsRes.vitals.bloodPressureDiastolic, //bp
          bloodPressureDiastolicDate:
            pastCsRes.vitals.bloodPressureDiastolicDate, //bpdate
          waistCircumference: pastCsRes.vitals.waistCircumference,
          waistCircumferenceDate: pastCsRes.vitals.waistCircumferenceDate,
          pulse: pastCsRes.vitals.pulse,
          pulseDate: pastCsRes.vitals.pulseDate,
        });
        const datacc = pastCsRes.chiefComplaints.map((eachcomplaint) => {
          return {
            symptoms: eachcomplaint.symptoms,
            since: eachcomplaint.since,
            sinceUnit: eachcomplaint.sinceUnit,
            howOften: eachcomplaint.howOften,
            severity: eachcomplaint.severity,
            details: eachcomplaint.details,
          };
        });
        setchiefComplaints(datacc);
        setmedicalHistory({
          medicalHistory: pastCsRes.medicalHistory.medicalHistory,
          medicationHistory: pastCsRes.medicalHistory.medicationHistory,
          surgicalHistory: pastCsRes.medicalHistory.surgicalHistory,
          drugAllergies: pastCsRes.medicalHistory.drugAllergies,
          dietAllergiesOrRestrictions:
            pastCsRes.medicalHistory.dietAllergiesOrRestrictions,
          personalLifestyle: pastCsRes.medicalHistory.personalLifestyle,
          personalHabits: pastCsRes.medicalHistory.personalHabits,
          environmentalAndOccupationalHistory:
            pastCsRes.medicalHistory.environmentalAndOccupationalHistory,
          familyMedicalHistory: pastCsRes.medicalHistory.familyMedicalHistory,
          pagnencyDetails: pastCsRes.medicalHistory.pagnencyDetails,
        });
        setNotes({
          juniorDoctorNotes: pastCsRes.notes.juniorDoctorNotes,
          diagnosticTestResult: pastCsRes.notes.diagnosticTestResult,
          clinicalObservations: pastCsRes.notes.clinicalObservations,
          personalNotes: pastCsRes.notes.personalNotes,
        });

        setDiagnosis(pastCsRes.diagnosis);

        let datamedicine;
        if(pastCsRes.medicinePrescription.length > 0){
          datamedicine = pastCsRes.medicinePrescription.map(
            (eachmedicine) => {
              return {
                nameOfTheDrug: eachmedicine.nameOfTheDrug,
                intakeFrequency: eachmedicine.intakeFrequency,
                food: eachmedicine.food,
                otherNotes: eachmedicine.otherNotes,
                durationInDays: eachmedicine.durationInDays,
                MRP: eachmedicine.MRP,
                medicineType: eachmedicine.medicineType,
                administrationRoute: eachmedicine.administrationRoute,
                enabled: eachmedicine.enabled,
                numberOfUnits: eachmedicine.numberOfUnits,
                packOf: eachmedicine.packOf,
                gstInPercentage: eachmedicine.gstInPercentage,
                hsnCode: eachmedicine.hsnCode,
              };
            }
          );
        } else{
          datamedicine = ([
            {
              nameOfTheDrug: "",
              medicineType: "",
              intakeFrequency: "",
              food: "Before food",
              otherNotes: "",
              durationInDays: "",
              administrationRoute: "",
              enabled: false,
              numberOfUnits: 1,
              packOf: 0,
              MRP: 0,
              gstInPercentage: 0,
              hsnCode: "",
            },
          ])
        }
        setMedicinePrescription(datamedicine);
        let datatest;
        if(pastCsRes.testPrescription.length > 0){
          datatest = pastCsRes.testPrescription.map((eachtest) => {
            return {
              date: eachtest.date,
              lab: eachtest.lab,
              serviceType: eachtest.serviceType,
              enabled: eachtest.enabled,
              cost: eachtest.cost,
              preCondition: eachtest.preCondition,
              reportWaitingTime: eachtest.reportWaitingTime,
              addCollectionCharges: eachtest.addCollectionCharges,
            };
          });
        } else {
          datatest = [
            {
              date: DateInput,
              lab: "",
              serviceType: "",
              enabled: false,
              cost: 0,
              preCondition: "",
              reportWaitingTime: "",
              addCollectionCharges: false,
            },
          ]
        }

        setTestPrescription(datatest);
        setLab(pastCsRes.lab);
        setadviceInstructions(pastCsRes.adviceInstruction);
        setfollowUpChatDays(pastCsRes.followUpChatDays);
        setRefferral({
          consultSpecialty: pastCsRes.refferral.consultSpecialty,
          reason: pastCsRes.refferral.reason,
        });
        if (pastCsRes.healthRecords.patientReports) {
          const rt = pastCsRes.healthRecords.patientReports.map((eachhealth) => {
            return {
              documentName: eachhealth.documentName,
              documentURL: eachhealth.documentURL,
              documentType: eachhealth.documentType,
              documentDated: eachhealth.documentDated,
              uploadDate: eachhealth.uploadDate,
              refferredByDiahome: eachhealth.refferredByDiahome,
            };
          });
          setPatientDocument(rt);
          setHealthRecords({
            // patientPhotos: rt,
            patientReports: rt,
            // pastConsultations: rt,
          });
          setSelectIndex(index);
          setLoader(false);
          setMsgData({
            message: `Now view case sheet of ${appointmentObj.customerName} on ${showdate} ${time} below`,
            type: "success",
          });
        }
      }).catch((error) => {
        if(index===0){
          setSelectIndex(0);
          resetCaseSheet();
        }

        setMsgData({
          message: "Case sheet not filled yet",
          type: "error",
        });
        setLoader(false);
      });
  };

  function resetCaseSheet(){
    setLab("ARH");
    setchiefComplaints([{
        symptoms: "",
        since: "",
        sinceUnit: "day",
        howOften: "",
        severity: "Low",
        details: "",
      },]
    );
    setVitals({
      weigthInKgs: "",
      weigthInKgsDate: "",
      heigthInCms: "",
      heigthInCmsDate: "",
      bloodPressureDiastolic: "", //bp
      bloodPressureDiastolicDate: "", //bp
      // tempratureInFernite: "",
      // tempratureInFerniteDate: "",
      waistCircumference: "",
      waistCircumferenceDate: "",
      pulse: "",
      pulseDate: "",
      bmi: "",
      bmiDate: "",
    });
    setmedicalHistory({
      medicalHistory: "",
      medicationHistory: "",
      surgicalHistory: "",
      drugAllergies: "",
      dietAllergiesOrRestrictions: "",
      personalLifestyle: "",
      personalHabits: "",
      environmentalAndOccupationalHistory: "",
      familyMedicalHistory: "",
      pagnencyDetails: "",
    });
    setHealthRecords({
      // patientPhotos: PatientDocument,
      patientReports: PatientDocument,
      // pastConsultations: PatientDocument,
    });
    setNotes({
      juniorDoctorNotes: "",
      diagnosticTestResult: "",
      clinicalObservations: "",
      personalNotes: "",
    });
    setDiagnosis([""]);
    setMedicinePrescription([
      {
        nameOfTheDrug: "",
        medicineType: "",
        intakeFrequency: "",
        food: "Before food",
        otherNotes: "",
        durationInDays: "",
        administrationRoute: "",
        enabled: false,
        numberOfUnits: 1,
        packOf: 0,
        MRP: 0,
        gstInPercentage: 0,
        hsnCode: "",
      },
    ]);
    setTestPrescription([
      {
        date: DateInput,
        lab: "",
        serviceType: "",
        enabled: false,
        cost: 0,
        preCondition: "",
        reportWaitingTime: "",
        addCollectionCharges: false,
      },
    ]);
    setfollowUpChatDays(0);
    setadviceInstructions([""]);
    setRefferral({
      consultSpecialty: "--Select--",
      reason: "",
    });
  }
  useEffect(() => {
    // Prevent api call unless cookies jas
    if (cookies === '') {
      return ;
    }
    fetcUserData();
  }, [cookies]);

  const handleClickOpen = () => {
    setOpen(true);
    setLoader(true);
    axios
      .get(
        config.API_URL +
        `/api/patient/patientbyid/${appointmentObj.customerId}`,
        {
          headers,
        }
      )
      .then((response) => {
        setArhId(response.data.mhrId === 'NA' ? '' : response.data.mhrId);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };
  const handleClose = () => {
    // clearAddForm();
    setErrMsg(false);
    setOpen(false);
    setArhErr('');
  };

  const fetcUserData = () => {
    setLoader(true);
    axios
      .get(
        config.API_URL +
        `/api/patient/patientbyid/${appointmentObj.customerId}`,
        { headers }
      )
      .then((response) => {
        setLoader(false);
        setArhId(response.data.mhrId === 'NA' ? '' : response.data.mhrId);
      })
      .catch((error) => {
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
        console.log("Fetch User Err", error);
        setLoader(false);
      });
  };
  const [arhId, setArhId] = useState("");
  const [arhErr, setArhErr] = useState('');
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState(false);

  const handleARH = async () => {
    if (arhId === 'NA' || arhId === '') {
      setArhErr('Please enter valid ARH ID');
      return ;
    }

    let headers = {
      authtoken: cookies,
    };
    const mhrobj = {
      patientId: appointmentObj.customerId,
      mhrId: arhId,
    };

    setLoader(true);
    // console.log("obj-cs", mhrobj);
    let url = config.API_URL + "/api/patient/patientmhrid";
    axios
      .post(url, mhrobj, { headers })
      .then((response) => {
        console.log("arhid ", response);
        setLoader(false);
        setMsgData({
          message: `ARH ID Updated for ${appointmentObj.customerName}`,
          type: "success",
        });
        console.log(`ARH ID Updated for ${appointmentObj.customerName}`);
        handleClose();
      })
      .catch((error) => {
        setLoader(false);
        setMsgData({
          message: error.response.data.errors[0].message,
          type: "error",
        });
      });
  };

  const [csDialog, setCsDialog] = useState(0);
  const [updateObj, setUpdateObj] = useState({});

  const handleCaseSheetDialog = (updateobj) => {
    setCsDialog(1);
    setUpdateObj(updateobj);
  };

  const handleCloseCsDialog = (e) => {
    e.preventDefault();
    setCsDialog(0);
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <CaseSheetConfirmation
        open={csDialog}
        updateObj={updateObj}
        handleClose={handleCloseCsDialog}
        setLoader={setLoader}
        headers={headers}
        appointmentObj={appointmentObj}
        setMsgData={setMsgData}
      />
      <div style={{ overflowY: "hidden" }}>
        <div className={`patientCaseSheet ${showVideoSec && 'during-video-call'}`}>
          <div style={{backgroundColor:'gray',padding:'15px'}}>
            <div className="profileImage">
              <div
                style={{
                  display: "flex",
                }}
              >
                <div className="docImage" style={{ padding: "15px 0" }}>
                  <Avatar
                    src={
                      appointmentObj.customerProfileImageName !== "NA"
                        ? `${config.API_URL}/api/utility/download/${appointmentObj.customerProfileImageName}`
                        : ""
                    }
                    style={{
                      height: "110px",
                      width: "110px",
                      fontSize: "32px",
                      textTransform: "capitalize",
                      backgroundColor:
                        appointmentObj.customerName !== undefined &&
                        appointmentObj.customerName !== "" &&
                        getAvatarColor(appointmentObj.customerName),
                    }}
                  // style={{ backgroundColor: getAvatarColor }}
                  >
                    {getInitialsOfGender(appointmentObj.customerName)}
                  </Avatar>
                </div>
                <div className="patientInfo">
                  <Typography
                    style={{
                      color: "#00888a",
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "20px",
                      textTransform: "capitalize",
                    }}
                  >
                    {appointmentObj.customerName + " " +appointmentObj.customerLastName}
                  </Typography>
                  <p>
                    {`${appointmentObj.patientAge} ${getInitialsOfGender(
                      appointmentObj.customerGender
                    )}`}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "-15px",
                      marginBottom: "-8px",
                    }}
                  >
                    <p style={{ display: "flex" }}>
                      ARH ID:&nbsp;{arhId}
                      <div>
                        <EditIcon
                          onClick={handleClickOpen}
                          style={{
                            color: "#00888a",
                            cursor: "pointer",
                            marginLeft: "8px",
                            fontSize: "20px",
                          }}
                        />
                      </div>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                        className="arhDialog video-call-end-dialog"
                      >
                        <DialogTitle
                          id="form-dialog-title"
                          style={{ marginTop: "10px", marginLeft: "-5px" }}
                        >
                          <span>Edit ARH ID</span>
                          <img
                            style={{
                              height: "20px",
                              cursor: "pointer",
                              float: "right",
                              marginTop: "8px",
                              marginRight: "1px",
                            }}
                            src="crossIcon.png"
                            onClick={handleClose}
                          />
                        </DialogTitle>
                        <DialogContent>
                          {loader && (
                            <div className="loader">
                              <CircularProgress color="secondary" />
                              <div className="text"></div>
                            </div>
                          )}
                          <div>
                            <TextField
                              style={{ margin: 8, width: "94%", display: "none" }}
                              value={appointmentObj.customerId}
                            />
                          </div>
                          <div className="full-div arh-dialog">
                            <TextField
                              autoFocus
                              required
                              label="ARH Id"
                              error={Boolean(arhErr)}
                              helperText={arhErr}
                              style={{
                                width: "100%",
                                marginLeft: "-6px",
                              }}
                              margin="normal"
                              variant="filled"
                              value={arhId}
                              onChange={(e) => {
                                const newArh = e.target.value;

                                if (newArh === 'NA' || newArh === '') {
                                  setArhErr('Please enter valid ARH ID');
                                } else {
                                  setArhErr('');
                                }
                                setArhId(newArh);
                              }}
                            />
                          </div>
                        </DialogContent>
                        <DialogActions
                          style={{ margin: "5px", marginBottom: "15px" }}
                        >
                          <Button
                            onClick={handleClose}
                            color="primary"
                            className="back cancelBtn"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleARH}
                            color="#fff"
                            className="primary-button forward saveBtn"
                            style={{ marginRight: "18px" }}
                          >
                            Update
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </p>
                  </div>
                  <p style={{ marginTop: 0 }}>
                    Appointment Date: &nbsp;
                    {getDates(appointmentObj.appointmentDate)}
                    &nbsp;&nbsp;&nbsp;&nbsp;Time: &nbsp;
                    {getSlot(appointmentObj.appointmentSlotId)}
                  </p>
                </div>
              </div>
            </div>

            <PastConsultations
              appointment={consultations}
              loginValue={login}
              showMsg={setMsgData}
              openPast={openPast}
              select={selectIndex}
            />
          </div>
          {/* Health Record */}
          <div style={{padding:'15px',paddingTop:'0px'}}>
            <TestReports
              reports={PatientDocument}
              uploads={patientUploads}
              myreports={testreports}
              reportChange={uploadDataToFirebase}
              // FileName={cancelChequeFileName}
              deleteFile={deleteCancelChequevalue}
            // value={cancelChequevalue}
              disableFlag = {disableTestReport}
              csid = {csid}
              setMsgData={setMsgData}
              showVideoSec={showVideoSec}
              isFullScreen={isFullScreen}
            />

            {/* Vitals */}
            <Vitals handleVital={handleVital} vital={vitals} disableFlag = {disableFlag}/>

            {/* Chief Complaints */}
            <ChiefComplaints
              handleComplaints={handleComplaints}
              complaints={chiefComplaints}
              removeComplaints={handleRemoveComplaints}
              addComplaints={handleAddComplaints}
              disableFlag = {disableFlag}
            />

            {/* Patient Medical History  */}
            <PatientMedicalHistory
              handleMedical={handlePatientMedicalHistory}
              history={medicalHistory}
              disableFlag = {disableFlag}
            />

            {/*Notes */}
            <Notes handleNotes={handleNotes} notes={notes} disableFlag = {disableFlag}/>

            {/* Family Medical History */}
            {/* <FamilyMedicalHistory
              handleDiagnosis={handleDiagnosis}
              diagnosis={diagnosis}
              handleRemoveDiagnosis={handleRemoveDiagnosis}
              handleAddDiagnosis={handleAddDiagnosis}
            /> */}

            {/* Diagnosis */}
            <Diagnosis
              handleDiagnosis={handleDiagnosis}
              diagnosis={diagnosis}
              handleRemoveDiagnosis={handleRemoveDiagnosis}
              handleAddDiagnosis={handleAddDiagnosis}
              disableFlag = {disableFlag}
            />

            {/*  PhotosbyPatient */}
            <PhotosbyPatient
              files={patientUploads}
              showVideoSec={showVideoSec}
              isFullScreen={isFullScreen}
            />

            {/* Tests Prescription */}
            <TestsPrescription
              handleTests={handleTests}
              tests={testPrescription}
              removeTests={handleRemoveTests}
              addTests={handleAddTests}
              setMsgData={setMsgData}
              valuelab={lab}
              handleLab={handleLab}
              disableFlag = {disableFlag}
              onTestArrowClic = {onTestArrowClic}
            />

            {/* Medical prescription */}
            <MedicalPrescription
              hanldeMedicines={handleMedicines}
              medicines={medicinePrescription}
              addMedicines={handleAddMedicines}
              removeMedicines={handleRemoveMedicines}
              setMsgData={setMsgData}
              disableFlag = {disableFlag}
              onArrowClic ={onArrowClic}
            />

            {/* Follow up chat days */}
            <FollowUp
              handleFollow={handleFollow}
              followup={followUpChatDays}
              followupError={followError}
              disableFlag = {disableFlag}
            />

            {/* Advice /Instructions */}
            <Advice
              handleAdvice={handleAdvice}
              advices={adviceInstructions}
              handleRemoveAdvice={handleRemoveAdvice}
              handleAddAdvice={handleAddAdvice}
              disableFlag = {disableAdvise}
            />

            {/* Referral */}
            <Referral handleRefferal={handleRefferal} refferral={refferral} disableFlag = {disableFlag}/>
            {/* <div style={{ marginBottom: "150px" }}></div> */}
          </div>
        </div>
        {selectIndex === 0 &&
          <div className="case-sheet-btn-group">
            <Button
              variant="contained"
              className="cs-refresh-btn"
              onClick={handleDownloadCS}
            >
              Download
            </Button>

            <Button
              variant="contained"
              className="cs-refresh-btn"
              onClick={getCSDetails}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              color="primary"
              className="save-sheet"
              onClick={handleSubmitSheet}
            >
              Save
            </Button>
          </div>}
      </div>
    </>
  );
}

export default DoctorHomePage;
