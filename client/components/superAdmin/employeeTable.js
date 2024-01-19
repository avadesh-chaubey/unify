import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import config from "../../app.constant";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Link,
  makeStyles,
} from "@material-ui/core";
import BlogPagination from "../blog/BlogPagination";
import SimpleBar from "simplebar-react";
import EmployeeDataGrid from "./employeeDataGrid";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Paper,
  Card,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputBase,
  Button,
  TextField,
  CardContent,
  Badge,
  CardHeader,
  List,
  Popover,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { DateRangePicker } from "react-date-range";
import Menu from "@material-ui/core/Menu";
import employeeData from '../../types/employee-access-list';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "authorName", numeric: false, disablePadding: false, label: "Author" },
  { id: "isPublished", numeric: false, disablePadding: false, label: "Status" },
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" },
];

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <strong style={{ fontSize: "1.15rem" }}>{headCell.label}</strong>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
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
    fontWeight: "normal",
    color: "#555555",
  },
  "&:hover": {
    backgroundColor: "#f2f2f2",
  },
  button: {
    border: "1px ",
    borderColor: "#B2AEAE",
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    opacity: "1",
    height: 44,
    border: "1px solid #cccccc",
    marginLeft: "35px",
    paddingRight: "15px",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
    fontWeight: "bold",
    fontSize: "14px",
    justifyContent: "center",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    "& span": {
      fontFamily: "Bahnschrift SemiBold",
      fontSize: "14px",
    },
  },
  selectWrapper: {
    borderRadius: "36px",
    display: "inline-block",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #cccccc",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontFamily: "Bahnschrift SemiBold",
    fontSize: "14px",
    fontWeight: "normal",
    color: "#555555",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  },
  selectBox: {
    width: "190px",
    height: "45px",
    border: "0px",
    outline: "none",
    color: "#555555",
    fontFamily: "Bahnschrift SemiBold",
    fontWeight: "normal",
  },
  Card: {
    width: "160px",
    height: "130px",
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
    fontSize: "25px",
  },
  typotext2: {
    paddingTop: "0",
    color: "#979797",
    fontFamily: "Bahnschrift SemiBold",
    fontWeight: "normal",
    fontSize: "10px",
  },
  Bar: {
    borderRadius: "2px",
    border: "none",
    fontFamily: "Bahnschrift SemiBold !important",
    paddingLeft: "15px",

    // paddingLeft: '15px',
    // paddingRight: '15px',
  },
}));

