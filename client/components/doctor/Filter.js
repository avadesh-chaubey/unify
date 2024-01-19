import React, {useState, useRef, useEffect} from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppointmentMenu from './AppointmentMenu';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Link from '@material-ui/core/Link';

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    border: '1.5px solid grey',
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: '#ececec',
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);

const Filter = (params) => {
  const {
    isRefresh,
    originalList,
    setList,
    setEnableSort,
    setPatientName,
    setViewPatientDetails,
    setSelectedIndex,
    setListFilterStatus,
    appointmentTimeMode,
    setAppointTimeMode,
    setAppointmentObj,
    listFilterStatus
  } = params;
  const [openMenuOne, setMenuOne] = useState(false);
  const anchorRef = useRef(null);
  const [userType, setUserType] = useState('');
  const [updateLabel, setUpdateLabel] = useState('All Appointments');
  const [updateIconColor, setUpdateIconColor] = useState();
  const [alignment, setAlignment] = React.useState('left');

  useEffect(() => {
    if (isRefresh || listFilterStatus === '') {
      setUpdateLabel('All Appointments');
      setAlignment('left');
    }
  }, [isRefresh, listFilterStatus]);

  const handleAlignment = (event, newAlignment) => {
    event.preventDefault();

    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setAppointTimeMode(!appointmentTimeMode);
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    setMenuOne((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    // Get user details from local storage wrt showing UI to assistant
    if (localStorage.hasOwnProperty('userDetails')) {
      const getUserDetails = JSON.parse(localStorage.getItem('userDetails'));
      const getUserType = getUserDetails['userType'];
      setUserType(getUserType);
    }
  }, []);

  return (
    <div className="filter-tab">
      <Breadcrumbs separator="" aria-label="breadcrumb">
        <StyledBreadcrumb
          ref={anchorRef}
          label={updateLabel}
          icon={ updateLabel === 'All Appointments' ?
            <img src="../filter@2x.png" alt="filter" className="img-logo" />
            : <FiberManualRecordIcon
                fontSize="small"
                style={{ color: updateIconColor}}
              />
          }
          deleteIcon={<ExpandMoreIcon />}
          onClick={handleClick}
          onDelete={handleClick}
        />
        <AppointmentMenu
          open={openMenuOne}
          setMenuOne={setMenuOne}
          anchorRef={anchorRef}
          originalList={originalList}
          setList={setList}
          setUpdateLabel={setUpdateLabel}
          setUpdateIconColor={setUpdateIconColor}
          setEnableSort={setEnableSort}
          setPatientName={setPatientName}
          setViewPatientDetails={setViewPatientDetails}
          setListFilterStatus={setListFilterStatus}
          setAppointmentObj={setAppointmentObj}
          setSelectedIndex={setSelectedIndex}
        />

        {
          userType === 'physician:assistant' && (
            <div>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
                className="call-time-breadcrumb"
              >
                <ToggleButton
                  value="left"
                  aria-label="left aligned"
                  className="call-time-mode-btn1"
                  id="toggle-appointment-view"
                >
                  <Link
                    href="#"
                    type="button"
                    className={`call-time-mode-buttons ${alignment !== 'left' && 'call-time-selected-btn'}`}
                    underline="none"
                  >
                    Appointment
                  </Link>
                </ToggleButton>
                <ToggleButton
                  value="center"
                  aria-label="centered"
                  className="call-time-mode-btn2"
                  id="toggle-call-time"
                >
                  <Link
                    href="#"
                    type="button"
                    className={`call-time-mode-buttons ${alignment !== 'center' && 'call-time-selected-btn'}`}
                    underline="none"
                  >
                    Call Time
                  </Link>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          )
        }
    </Breadcrumbs>
    </div>
  )
};

export default Filter;