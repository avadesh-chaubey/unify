import React from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import { useState, useEffect } from "react";
import { useAlert, types } from "react-alert";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../app.constant";
import FilterListIcon from '@material-ui/icons/FilterList';
import {
  Paper, Card, Typography, makeStyles, Grid, Select,
  MenuItem, InputBase, IconButton, Button, CardContent, Badge, CardHeader, List, Popover
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import Switch from '@material-ui/core/Switch';
import Menu from '@material-ui/core/Menu';

const list =[{id:"1234",name:"Sarva Daman",phoneNo:"1234567890", email:"email@email.com", role:"Pharmacy",assignDate:"17 Sep 2021", assignedBy:"Admin", isActive: true},{id:"1234",name:"Rahul Kumar",phoneNo:"1234567890", email:"email@email.com", role:" Appointment",assignDate:"20 Sep 2021", assignedBy:"Admin", isActive: false},{id:"1234",name:"Sanjay Kumar",phoneNo:"1234567890", email:"email@email.com", role:"Lab test",assignDate:"10 Sep 2021", assignedBy:"Admin", isActive: true},{id:"1234",name:"Ankit Kumar",phoneNo:"1234567890", email:"email@email.com", role:"Reception",assignDate:"19 Sep 2021", assignedBy:"Admin", isActive: false},{id:"1234",name:"Vishal Kumar",phoneNo:"1234567890", email:"email@email.com", role:"Pharmacy",assignDate:"25 Sep 2021", assignedBy:"Admin", isActive: true},{id:"1234",name:"Abhishek Kumar",phoneNo:"1234567890", email:"email@email.com", role:"Appointment",assignDate:"27 Sep 2021", assignedBy:"Admin", isActive: false},{id:"1234",name:"Sarva Daman",phoneNo:"1234567890", email:"email@email.com", role:"Reception",assignDate:"15 Sep 2021", assignedBy:"Admin", isActive: true}];
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
function EmployeeList() {
  const classes = useStyles();
  const [empList, setEmpList] = useState(list);
  const [roleName, setRoleName] = useState("All");


  useEffect(() => {
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem('token')),
        "Content-type": "application/json",
      }
    };

    axios.get(`${config.API_URL}/api/users/accesslist `, headers)
      .then(res => {
        console.log("res: ",res);


      })
      .catch(err => {
        setLoader(false);
        setMsgData({
          message: 'Error occured while getting all Employee List',
          type: 'error'
        });
      });
  }, [])

  const handleAction = (event,i) => {
    let tempEmpList = [...empList];
    console.log("index:",i,empList);
    tempEmpList[i].isActive = ! tempEmpList[i].isActive;
    console.log("tempEmpList", tempEmpList);
    setEmpList(tempEmpList);
  };

  const [appDateRange, setAppDateRange] = useState([
    {
      endDate: new Date(),
        // startDate: new Date(),
        startDate: addDays(new Date(), -30),
        // endDate: addDays(new Date(), 7),
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

  const [openMenu, setOpenMenu] = useState(null);

  const filterBtnClick = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };
  const handleFilter = (val) =>{
    console.log("val: ",val)
    setRoleName(val);
    let tempEmpList = [...list];
    if(val === "All"){
      setEmpList(tempEmpList);
      handleClose();
      return false
    }
    let tempArr = [];
    tempEmpList.map((item)=>{
      if(item.role === val){
        tempArr.push(item);
      }
    })
    console.log("tempEmpList", tempEmpList);
    console.log("tempArr: ",tempArr);
    setEmpList(tempArr);
    handleClose();
  }
  const onSearchChange = (e)=>{
    console.log("object dsd,fjh k: ",e.target.value );
    let val = e.target.value;

    let tempEmpList = [...list];
    let tempArr = [];
    tempEmpList.map((item)=>{
      if(item.name.indexOf(val)> -1){
        tempArr.push(item);
      }
    });
    setEmpList(tempArr);
    console.log("tempEmpList: ",tempEmpList);
    console.log("tempArr: ",tempArr);
  }
  const getDate = () => {
    const startDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].startDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
    const endDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].endDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
    return startDate + ' - ' + endDate
  }
  useEffect(() => {
    const startDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].startDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
    const endDate = new Date (appDateRange && appDateRange[0] && appDateRange[0].endDate).toLocaleString('en-US', {day: 'numeric',year: 'numeric', month: 'long', })
    console.log("startDate: ",startDate)
    console.log("endDate: ",endDate)
    let tempEmpList = [...list];
    let tempArr = [];
    tempEmpList.map((item)=>{
      console.log("assignDate: ", new Date(item.assignDate));
      if(new Date(item.assignDate) <= new Date(endDate) && new Date(item.assignDate) >= new Date(startDate)){
        tempArr.push(item);
      }
    });
    // setEmpList(tempArr);
    console.log("tempEmpList: ",tempEmpList);
    console.log("tempArr: ",tempArr);
  }, [appDateRange])
  return (
    <div>
      <Grid container justify='space-between' style={{ backgroundColor: '#F6FBF8', padding: '10px 10px', }} >
        <Grid item >
            <Grid container >
                <InputBase
                    placeholder="Search Here"
                    className={classes.searchInput}
                    startAdornment={<SearchIcon fontSize="small" />}
                    onChange = {(e)=>onSearchChange(e)}
                />
                <Button
                    variant="Filter"
                    color="default"
                    className={classes.button}
                    endIcon={<FilterListIcon />}
                    onClick={filterBtnClick}
                >Role: {roleName}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={openMenu}
                  keepMounted
                  open={Boolean(openMenu)}
                  onClose={handleClose}
                  clas
                >
                  <MenuItem onClick={(e)=>handleFilter("All")}>All</MenuItem>
                  <MenuItem onClick={(e)=>handleFilter("Pharmacy")}>Pharmacy</MenuItem>
                  <MenuItem onClick={(e)=>handleFilter("Appointment")}>Appointment</MenuItem>
                  <MenuItem onClick={(e)=>handleFilter("Lab test")}>Lab test</MenuItem>
                  <MenuItem onClick={(e)=>handleFilter("Reception")}>Reception</MenuItem>
                </Menu>
            </Grid>
        </Grid>
        <Grid item style={{ fontFamily: 'Bahnschrift SemiBold', fontSize: '12px', paddingRight: '25px' }}>
            <div className={classes.selectWrapper} >
                <img src="/calender icon.svg" className={classes.icon} />
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
    
      <div className="empTable">
        {console.log("emplist: ",empList)}
        {empList.length > 0 ? (
          <TableContainer component={Paper} style={{ maxHeight: "72vh" }}>
            <Table stickyHeader aria-label="simple table" className="table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Employee Name</TableCell>
                  <TableCell align="left">Phone Number</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Role Assigned</TableCell>
                  <TableCell align="left">Assigned Date</TableCell>
                  <TableCell align="left">Assigned By</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empList.map((emp, i) => (
                  <TableRow key={emp.id}>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {" "}
                      {emp.id}
                    </TableCell>
                    <TableCell align="left">{emp.name}</TableCell>
                    <TableCell align="left">{emp.phoneNo}</TableCell>
                    <TableCell align="left">
                      {emp.email}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize",maxWidth:"380px" }}
                    >
                      {emp.role}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {emp.assignDate}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      <span>
                       {emp.assignedBy}
                      </span>
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      <Switch
                        checked={emp.isActive}
                        onChange={(e)=>handleAction(e,i)}
                        color="primary"
                        name="Active"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: "10%",
                lineHeight: "1.5",
                wordSpacing: "1px",
              }}
              className="noData"
            >
              <div className="title">
                No Data To Show.
            </div>
            </div>
          )}
      </div>

    </div>
  )
}

export default EmployeeList
