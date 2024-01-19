import React, {useState} from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import moment from 'moment';

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
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

function handleClick(event) {
  event.preventDefault();
}

const LabelBreadCrumb = ({status, appointmentDate}) => {
  const [currentDate] = useState( moment(new Date()).format('YYYY-MM-DD') );

  const updateStatus = {
    'ready:for:doctor:consultation': 'Ready for consult',  
    "successfully:completed": 'Completed',
    "completed:with:error": 'Completed',
    'case:history:pending': 'Case Sheet Pending',
    'cancelled': 'Cancelled'
  };

  const statusColorCode = {
    'Completed': '#9C9C9C', // grey
    'Cancelled': '#9C9C9C',
    'Case Sheet Pending': '#D8243C', // red
    'Ready for consult': '#007E7C', // app theme color
  };

  const getStatus = updateStatus[status ?? 'Ready for consult'];
  let getColorCode = statusColorCode['Ready for consult'];

  // if (getStatus === 'Case Sheet Pending' && currentDate === appointmentDate) {
  //   // Change the getColorCode to orange for current day of case sheet pending status
  //   getColorCode = '#FA6400';
  // }

  return (
    <Breadcrumbs separator="" aria-label="breadcrumb">
      <StyledBreadcrumb
        className="label-breadcrumb"
        style={{ backgroundColor: getColorCode}}
        label={<span style={{ color: '#fff', fontSize: '11px' }}>
          Ready for Consult
        </span>}
        icon={ status === "completed:with:error" && (
          <ReportProblemOutlinedIcon fontSize="small" style={{ color: '#fff'}} /> 
        )}
        onClick={handleClick}
      />
    </Breadcrumbs>
  )
};

export default LabelBreadCrumb;