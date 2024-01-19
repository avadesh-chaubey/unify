import '../styles/globals.css';
import '../styles/globalStyles.css';
import '../components/agency-home/agency-home.css';
import '../styles/Calendar.css';
import '../styles/doctor.css';
import '../styles/candidate.css';
import '../styles/theme.css';
import '../styles/blog.css';
import '../styles/hospitalUnits.css';
import '../styles/settings.css';
import '../styles/notificationManagement.css';
import '../styles/portals.css';
import '../styles/manageRolePerm.css';
import '../styles/empOnboarding.css';
import '../styles/access.css';
import '../styles/banner.css';
import 'react-calendar/dist/Calendar.css';
import "react-awesome-lightbox/build/style.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'simplebar/dist/simplebar.min.css';

import React, { useEffect } from 'react';
import buildClient from '../api/build-client';
import config from '../app.constant';
import AlertTemplate from 'react-alert-template-basic';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import { initializeFirebase } from '../components/doctor/firebaseConfig';
import { CookiesProvider } from "react-cookie";
import router from 'next/router';

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '10px',
  // you can also just use 'scale'
  transition: transitions.SCALE
};

const AppComponent = ({ Component, pageProps, currentUser }) => {
  useEffect(() => {
    let temp = [];
    let {pathname} = router;
    // console.log("pathname: ",pathname);
    if(localStorage.getItem("routerLink") != null){
      let t = localStorage.getItem("routerLink");
      let arr = t.split(",");
      let arr2 = arr.slice(-1);
      temp = [...arr2];
    }
    temp.push(pathname);
    localStorage.setItem("routerLink",temp);
  }, [])
  useEffect(() => {
    // Register service worker at the time of loading application
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, [])

  return (
    <CookiesProvider>
      <AlertProvider template={AlertTemplate} {...options}>
        <div>
          <div className="container">
            <Component currentUser={currentUser} {...pageProps} firebase={initializeFirebase()} />
          </div>
        </div>
      </AlertProvider>
    </CookiesProvider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  // const { data } = await client.get('/api/users/currentuser');
  const data = {currentUser : {}};

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
