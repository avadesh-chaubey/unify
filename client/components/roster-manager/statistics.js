import React, { useState }  from 'react'
import {
  Paper, Card, Typography, makeStyles, Grid, Select,
  MenuItem, InputBase, IconButton, Button, CardContent, Badge, CardHeader, List, Popover
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import PatientTypeChart from './patientTypeChart';
import Appointmentschart from './appointmentChart';
import PatientGenderchart from './patientGenderChart'
const useStyles = makeStyles(theme => ({
  root: {
      backgroundColor: '#FFFFFF',
  },
  searchInput: {
      border: '1px ',
      borderColor: '#B2AEAE',
      boxShadow: '0 0 0 .5px #979797',
      borderRadius: '20px',
      marginLeft: '15px',
      opacity: '1',
      padding: `0px ${theme.spacing(1)}px`,
      fontSize: '0.8rem',
      width: '300px',
      height: '45px',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Bahnschrift SemiBold',
      fontWeight: 'normal',
      color: '#555555',
  },
  '&:hover': {
      backgroundColor: '#f2f2f2'
  },
  button: {
      border: '1px ',
      borderColor: '#B2AEAE',
      borderRadius: '36px',
      display: 'inline-block',
      overflow: 'hidden',
      background: '#ffffff',
      opacity: '1',
      border: '1px solid #cccccc',
      marginLeft: '35px',
      paddingRight: '15px',
      color: '#555555',
      fontFamily: 'Bahnschrift SemiBold',
      fontWeight: 'bold',
      fontSize: '14px',
      justifyContent: 'center',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      '& span': {
          fontFamily: 'Bahnschrift SemiBold',
          fontSize:'14px',
      }
  },
  selectWrapper: {
      borderRadius: '36px',
      display: 'inline-block',
      overflow: 'hidden',
      background: '#ffffff',
      border: '1px solid #cccccc',
      paddingLeft: '15px',
      paddingRight: '15px',
      fontFamily: 'Bahnschrift SemiBold',
      fontSize:'14px',
      fontWeight: 'normal',
      color: '#555555',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
  },
  selectBox: {
      width: '190px',
      height: '45px',
      border: '0px',
      outline: 'none',
      color: '#555555',
      fontFamily: 'Bahnschrift SemiBold',
      fontWeight: 'normal',
  },
  Card: {
      width: '160px',
      height: '130px',
      borderRadius: '5px',
      fontFamily: 'Bahnschrift SemiBold',
  },
  icon: {
      width: '40px',
      height: '40px',
      opacity: '1'
  },
  typotext: {
      color: '#161616',
      fontFamily: 'Bahnschrift SemiBold',
      fontSize: '25px',
  },
  typotext2: {
      paddingTop: '0',
      color: '#979797',
      fontFamily: 'Bahnschrift SemiBold',
      fontWeight: 'normal',
      fontSize: '10px',
  },
  Bar: {
      borderRadius: '2px',
      border: 'none',
      fontFamily: 'Bahnschrift SemiBold !important',
      paddingLeft: '15px',

      // paddingLeft: '15px',
      // paddingRight: '15px',
  },
}))
function Statistics(props) {
  const classes = useStyles();
    const { } = props;


    // calendedr
    const [appDateRange, setAppDateRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openCalendar = Boolean(anchorEl);
    const id = openCalendar ? 'simple-popover' : undefined;
    // Function to close the calender popover and reset values
    const onClosePopOver = (e) => {
        e.preventDefault();

        setAnchorEl(null);
    }
    const handleCalendar = () => {
        // e.preventDefault();
        console.log("==========================>",)
        setAnchorEl(true);
    }
    // end calender
    const getDate = () => {
        const startDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].startDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
        const endDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].endDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
        return startDate + ' - ' + endDate
      }
  return (
    <div className={classes.root}>
    <Grid container>
        <Grid item xs={12} style={{height:'100vh',overflow: 'hidden',overflowY: 'scroll'}}>
            <Grid container justify='space-between' style={{ backgroundColor: '#F6FBF8', padding: '10px 10px', }} >
                <Grid item >
                    <Grid container >
                        <InputBase
                            placeholder="Search Here"
                            className={classes.searchInput}
                            startAdornment={<SearchIcon fontSize="small" />}
                        />
                        {/* <Button
                            variant="Filter"
                            color="default"
                            className={classes.button}
                            endIcon={<FilterListIcon />}
                        >Filter
                        </Button> */}
                    </Grid>
                </Grid>
                <Grid item style={{ fontFamily: 'Bahnschrift SemiBold', fontSize: '12px', paddingRight: '25px' }}>
                    <div className={classes.selectWrapper} >
                        <img src="../calender icon.svg" className={classes.icon} />
                        <p onClick={handleCalendar} style={{ fontFamily: 'Bahnschrift SemiBold', cursor: 'pointer',}}>{getDate()}</p>
                        <Popover style={{marginTop:'125px'}}
                            id={id}
                            open={openCalendar}
                            anchorEl={anchorEl}
                            onClose={onClosePopOver}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <DateRangePicker
                                onChange={item => setAppDateRange([item.selection])}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={appDateRange}
                                direction="horizontal"
                            />
                        </Popover>
                    </div>
                </Grid>
            </Grid>
            <Grid container style={{ paddingLeft: '20px', paddingTop: '10px' }} spacing={1}>
               <Grid container spacing={3} style={{ paddingLeft: '5px', paddingTop: '10px', paddingRight: '30px' }} >
                  <Grid container style={{ paddingLeft: '10px', paddingTop: '10px', paddingRight: '10px' }} >
                        <Grid item sm={12} >
                            <Card className={classes.Bar}>
                                <CardContent>
                                    <Typography style={{ color: '#161616', fontFamily: 'Bahnschrift SemiBold', fontSize: '20px', }} variant="h6">Appointment</Typography>
                                </CardContent>
                                <Appointmentschart />
                            </Card>
                        </Grid>
                    </Grid>
                
                    <Grid item sm={6} >
                        <Card className={classes.Bar}>
                            <CardContent>
                                <Typography style={{ color: '#161616', fontFamily: 'Bahnschrift SemiBold', fontSize: '20px', }} variant="h6">PATIENT BY GENDER</Typography>
                            </CardContent>
                            <PatientGenderchart />
                        </Card>
                    </Grid>
                    <Grid item sm={6} >
                        <Card className={classes.Bar}>
                            <CardContent >
                                <Typography style={{ color: '#161616', fontFamily: 'Bahnschrift SemiBold', fontSize: '20px', fontWeight: 'bold' }} variant="h6">PATIENT</Typography >
                            </CardContent>
                            <PatientTypeChart />
                        </Card>
                    </Grid>
                    
                </Grid>
                <br />
            </Grid>
        </Grid>
    </Grid>
</div>

  )
}

export default Statistics