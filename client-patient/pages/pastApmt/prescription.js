import React, {useState, useEffect} from 'react';
import Header from "../../components/consultationServices/Header";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import PrintIcon from '@material-ui/icons/Print';
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles((theme) => ({
    topIcons:{
        margin:"15px",
        display:"block",
        height:"30px"
    },
    rightIcons: {
        margin:"0 10px",
        color: "#424242",
        cursor:"pointer",
        float:"right"
    },
    root:{
        border:"2px solid #7b7b7b",
        width:"auto",
        display:"block",
        padding:"15px",
        margin:"20px",
        overflow:"hidden"
    },
    imageDiv:{
        background: "#ecf0f2ad",
        padding: "10px 0",
        textAlign: "center",
    },
    doctorDetails:{
        background: "#ecf0f2ad",
        padding: "10px 20px",
        margin: "10px 0"
    },
    docName:{
        color: "#424242",
        fontSize: "22px",
        // fontWeight: "bold",
        padding: "10px 0",
        fontFamily: "'Avenir_Black' !important"
    },
    docEdu:{
        fontSize: "12px",
        color: "#7b7b7b,"
    },
    phone:{
        float:"left",
        marginRight: "50px",
        fontSize: "14px",
        fontFamily: "'Avenir_heavy' !important",
    },
    contact:{
        paddingBottom:"10px"
    },
    contactIcon:{
        margin: "-5px 0",
        marginRight: "15px",
        color:"#502e92"
    },
    email:{
        fontSize: "14px",
        fontFamily: "'Avenir_heavy' !important",
    },
    patientDetails:{
        fontSize:"14px",
        color: "#424242",
        padding: "10px 20px",
        // margin: "10px 0",
        width:"100%",
        position:"relative",
        display:"inline-block"
    },
    patientDetailsInner:{
        float:"left",
        width:"33%",
        margin:"10px 0"
    },
    patientTitle:{
        minWidth:"110px",
        display:"inline-block"
    },
    patientValue:{
        
    },
    vitalDetails:{
        borderTop:"1px solid",
        borderBottom:"1px solid",
        fontSize:"14px",
        color: "#424242",
        margin: "10px 20px",
        padding: "20px 0px",
        width:"calc(100% - 40px);",
        position:"relative",
        display:"inline-block"
    },
    vitalText:{

    },
    vitalInner:{
        float:"left",
        marginTop:"10px",
        marginRight:"40px"
    },
    vitalTitle:{
        fontFamily: "Avenir_black !important"
    },
    vitalValue:{
        
    },
    complaintsAndDiag:{
        fontSize:"14px",
        color: "#424242",
        padding: "10px 20px",
        // margin: "10px 0",
        width:"100%",
        position:"relative",
        display:"inline-block"
    },
    complaintsAndDiagValue:{
        fontFamily: "Avenir_black !important"
    },
    tableRoot:{
        borderRadius:"0",
        boxShadow:"none"
    },
    table: {
        minWidth: 650,
    },
    tableHead:{
        background:"#d8e6f8",

    },
    tableHeadText:{
        fontFamily: "Avenir_black !important",
        fontSize:"13px",
        color: "#424242",
    },
    tableItemRow:{
        borderBottom:"2px solid #7b7b7b"
    },
    tableItem:{
        fontSize:"13px",
        color: "#424242",
        height:"80px"
    },
    disclamer:{
        fontSize: "14px",
        color: "#7b7b7b",
        padding: "10px 20px",
        width: "1030px",

    }
  }));
  function createData(serialNo, dType, dName, dose, comment) {
    return { serialNo, dType, dName, dose, comment };
  }
  
  const rows = [
    createData(1, "ADVICE", {name:"DIET AND EXERCISE",details:""}, {dose:"0-0-0",relation:""}, ""),
    createData(2, "INSULIN", {name:"TRESIBA PENFILL",details:"(Degludec)"}, {dose:"0-0-14",relation:"[At Bed Time]"}, ""),
    createData(3, "INSULIN", {name:"NOVORAPID PENFILL",details:"(Cartridge)"}, {dose:"0-0-10",relation:"[15 min Before Food]"}, ""),
    createData(4, "TABLET", {name:"GLYNASE XL5MG TAB",details:"(Glipizide)"}, {dose:"1-0-0",relation:"[1/2hr Before Breakfast]"}, ""),
    createData(5, "TABLET", {name:"GLUCOBAY 25MG TAB",details:"(Acarbose)"}, {dose:"0-0-1",relation:"[With food]"}, ""),
  ];
