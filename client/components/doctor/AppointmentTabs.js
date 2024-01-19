import React, {useState, useEffect, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, Link, Badge } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  dateColor: {
    color: 'rgb(103 103 103 / 87%)',
  },
  header: {
    height: '50px',
    position: 'relative',
    top: '6px',
  },
  arrowLeft: {
    color: '#00888A',
    minWidth: '50px !important',
    // padding: '6px',
  },
  arrowRight: {
    color: '#00888A',
    minWidth: '30px !important',
    // padding: 0,
  },
  link: {
    fontSize: 14,
  },
  linkBolder: {
    color: '#3D63A9',
    fontWeight: 600
  }
}));

const AppointmentTabs = (params) => {
  const {
    setSelectedDate,
    upcomingDate,
    setUpcomingDate,
    selectedDate,
    setSearchMode,
    badgeCount,
    userDetails
  } = params;
  const classes = useStyles();

  const [dayOne, setDayOne] = useState(moment(selectedDate).subtract(1, 'day').format('DD MMM'));
  const [dayTwo, setDayTwo] = useState( moment(selectedDate).format('DD MMM') );
  const [dayThree, setDayThree] = useState(moment(selectedDate).add(1, 'day').format('DD MMM'));

  useEffect(() => {
    if (upcomingDate !== '') {
      const searchDate = moment(upcomingDate).format('DD MMM');

      setDayOne(moment(searchDate).subtract(1, 'day').format('DD MMM'));
      setDayTwo(searchDate);
      setDayThree(moment(searchDate).add(1, 'day').format('DD MMM'));
      setUpcomingDate('');
    } else {
      const getCurrentDateSelected = moment().year() + '-' + moment(dayTwo).format('MM-DD');
      setSelectedDate(getCurrentDateSelected);
    }
  }, [dayTwo, upcomingDate]);

  const updateToNextDate = () => {
      setDayOne(moment(dayOne).add(1, 'day').format('DD MMM'));
      setDayTwo(moment(dayTwo).add(1, 'day').format('DD MMM'));
      setDayThree(moment(dayThree).add(1, 'day').format('DD MMM'));
      setSearchMode(false);
  };

  const updateToPrevDate = () => {
    setDayOne(moment(dayOne).subtract(1, 'day').format('DD MMM'));
    setDayTwo(moment(dayTwo).subtract(1, 'day').format('DD MMM'));
    setDayThree(moment(dayThree).subtract(1, 'day').format('DD MMM'));
    setSearchMode(false);
  };

  const handleOnClick = (tab) => {
    if (tab === 'Y') {
      // For yesterday reduce the date by one day
      updateToPrevDate();
    } else if (tab === 'Tomm') {
      // For tomorrow increase the day by one day
      updateToNextDate();
    }
  };

  return (
    <Fragment>
      <Paper square>
        <div className={classes.header}>
          <React.Fragment>
            <Button
              id="goto-previous-date"
              className={classes.arrowLeft}
              onClick={() => updateToPrevDate()}
            >
              <ChevronLeftIcon />
            </Button>
          </React.Fragment>

          <React.Fragment>
            <Button id="yesterday" className="btnPadding" onClick={() => handleOnClick('Y')}>
              <Link
                href="#"
                color="secondary"
                underline="none"
                className={`${classes.dateColor} ${classes.link}`}
              >
                {dayOne}
              </Link>
            </Button>
          </React.Fragment>

          <React.Fragment>
            <Button id="today" className="btnPadding" onClick={() => handleOnClick('T')}>
              <Link
                href="#"
                underline="always"
                className={`${classes.link} ${classes.linkBolder}`}
              >
                {dayTwo}
              </Link>
            </Button>
          </React.Fragment>

          <React.Fragment>
            <Button id="tomorrow" className="btnPadding" onClick={() => handleOnClick('Tomm')}>
              {
                userDetails.userType === 'physician:assistant'
                ? (
                  <Badge badgeContent={badgeCount} color='secondary'>
                    <Link
                      href="#"
                      color="secondary"
                      underline="none"
                      className={`${classes.dateColor} ${classes.link}`}
                    >
                      {dayThree}
                    </Link>
                  </Badge>
                )
                : (
                  <Link
                    href="#"
                    color="secondary"
                    underline="none"
                    className={`${classes.dateColor} ${classes.link}`}
                  >
                    {dayThree}
                  </Link>
                )
              }
            </Button>
          </React.Fragment>

          <React.Fragment>
            <Button
              id="goto-next-date"
              className={classes.arrowRight}
              onClick={() => updateToNextDate()}
            >
              <ChevronRightIcon />
            </Button>
          </React.Fragment>
        </div>
      </Paper>
    </Fragment>
  )
};

export default AppointmentTabs;
