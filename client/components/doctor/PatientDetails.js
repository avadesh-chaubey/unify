import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Divider,
  Grid,
  Avatar
} from '@material-ui/core';
import axios from 'axios';
import config from "../../app.constant";
import moment from 'moment';
import { getHexColor } from '../../utils/nameDP';
import { getInitialsOfGender } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  // Fix the scroll issue when family members are increasing
  root: {
    backgroundColor: "#eee",
    height: 'calc(100vh - 50px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  avatar: {
    height: "100px",
    width: "100px",
    position: 'relative',
    left: 44,
    marginTop: '15px',
    fontSize: '3rem',
  },
  patientName: {
    fontSize: '1.3rem',
    fontWeight: 600,
  },
  patientDetailsField: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#00000042',
    padding: 5,
  },
  patientBasic: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#767676',
    padding: 5,
  },
  details: {
    marginTop:'15px',
    marginLeft: '50px',
  },
  familyDes: {
    marginBottom:'20px',
  },
  gridRoot: {
    // width: 'fit-content',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#eee",
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 14,
    '& svg': {
      margin: theme.spacing(1.5),
    },
    '& hr': {
      margin: '0 15px',
    },
  },
  alignName: {
    display: 'block',
    fontWeight: 600,
    textAlign: 'center',
    left: '30px',
    width: '100px',
    position: 'relative',
  },
  alignRelationship: {
    position: 'relative',
    bottom: 22,
    fontSize: '14px',
    color: 'grey'
  },
  familyMember : {
    fontSize: '14px',
  },
  avatarMember: {
    height: "75px",
    width: "75px",
    position: 'relative',
    left: 44,
    marginTop: '15px',
    fontSize: '3rem',
  }
}));

