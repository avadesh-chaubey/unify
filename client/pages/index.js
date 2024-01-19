import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import PartnerStates from "../types/partner-states";
import UserType from "../types/user-type";
import Router from "next/router";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

const HEADER1 = "Hello Doctors";
const HEADER2 = "Your hospital is now running online.";
const TITLE = `Currently everything is available online then why not your hospital. 
  Unify care is a digital healthcare platform which enables hospitals to go online.`;
const PAGE_TITLE = `Unify Care`;

const PartnerLandingPage = ({ currentUser, userState }) => {
  const [loader, setLoader] = useState(false);
  const fetchData = async () => {
    try {
      if (currentUser) {
        if (currentUser.uty === UserType.PartnerSuperuser) {
          if (currentUser.ust === "unverified") {
            return Router.push("/register?verifyAgency");
          }
          if (userState === PartnerStates.AddPartnerInformation) {
            return Router.push("register?companyInfo");
          }
          if (userState === PartnerStates.AddPartnerBankingDetails) {
            return Router.push("register?bankAccount");
          }
          if (userState === PartnerStates.AddPartnerSigningAuth) {
            return Router.push("register?authoritySign");
          }
          if (userState === PartnerStates.PartnerVerifiedAndActive) {
            return Router.push("register?finalMessage");
          }
          if (userState === PartnerStates.PartnerVerificationPending) {
            return Router.push("register?finalMessage");
          }
          if (userState === PartnerStates.PartnerVerifiedAndActive) {
            return Router.push("agencyPage");
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch((error) => {
        console.warn(JSON.stringify(error, null, 2));
      });
  }, []);

  return (
    <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{PAGE_TITLE}</title>
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
      <div className="container" style={{ backgroundColor: "#fff" }}>
        {/* <div
          style={{
            display: "flex",
            flexDirection: "row",
            background: "#2b2b2b",
          }}
        >
          <Link href="/register">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button"
              style={{ margin: "20px 20px 20px 1000px" }}
            >
              Register Now as Partner
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button"
              style={{ margin: "20px 20px 20px 20px" }}
            >
              Login
            </Button>
          </Link>
        </div> */}
        <CssBaseline />
        <Container maxWidth="xl" className="index-page-main landing-page">
          <Typography component="div" className="index-page-div">
            <div className="logo-with-btn">
              <Card className="card-logo">
                <CardContent className="area">
                  <CardMedia
                    component="img"
                    className="home_page_logo"
                    alt="Logo"
                    image="logo/unifycare_home_logo.png"
                    title="Logo"
                  />
                </CardContent>
              </Card>
            </div>
            <div
              style={{ width: "100%", position: "relative", marginTop: "7%" }}
            >
              <div
                style={{
                  width: "37%",
                  float: "left",
                  position: "absolute",
                  marginTop: "60px",
                  marginLeft: "65px",
                }}
              >
                <Typography
                  paragraph
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#3C3C3C",
                  }}
                >
                  {HEADER1}, <br />
                  {HEADER2}
                </Typography>
                <Typography
                  paragraph
                  style={{ fontSize: "13px", color: "#5F5D5D" }}
                >
                  {TITLE}
                </Typography>
                <Link href="/login">
                  <Button
                    id="go-login"
                    size="small"
                    variant="contained"
                    color="secondary"
                    className="primary-button"
                    style={{
                      margin: "20px 20px 20px 0px",
                      color: "#fff",
                      width: "105px",
                      borderRadius: "20px",
                    }}
                    onClick={() => setLoader(true)}
                  >
                    Login
                  </Button>
                </Link>
              </div>
              <div
                style={{
                  // width: "48%",
                  float: "right",
                  position: "relative",
                  marginTop: "-74px",
                  marginBottom: "40px",
                }}
              >
                <Card className="section theme-card">
                  <CardContent className="area">
                    <CardMedia
                      component="img"
                      alt="Partner"
                      image="logo/home_page.png"
                      title="Partner"
                      className="theme-card-media"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </Typography>
        </Container>
        <div className="index-page-footer" style={{ display: "none" }}>
          <Container maxWidth="xl" style={{ marginTop: "11%" }}>
            <br />
            {/* <Typography paragraph style={{ color: "#fff" }}>
              Hello Patients, <br />
              Now consult super-specialist doctors from the comfort of your
              home.
            </Typography>
            <Link href="/">
              <Button
                disabled
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button"
                style={{
                  margin: "10px 20px 15px 0px",
                  color: "#fff",
                  width: "135px",
                }}
              >
                Consult Now
              </Button>
            </Link> */}
          </Container>
        </div>
        {/* <div className="container" style={{width:'50%', float:'left'}}>
          <h1>Hello Doctors,</h1>
        </div>
        <div className="container" style={{width:'50%', float:'right'}}>
          <Card className="section" style={{width:'100%', height:'100%'}}>
            <CardActionArea className="area">
              <CardMedia
                component="img"
                // className="sec-img"
                alt="Partner"
                image="home-image.jpg"
                title="Partner"
                style={{width:'80%',height:'80%'}}
              />
            </CardActionArea>
          </Card>
        </div> */}
        {/* <Card className="section" style={{ maxWidth: 1200, margin: 'auto' }}>
          <CardActionArea className="area">
            <CardMedia
              component="img"
              className="sec-img"
              alt="Partner"
              image="home-image.jpg"
              title="Partner"
            />
          </CardActionArea>
        </Card> */}
      </div>
    </div>
  );
};

PartnerLandingPage.getInitialProps = async (context, client, currentUser) => {
  if (currentUser && currentUser.uty === UserType.PartnerSuperuser) {
    const { data } = await client.get("/api/partner");

    return { userState: data.currentState };
  }
};

export default PartnerLandingPage;
