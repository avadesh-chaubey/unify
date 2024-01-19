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

export default function AppointmentTimeMenu(params) {
  const classes = useStyles();
  const {
    open,
    setMenuTwo,
    anchorRef,
    setMenuTwoLabel,
    appointmentTimeMode,
    setAppointTimeMode
  } = params;

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return ;
    }

    setMenuTwo(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setMenuTwo(false);
    }
  };

  const sortList = (e, label) => {
    e.preventDefault();

    setMenuTwoLabel(label);
    setMenuTwo(false);
    setAppointTimeMode(!appointmentTimeMode);
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
                      className={`
                        ${classes.consultationBtn}
                      `}
                      onClick={(event) => sortList(event, 'Appointment Time')}
                    >
                      <Typography className={classes.menuItem}>
                        Appointment Time
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      className={`
                        ${classes.consultationBtn}
                      `}
                      onClick={(event) => sortList(event, 'Call Time For Case Sheet')}
                    >
                      <Typography className={classes.menuItem}>
                        Call Time For Case Sheet
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
