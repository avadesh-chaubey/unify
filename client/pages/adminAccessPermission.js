import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../components/header/header";
import MessagePrompt from "../components/messagePrompt";
import Sidenavbar from '../components/dashboard/Sidenavbar';
import AccessPermission from '../components/superAdmin/accessPermission';
const TITLE = "Unify Care - Super Admin Access Permission";
function adminAccessPermission() {
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});

  return (
    <div>
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
      <div className="right-area listing">
        <Header name="Access Permission" />
        <AccessPermission setMsgData={setMsgData} setLoader={setLoader} />
      </div>
    </div>
  )
}

export default adminAccessPermission