export default function EmployeeTable(prop) {
  const {
    setLoader,
    setMsgData,
    searchTerm,
    empRow,
    setEmpRow,
    totalRow,
    setTotalRow,
    originalEmpRow,
    setOrginalEmpRow,
  } = prop;
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleName, setRoleName] = useState("All");
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [presentationDate, setPresentationDate] = useState("Select Date Range");
  const [dateRange, setDateRange] = useState({});
  const [empSearch, setEmpSearch] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(false);

  // Popover open & id for calender
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;

  const onDateChange = (item) => {
    handleResetEmpSearch();
    setAppDateRange([item.selection]);

    setDateRange([item.selection][0]);
    const appStartDate = moment([item.selection][0].startDate).format(
      "MMM DD, YYYY"
    );
    const appEndDate = moment([item.selection][0].endDate).format(
      "MMM DD, YYYY"
    );
    setPresentationDate(`${appStartDate} - ${appEndDate}`);
  };

  useEffect(() => {
    let dateParam = "";
    if (dateRange.startDate) {
      let obj = {
        startDate: moment(dateRange.startDate).format("YYYY-MM-DD"),
        endDate: moment(dateRange.endDate).format("YYYY-MM-DD"),
      };

      dateParam = `&startDate=${obj.startDate}&endDate=${obj.endDate}`;
      showBlogList(dateParam);
    }
  }, [dateRange]);

  // Functions related to calender handle events
  const handleCalenderEvent = (e) => {
    e.preventDefault();
    setStartDateFilter(true);
    setAnchorEl(e.currentTarget);
  };

  // Function to close the calender popover and reset values
  const onClosePopOver = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  const showBlogList = (dateParam) => {
    setLoader(true);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    let data = page;

    if (localStorage.getItem("routerLink") != null) {
      let t = localStorage.getItem("routerLink");
      let arr = t.split(",");

      if (arr[1] == "/previewTemplate" || arr[1] == "/cms/blogPost") {
        data = parseInt(localStorage.getItem("pageId"));
      } else {
        localStorage.setItem("pageId", 0);
      }
    }
    setPage(data);
    // axios
    //   .get(
    //     `${config.API_URL}/api/users/employeeaccesslist?page=${
    //       data + 1
    //     }&size=${rowsPerPage}${dateParam}`,
    //     headers
    //   )
    //   .then((res) => {
    setLoader(false);
    // const empAccessLisrRes = res.data.data.role;
    // setEmpRow(empAccessLisrRes.slice(0, 10));
    // setOrginalEmpRow(empAccessLisrRes);
    // setTotalRow(empAccessLisrRes.length);

    setEmpRow(employeeData.slice(0, 10));
    setOrginalEmpRow(employeeData);
    setTotalRow(employeeData.length);

    // })
    // .catch((err) => {
    //   setLoader(false);
    //   setMsgData({
    //     message: "Error occured while getting employee list",
    //     type: "error",
    //   });
    // });
  };

  const [openMenu, setOpenMenu] = useState(null);
  const filterBtnClick = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleClose = () => {
    setOpenMenu(null);
  };
  const handleFilter = (val) => {
    setRoleName(val);
    let tempEmpList = [...originalEmpRow];
    if (val === "All") {
      console.log("emp row (2)");
      setEmpRow(tempEmpList);
      setTotalRow(tempEmpList.length);
      handleClose();
      return false;
    }
    let tempArr = [];
    tempEmpList.map((item) => {
      if (item.roleAssigned === val) {
        tempArr.push(item);
      }
    });

    setEmpRow(tempArr);
    setTotalRow(tempArr.length);
    handleClose();
  };
  const onSearchChange = (e) => {
    setRoleName("All");

    let val = e.target.value;
    setEmpSearch(val);

    let tempEmpList = [...originalEmpRow];
    let tempArr = [];

    // Filter records based on userFirstName, userLastNane, Role, Phone Number and Email
    tempArr = tempEmpList.filter(
      (item) =>
        item.userFirstName
          .toLocaleLowerCase()
          .indexOf(val.toLocaleLowerCase()) > -1 ||
        item.userLastName.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >
          -1 ||
        item.emailId.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >
          -1 ||
        item.role.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1 ||
        item.phoneNumber.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >
          -1
    );

    if (tempArr.length > 0) {
      setEmpRow(tempArr);
      setTotalRow(tempArr.length);
    } else {
      let arr = [];
      setEmpRow(arr);
      setTotalRow(0);
    }
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handlePageChange = (e) => {
    const newPage = e.selected + 1;
    setPage(e.selected);
    setLoader(true);
    let temp = [...originalEmpRow];

    setEmpRow(temp.splice((newPage - 1) * 10, 10));
    setLoader(false);
  };

  const handleAccessData = () => {
    setLoader(true);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    axios
      // .get(`${config.API_URL}/api/users/employeeaccesslist`, headers)
      // .then((res) => {
        setLoader(false);
        const loggedInUserDetails = JSON.parse(
          localStorage.getItem("userDetails")
        );
        // const empList = res.data.data.role;
        const empList = employeeData;

        // Remove record of logged in user
        const updateUserList = empList.filter(
          (emp) => emp.emailId !== loggedInUserDetails.emailId
        );
        setEmpRow(updateUserList.slice(0, 10));
        setOrginalEmpRow(updateUserList);
        setTotalRow(updateUserList.length);
      // })
      // .catch((err) => {
      //   setLoader(false);
      //   setMsgData({
      //     message: "Error occured while getting all employeeaccesslist",
      //     type: "error",
      //   });
      // });
  };

  useEffect(() => {
    handleAccessData();
  }, []);

  const handleResetEmpSearch = () => {
    setEmpSearch("");
    console.log("emp row (5)");
  };

  const handleFilterReset = () => {
    handleResetEmpSearch();
    setDateRange({});
    setAppDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setStartDateFilter(false);
    setEmpRow(originalEmpRow);
    setTotalRow(originalEmpRow.length);
    setPresentationDate("Select Date Range");
    handleAccessData();
  };

  return (
    <div>
      <Grid
        container
        justifyContent="space-between"
        style={{ backgroundColor: "#F6FBF8", padding: "10px 10px" }}
      >
        <Grid item xs={startDateFilter ? 7 : 9}>
          <Grid container>
            <TextField
              placeholder="Search Here"
              id="search-content-list"
              className="searchbar-content"
              style={{ marginTop: 7 }}
              variant="outlined"
              value={empSearch}
              onChange={(e) => onSearchChange(e)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" />,
                endAdornment: (
                  <IconButton
                    style={{
                      visibility: empSearch.length ? "visible" : "hidden",
                    }}
                    onClick={handleResetEmpSearch}
                  >
                    <img
                      src="../doctor/close_search.svg"
                      alt="close_search"
                      height="18"
                      width="18"
                    />
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              endIcon={<FilterListIcon />}
              onClick={filterBtnClick}
            >
              Filter: {roleName}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={openMenu}
              keepMounted
              open={Boolean(openMenu)}
              onClose={handleClose}
            >
              <MenuItem onClick={(e) => handleFilter("All")}>All</MenuItem>
              <MenuItem onClick={(e) => handleFilter("Front Office Manager")}>
                Front Office Manager
              </MenuItem>
              <MenuItem onClick={(e) => handleFilter("OP Manager")}>
                OP Manager
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Button
            className="blog-calender-popover"
            style={{ float: "right", marginTop: "6px" }}
            aria-describedby={id}
            variant="outlined"
            color="primary"
            onClick={handleCalenderEvent}
          >
            <img
              src="/calender icon.svg"
              alt="calendar-icon"
              className="calender-icon"
            />
            <Typography
              variant="body1"
              className="presentation-date blog-date-range"
            >
              {presentationDate}
            </Typography>
            {anchorEl !== null ? (
              <ExpandLess className="date-range-expand-icon" />
            ) : (
              <ExpandMore className="date-range-expand-icon" />
            )}
          </Button>
          <Popover
            id={id}
            open={openCalendar}
            anchorEl={anchorEl}
            onClose={onClosePopOver}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            className="dateRangeBlog"
          >
            <DateRangePicker
              onChange={onDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={appDateRange}
              direction="horizontal"
              showMonthAndYearPickers={false}
            />
          </Popover>
        </Grid>
        {startDateFilter && (
          <Grid
            item
            xs={1}
            style={{
              marginTop: "10px",
              marginLeft: "-50px",
              cursor: "pointer",
            }}
          >
            <CancelIcon
              className="date-range-expand-icon"
              onClick={handleFilterReset}
            />
          </Grid>
        )}
      </Grid>
      <EmployeeDataGrid blogList={empRow} setMsgData={setMsgData} />
      {!!empRow.length && (
        <TablePagination
          className="content-table-pagination"
          rowsPerPageOptions={[10]}
          component="div"
          count={totalRow}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handlePageChange}
          labelDisplayedRows={({ from, to, count }) => (
            <strong className="content-pagination">
              Showing {from} to {to} of {count} entries
            </strong>
          )}
          ActionsComponent={BlogPagination}
        />
      )}
    </div>
  );
}
