import React, {useState, useEffect} from 'react';
import axios from 'axios';
import config from '../app.constant';
import Head from "next/head";
import Header from '../components/header/header';
import MessagePrompt from '../components/messagePrompt';
import {
  Card,
  Link,
  CardContent,
  CardMedia,
  Typography
} from '@material-ui/core';

const TITLE = "Unify Care - Portals";

export default function portals () {
  const [msgData, setMsgData] = useState({});
  const [rolePerm, setRolePerm] = useState({});
  const moduleDict = {
    'Front Desk': 'frontDesk',
    'Doctor Portal': 'doctorPortal',
    'Nurse Module': 'nurseModule',
    'Vaccinations': 'vaccinations',
    'Admin': 'admin',
    'Pharmacy': 'pharmacy',
    'Diagnostic': 'diagnostic',
    'Finance': 'finance',
    'Finance': 'finance',
    'Settings': 'settings',
    'Admin Access': 'access',
    'CMS': 'cms',
    'Support': 'support',
    'Employee Onboarding': 'employeeOnboarding'
  };

  return (
    <>
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

      <div className="onboarding-right-area listing landing-page" style={{ background: 'linear-gradient(to bottom, #7F368C, #DB2032)' }}>
        
        <Card className="card-logo emp-onboarding-logo">
          <CardContent className="area">
            <Link href="/portals">
              <CardMedia
                component="img"
                className="home_page_logo portal-logo-size"
                alt="Logo"
                image="logo/unifycare_white_logo.png"
                title="Logo"
              />
            </Link>
          </CardContent>
        </Card>    

        <Header name="" />

        <div className="portal-body">
          <div className="portal-link-rows">
            <Link href="/frontDesk/roasterManagement" underline="none">
              <div className="square">
                <img
                  src="portal/front_desk.svg"
                  className="square-image"
                  alt="Front Desk"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Front Desk
              </Typography>
            </Link>

            <Link href="#" underline="none">
              <div className="square inactive-portals">
                <img
                  src="portal/doctor_portal.svg"
                  className="square-image"
                  alt="Doctor Portal"
                />
              </div>
              <Typography
                className="portal-description inactive-portals"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Doctor Portal
              </Typography>
            </Link>

            <Link href="#" underline="none">
              <div className="square inactive-portals">
                <img
                  src="portal/nurse_module.svg"
                  className="square-image"
                  alt="Nurse Module"
                />
              </div>
              <Typography
                className="portal-description inactive-portals"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Nurse Module
              </Typography>
            </Link>

            <Link href="#" underline="none">
              <div className="square inactive-portals">
                <img
                  src="portal/vaccinations.svg"
                  className="square-image"
                  alt="Vaccinations"
                />
              </div>
              <Typography
                className="portal-description inactive-portals"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Vaccinations
              </Typography>
            </Link>

            <Link
              href="/admin/hospitalUnit"
              underline="none"
            >
              <div className="square">
                <img
                  src="portal/admin.svg"
                  className="square-image"
                  alt="Admin"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Admin
              </Typography>
            </Link>

            <Link href="/pharmacy/allMedicines" underline="none">
            {/* <Link href="#" underline="none"> */}
              <div className="square">
                <img
                  src="portal/pharmacy.svg"
                  className="square-image"
                  alt="Pharmacy"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Pharmacy
              </Typography>
            </Link>

            <Link href="/diagnostic/tests" underline="none">
            {/* <Link href="#" underline="none"> */}
              <div className="square">
                <img
                  src="portal/diagnostic_icon.png"
                  className="square-image"
                  alt="Diagnostic"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Diagnostic
              </Typography>
            </Link>

            <Link href="#" underline="none">
              <div className="square inactive-portals">
                <img
                  src="portal/finance.svg"
                  className="square-image"
                  alt="Finance"
                />
              </div>
              <Typography
                className="portal-description inactive-portals"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Finance
              </Typography>
            </Link>

            <Link
              href="/setting"
              underline="none"
            >
              <div className="square">
                <img
                  src="portal/settings.svg"
                  className="square-image"
                  alt="Settings"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Settings
              </Typography>
            </Link>

            <Link href="/adminAccessPermission" underline="none">
              <div className="square">
                <img
                  src="portal/access.svg"
                  className="square-image"
                  alt="Access"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Access
              </Typography>
            </Link>

            <Link
              href="/cms/contentManagementList"
              underline="none"
            >
              <div className="square">
                <img
                  src="/content_mgmt_icon.svg"
                  className="square-image"
                  style={{
                    top: 25,
                    left: 8
                  }}
                  alt="Content Management Portal"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                CMS
              </Typography>
            </Link>

            <Link href="/supportCenter/customerSupportHomePage" underline="none">
              <div className="square">
                <img
                  src="/portal/support_section.svg"
                  className="square-image"
                  alt="Support Center"
                />
              </div>
              <Typography
                className="portal-description"
                variant="subtitle1"
                display="block"
                gutterBottom
              >
                Support
              </Typography>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