const PatientDetails = ({ details }) => {
  const classes = useStyles();
  const [patient, setPatient] = useState([]);
  const [members, setMembers] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [cookies, setCookies] = useState('');
  const [arhId, setArhId] = useState('NA');

  const headers = {
    authtoken: cookies,
    "Content-type": "application/json",
  };

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }

    if (details !== undefined && patient.length === 0 && cookies !== '') {
      axios.get(
        `${config.API_URL}/api/patient/showpatientdetails/${details.customerId}`,
        {headers}
      ).then(res => {
        const data = res.data;
        console.log("Patient Details res", data);
        const patient = data.appointments;
        const caseSheet = data.casesheets;

        setPatient(patient[patient.length - 1]);

        // Get the case-sheet data for current appointment
        if (caseSheet.length) {
          const getSelectedCS = caseSheet.filter((csObj) => {
            return csObj.appointmentId === details.id;
          });

          // Set vitails when casesheet data is present for current appointment
          if (getSelectedCS.length) {
            setVitals(getSelectedCS[0].vitals);
          }
        }
        
        setMembers(res.data.members);
        return res.data;
      })
      .then(() => {
        // Api to get the ARH ID of the patient
        axios
          .get(
            config.API_URL +
              `/api/patient/patientbyid/${details.customerId}`,
            {
              headers,
            }
          )
          .then(res => {
            if (res.data.mhrId !== 'NA') {
              //Set updated ARH ID
              setArhId(res.data.mhrId);
            }
          })
          .catch(err => console.log('Error occurred while getting arh id', err));
      })
      .catch(err => console.log('patient err', err));
    }
    
  },[details, patient, cookies]);

  const addAgeOfPatient = (dob) => {
    const momentObj = moment();
    const patientBirthYear = moment(new Date(dob), "YYYY");
    const ageDifference = momentObj.diff(patientBirthYear, "years");

    return isNaN(ageDifference) ? 0 : ageDifference;
  };

  const calculateBMI = (height, weight) => {
    const bmi = Math.floor(weight / Math.pow(height/100, 2));
    return isNaN(bmi) ? '--' : bmi;;
  };

  const makeInitialCapital = (str) => {
    let word = str.toLowerCase().split(" ");
    for (let i = 0; i < word.length; i++) {
      word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
    }
    return word.join(" ");
  };

  return (
    <div className={classes.root}>
      <div className="user-intro" style={{ display: 'inline-flex', marginBottom: '15px' }}>
        <div style={{ display: 'flex'}}>
          <Avatar
            src={patient.customerProfileImageName !== 'NA'
              ? `${config.API_URL}/api/utility/download/${patient.customerProfileImageName}`
              : ''
            }
            className={classes.avatar}
            style={{ backgroundColor: patient.customerName !== undefined && getHexColor(patient.customerName) }}
          >
            { patient.customerName !== undefined && getInitialsOfGender(patient.customerName) }
          </Avatar>
        </div>
        <div className="basic-details">
          <span className={`patient-name ${classes.patientName}`}>
            { patient.customerName !== undefined
              ? `${makeInitialCapital(patient.customerFirstName)} ${makeInitialCapital(patient.customerLastName)}`
              : '' 
            }
          </span>
          <br />
          <Grid container alignItems="center" className={classes.gridRoot}>
            <span>
              { patient.customerGender ?? '' }
            </span>
            <Divider orientation="vertical" flexItem />
            <span>
              { addAgeOfPatient(patient.customerDateOfBirth) } years
            </span>
          </Grid>

          <span style={{ fontWeight: 600, color: '#929292' }}>
            ARH ID: { arhId !== 'NA' ? arhId : '' }
          </span>
        </div>
      </div>

      <Divider />

      <Grid container spacing={1} className={classes.details}>
        <Grid item xs={2}>
          <Typography variant="h6" className={classes.patientDetailsField}>Height</Typography>
          <Typography variant="h6" className={classes.patientDetailsField}>Weight</Typography>
          <Typography variant="h6" className={classes.patientDetailsField}>BMI</Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="h6" className={classes.patientBasic}>
            {
              (vitals.heigthInCms !== '' && vitals.heigthInCms !== undefined)
              ? `${vitals.heigthInCms} cms`
              : '--'
            }
          </Typography>
          <Typography variant="h6" className={classes.patientBasic}>
            {
              (vitals.weigthInKgs !== '' && vitals.weigthInKgs !== undefined)
              ? `${vitals.weigthInKgs} Kg`
              : '--'
            }
          </Typography>
          <Typography variant="h6" className={classes.patientBasic}>
            { calculateBMI(vitals.heigthInCms, vitals.weigthInKgs) }
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="h6" className={classes.patientDetailsField}>Waist Circumference</Typography>
          <Typography variant="h6" className={classes.patientDetailsField}>Blood Pressure</Typography>
          <Typography variant="h6" className={classes.patientDetailsField}>Pulse</Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="h6" className={classes.patientBasic}>
            {
              (vitals.waistCircumference !== '' && vitals.waistCircumference !== undefined)
              ? `${vitals.waistCircumference} cms`
              : '--'
            }
          </Typography>
          <Typography variant="h6" className={classes.patientBasic}>
            {
              vitals.bloodPressureSystolic !== undefined && vitals.bloodPressureSystolic !== ''
                ? `${vitals.bloodPressureSystolic}/`
                : ''
            }{
              (vitals.bloodPressureDiastolic !== undefined && vitals.bloodPressureDiastolic !== '')
              ? `${vitals.bloodPressureDiastolic} mmHg`
              : '--'
            }
          </Typography>
          <Typography variant="h6" className={classes.patientBasic}>
            {
              (vitals.pulse !== undefined && vitals.pulse !== '')
              ? `${vitals.pulse} beats/min`
              : '--'
            }
          </Typography>
        </Grid>
      </Grid>

      <Divider style={{ marginTop: 20 }} />

      <Grid container spacing={1} className={classes.familyDes}>
        {
          members.map((d, index) => {
            if (d.userFirstName === patient.customerName) {
              return ;
            }

            return (
              <Grid item xs={2} key={index}>
                <Avatar
                  style={{ backgroundColor: getHexColor(d.userFirstName) }}
                  className={classes.avatarMember}
                  src={d.profileImageName !== 'NA' && `${config.API_URL}/api/utility/download/${d.profileImageName}`}
                >
                  { getInitialsOfGender(d.userFirstName) }
                </Avatar>
                <span className={`patient-name ${classes.familyMember} ${classes.patientName} ${classes.alignName}`}>
                  { makeInitialCapital(d.userFirstName) }
                </span>
                <br />
                <Typography
                  variant="body1"
                  className={`${classes.alignName} ${classes.alignRelationship}`}
                >
                  {makeInitialCapital(d.relationship)}
                </Typography>
              </Grid>
            )
          })
        }
      </Grid>
    </div>
  );
};

export default PatientDetails;