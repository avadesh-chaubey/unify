import "../styles/globals.css";
import "../styles/home.css";
import "../styles/main.css";
import "../styles/order.css";
import "../styles/blog.css";
import "../styles/selectunit.css";
import "../styles/doctorresult.css";
import "../styles/doctorlist.css";
import "react-date-range/dist/styles.css";
import "../styles/Header.css";
import "react-date-range/dist/theme/default.css";
import { useEffect } from "react";
import { initializeFirebase } from "../components/firebaseConfig";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker at the time of loading application
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return <Component {...pageProps} firebase={initializeFirebase()} />;
}

export default MyApp;
