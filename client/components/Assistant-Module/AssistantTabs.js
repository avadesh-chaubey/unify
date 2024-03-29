import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Divider } from "@material-ui/core";
import AssistantDoctor from "./AssistantDoctor";
import VitalsTab from "./Vitals/VitalsTabLeft";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function AssistantTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Chats" {...a11yProps(0)} />
          <Tab label="Consultation" {...a11yProps(1)} />
          <Tab label="Vitals" {...a11yProps(2)} />
          <Tab label="Symptoms" {...a11yProps(3)} />
          <Tab label="History" {...a11yProps(4)} />
          <Tab label="Notes" {...a11yProps(5)} />
          <Tab label="Photos" {...a11yProps(6)} />
          <Tab label="RX" {...a11yProps(7)} />
          <Tab label="Vaccination" {...a11yProps(8)} />
          <Tab label="Milestone" {...a11yProps(9)} />
          <Tab label="Tests" {...a11yProps(10)} />
          <Tab label="Reports" {...a11yProps(11)} />
          <Tab label="Others" {...a11yProps(12)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography style={{ fontWeight: "bold", fontSize: "25px" }}>
          Past Consultations
        </Typography>
        <Divider />
        <AssistantDoctor />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <VitalsTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </div>
  );
}
