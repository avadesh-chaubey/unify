import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import moment from "moment";
import { TablePagination } from "@material-ui/core";
import BlogPagination from "./BlogPagination";
import BlogDataGrid from "./BlogDataGrid";

export default function ContentManagementTable(prop) {
  const {
    setLoader,
    setMsgData,
    blogRow,
    setBlogRow,
    setFilterData,
    totalRow,
    setTotalRow,
    setOrginalBlogRow,
    startSearch,
    startDateFilter,
    setOriginalRowCount,
    dateRange,
    allblog,
    setAllBlogs,
    page,
    term,
    setPage,
    setLastPageHistory,
    tableLoader,
  } = prop;

  // Number of records per page
  const rowsPerPage = 10;
  const [dateObj, setDateObj] = useState("");
  const [blogRowFlag, setBlogRowFlag] = useState(true);
  const [dataGridLoader, setDataGridLoader] = useState(false);
  const [fetchNewData, setFetchNewData] = useState(false);
  const [sortModel, setSortModel] = useState([]);
  const [sortEnabled, setSortEnabled] = useState(false);

  const handleSortModelChange = (newModel) => {
    // Trigger server side sorting for 3 phases (asc, desc, null)
    if (
      newModel.length === 0 ||
      sortModel.length === 0 ||
      sortModel[0].sort !== newModel[0].sort ||
      sortModel[0].field !== newModel[0].field
    ) {
      setSortEnabled(true);
      setSortModel(newModel);
      setFetchNewData(true);
    }
  };

  useEffect(() => {
    if (!sortModel.length || !sortEnabled) {
      setSortEnabled(false);
      return;
    }
    let active = true;

    (async () => {
      setDataGridLoader(true);

      await sortByField(sortModel[0].field, sortModel[0].sort, page);
      setFetchNewData(false);

      if (!active) {
        return;
      }

      setDataGridLoader(false);
    })();

    return () => {
      active = false;
    };
  }, [sortModel, fetchNewData, page, sortEnabled]);

  const sortByField = (sortField, sortType = "asc") => {
    const headers = {
      headers: {
        authToken: JSON.parse(localStorage.getItem("token")),
      },
    };

    axios
      .get(
        startDateFilter
          ? `${config.API_URL}/api/cms/blog?page=${
              page + 1
            }&size=${rowsPerPage}&accessKey=${sortField}&sort=${sortType}${dateObj}`
          : startSearch
          ? `${config.API_URL}/api/cms/blog/searchtitle?title=${term}&page=${
              page + 1
            }&size=${rowsPerPage}&accessKey=${sortField}&sort=${sortType}`
          : `${config.API_URL}/api/cms/blog?page=${
              page + 1
            }&size=${rowsPerPage}&accessKey=${sortField}&sort=${sortType}`,
        headers
      )
      .then((res) => {
        const sortResult = startDateFilter
          ? res.data.data.cms
          : startSearch
          ? res.data.data.blog
          : res.data.data.cms;

        const formatSortResult = sortResult.map((i) => ({
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
          action: i.action,
        }));

        setBlogRow(formatSortResult);
        setOrginalBlogRow(formatSortResult);

        setTotalRow(
          startDateFilter
            ? res.data.data.totalBlogs
            : startSearch
            ? res.data.data.totalBlogCount
            : res.data.data.totalBlogs
        );

        setOriginalRowCount(
          startDateFilter
            ? res.data.data.totalBlogs
            : startSearch
            ? res.data.data.totalBlogCount
            : res.data.data.totalBlogs
        );
      })
      .catch((err) => {
        console.log("Error in blog sort", err);
      });
  };

  const handlePageChange = (e) => {
    const newPage = e.selected + 1;
    setPage(e.selected);
    // newPage - 1 give result of current page that Table Pagination accept as current page
    setLastPageHistory(newPage - 1);

    // If sort is enabled ignore the pagination of below line
    if (sortEnabled) {
      return;
    }

    setLoader(true);
    localStorage.setItem("pageId", e.selected);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    axios
      .get(
        startDateFilter
          ? `${config.API_URL}/api/cms/blog?page=${newPage}&size=${rowsPerPage}${dateObj}`
          : startSearch
          ? `${config.API_URL}/api/cms/blog/searchtitle?title=${term}&page=${newPage}&size=${rowsPerPage}`
          : `${config.API_URL}/api/cms/blog?page=${newPage}&size=${rowsPerPage}${dateObj}`,
        headers
      )
      .then((res) => {
        setLoader(false);
        const loopData = startDateFilter
          ? res.data.data.cms
          : startSearch
          ? res.data.data.blog
          : res.data.data.cms;
        const filterBlogData = loopData.map((i, blogIndex) => ({
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
          action: i.action,
        }));

        setBlogRow(filterBlogData);
        setOrginalBlogRow(filterBlogData);
        setTotalRow(
          startDateFilter
            ? res.data.data.totalBlogs
            : startSearch
            ? res.data.data.totalBlogCount
            : res.data.data.totalBlogs
        );
        setOriginalRowCount(
          startDateFilter
            ? res.data.data.totalBlogs
            : startSearch
            ? res.data.data.totalBlogCount
            : res.data.data.totalBlogs
        );
      })
      .catch((err) => {
        setLoader(false);
        setMsgData({
          message: "Error occured while getting all blog post",
          type: "error",
        });
      });
  };
  useEffect(() => {
    // console.log("dateRange in table: ",dateRange);
    let dateParam = "";
    if (dateRange.startDate) {
      setPage(0);
      setBlogRowFlag(false);
      let obj = {
        startDate: moment(dateRange.startDate).format("YYYY-MM-DD"),
        endDate: moment(dateRange.endDate).format("YYYY-MM-DD"),
      };
      // console.log("obj :",obj);
      dateParam = `&startDate=${obj.startDate}&endDate=${obj.endDate}`;
      showBlogList(dateParam);
      sessionStorage.setItem("cmsDateRange", dateParam);
    }
    setDateObj(dateParam);
  }, [dateRange]);

  useEffect(() => {
    if (blogRow.length === 0 && blogRowFlag === true) {
      let dateParam = "";
      // setBlogRowFlag(false);
      showBlogList(dateParam);
    }

    if (allblog.length === 0) {
      const headers = {
        headers: {
          authtoken: JSON.parse(localStorage.getItem("token")),
          "Content-type": "application/json",
        },
      };

      axios
        .get(`${config.API_URL}/api/cms/blog`, headers)
        .then((res) => {
          // Filter out few fields for csv download
          const blogAllData = res.data.data.cms;
          const filterBlogData = blogAllData.map((i, blogIndex) => ({
            id: blogIndex + 1,
            title: i.title,
            publisher: i.authorName,
            publishedData: moment(i.publishedDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            modifiedPublishedDate: `${moment(i.publishedDate).format(
              "DD MMM YYYY"
            )} ${moment(i.publishedDate).format("HH:mm:ss")}`,
            sorting: i.sorting,
            status: i.isPublished ? "Published" : "Unpublished",
            categories: i.categories.join(", "),
          }));

          setAllBlogs(filterBlogData);
        })
        .catch((err) => {
          setMsgData({
            message: "Error occured while getting all blog list",
            type: "error",
          });
        });
    }
  }, []);

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
        // localStorage.setItem('pageId', data);
      } else {
        localStorage.setItem("pageId", 0);
      }
    }
    setPage(data);
    axios
      .get(
        `${config.API_URL}/api/cms/blog?page=${
          data + 1
        }&size=${rowsPerPage}${dateParam}`,
        headers
      )
      .then((res) => {
        setLoader(false);
        const filterBlogData = res.data.data.cms.map((i, blogIndex) => ({
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
          action: i.action,
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

    axios
      .get(
        `${config.API_URL}/api/cms/blog?page=${data + 1}${dateParam}`,
        headers
      )
      .then((res) => {
        setLoader(false);
        const filterBlogData = res.data.data.cms.map((i, blogIndex) => ({
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
          action: i.action,
        }));
        setFilterData(filterBlogData);
      })
      .catch((err) => {
        setLoader(false);
        setMsgData({
          message: "Error occured while getting all blog post",
          type: "error",
        });
      });
  };

  return (
    <div>
      {/* <h3 style={{ textTransform: "uppercase" }}>Content List</h3> */}
      <BlogDataGrid
        blogList={blogRow}
        setMsgData={setMsgData}
        tableLoader={tableLoader}
        dataGridLoader={dataGridLoader}
        setDataGridLoader={setDataGridLoader}
        fetchNewData={fetchNewData}
        setFetchNewData={setFetchNewData}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleSortModelChange={handleSortModelChange}
      />
      {!!blogRow.length && (
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
