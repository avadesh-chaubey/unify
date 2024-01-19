import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import config from "../../app.constant";
import { CSVLink } from "react-csv";
import {
  MenuItem,
  Link,
  Popper,
  Grow,
  ClickAwayListener,
  Paper,
  MenuList,
} from "@material-ui/core";
import CmsSummary from "./CmsSummary";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import CmsPdfList from "./CmsPdfList";
import { saveAs } from "file-saver";
import { divideByChunk } from "../../utils/helpers";
import PreviewCmsPdf from "./previewCmsPdf";

export default function CmsDownload(props) {
  const [openDownloadOption, setOpenDownloadOption] = useState(false);
  const downloadAchorRef = useRef(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [previewBlogList, setPreviewBlogList] = useState([]);
  const [modalName, setModalName] = useState("");

  const handleDownloadOption = (e) => {
    e.preventDefault();
    setOpenDownloadOption(!openDownloadOption);
  };

  const printRef = useRef();
  // const handlePrint = useReactToPrint(
  //   {
  //     content: () => printRef.current,
  //   }
  //   // setOpenDownloadOption(!openDownloadOption)
  // );

  const handleCloseOption = (e) => {
    if (
      downloadAchorRef.current &&
      downloadAchorRef.current.contains(e.target)
    ) {
      return;
    }

    setOpenDownloadOption(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenDownloadOption(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(openDownloadOption);

  useEffect(() => {
    if (prevOpen.current === true && openDownloadOption === false) {
      downloadAchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [openDownloadOption]);

  const handleError = (type) => {
    props.setMsgData({
      message: `No Records Available to ${
        type !== "preview" ? "Download" : "Preview"
      }`,
      type: "error",
    });
  };

  const csvHeader = [
    // { label: "SNO", key: "id" },
    { label: "Title", key: "title" },
    { label: "Publisher", key: "publisher" },
    { label: "Sorting", key: "sorting" },
    { label: "Category", key: "categories" },
    { label: "Date", key: "modifiedPublishedDate" },
    { label: "Status", key: "status" },
  ];

  const csvFilterHeader = [
    { label: "Title", key: "title" },
    { label: "Publisher", key: "authorName" },
    { label: "Sorting", key: "sorting" },
    { label: "Category", key: "categories" },
    { label: "Date", key: "publishedDate" },
    { label: "Status", key: "isPublished" },
  ];

  // Function to perform file download of cms-list on onClick event
  const generatePdfLink = async (blogData) => {
    const blob = await pdf(<CmsPdfList allblog={blogData} />).toBlob();

    saveAs(blob, "cms-list.pdf");
  };

  const performCmsSearch = async () => {
    // Get CMS Search Term from Session Storage
    const getSearchTerm = sessionStorage.getItem("cmsSearchTerm");
    let filterBlogData = [];
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    await axios
      .get(
        `${config.API_URL}/api/cms/blog/searchtitle?title=${getSearchTerm}`,
        headers
      )
      .then((res) => {
        const searchRes = res.data;
        filterBlogData = searchRes.blog.map((i, blogIndex) => ({
          id: blogIndex + 1,
          title: i.title,
          publisher: i.authorName,
          publishedData: moment(i.publishedDate).format("YYYY-MM-DD HH:mm:ss"),
          modifiedPublishedDate: `${moment(i.publishedDate).format(
            "DD MMM YYYY"
          )} ${moment(i.publishedDate).format("HH:mm:ss")}`,
          sorting: i.sorting,
          status: i.isPublished ? "Published" : "Unpublished",
          categories: i.categories.join(", "),
        }));
      })
      .catch((err) => {
        setMsgData({
          message: "Error occured while getting Search Records",
          type: "error",
        });
      });

    return filterBlogData;
  };

  const getCmsDataByDate = async (selectedDateRange) => {
    let dateRangeBlogData = [];
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    await axios
      .get(`${config.API_URL}/api/cms/blog?${selectedDateRange}`, headers)
      .then((res) => {
        const dateRangeRes = res.data.data;
        dateRangeBlogData = dateRangeRes.cms.map((i, blogIndex) => ({
          id: blogIndex + 1,
          title: i.title,
          publisher: i.authorName,
          publishedData: moment(i.publishedDate).format("YYYY-MM-DD HH:mm:ss"),
          modifiedPublishedDate: `${moment(i.publishedDate).format(
            "DD MMM YYYY"
          )} ${moment(i.publishedDate).format("HH:mm:ss")}`,
          sorting: i.sorting,
          status: i.isPublished ? "Published" : "Unpublished",
          categories: i.categories.join(", "),
        }));
      })
      .catch((err) => {
        console.log("Error occurred by cms-date-range", err);
      });

    return dateRangeBlogData;
  };

  const handleGeneratePdf = (e) => {
    e.preventDefault();

    if (props.startSearch && props.blogRow.length) {
      const getSearchedData = performCmsSearch();
      getSearchedData
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const blogSerachChunk = divideByChunk(data, 17);
          generatePdfLink(blogSerachChunk);
        })
        .catch((err) =>
          setMsgData({
            message: "Error occured in generating PDF",
            type: "error",
          })
        );
    } else if (props.startDateFilter && props.blogRow.length) {
      // Get selected data-range from session storage
      const cmsDateRangeVal = sessionStorage.getItem("cmsDateRange");
      getCmsDataByDate(cmsDateRangeVal)
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const cmsDateRangeChunk = divideByChunk(data, 17);
          generatePdfLink(cmsDateRangeChunk);
        })
        .catch((err) => console.log("Date Range PDF Err", err));
    } else if (props.blogRow.length) {
      // Perform download for all cms records
      // Divide the blog records by chunk size which is 17
      const allBlogByChunk = divideByChunk(props.allblog, 17);
      generatePdfLink(allBlogByChunk);
    } else {
      // Display Error Message for No Records
      handleError();
      return;
    }

    handleCloseOption(e);
  };

  const handlePreviewModal = () => {
    setOpenPreviewModal(!openPreviewModal);
    setModalName("Preview");

    // Filter data as per the condition applied i.e, All Data,
    // CMS Search related data and Date Range Data
    if (props.startSearch && props.blogRow.length) {
      const getSearchedData = performCmsSearch();
      getSearchedData
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const blogSerachChunk = divideByChunk(data, 17);
          setPreviewBlogList(blogSerachChunk);
        })
        .catch((err) =>
          setMsgData({
            message: "Error occured in generating PDF",
            type: "error",
          })
        );
    } else if (props.startDateFilter && props.blogRow.length) {
      // Get selected data-range from session storage
      const cmsDateRangeVal = sessionStorage.getItem("cmsDateRange");
      getCmsDataByDate(cmsDateRangeVal)
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const cmsDateRangeChunk = divideByChunk(data, 17);
          setPreviewBlogList(cmsDateRangeChunk);
        })
        .catch((err) => console.log("Date Range PDF Err", err));
    } else if (props.blogRow.length) {
      // Perform download for all cms records
      // Divide the blog records by chunk size which is 17
      const allBlogByChunk = divideByChunk(props.allblog, 17);
      setPreviewBlogList(allBlogByChunk);
    } else {
      // Display Error Message for No Records
      handleError("preview");
      return;
    }
  };

  const handlePrintModal = () => {
    setOpenPreviewModal(!openPreviewModal);
    setModalName("Print");

    // Filter data as per the condition applied i.e, All Data,
    // CMS Search related data and Date Range Data
    if (props.startSearch && props.blogRow.length) {
      const getSearchedData = performCmsSearch();
      getSearchedData
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const blogSerachChunk = divideByChunk(data, 17);
          setPreviewBlogList(blogSerachChunk);
        })
        .catch((err) =>
          setMsgData({
            message: "Error occured in generating PDF",
            type: "error",
          })
        );
    } else if (props.startDateFilter && props.blogRow.length) {
      // Get selected data-range from session storage
      const cmsDateRangeVal = sessionStorage.getItem("cmsDateRange");
      getCmsDataByDate(cmsDateRangeVal)
        .then((data) => {
          // Divide the blog records by chunk size which is 17
          const cmsDateRangeChunk = divideByChunk(data, 17);
          setPreviewBlogList(cmsDateRangeChunk);
        })
        .catch((err) => console.log("Date Range PDF Err", err));
    } else if (props.blogRow.length) {
      // Perform download for all cms records
      // Divide the blog records by chunk size which is 17
      const allBlogByChunk = divideByChunk(props.allblog, 17);
      setPreviewBlogList(allBlogByChunk);
    } else {
      // Display Error Message for No Records
      handleError("preview");
      return;
    }
  };

  return (
    <>
      <Link
        ref={downloadAchorRef}
        href="#"
        onClick={handleDownloadOption}
        style={{
          textDecoration: "none",
          display:
            props.name === "Content Management List" ||
            props.name === "Banner Management List" ||
            props.name === "Notification Management List"
              ? ""
              : "none",
        }}
      >
        <img
          src="/download_file_icon.svg"
          className="righticon settings-icon"
          style={{ height: 25 }}
        />
      </Link>

      <PreviewCmsPdf
        name={modalName}
        open={openPreviewModal}
        allblogs={previewBlogList}
        handlePreviewModal={handlePreviewModal}
        handleCloseOption={handleCloseOption}
        handleGeneratePdf={handleGeneratePdf}
      />

      <PreviewCmsPdf
        name={modalName}
        open={openPrintModal}
        allblogs={previewBlogList}
        handlePreviewModal={handlePrintModal}
        handleCloseOption={handleCloseOption}
        handleGeneratePdf={handleGeneratePdf}
      />

      <Popper
        open={openDownloadOption}
        anchorEl={downloadAchorRef.current}
        role={undefined}
        transition
        disablePortal
        className="print-option-popper"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: "center bottom" }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseOption}>
                <MenuList
                  id="menu-list-grow"
                  className="download-option-list"
                  autoFocusItem={openDownloadOption}
                  onKeyDown={handleKeyDown}
                >
                  <MenuItem
                    className="print-option"
                    onClick={
                      props.blogRow.length > 0
                        ? handleCloseOption
                        : handleCloseOption && handleError
                    }
                  >
                    {props.startSearch && props.blogRow.length > 0 ? (
                      <CSVLink
                        headers={csvFilterHeader}
                        filename="cms_blogs_details"
                        data={props.filterData}
                      >
                        CSV
                      </CSVLink>
                    ) : props.startDateFilter && props.blogRow.length > 0 ? (
                      <CSVLink
                        headers={csvFilterHeader}
                        filename="cms_blogs_details"
                        data={props.filterData}
                      >
                        CSV
                      </CSVLink>
                    ) : props.startDateFilter === false &&
                      props.startSearch === false &&
                      props.blogRow.length > 0 ? (
                      <CSVLink
                        headers={csvHeader}
                        filename="cms_blogs_details"
                        data={props.allblog}
                      >
                        CSV
                      </CSVLink>
                    ) : (
                      <div>CSV</div>
                    )}
                  </MenuItem>
                  <MenuItem
                    className="print-option"
                    onClick={handleGeneratePdf}
                  >
                    PDF
                  </MenuItem>
                  <MenuItem
                    className="print-option"
                    onClick={handleCloseOption}
                  >
                    <PDFDownloadLink
                      document={<CmsSummary summaryData={props.allblog} />}
                      fileName="CMS_Blogs_Summary.pdf"
                    >
                      Summary
                    </PDFDownloadLink>
                  </MenuItem>
                  <MenuItem
                    className="print-option"
                    onClick={handlePreviewModal}
                  >
                    Preview
                  </MenuItem>
                  <MenuItem
                    className="print-option"
                    onClick={handlePrintModal}
                  >
                    Print
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
