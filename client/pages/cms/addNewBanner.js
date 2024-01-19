import React, {useState, useEffect} from 'react';
import Head from "next/head";
import Header from "../../components/header/header";
import { CircularProgress } from "@material-ui/core";
import Sidenavbar from '../../components/dashboard/Sidenavbar';
import MessagePrompt from '../../components/messagePrompt';
import router from 'next/router';
import NewBannerForm from '../../components/banner/NewBannerForm';

export default function BannerForm () {
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [blogId, setBlogId] = useState('');
  const TITLE = 'Blog Management';

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
      <div className="right-area">
        <MessagePrompt msgData={msgData} />
        <Header name="Banner Management" />
        <hr />
        <NewBannerForm
          setLoader={setLoader}
          setMsgData={setMsgData}
          // blogId={blogId}
          // newArticlePerm={newArticlePerm}
        />
      </div>
    </>
  );
}
