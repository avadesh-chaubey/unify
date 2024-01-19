import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/header/header";
import { CircularProgress } from "@material-ui/core";
import Sidenavbar from "../../components/dashboard/Sidenavbar";
import BannerManagementTable from "../../components/banner/BannerManagementTable";
import BannerContentHeader from "../../components/banner/BannerContentHeader";
import MessagePrompt from "../../components/messagePrompt";
import { useRouter } from "next/router";

export default function blogContentTable() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("");
  const [orginalBlogRow, setOrginalBlogRow] = useState([]);
  const [allblog, setAllBlogs] = useState([]);
  const [blogRow, setBlogRow] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [startSearch, setStartSearch] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState(false);
  const [totalRow, setTotalRow] = useState(0);
  const [originalRowCount, setOriginalRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [lastPageHistory, setLastPageHistory] = useState(0);
  const TITLE = "Unify Care : Banner Management List";
  const [dateRange, setDateRange] = useState({});
  const [cmsAccessPerm, setCmsAccessPerm] = useState([]);

  useEffect(() => {
    // Trigger event to remove item from local storage
    localStorage.removeItem("blog-post");

    const getUserPermission = JSON.parse(localStorage.getItem('rolePermission'));

    // Segregate the view / edit access for all tabs
    if (getUserPermission !== null) {
      setCmsAccessPerm(getUserPermission.cms.accessTypes);
    }

    // Page Level Access: Check the permission of the user with role for the access to settings page
    if (getUserPermission !== null && (!getUserPermission.cms.viewChecked && !getUserPermission.cms.editChecked)) {
      setLoader(true);
      setMsgData({
        message: 'Unauthorized Access. Request your Administrator for the access',
        type: 'error'
      });
      // Redirect user to Portals Page
      router.push('/portals');
    }
  }, []);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{TITLE}</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <Sidenavbar />
      <div className="right-area content-management-page">
        <MessagePrompt msgData={msgData} />
        <Header
          blogRow={blogRow}
          name="Banner Management List"
          allblog={allblog}
          filterData={filterData}
          startSearch={startSearch}
          startDateFilter={startDateFilter}
          cmsAccessPerm={cmsAccessPerm}
        />
        <hr />
        <BannerContentHeader
          blogRow={blogRow}
          setAllBlogs={setAllBlogs}
          originalRowCount={originalRowCount}
          setBlogRow={setBlogRow}
          term={term}
          setTerm={setTerm}
          setLoader={setLoader}
          setMsgData={setMsgData}
          setTotalRow={setTotalRow}
          setFilterData={setFilterData}
          setOrginalBlogRow={setOrginalBlogRow}
          setOriginalRowCount={setOriginalRowCount}
          setSearchTerm={setSearchTerm}
          orginalBlogRow={orginalBlogRow}
          setDateRange={setDateRange}
          setPage={setPage}
          startSearch={startSearch}
          setStartSearch={setStartSearch}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          lastPageHistory={lastPageHistory}
          setTableLoader={setTableLoader}
          cmsAccessPerm={cmsAccessPerm}
        />
        <BannerManagementTable
          blogRow={blogRow}
          totalRow={totalRow}
          term={term}
          setTerm={setTerm}
          setLoader={setLoader}
          setBlogRow={setBlogRow}
          setMsgData={setMsgData}
          searchTerm={searchTerm}
          setTotalRow={setTotalRow}
          setOrginalBlogRow={setOrginalBlogRow}
          setOriginalRowCount={setOriginalRowCount}
          dateRange={dateRange}
          startSearch={startSearch}
          startDateFilter={startDateFilter}
          allblog={allblog}
          setFilterData={setFilterData}
          setAllBlogs={setAllBlogs}
          page={page}
          setPage={setPage}
          setLastPageHistory={setLastPageHistory}
          tableLoader={tableLoader}
        />
      </div>
    </>
  );
}
