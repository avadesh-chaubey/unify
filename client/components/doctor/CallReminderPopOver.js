import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import config from '../../app.constant';
import {useCookies} from 'react-cookie';
import moment from 'moment';
import { set } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function CallReminderPopOver(params) {

  const {appointmentObj, setMsgData, updateCallTimeList} = params;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectDate, setSelectedDate] = useState(
    appointmentObj.assistantAppointmentDate !== 'NA'
    ? moment(
      appointmentObj.assistantAppointmentDate
    ).format('DD.MM.YYYY')
    : ''
  );
  const [selectTime, setSelectedTime] = useState('');
  const [showCallTime, setShowCallTime] = useState(false);
  const [dateNtime, setDateNtime] = useState(false);
  const [cookies] = useCookies(['name']);
  const [getUserType, setUserType] = useState('');
  const formattedTime = appointmentObj.assistantAppointmentDate !== 'NA' ? moment(
    `${appointmentObj.assistantAppointmentDate} ${appointmentObj.assistantAppointmentSlotId}`
  ).format('hh:mm A') : '';
  const currDate = moment(new Date()).format('YYYY-MM-DD');
  const compareDate = moment(currDate).isSame(appointmentObj.assistantAppointmentDate);
  const formatDate = compareDate
    ? ''
    : `, ${moment(appointmentObj.assistantAppointmentDate).format('MMM DD YYYY')}`;
  const callTime = `CALL AT - ${formattedTime}${formatDate}`;
  const expiredAppoint = moment(appointmentObj.appointmentDate).isBefore(currDate);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserType(userDetails['userType']);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelectDate = (e) => {
    e.preventDefault();
    const date = moment(e.target.value).format('DD.MM.YYYY');

    setSelectedDate(date);
  }

  const onSelectTime = (e) => {
    e.preventDefault();
    setSelectedTime(e.target.value);
  };

  const setReminderCall = (e) => {
    e.preventDefault();
    const headers = {
      authtoken: cookies["express:sess"],
      "Content-type": "application/json",
    };

    // Ready for consult
    // appointmentDateAndTime, consecutiveBookedSlots,

    // { appointmentId,  newAppointmentState:ready:for:doctor:consultation }
    
    // appointmentSlotId: appointmentObj.assistantAppointmentSlotId, 
    
    // consecutiveBookedSlots: 1, 

    axios.post(
      `${config.API_URL}/api/appointment/updateassistantappointment`,
      {
        appointmentId: appointmentObj.id, 
        appointmentDateAndTime: `${selectDate} ${selectTime}`,
      },
      {headers}
    ).then(res => {
      // Update the Set Call Link with date
      const data = res.data;
      const app = appointmentObj;
      app.assistantAppointmentDate = data.assistantAppointmentDate;
      app.assistantAppointmentSlotId = data.assistantAppointmentSlotId;
      updateCallTimeList(app);

      setMsgData({message:'Call Time Updated...'});
      handleClose();
    })
    .catch(err => {
      handleClose();
      setMsgData({
        message: err.response.data.errors[0].message ?? 'Unable to update appointment',
        type: "error"
      });

      // Reset the form with current selected date
      setSelectedDate(
        appointmentObj.assistantAppointmentDate !== 'NA'
        ? moment(
          appointmentObj.assistantAppointmentDate
        ).format('DD.MM.YYYY')
        : ''
      );
    });
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      {
        (
          getUserType === 'physician:assistant'
          && appointmentObj.appointmentStatus === 'case:history:pending'
          && !expiredAppoint
        ) &&
        (
          <React.Fragment>
            <Link
              className="set-call-time-link"
              aria-describedby={id}
              variant="contained"
              color="primary"
              onClick={handleClick}
          >
              {
                appointmentObj.assistantAppointmentDate !== 'NA'
                ? callTime
                : 'SET CALL TIME'
              }
            </Link>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                <Typography className={classes.typography}>
                  Date
                </Typography>
                <TextField
                  id="date"
                  type="date"
                  defaultValue={
                    appointmentObj.assistantAppointmentDate !== 'NA'
                    ? appointmentObj.assistantAppointmentDate
                    : selectDate
                  }
                  onChange={onSelectDate}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                <Typography className={classes.typography}>
                  Time
                </Typography>
                <TextField
                  style={{ paddingRight: 10 }}
                  id="time"
                  type="time"
                  defaultValue={
                    appointmentObj.assistantAppointmentSlotId !== 'NA'
                    ? appointmentObj.assistantAppointmentSlotId
                    : ''
                  }
                  onChange={onSelectTime}
                />
                <Button style={{ marginRight: 10 }} onClick={setReminderCall} variant="contained" color="primary">OK</Button>
              </div>
              
              
            </Popover>
          </React.Fragment>
        )
      }
    </div>
  );
}