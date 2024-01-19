import React, {useState, useEffect} from 'react';
import moment from 'moment';
import config from '../../app.constant';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Avatar } from '@material-ui/core';
import LabelBreadCrumb from './LabelBreadCrumb';
import CallReminderPopOver from './CallReminderPopOver';
import { Grid, Typography } from '@material-ui/core';
import { getHexColor } from '../../utils/nameDP';
import time from "../../data/time.json";

const useStyles = makeStyles((theme) => ({
  appointmentTime: {
    width: '100%',
    fontWeight: '600',
    color: '#3e3eb7'
  },
  tabs: {
    width: '500px'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    overflowY: 'hidden',
    marginTop: '2px',
    backgroundColor: '#EDEDED',
  },
  chatList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '1px',
  },
  chat: {
    display: 'flex',
    flex: 3,
    flexDirection: 'column',
    borderWidth: '1px',
    borderColor: '#a0a0a0',
    borderRightStyle: 'solid',
    borderLeftStyle: 'solid',
  },
  appointmentList: {
    minHeight: 'calc(100vh - 100px)',
    height: '100vh',
    overflowY: 'auto',
    marginTop: '10px',
    backgroundColor: '#e8e8e8',
  },
  active: {
    border: '2px solid rgba(65, 154, 249, 0.99)',
    backgroundColor: 'rgba(65, 154, 249, 0.3) !important',
  },
  activeCard: {
    borderRadius: '4px',
    border: 'solid 2px #2188cb',
    backgroundColor: '#e1efff',
  },
  chatListHover: {
    '&:hover' : {
      cursor: 'pointer',
      backgroundColor: '#e1efff',
    }
  },
  alertNotify: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AppointmentList = (params) => {
  const classes = useStyles();
  const {
    listOfAppointment,
    selectedIndex,
    makeInitialCapital,
    handleOnClickList,
    setMsgData,
    enableSort,
    updateCallTimeList,
    appointmentTimeMode,
  } = params;
  const currDate = moment(new Date()).format('YYYY-MM-DD');

  useEffect(() => {
    // smooth scroll to element and align it at the bottom
    if (listOfAppointment.length) {
      const element = window.document.querySelector('.app-active-card');
      if (element !== null) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end'});
      }
    }
  }, [ listOfAppointment, selectedIndex ]);

  // Function to get the initial letter of gender
  const getInitialsOfGender = (gender) => {
    let name = gender !== null ? gender : 'Male';
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '')
    ).toUpperCase();

    return initials;
  };

  const calculateLeftMargin = (d) => {

    if (
      (d.status === 'ready:for:doctor:consultation' && !d.appointmentRescheduleEnabled)
      || ((d.appointmentStatus === "completed:with:error" && d.appointmentRescheduleEnabled))
      ) {
      return 'ready-for-consult-app-status';
    } else if ( d.status === 'ready:for:doctor:consultation' && d.appointmentRescheduleEnabled) {
      return 'ready-for-consult-with-reschedule';
    } else if (d.appointmentRescheduleEnabled && d.status !== 'completed' && d.status !== 'error') {
      return 'app-time-reschedule';
    } else if (!d.appointmentRescheduleEnabled && d.status !== 'completed' && d.status !== 'error') {
      return 'app-time';
    } else if (d.status === 'completed' && d.appointmentRescheduleEnabled) {
      return 'completed-with-reschedule';
    } else if ((d.appointmentRescheduleEnabled || d.appointmentStatus === "completed:with:error")
    ) {
      return 'completed-with-reschedule';
    } else {
      return 'completed-app-status';
    }
  };

  const calculateTime = (slotId) => {
    const getTime = time.filter(t => t.value === slotId);

    return getTime[0].label;
  }

  const appointmentList = () => (
    listOfAppointment.length !== 0 && listOfAppointment.map((d, index) => (
      <Card
        id={`app-list-${index}`}
        style={{ margin: '5px' }}
        className={
          `doctorcard
          ${ classes.chatListHover }
          ${ (index === selectedIndex) ? 'app-active-card' : '' }
          `
        }
        key={index}
      >
        <CardActionArea
          style={{height:'100%'}}
          onClick={(event) => handleOnClickList(event, index, d)}
        >
          <CardContent>
          <div className='docImage patient-image'>
            <Avatar
              // -- In future, profile pic property is to be needed -- 
              // src={d.customerProfileImageName !== 'NA'
              //   ? `${config.API_URL}/api/utility/download/${d.customerProfileImageName}`
              //   : ''
              // }
              style={{
                position: 'relative',
                height: '70px',
                width: '70px',
                backgroundColor: getHexColor(d.userFirstName),
                fontSize: '2.5rem'
              }}
            >
              {getInitialsOfGender(d.userFirstName)}
            </Avatar>
          </div>
          <div className='docDetails'>
            <span style={{ width: '100%', display: 'flex', paddingLeft: 5 }}>
              <span style={{fontWeight:'bold'}}>
                {`${makeInitialCapital(d.userFirstName)}`}
              </span>
              <span style={{ paddingLeft: '10px', fontColor: '#b0afaf'}}>
                { `${d.patientAge} ${getInitialsOfGender(d.genderType)}` }
              </span>
            </span>

            <div className="reschedule-icon app-slot-time">
              <img src="../clock-icon.svg" alt="reschedule" height="23" width="23" />
              <p className="slot-time">{moment(d.slotStartDttm).format('h:m a')}</p>
            </div>

            <span className="appointment-list-card">
              <span>
                <LabelBreadCrumb
                  status={d.statusFlag}
                  appointmentDate={moment(d.slotStartDttm).format('YYYY-MM-DD')}
                />
              </span>
              {
                d.appointmentRescheduleEnabled && (
                  <span className="reschedule-icon">
                    <img src="../doctor/reschedule.svg" alt="reschedule" height="23" width="23" />
                  </span>
                )
              }
              <span 
                className={calculateLeftMargin(d)}
              >
                <strong style={{ right: 0, color:'#054fd8' }}>
                  {/* { calculateTime(d.appointmentSlotId)  } */}
                </strong>
                <NavigateNextIcon fontSize="small" style={{ position: 'relative', top: 7 }}/>
                {/* {
                  moment(d.appointmentDate).isAfter(currDate) && appointmentTimeMode &&
                  (
                    <span className="call-time-date">{moment(d.appointmentDate).format('DD MMM, YY')}</span>
                  )
                } */}
              </span>
            </span>
            {/* <CallReminderPopOver
              appointmentObj={d}
              setMsgData={setMsgData}
              updateCallTimeList={updateCallTimeList}
            /> */}
          </div>
          </CardContent>
        </CardActionArea>
      </Card>
    ))
  );

  const defaultMessList = () => (
    <div
      style={{
        position: 'relative',
        top: '11%',
        marginLeft: 150,
        backgroundColor: 'inherit',
        display: (listOfAppointment.length) ? 'none' : 'block'
      }}
      className="doctorcard"
    >
      <Grid
        container
        wrap="nowrap"
        spacing={2}
      >
        <Grid item>
          <img
            src="../../no_appointments.svg"
            height="108"
            width="83"
            alt="no-appointments"
          />
        </Grid>
      </Grid>

      <Grid
        container
        wrap="nowrap"
        spacing={2}
        style={{
          width: '444px',
          position: 'relative',
          textAlign: 'center',
          right: 50,
          color: '#00000059',
        }}
      >
        <Grid item>
          <Typography variant="body1">
            {
              enableSort
              ? (<strong>No Appointments available for <br /> selected filter.</strong>)
              : (<strong>No Appointments available for <br /> selected date.</strong>)
            }
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  return <>
    {(!listOfAppointment.length) && defaultMessList()}
    {appointmentList()}
  </>
};

export default AppointmentList;