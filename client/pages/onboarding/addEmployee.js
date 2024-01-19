import React from "react";
import { useState, useEffect } from "react";
import Form from "../../components/add-doctor/doc-form";
import StepUpdateProvider from "../../context/registerStep";
import Steps from "../../components/add-doctor/doc-steps";
import { useRouter } from "next/router";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";
import AddNewEmployee from "../../components/add-doctor/addNewEmployee";
import Header from "../../components/header/header";
import { CircularProgress } from "@material-ui/core";

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};
const TITLE = "Unify Care - Add New Employee";

export default function addEmployee () {
  const router = useRouter();
  const [msgData, setMsgData] = useState({});
  const [employeeType, setEmployeeType] = useState('');
  const [loader, setLoader] = useState(false);

  return (
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <AlertProvider template={AlertTemplate} {...options}>
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
          <Header name="Add New Employee" />
            <AddNewEmployee
              employeeType={employeeType}
              setMsgData = {setMsgData}
              setLoader={setLoader}
            />
        </div>
      </AlertProvider>
    </div>
  );
}
