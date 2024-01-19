import React, {useState, useEffect} from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../components/header/header";
import MessagePrompt from "../components/messagePrompt";
import Sidenavbar from '../components/dashboard/Sidenavbar';
import { CircularProgress } from '@material-ui/core';
import ManageRoles from '../components/superAdminRoll&Permission/manageRoles';

const TITLE = "Unify Care - Manage Roles and Permission"

export default function manageRoleAndPermission () {
  const [loader, setLoader] = useState('');
  const [message, setMessage] = useState({});

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
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
      <MessagePrompt msgData={message} />
      <Sidenavbar />

      <div className="right-area listing">
        <Header name="Manage Role and Permission" />
        <ManageRoles setLoader={setLoader} setMessage={setMessage} />
      </div>
    </>
  );
}
