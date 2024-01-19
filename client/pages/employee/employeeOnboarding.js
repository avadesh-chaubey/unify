import React, { useState, useEffect, useReducer } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../../components/header/header";
import MessagePrompt from "../../components/messagePrompt";
import {
  Button,
  Link,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";

const TITLE = "Unify Care - Employee Onboarding";

export default function employeeOnboarding() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [pageAccess, setPageAccess] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      addDoctor: "",
      addEmployee: "",
      addUnit: "",
      addArticle: "",
      addSettings: "", // Get the permission from settings property
    }
  );

  return (
    <>
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
      <div className="onboarding-right-area listing landing-page">
        <Card className="card-logo emp-onboarding-logo">
          <CardContent className="area">
            <Link href="/portals">
              <CardMedia
                component="img"
                className="home_page_logo onboarding-logo-size"
                alt="Logo"
                image="/logo/unifycare_home_logo.png"
                title="Logo"
              />
            </Link>
          </CardContent>
        </Card>

        <Header name="" />
        <div class="add-onboarding-btn">
          <Link href="#" underline="none">
            <Button
              variant="contained"
              color="primary"
              className="inactive-btn"
            >
              + ADD NEW PATIENT
            </Button>
          </Link>

          <Link href="/onboarding/addDoctor" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW DOCTOR
            </Button>
          </Link>

          <Link href="/addnewappointment" underline="none">
            <Button
              variant="contained"
              color="primary"
              // className="inactive-btn"
            >
              + ADD NEW APPOINTMENT
            </Button>
          </Link>

          <Link href="/addnewpharmacyorder" underline="none">
            <Button
              variant="contained"
              color="primary"
              // className="inactive-btn"
            >
              + ADD NEW PHARMACY ORDER
            </Button>
          </Link>

          <Link href="#" underline="none">
            <Button
              variant="contained"
              color="primary"
              className="inactive-btn"
            >
              + ADD NEW LAB ORDER
            </Button>
          </Link>

          <Link href="/companydetails?companyInfo" underline="none">
            <Button variant="contained" color="primary">
              + ADD UNIT
            </Button>
          </Link>

          <Link href="/onboarding/addEmployee" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW EMPLOYEE
            </Button>
          </Link>

          <Link
            // href="/admin/addMedicine"
            href="#"
            underline="none"
          >
            <Button
              variant="contained"
              color="primary"
              className="inactive-btn"
            >
              + ADD NEW MEDICINE
            </Button>
          </Link>

          <Link
            // href="/diagnostic/addNewTest"
            href="#"
            underline="none"
          >
            <Button
              variant="contained"
              color="primary"
              className="inactive-btn"
            >
              + ADD NEW TEST
            </Button>
          </Link>

          <Link href="/cms/blogPost" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW ARTICLE
            </Button>
          </Link>

          <Link href="/cms/addNewNotification" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW NOTIFICATION
            </Button>
          </Link>

          <Link href="/setting" underline="none">
            <Button variant="contained" color="primary">
              + ADD SETTINGS
            </Button>
          </Link>

          <Link href="/cms/addNewBanner" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW BANNER
            </Button>
          </Link>

          <Link href="/onboarding/addRole" underline="none">
            <Button variant="contained" color="primary">
              + ADD NEW ROLE
            </Button>
          </Link>

          <Link href="/onboarding/addSpeciality" underline="none">
            <Button variant="contained" color="primary">
              + ADD SPECIALITY TO UNIT
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
