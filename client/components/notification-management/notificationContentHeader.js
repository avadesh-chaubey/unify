import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import {
  Popover,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Link,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import CancelIcon from "@material-ui/icons/Cancel";

export default function NotificationContentHeader(props) {
  const {
    setMsgData,
    orginalBlogRow,
    startSearch,
    setFilterData,
    setStartSearch,
    startDateFilter,
    setStartDateFilter,
    setBlogRow,
    setOriginalRowCount,
    setOrginalBlogRow,
    setTotalRow,
    setLoader,
    setPage,
    setAllBlogs,
    originalRowCount,
    setDateRange,
    term,
    setTerm,
    lastPageHistory,
    setTableLoader,
    cmsAccessPerm
  } = props;
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [presentationDate, setPresentationDate] = useState("Select Date Range");
  const [filterPerm, setFilterPerm] = useState('');

  // Popover open & id for calender
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;

  useEffect(() => {
    if (cmsAccessPerm.length) {
      setFilterPerm(cmsAccessPerm.filter(i => i.name === 'Filters')[0]);
    }
  }, [cmsAccessPerm]);

  const onDateChange = (item) => {
    setAppDateRange([item.selection]);
    setDateRange([item.selection][0]);
    const appStartDate = moment([item.selection][0].startDate).format(
      "MMM DD, YYYY"
    );
    const appEndDate = moment([item.selection][0].endDate).format(
      "MMM DD, YYYY"
    );

    const cmsDateRange = `${appStartDate} - ${appEndDate}`;
    setPresentationDate(cmsDateRange);
  };

  // Functions related to calender handle events
  const handleCalenderEvent = (e) => {
    e.preventDefault();

    // Check the permission to access the Date Range Feature
    if (!filterPerm.viewChecked && !filterPerm.editChecked) {
      setMsgData({
        message: 'Unauthorised Access. Please contact your administrator',
        type: 'error'
      })
      return ;
    }

    setAnchorEl(e.currentTarget);
    setStartDateFilter(true);
    setStartSearch(false);
  };

  // Function to close the calender popover and reset values
  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };

  const handleTermChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    setTerm(searchTerm);
    // Store the search term in Session Storage
    sessionStorage.setItem("cmsSearchTerm", searchTerm);

    // Reset the search term and table data with original record
    if (searchTerm.length === 0) {
      setTableLoader(true);
      // setTimeout(() => {
      handleReset(e);
      setTableLoader(false);
      // }, 1000);
    } else {
      handleSearchEnter(searchTerm);
    }
  };

  const handleSearchEnter = (searchTerm) => {
    // Perform search when search term length is over 2 digit
    if (searchTerm.length < 3) {
      return;
    }

    setTableLoader(true);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    // API to fetch all records of search result for CSV / PDF Download
    axios
      .get(
        `${config.API_URL}/api/cms/blog/searchtitle?title=${searchTerm}`,
        headers
      )
      .then((res) => {
        const searchRes = res.data;
        setTableLoader(false);
        // Reset the page number to first page when search operation has taken place
        setPage(0);
        setStartSearch(true);
        setStartDateFilter(false);
        // console.log(searchRes);
        const filterBlogData = searchRes.blog.map((i, blogIndex) => ({
          authorName: i.authorName,
          blogId: i.blogId,
          blogPublishedDate: i.blogPublishedDate,
          blogPublishedTime: i.blogPublishedTime,
          buttonCaption: i.buttonCaption,
          categories: i.categories,
          content: i.content,
          id: i.id,
          isPublished: i.isPublished ? "Published" : "Unpublished",
          metaDescription: i.metaDescription,
          metaKeywords: i.metaKeywords,
          publishOnHomePage: i.publishOnHomePage,
          publishedDate: i.publishedDate,
          seoUrl: i.seoUrl,
          sorting: i.sorting,
          tags: i.tags.join(","),
          title: i.title,
          titleImageUrl: i.titleImageUrl,
          version: i.version,
        }));
        setFilterData(filterBlogData);
      })
      .catch((err) => {
        setTableLoader(false);

        if (err.response !== undefined) {
          setMsgData({
            message: err.response.data.errors[0].message,
            type: "error",
          });
        } else {
          setMsgData({
            message: "Error occured during Searching for requested for title",
            type: "error",
          });
        }
      });

    // API to fetch all blog by search title based on page number
    axios
      .get(`${config.API_URL}/api/cms/blog/searchtitle?title=${searchTerm}&page=${1}&size=10`,
        headers
      )
      .then((res) => {
        const searchRes = res.data;
        setTableLoader(false);
        // Reset the page number to first page when search operation has taken place
        setPage(0);
        setStartSearch(true);
        setStartDateFilter(false);

        const filterBlogData = searchRes.blog.map((i, blogIndex) => ({
          authorName: i.authorName,
          blogId: i.blogId,
          blogPublishedDate: i.blogPublishedDate,
          blogPublishedTime: i.blogPublishedTime,
          buttonCaption: i.buttonCaption,
          categories: i.categories,
          content: i.content,
          id: i.id,
          isPublished: i.isPublished ? "Published" : "Unpublished",
          metaDescription: i.metaDescription,
          metaKeywords: i.metaKeywords,
          publishOnHomePage: i.publishOnHomePage,
          publishedDate: i.publishedDate,
          seoUrl: i.seoUrl,
          sorting: i.sorting,
          tags: i.tags.join(","),
          title: i.title,
          titleImageUrl: i.titleImageUrl,
          version: i.version,
        }));
        setBlogRow(filterBlogData);
        setTotalRow(searchRes.totalBlogCount);
        setOrginalBlogRow(filterBlogData);
        setTotalRow(searchRes.totalBlogCount);
        setOriginalRowCount(searchRes.totalBlogCount);
      })
      .catch((err) => {
        setTableLoader(false);

        if (err.response !== undefined) {
          setMsgData({
            message: err.response.data.errors[0].message,
            type: "error",
          });
        } else {
          setMsgData({
            message: "Error occured during Searching for requested for title",
            type: "error",
          });
        }
      });
  };

  const handleData = () => {
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };
    // let data = page;

    // if (localStorage.getItem("routerLink") != null) {
    //   let t = localStorage.getItem("routerLink");
    //   let arr = t.split(",");

    //   if (arr[1] == "/previewTemplate" || arr[1] == "/cms/blogPost") {
    //     data = parseInt(localStorage.getItem("pageId"));
    //     // localStorage.setItem('pageId', data);
    //   } else {
    //     localStorage.setItem("pageId", 0);
    //   }
    // }
    setPage(0);
    axios
      .get(`${config.API_URL}/api/cms/blog?page=${1}&size=10`, headers)
      .then((res) => {
        setLoader(false);
        const filterBlogData = res.data.data.cms.map((i) => ({
          authorName: i.authorName,
          blogId: i.blogId,
          blogPublishedDate: i.blogPublishedDate,
          blogPublishedTime: i.blogPublishedTime,
          buttonCaption: i.buttonCaption,
          categories: i.categories,
          content: i.content,
          id: i.id,
          isPublished: i.isPublished ? "Published" : "Unpublished",
          metaDescription: i.metaDescription,
          metaKeywords: i.metaKeywords,
          publishOnHomePage: i.publishOnHomePage,
          publishedDate: i.publishedDate,
          seoUrl: i.seoUrl,
          sorting: i.sorting,
          tags: i.tags.join(","),
          title: i.title,
          titleImageUrl: i.titleImageUrl,
          version: i.version,
        }));
        setBlogRow(filterBlogData);
        setOrginalBlogRow(filterBlogData);
        setTotalRow(res.data.data.totalBlogs);
        setOriginalRowCount(res.data.data.totalBlogs);
      })
      .catch((err) => {
        setLoader(false);
        setMsgData({
          message: "Error occured while getting all blog post",
          type: "error",
        });
      });
  };

  const handleReset = () => {
    setTerm("");
    setDateRange({});
    setAppDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setPresentationDate("Select Date Range");
    setStartSearch(false);
    setStartDateFilter(false);
    // Reset the page number to previous state before search operation has occurred
    setPage(lastPageHistory);
    setBlogRow(orginalBlogRow);
    setTotalRow(originalRowCount);
    handleData();
  };

  const handleFilterReset = () => {
    setTerm("");
    setDateRange({});
    setAppDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setStartSearch(false);
    setPage(lastPageHistory);
    setStartDateFilter(false);
    setBlogRow(orginalBlogRow);
    setTotalRow(originalRowCount);
    setPresentationDate("Select Date Range");
    handleData();
  };

  return (
    <AppBar position="relative" color="default" className="appbar-support">
      <Toolbar className="support-toolbar">
        <Grid container spacing={3}>
          <Grid item xs={startDateFilter ? 8 : 9}>
            <TextField
              id="search-content-list"
              className="searchbar-content"
              placeholder="Search Here"
              variant="outlined"
              value={term}
              onChange={handleTermChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src="/doctor/search_small.svg"
                      alt="close_search"
                      height="18"
                      width="18"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    style={{ visibility: term.length ? "visible" : "hidden" }}
                    onClick={handleReset}
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
              disabled={(!filterPerm.viewChecked && !filterPerm.editChecked)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              className="blog-calender-popover"
              style={{ float: "right" }}
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
            <Grid item xs={1} style={{ marginTop: "4px", cursor: "pointer" }}>
              <CancelIcon
                className="date-range-expand-icon"
                onClick={handleFilterReset}
              />
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
