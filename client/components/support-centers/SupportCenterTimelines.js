import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import config from '../../app.constant';
import { useCookies } from "react-cookie";
import { getHexColor } from '../../utils/nameDP';
import { getInitialsOfGender, getAppointmentTime, makeInitialCapital } from '../../utils/helpers';
import {
  Grid, Paper, Avatar, Link, Tooltip, Typography, Button
} from '@material-ui/core';
import {
  Timeline, TimelineSeparator, TimelineItem, TimelineConnector,
  TimelineContent, TimelineDot
} from '@material-ui/lab';

export default function SupportCenterTimelines (props) {
  const { patientSelected } = props;

  const [cookies, getCookie] = useCookies(["name"]);
  const [pastConsultation, setPastConsultation] = useState('');
  const [caseSheet, setCaseSheet] = useState('');

  const headers = {
    authtoken: cookies["express:sess"],
    "Content-type": "application/json",
  };

  useEffect(() => {
    axios
      .get(
        `${config.API_URL}/api/patient/showpatientdetails/${patientSelected.customerId}`,
        { headers }
      )
      .then(res => {
        // Get all appointments and case-sheet
        const appointments = res.data.appointments;
        const caseSheets = res.data.casesheets;

        const allCons = appointments.map((eachappoint) => {
          eachappoint.sortOption = -1;
          if(eachappoint.id === patientSelected.customerId){
            eachappoint.currentAppointment = true;
            eachappoint.sortOption = 1;
          }

          return eachappoint;
        });

        // Sort All appointments
        const sortAppointments = allCons.sort((a, b) => b.sortOption - a.sortOption);
        setPastConsultation(sortAppointments);
        setCaseSheet(caseSheets);
      })
      .catch(err => console.log('Show patient details err', err));
  }, []);

  return (
    <div className="patient-timeline">
      <div className="timeline-main">
        <Paper className="timeline-paper">
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Timeline className="patient-timeline">

                <TimelineItem className="timeline-avatar">
                  <TimelineSeparator>
                    <Avatar
                      src={patientSelected.customerProfileImageName !== 'NA'
                        ? `${config.API_URL}/api/utility/download/${d.customerProfileImageName}`
                        : ''
                      }
                      style={{ backgroundColor: getHexColor(patientSelected.customerName) }}
                    >
                      { getInitialsOfGender(patientSelected.customerName) }
                    </Avatar>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="customer-name-inline">
                      <Typography variant="body1" className="customer-name-timeline">
                        { patientSelected.customerName }
                      </Typography>

                      <Typography variant="body1" className="customer-name-timeline">
                        { patientSelected.age }
                      </Typography>

                      <Typography variant="body1">
                        { getInitialsOfGender(patientSelected.customerGender) }
                      </Typography>
                    </div>
                    <div className="customer-name-inline">
                      <Typography variant="body1" className="appointment-details current-app-time">
                        { patientSelected.appointmentSlot} 
                      </Typography>

                      <Typography variant="body1" className="appointment-details current-app-time">
                        { moment(patientSelected.appointmentDate).format('DD MMM, YY') } 
                      </Typography>
                    </div>
                  </TimelineContent>
                </TimelineItem>

                { pastConsultation !== '' && pastConsultation.map((d, index) => (
                  <TimelineItem key={ index }>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="customer-name-inline">
                        <Typography
                          variant="body1"
                          className="customer-name-timeline doc-name-timeline"
                        >
                          { d.consultantName }
                        </Typography>
                      </div>
                      <div className="customer-name-inline">
                        <Typography
                          variant="body1"
                          className="appointment-details current-app-time"
                        >
                          { getAppointmentTime(d.appointmentSlotId)} 
                        </Typography>

                        <Typography
                          variant="body1"
                          className="appointment-details current-app-time"
                        >
                          { moment(d.appointmentDate).format('DD MMM, YY') } 
                        </Typography>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}

              </Timeline>
            </Grid>

            <Grid item xs={2} className="profession">
              { pastConsultation !== '' && pastConsultation.map((d, index) => (
                <Typography key={index} variant="body1" className="profession">
                  { makeInitialCapital(d.consultationType) }
                </Typography>
              ))}
            </Grid>

            <Grid item xs={4} className="doctor-remark">
              { caseSheet !== '' && caseSheet.map((d, index) => (
                <Typography key={index} variant="body1" className="profession">
                  { d.adviceInstruction[d.adviceInstruction.length - 1] }
                </Typography>
              ))}
            </Grid>

            <Grid item xs={2} className="doctor-fees">
              { pastConsultation !== '' && pastConsultation.map((d, index) => (
                <Button key={index} variant="contained" className="consultation-fee">
                  {`₹ ${d.basePriceInINR}`}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
}
