import React, {useState, useEffect} from 'react';
import { addDays } from 'date-fns';
import moment from 'moment';
import { DateRangePicker }  from 'react-date-range';
import {
    Popover, Button, AppBar, Toolbar, Typography, IconButton,
    Tab, Tabs
  } from "@material-ui/core";

export default function Support_Center_AppBar (props) {
  const { setCurrentTab, currentTab } = props;
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const appStartDate = moment(appDateRange[0].startDate).format('MMM DD, YYYY');
  const appEndDate = moment(appDateRange[0].endDate).format('MMM DD, YYYY');
  const presentationDate = `${appStartDate} - ${appEndDate}`;

  // Popover open & id for calender
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? 'simple-popover' : undefined;

  // Functions related to calender handle events
  const handleCalenderEvent = (e) => {
    e.preventDefault();

    setAnchorEl(e.currentTarget);
  };

  // Function to close the calender popover and reset values
  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };

  const handleTabChange = (e, tabValue) => {
    e.preventDefault();
    setCurrentTab(tabValue);
  };

  return (
    <AppBar position="sticky" color="default" className="appbar-support">
      <Toolbar className="support-toolbar">
        <Button
          className="add-new-support-btn"
          color="primary"
          variant="contained"
        >
          <Typography variant="body1">
            + Add New
          </Typography>
        </Button>

        <Button
          className="calender-popover"
          aria-describedby={id}
          variant="outlined"
          color="primary"
          onClick={handleCalenderEvent}
        >
          <Typography variant="body1" className="presentation-date">
            { presentationDate }
          </Typography>
        </Button>
        <Popover
          id={id}
          open={openCalendar}
          anchorEl={anchorEl}
          onClose={onClosePopOver}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
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

        <IconButton
          className="search-icon-support"
        >
          <img
            src="/doctor/search_small.svg"
            alt="close_search"
            height="18"
            width="18"
          />
        </IconButton>
        <IconButton
          className="search-icon-support"
        >
          <img
            src="/filter@2x.png"
            alt="close_search"
            height="18"
            width="18"
          />
        </IconButton>
        <div style={{ width: 40 }} />
        <Tabs
          className="support-center-tabs"
          aria-label="support-center-tabs"
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
        >
          <Tab label="Details" className={currentTab === 0 ? "current-active-tab" : ''} />
          <Tab label="History" className={currentTab === 1 ? "current-active-tab" : ''} />
          <Tab label="Chat" className={currentTab === 2 ? "current-active-tab" : ''} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
