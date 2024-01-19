import { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Head from "next/head";
import { useRouter } from "next/router";

const TITLE = "Unify Care";

function ResetPasswordResponse() {
  const Router = useRouter();

  useEffect(() => {
    // Display this page only when user id is present in local Storage
    const getUserEmailId = localStorage.getItem("userEmail");
    if (getUserEmailId === null || getUserEmailId === "undefined") {
      // Redirect user to login page
      Router.push("/login");
    }
  }, []);

  const goBackBasicPage = (e) => {
    e.preventDefault();
    Router.push("/login");
  };

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
          maxWidth="xl"
          style={{ width: "80%", position: "relative", top: "4%" }}
        >
          <div>
            <Link
              style={{
                width: "20%",
                height: "100%",
                float: "left",
                boxShadow: "none",
              }}
              href="/"
            >
              <img
                style={{ width: "80%", height: "80%" }}
                src="/logo/home_page_logo.png"
                alt="diahome_logo.png"
              />
            </Link>

            <div style={{ textAlign: "end" }}>
              <img
                style={{ height: "25px", cursor: "pointer" }}
                src="crossIcon.png"
                onClick={goBackBasicPage}
              />
            </div>
          </div>
        </Container>
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
                style={{
                  height: "150px",
                  marginTop: "70px",
                  marginRight: "30px",
                }}
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
                }}
              >
                Password has been changed successfully. Please <br /> login with
                your new password.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ResetPasswordResponse;
