import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../../components/header/header";
import FilterArea from "../../components/tests/filter-area";
import TestsTable from "../../components/tests/tests-table";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";

const TITLE = "Unify Care";

function Tests() {
  const [loader, setLoader] = useState(false);
  const [updateList, setUpdateList] = useState("");
  const [msgData, setMsgData] = useState({});
  const [addTestFlag, setAddTestFlag] = useState(false);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{ TITLE }</title>
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
      <MessagePrompt msgData={msgData} />
      <Sidenavbar />

      <div className="right-area medicine">
        <Header name="All Lab Tests" />

        <FilterArea updateList={setUpdateList} setMsgData={setMsgData} setAddTestFlag = {setAddTestFlag} />

        <TestsTable
          updateList={updateList}
          update={setUpdateList}
          setMsgData={setMsgData}
          addTestFlag = {addTestFlag}
          setAddTestFlag = {setAddTestFlag}
        />
      </div>
    </>
  );
}

export default Tests;
