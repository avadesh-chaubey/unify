import React, { useState, useEffect } from "react";
import Form from "../../components/add-doctor/doc-form";
import StepUpdateProvider from "../../context/registerStep";
import Steps from "../../components/add-doctor/doc-steps";
import { useRouter } from "next/router";
import { CircularProgress } from "@material-ui/core";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";
import AddNewDoctor from "../../components/add-doctor/addNewDoctor";
import Header from "../../components/header/header";

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};
const TITLE = "Unify Care - Add New Doctor";

function AddAoctor() {
  const router = useRouter();
  const [stepName, setStepName] = useState(0);
  const [userData, setUserData] = useState({});
  const [msgData, setMsgData] = useState({});
  const [employeeType, setEmployeeType] = useState("");
  const [loader, setLoader] = useState("");

  return (
    <div>
      <AlertProvider template={AlertTemplate} {...options}>
        {loader && (
          <div className="loader">
            <CircularProgress color="secondary" />
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
        <MessagePrompt msgData={msgData} />
        <Sidenavbar />

        <div className="right-area listing">
          <Header name="Add New Doctor" />
          <AddNewDoctor
            employeeType={employeeType}
            userData={userData}
            setLoader={setLoader}
            type={"agency"}
            setMsgData={setMsgData}
          />
        </div>
      </AlertProvider>
    </div>
  );
}

export default AddAoctor;