function prescription() {
  const classes = useStyles();

    return (
        <div>
            <Header />
            <HeadBreadcrumbs title1={"Consults"} title2 = {"Past Appointment"} title3 = {"Prescription"} mainTitle = {"Prescription"} />

            <div>
                <div className={classes.topIcons}>
                    <GetAppIcon className={classes.rightIcons} />
                    <PrintIcon className={classes.rightIcons} />
                    <ShareIcon className={classes.rightIcons} />

                </div>
                <div className={classes.root}>
                    <div className={classes.imageDiv} >
                      <img
                        src="/home_page_logo.png"
                        style={{height: "85px"}}
                        />
                    </div>
                    {/* Doctor Details */}
                    <div className={classes.doctorDetails}>
                        <div className={classes.docName}>
                            Dr. Anjali Mehta
                        </div>
                        <div className={classes.docEdu}>
                            MD (Int. Med), MRCPS(GLASSGOW), FIMSA, FICM (Crit. Care), PGDD (Diab, UK)
                        </div>
                        <div className={classes.docName} style={{margin:"10px 0"}}>
                            Registration No: 83107
                        </div>
                        <div className={classes.contact}>
                            <div className={classes.phone}>
                                {/* <PhoneIcon className={classes.contactIcon}/> */}
                                <img src='../Phone.svg' className={classes.contactIcon} style={{height:"20px"}} />
                                7540001234
                            </div>
                            <div className={classes.email}>
                                <MailOutlineIcon className={classes.contactIcon}/>
                                care@rainbow.com
                            </div>
                        </div>

                    </div>
                    {/* Patients Details */}
                    <div className={classes.patientDetails}>
                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                MRD No
                            </span>
                            <span className={classes.patientValue}>
                                :AR________________
                            </span>
                        </div>
                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                Date & Time
                            </span>
                            <span className={classes.patientValue}>
                                :dd/mm/yyyy at _________
                            </span>
                        </div>
                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                Consult Type
                            </span>
                            <span className={classes.patientValue}>
                                :Online
                            </span>
                        </div>
                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                Patient Name
                            </span>
                            <span className={classes.patientValue}>
                                :Mr. Sidharth Sharma
                            </span>
                        </div>

                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                Age/Gender
                            </span>
                            <span className={classes.patientValue}>
                                :36 Male
                            </span>
                        </div>

                        <div className={classes.patientDetailsInner}>
                            <span className={classes.patientTitle}>
                                Appointment ID
                            </span>
                            <span className={classes.patientValue}>
                                :_________________
                            </span>
                        </div>
                    </div>
                    {/* Vitals */}
                    <div className={classes.vitalDetails}>
                        <div className={classes.vitalText}>
                            Vitals (performed at home by health assistant/as decleared by patient)
                        </div>
                        
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                BP:
                            </span>
                            <span className={classes.vitalValue}>
                                120/80 mm/Hg
                            </span>
                        </div>
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                Pulse:
                            </span>
                            <span className={classes.vitalValue}>
                                82 bpm
                            </span>
                        </div>
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                Height:
                            </span>
                            <span className={classes.vitalValue}>
                                180cm
                            </span>
                        </div>
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                Weight:
                            </span>
                            <span className={classes.vitalValue}>
                                100 kg
                            </span>
                        </div>
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                Temperature:
                            </span>
                            <span className={classes.vitalValue}>
                                99 F
                            </span>
                        </div>
                        <div className={classes.vitalInner}>
                            <span className={classes.vitalTitle}>
                                BMI:
                            </span>
                            <span className={classes.vitalValue}>
                                30.86 Kg/m
                            </span>
                        </div>
                    </div>

                    {/* Complaints */}
                    <div className={classes.complaintsAndDiag}>
                        <span>Complaints: </span>
                        <span className={classes.complaintsAndDiagValue}>GIDDINESS, PALPITATION, DYSPNOEA, POLYURIA</span>
                    </div>
                    <div className={classes.complaintsAndDiag}>
                        <span>Diagnosis: </span>
                        <span className={classes.complaintsAndDiagValue}>TYPE 2 DIABETES, HYPERTENSION, HYPERLIPIDEMIA</span>
                    </div>
                    {/* Table */}
                    <div style={{margin:"20px"}}>
                        <TableContainer component={Paper} className={classes.tableRoot}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell align="left" className={classes.tableHeadText}>S.N0</TableCell>
                                        <TableCell align="left" className={classes.tableHeadText}>DRUG TYPE</TableCell>
                                        <TableCell align="left" className={classes.tableHeadText}>DRUG NAME</TableCell>
                                        <TableCell align="left" className={classes.tableHeadText}>DOSE/RELATION TO FOOD</TableCell>
                                        <TableCell align="left" className={classes.tableHeadText}>COMMENTS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.serialNo} className={classes.tableItemRow}>
                                        <TableCell className={classes.tableItem}>
                                            {row.serialNo}
                                        </TableCell>
                                        <TableCell className={classes.tableItem} align="left">{row.dType}</TableCell>
                                        <TableCell className={classes.tableItem} align="left">
                                            {row.dName.name}
                                            <br />
                                            {row.dName.details}
                                        </TableCell>
                                        <TableCell className={classes.tableItem} align="left">
                                            {row.dose.dose}
                                            <br />
                                            {row.dose.relation}
                                        </TableCell>
                                        <TableCell className={classes.tableItem} align="left">{row.comment}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    {/* Advice  */}
                    <div className={classes.complaintsAndDiag}>
                        Advice: Restrict Sugar, Low salt intake, reduce oil uses while cooking
                    </div>
                    <div className={classes.complaintsAndDiag}>
                        <div style={{float:"left"}}>
                            <span className={classes.vitalTitle} style={{fontStyle:"italic"}}>Test Prescribed: </span>
                            <span>HBA1C, LIPID PROFILE, CREATINNE</span>
                        </div>
                        <div style={{float:"right"}}>
                            <span className={classes.vitalTitle} style={{fontStyle:"italic"}}>Next visit: </span>
                            <span>10/07/2021</span>
                        </div>
                    </div>
                    <div className={classes.complaintsAndDiag}>
                        Priscribed on 10/06/2021
                    </div>

                    <div className={classes.complaintsAndDiag} style={{marginTop:"40px"}}>
                        <span>Signature</span>
                        <div className={classes.docName} style={{marginTop:"15px"}}>
                            Dr. Anjali Mehta
                        </div>
                        <span>Consultant Physician</span>
                    </div>
                    <div style={{width:"calc(100% - 40px);", margin:"10px 20px", borderTop:"1px solid #424242"}}>
                    </div>
                    {/* Disclamer */}
                    <div className={classes.disclamer}>
                        Disclamer: This prescription is issued on the basis of your inputs during teleconsultation. It is validfrom the date of issue until the specific period/dosage of each medicineas advised.
                    </div>
                    <div className={classes.vitalTitle} style={{padding:"10px 20px", fontStyle:"italic", color:"#424242"}}>To reduce the dose of Tablet/Insulin if low sugar symptoms occur</div>
                </div>
            </div>

        </div>
    )
}

export default prescription
