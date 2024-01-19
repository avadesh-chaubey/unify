import React, {useState, useRef, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
  },
  listSide: {
    paddingLeft: '0 !important',
  },
  icons: {
    minWidth: 25,
  },
  menuItem: {
    fontSize: 12,
  }
}))

export default function AppointmentMenu(params) {
  const classes = useStyles();
  const {
    open,
    setMenuOne,
    anchorRef,
    setAppointmentObj,
    originalList,
    setList,
    setUpdateLabel,
    setUpdateIconColor,
    setEnableSort,
    setListFilterStatus,
    setViewPatientDetails,
    setSelectedIndex
  } = params;

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return ;
    }

    setMenuOne(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setMenuOne(false);
    }
  };

  const sortListByAppointmentType = (event, status, label) => {
    handleClose(event);
    setUpdateLabel(label);
    setViewPatientDetails(0);

    // All
    // pending = booked
    // ready = caseSheet:Filled
    // completed = successfully:completed / completed:with:error
    const updateStatus = {
      'all': 'all',
      'pending': "case:history:pending",
      'ready': 'ready:for:doctor:consultation',  
      'completed': 'completed',
      'error': "error",
    };
    const statusColorCode = {
      'all': '#656565',
      'pending': "#D8243C",
      'ready': '#007E7C',  
      'completed': '#656565',
      'error': '#656565',
    };

    const filterStatus = updateStatus[status];
    setUpdateIconColor(statusColorCode[status]);
    setListFilterStatus(filterStatus);

    // Filter the appointment list based on status
    if (filterStatus !== 'all') {
      const newList = originalList.filter(d => {
        if (d.status === filterStatus) {
          return d;
        }
      });
      setList(newList);
      setAppointmentObj(newList[0] ?? {})
      setEnableSort(true);
      setSelectedIndex(0);
    } else {
      console.log('else part to be executed');
      setList(originalList);
      setAppointmentObj(originalList[0] ?? {})
      setEnableSort(false);
      setSelectedIndex(0);
    }
  };

  return(
    <div className={classes.root}>
      <div>
        <Popper
          style={{ top: '14px', zIndex: 1 }}
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
              transformOrigin: 'bottom' ? 'center top' : 'center bottom'
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
                      id="show-all-appointment"
                      className={`
                        ${classes.consultationBtn}
                      `}
                      onClick={(event) => sortListByAppointmentType(event, 'all', 'All Appointments')}
                    >
                      <ListItemIcon className={classes.icons}>
                        <StarBorderOutlinedIcon
                          fontSize="small"
                          style={{ color: '#656565'}}
                        />
                      </ListItemIcon>
                      <Typography className={classes.menuItem}>
                        All Appointments
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      id="casesheet-pending"
                      className={`
                        ${classes.consultationBtn}
                      `}
                      onClick={(event) => sortListByAppointmentType(event, 'pending', 'Case Sheet Pending')}
                    >
                      <ListItemIcon className={classes.icons}>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: '#D8243C'}}
                        />
                      </ListItemIcon>
                      <Typography className={classes.menuItem}>
                        Case Sheet Pending
                      </Typography>                      
                    </MenuItem>
                    <MenuItem
                      id="show-ready-for-consult"
                      className={`
                      ${classes.consultationBtn}
                    `}
                    onClick={(event) => sortListByAppointmentType(event, 'ready', 'Ready for consult')}
                    >
                      <ListItemIcon className={classes.icons}>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color:'#007E7C'}}
                        />
                      </ListItemIcon>
                      <Typography className={classes.menuItem}>
                        Ready for consult
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      id="show-completed"
                      className={`
                      ${classes.consultationBtn}
                    `}
                    onClick={(event) => sortListByAppointmentType(event, 'completed', 'Completed')}
                    >
                      <ListItemIcon className={classes.icons}>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: '#656565'}}
                        />
                      </ListItemIcon>
                      <Typography className={classes.menuItem}>
                        Completed
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      id="show-completed-with-err"
                      className={`
                      ${classes.consultationBtn}
                    `}
                    onClick={(event) => sortListByAppointmentType(
                      event,
                      'error',
                      'Completed with Error'
                      )
                    }
                    >
                      <ListItemIcon className={classes.icons}>
                        <FiberManualRecordIcon
                          fontSize="small"
                          style={{ color: '#656565'}}
                        />
                      </ListItemIcon>
                      <Typography className={classes.menuItem}>
                        Completed with Error
                      </Typography>
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
};
