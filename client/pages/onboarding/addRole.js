import React, { useState } from "react";
import Head from "next/head";
import { CircularProgress } from "@material-ui/core";
import Header from "../../components/header/header";
import Sidenavbar from '../../components/dashboard/Sidenavbar';
import AddNewRole from "../../components/add-doctor/addNewRole";
import MessagePrompt from "../../components/messagePrompt";

const TITLE = "Unify Care - Add New Role";

export default function addRole () {
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});

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
      <Sidenavbar />
      <MessagePrompt msgData={msgData} />
      <div className="right-area listing">
        <Header name="Add New Role" />
        <AddNewRole setLoader={setLoader} setMsgData={setMsgData} />
      </div>
    </>
  );
}
