import { useState, useEffect } from "react";
import Form from "../components/agency-home/form";
import StepUpdateProvider from "../context/registerStep";
import Steps from "../components/agency-home/steps";
import { useRouter } from "next/router";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";
import BasicForm from "../components/agency-home/basicForm";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

function Register() {
  return (
    <>
      <AlertProvider template={AlertTemplate} {...options}>
        <Head>
          <title>Dia Home: Partner</title>
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
        {/* <div className="register-body"> */}
        <BasicForm />
        {/* </div> */}
      </AlertProvider>
    </>
  );
}

export default Register;
