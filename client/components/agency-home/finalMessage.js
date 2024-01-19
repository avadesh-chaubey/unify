import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss';
import { useRouter } from 'next/router';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState} from 'react';

function FinalMessage({ type }) {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const signout = async () => {
    await axios
      .post("/api/users/signout")
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        alert.show("API error", { type: "error" });
      });
  };
  function doneClickLogin() {
    setLoader(true);
    router.push("/login");
  }
  function doneClickCompany() {
    setLoader(true);
    router.push("/companyPage");
  }
  return (
    <>
      <div
      // style={{
      //    display: "flex",
      //    flexDirection: "row",
      //    background: "#2b2b2b",
      // }}
      >
        {/* <Button
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button"
            onClick={signout}
            style={{ margin: "20px 20px 20px 900px" }}
         >
            Logout
            </Button> */}
        <div style={{ textAlign: "end" }}>
          <img style={{ height: "25px" }} src="bell.png" />
          <img
            style={{
              height: "25px",
              marginLeft: "12px",
              borderRadius: "50%",
              border: "1px solid #a9a9a9",
            }}
            src="/user.svg"
          />
        </div>
      </div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <div className="confirm-msg">
        <div className="message">
          We are reviewing your corporate details. You will receive confirmation
          email in next 24 hours.
        </div>
        <div className="action">
          {type === "hospitalUnit" ? (
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              style={{ color: "#000", fontSize: "14px", fontWeight: "bold" }}
              onClick={doneClickCompany}
            >
              <Link href="/companydetails">
                <a>DONE</a>
              </Link>
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              style={{ color: "#000", fontSize: "14px", fontWeight: "bold" }}
              onClick={doneClickLogin}
            >
              <Link href="/login">
                <a>DONE</a>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default FinalMessage