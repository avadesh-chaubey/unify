import React, {useState, useRef, useEffect} from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import ConsultationDialog from './ConsultationDialog';
import AssistantListDialog from './AssistantListDialog';
import ReadyToConsultDialog from './ReadyToConsultDialog';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import config from '../../app.constant';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  consultationBtn: {
    color: '#6b6974',
    fontSize: '12px',
  },
  cancelBtn: {
    color: '#ff0000'
  }
}))

export default function ConsultationListMenu(params) {
  const {
    appointment,
    viewPatientDetails,
    updateList,
    isFullScreen,
    showVideoSec,
    setMsgData
  } = params;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(0);
  const [rfcDialog, setRfcDialog] = useState(0);
  const prevOpen = useRef(open);
  const anchorRef = useRef(null);
  const [openAssistantDialog, setAssitantDialog] = useState(0);
  const [cookies, setCookies] = useState('');
  const headers = {
    authtoken: cookies,
    "Content-type": "application/json",
  };

  useEffect(() => {
    if (cookies === '') {
      setCookies(JSON.parse(localStorage.getItem('token')));
    }
  }, [cookies]);

  const getUserDetails = JSON.parse(localStorage.getItem('userDetails'));

  const handleToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return ;
    }

    setOpen(false);
  };

  useEffect( () => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const showPatientDetails = () => {
    viewPatientDetails(1);
    handleToggle();
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
    setOpen(false);
  };

  const closeConsultDialog = () => {
    setOpenDialog(false);
    setOpen(false);
  };

  const readyForConsultDialog = () => {
    setRfcDialog(!rfcDialog);
    setOpen(false);
  };

  const allowPatientToReschedule = (e) => {
    e.preventDefault();

    const rescheduleData = {
      appointmentId: appointment.id
    };

    axios
      .post(`${ config.API_URL }/api/appointment/markreschedule`, rescheduleData, { headers })
      .then(res => {
        const patientObj = appointment;
        patientObj.appointmentRescheduleEnabled = res.data.appointmentRescheduleEnabled;

        updateList(patientObj, 'reschedule');
      })
      .catch(err => console.log('Error occured with rescheduling appointment', err));
  };

  const handleAssistantDialog = (e) => {
    setAssitantDialog(!openAssistantDialog);
  };

  const closeAssistantDialog = (e) => {
    setAssitantDialog(0);
  };

  return(
    <div className={classes.root}>
      <ConsultationDialog
        open={openDialog}
        appointment={appointment}
        closeDialog={closeConsultDialog}
        updateList={updateList}
        isFullScreen={isFullScreen}
        showVideoSec={showVideoSec}
      />
      <ReadyToConsultDialog
        open={rfcDialog}
        appointment={appointment}
        closeDialog={readyForConsultDialog}
        updateList={updateList}
      />
      <AssistantListDialog
        open={openAssistantDialog}
        appointment={appointment}
        closeDialog={closeAssistantDialog}
        updateList={updateList}
        isFullScreen={isFullScreen}
        showVideoSec={showVideoSec}
        setMsgData={setMsgData}
        userDetails={getUserDetails}
      />
      <div>
        <IconButton
          className="menu-dot-icon" 
          ref={anchorRef}
          aria-controls = {open ? 'menu-list-grow': undefined}
          onClick={handleToggle}
        >
          <img src="../doctor/menu_dots.svg" alt="menu_dots" height="18" width="18" />
        </IconButton>
        <Popper
          style={{ top: '14px', zIndex: 100 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({TransitionProps, placement}) => (
            <Grow
            {...TransitionProps}
            style={{
              zIndex: '100',
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      id="view-patient-details"
                      className={classes.consultationBtn}
                      onClick={showPatientDetails}
                    >
                      VIEW PATIENT DETAILS
                    </MenuItem>

                    {
                      appointment.appointmentStatus !== 'ready:for:doctor:consultation'
                      && appointment.status !== 'completed'
                      && appointment.status !== 'error'
                      &&
                      (
                        <MenuItem
                        id="ready-for-consult"
                          className={classes.consultationBtn}
                          onClick={readyForConsultDialog}
                        >
                          READY FOR CONSULT
                        </MenuItem>
                      )
                    }

                    {
                      !appointment.appointmentRescheduleEnabled && (
                        <MenuItem
                          id="patient-reschedule"
                          className={classes.consultationBtn}
                          onClick={allowPatientToReschedule}
                          style={{ display: (
                            appointment.status === 'error' || appointment.status === 'completed'
                            )
                            ? 'none'
                            : ''
                          }}
                        >
                          ALLOW PATIENT TO RESCHEDULE
                        </MenuItem>
                      )
                    }

                    {
                      // Option to assign assistant when assistant is not assigned to patient
                      getUserDetails.userType === 'physician:assistant' && (
                        <MenuItem
                          id="transfer-assistant"
                          className={classes.consultationBtn}
                          onClick={handleAssistantDialog}
                          style={{ display: (
                            appointment.status === 'error' || appointment.status === 'completed'
                            )
                            ? 'none'
                            : ''
                          }}
                        >
                          TRANSFER ASSISTANT
                        </MenuItem>
                      )
                    }
                    
                    <MenuItem
                      id="complete-consultation"
                      className={classes.consultationBtn}
                      onClick={handleDialog}
                      style={{ display: (
                        appointment.status === 'error' || appointment.status === 'completed'
                        )
                        ? 'none'
                        : ''
                      }}
                    >
                      COMPLETE CONSULTATION
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );

}
