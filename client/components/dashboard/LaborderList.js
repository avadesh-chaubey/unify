import React, { useState, useEffect } from "react";
import {
  Paper,
  Card,
  Typography,
  makeStyles,
  Grid,
  TablePagination,
  FormControlLabel,
  InputBase,
  Button,
  CardContent,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Popover,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import Header from "../dashboard/Header";
import Sidenavbar from "../dashboard/Sidenavbar";
import ListPagination from "./ListPagination";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    boxShadow: "none",
  },
  "& .MuiSvgIcon-root": {
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(4),
  },
  selectWrapper: {
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #cccccc",
    paddingLeft: "8px",
    paddingRight: "15px",
    marginRight: "0px",
    marginLeft: "90px",
    fontFamily: "Avenir LT 65",
    color: "#555555",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
  },
  selectBox: {
    width: "190px",
    height: "45px",
    border: "0px",
    outline: "none",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
  },
  IconButton: {
    padding: "3px",
    paddingRight: "10px",
    overflow: "hidden",
    textAlign: "center",
  },
  searchInput: {
    border: "1px ",
    borderColor: "#B2AEAE",
    boxShadow: "0 0 0 .5px #979797",
    borderRadius: "20px",
    marginLeft: "15px",
    opacity: "1",
    padding: `0px ${theme.spacing(1)}px`,
    fontSize: "0.8rem",
    width: "300px",
    height: "45px",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bahnschrift SemiBold",
    color: "#555555",
  },
  "&:hover": {
    backgroundColor: "#f2f2f2",
  },
  buttonFilter: {
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginLeft: "20px",
    paddingRight: "15px",
    color: "#555555",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    fontFamily: "Bahnschrift SemiBold",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  button2: {
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    border: "1px solid #cccccc",
    marginRight: "20px",
    color: "#fff",
    fontFamily: "Bahnschrift SemiBold",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#152A75",
    padding: "10px",
    borderRadius: "30px",
    width: "145px",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  Card: {
    width: "160px",
    height: "50px",
    borderRadius: "5px",
    fontFamily: "Bahnschrift SemiBold",
  },
  icon: {
    width: "40px",
    height: "40px",
    opacity: "1",
  },
  typotext: {
    color: "#161616",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "15px",
  },
  typotext2: {
    paddingTop: "0",
    color: "#979797",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "9px",
    paddingBottom: "15px",
  },
  IconButton: {
    "& span": {
      width: "12px",
      height: "12px",
      backgroundColor: "#F1F1F1",
      borderColor: "#979797",
    },
  },
  final: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.75rem",
      width: "0.75rem",
      marginRight: "0.5rem",
      backgroundColor: "#00C11F",
    },
  },
  panding: {
    fontFamily: "Bahnschrift SemiBold",
    "&::before": {
      display: "inline-block",
      content: '""',
      borderRadius: "0.375rem",
      height: "0.75rem",
      width: "0.75rem",
      marginRight: "0.5rem",
      backgroundColor: "#D7243B",
    },
  },
  Grid: {
    fontFamily: "Bahnschrift SemiBold",
    "& .MuiDataGrid-cell": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
      textAlign: "left",
      color: "#555555",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontFamily: "Bahnschrift SemiBold",
      color: "#000000",
      overFlow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "inherit",
    },
    "&MuiDataGrid-iconButtonContainer": {
      position: "absolute",
      paddingLeft: "35px",
    },
  },
  contentPagination: {
    float: "left !important",
    color: "grey",
    position: "absolute",
    left: "8px",
    padding: "3px",
    bottom: "12px",
    fontFamily: "Bahnschrift SemiBold",

    "& li": {
      border: "1px solid #D7DAE2",
      padding: "10px 15px",
      outline: "none",
      cursor: "pointer",
    },
  },
}));
export default function laborderList(props) {
  const [laborderList, setLaborderList] = useState([]);
  const [paidOrderCount, setPaidOrderCount] = useState(0);
  const [paidLabOrderAmount, setPaidLabOrderAmount] = useState(0);
  const [paymentFailedOrderCount, setPaymentFailedOrderCount] = useState(0);
  const [paymentFailedLabOrderAmount, setPaymentFailedLabOrderAmount] =
    useState(0);
  const [page, setPage] = useState(1);
  const [totalRow, setTotalRow] = useState(100);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [cookies] = useCookies(["name"]);
  const router = useRouter();
  const classes = useStyles();

  const addnewLabOrderHandler = () => {
    router.push("/addnewlaborder");
  };

  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;
  const columns = [
    { field: "patientARHId", headerName: "Lab No.", width: 130 },
    { field: "patientName", headerName: "Name", width: 130 },
    { field: "patientAge", headerName: "Age", width: 100 },
    { field: "patientGender", headerName: "Gender", width: 125 },
    { field: "consultantName", headerName: "Referred Dr.", width: 175 },
    { field: "orderDate", headerName: "Collected Date", width: 180 },
    // { field: 'orderDate', headerName: 'Received Date', width: 180, },
    { field: "city", headerName: "City ", width: 130 },
    { field: "reportStatus", headerName: "Status", width: 130 },
  ];
  const [list, setList] = useState([]);

  const handlePageChange = (event, value) => {
    setPage(event.target.value);
  };

  const getData = async () => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: cookie,
      };
      const url = config.API_URL + "/api/patient/laborderdashboard";
      const response = await axios.get(url, { headers });
      const data = response.data.patients.map((item) => {
        const age = getAge(item.patientAge);
        const orderDate = getDate2(item.orderDate);
        let temp = { ...item };
        temp.patientAge = age.toString();
        temp.orderDate = orderDate.toString();
        return temp;
      });
      setLaborderList(data);
      setList(data);
      setPaidOrderCount(response.data.paidOrderCount);
      setPaidLabOrderAmount(response.data.paidLabOrderAmount);
      setPaymentFailedOrderCount(response.data.paymentFailedOrderCount);
      setPaymentFailedLabOrderAmount(response.data.paymentFailedLabOrderAmount);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);

  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };
  const handleCalendar = () => {
    setAnchorEl(true);
  };
  const getDate = () => {
    const startDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].startDate
    ).toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const endDate = new Date(
      appDateRange && appDateRange[0] && appDateRange[0].endDate
    ).toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    return startDate + " - " + endDate;
  };
  const getDate2 = (dateString) => {
    const date = new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    return date;
  };
  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const searchHeandler = (value) => {
    const filter = laborderList.filter((item) => {
      if (!value) true;
      const status =
        item.consultantName
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        item.patientARHId
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      return status;
    });
    setList(filter);
  };
  console.log("===========>laborderList", laborderList);
  console.log("========>columns", columns);
  return (
    <Grid container>
      <Grid item xs={1}>
        <Sidenavbar />
      </Grid>
      <Grid
        item
        xs={11}
        style={{ height: "100vh", overflow: "hidden", overflowY: "scroll" }}
      >
        <Header title="Lab Orders" rows={laborderList} columns={columns} />
        <div>
          <div>
            <Grid
              container
              justify="space-between"
              style={{ backgroundColor: "#F6FBF8", padding: "10px 10px" }}
            >
              <Grid item>
                <Grid container>
                  <InputBase
                    onChange={(e) => searchHeandler(e.target.value)}
                    placeholder="Search Here"
                    className={classes.searchInput}
                    startAdornment={<SearchIcon fontSize="small" />}
                  />
                  <Button
                    variant="Filter"
                    color="default"
                    className={classes.buttonFilter}
                    endIcon={<FilterListIcon />}
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                style={{
                  fontFamily: "Bahnschrift SemiBold",
                  fontSize: "13px",
                  marginLeft: "90px",
                }}
              >
                <div className={classes.selectWrapper}>
                  <img src="/calender icon.svg" className={classes.icon} />
                  <p
                    onClick={handleCalendar}
                    style={{
                      fontFamily: "Bahnschrift SemiBold",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {getDate()}
                  </p>
                  <Popover
                    style={{ marginTop: "105px" }}
                    id={id}
                    open={openCalendar}
                    anchorEl={anchorEl}
                    onClose={onClosePopOver}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <DateRangePicker
                      onChange={(item) => setAppDateRange([item.selection])}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={2}
                      ranges={appDateRange}
                      direction="horizontal"
                    />
                  </Popover>
                </div>
              </Grid>
              <Grid item>
                <Button
                  onClick={addnewLabOrderHandler}
                  variant="contained"
                  className={classes.button2}
                >
                  NEW ORDER
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              style={{ paddingLeft: "20px", paddingTop: "10px" }}
              spacing={1}
            >
              <Grid item sm={2} style={{ textAlign: "center" }}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}>
                      {paidOrderCount}
                    </Typography>
                    <Typography className={classes.typotext2}>
                      All Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={2} style={{ textAlign: "center" }}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}>
                      {paidLabOrderAmount}
                    </Typography>
                    <Typography className={classes.typotext2}>
                      New Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={2} style={{ textAlign: "center" }}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}>
                      {paymentFailedOrderCount}
                    </Typography>
                    <Typography className={classes.typotext2}>
                      Active Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={2} style={{ textAlign: "center" }}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}>
                      {paymentFailedLabOrderAmount}
                    </Typography>
                    <Typography className={classes.typotext2}>
                      Pending Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={2} style={{ textAlign: "center" }} spacing={1}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}> 9.7 K</Typography>
                    <Typography className={classes.typotext2}>
                      Completed Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={2} style={{ textAlign: "center" }}>
                <Card className={classes.Card}>
                  <CardContent style={{ padding: "10px" }}>
                    <Typography className={classes.typotext}>7.35 L</Typography>
                    <Typography className={classes.typotext2}>
                      Revenue Generated
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          <br />
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              className={classes.Grid}
              rows={list}
              columns={columns}
              pageSize={15}
              rowHeight={30}
              headerHeight={45}
              sortable={true}
              resizable={true}
              filter={true}
              //checkboxSelection
              disableSelectionOnClick
              getCellClassName={(params) => {
                if (params.field === "reportStatus") {
                  if (params.value == "Final") {
                    return classes.final;
                  }
                }
              }}
            />
            <TablePagination
              className="content-table-pagination"
              //className={classes.contentPagination}
              rowsPerPageOptions={[10]}
              component="div"
              count={totalRow}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handlePageChange}
              labelDisplayedRows={({ from, to, count }) => (
                <strong className={classes.contentPagination}>
                  Showing {from} to {to} of {count} entries
                </strong>
              )}
              ActionsComponent={ListPagination}
            />
          </div>
          {/* <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((item, index) => {
                                        if (index == 0) {
                                            return (<TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size='small'
                                                            color='#979797'
                                                        />
                                                    } */}
          {/* label={item.fieldName}
                                                /></TableCell>)
                                        }
                                        return <TableCell align="left">{item.fieldName}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                    return ( */}
          {/* <TableRow key={item.labNo}  >
                                            <TableCell >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            size='small'
                                                            color='#979797'
                                                        />
                                                    }
                                                    label={item.labNo}
                                                />
                                            </TableCell> */}
          {/* <TableCell align="left">{item.labno}</TableCell> */}
          {/* <TableCell align="left">{item.patientName}</TableCell>
                                            <TableCell align="left">{item.age}</TableCell>
                                            <TableCell align="left">{item.gender}</TableCell>
                                            <TableCell align="left">{item.referredDr}</TableCell>
                                            <TableCell align="left">{item.collectedDate}</TableCell>
                                            <TableCell align="left">{item.receivedDate}</TableCell>
                                            <TableCell align="left">{item.reportingLocation}</TableCell>
                                            <TableCell align="left"> */}
          {/* {getStatus(item.reportStatus)}
                                            </TableCell>
                                        </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
          {/* <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    /> */}
        </div>
      </Grid>
    </Grid>
  );
}
