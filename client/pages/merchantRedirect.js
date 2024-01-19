import React, { useEffect } from "react";
import Head from "next/head";
import { Container, CssBaseline, Link, Typography } from "@material-ui/core";

const TITLE = "Redirecting to Merchant...";

export default function merchantRedirect() {
  useEffect(() => {
    var response = document.getElementById("response").value;
    window.parent.postMessage({ response: response }, "*");
  });

  return (
    <>
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
      <div className="otpVerification landing-page">
        <Container
          component="main"
          maxWidth="sm"
          className="mainContainer"
          style={{ paddingTop: "4%" }}
        >
          <CssBaseline />
          <div style={{ textAlign: "center" }}>
            <Typography component="h1" variant="h5">
              <img
                style={{ height: "150px", marginTop: "70px" }}
                src="password_reset.svg"
                alt="Password Reset"
              />
            </Typography>

            <div className="action">
              <p
                style={{
                  fontSize: "13pt",
                  fontWeight: "400",
                  color: "#555555",
                  fontWeight: "600",
                }}
              >
                Redirecting back to Merchant...
              </p>
            </div>
          </div>

          <textarea
            id="response"
            style={{ margin: 0, height: 155, width: 224 }}
          />
        </Container>
      </div>
    </>
  );
}
