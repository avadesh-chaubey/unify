import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../components/header/header";
import ReportArea from "../components/reports/reports-area";
import { useRouter } from "next/router";
import { Report } from "@material-ui/icons";
import MessagePrompt from "../components/messagePrompt";

function Reports() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [updateList, setUpdateList] = useState("");
  const [msgData, setMsgData] = useState({});

  const Medicine = () => {
    router.push("/allMedicines");
  };

  const roaster = () => {
    router.push("/roasterManagement");
  };

  const employee = () => {
    router.push("/listing");
  };

  const tests = () => {
    router.push("/tests");
  };

  const toreports = () => {
    router.push("/reports");
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>Dia Home: Test Reports</title>
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
      <div className="left-area">
        <div className="unifyLogo">
          <img src="/logo/admin_logo.png" className="logo" />
          <span>
            <img
              src="/diahome-txt.svg"
              style={{ width: "212px", marginLeft: "13px", display: 'none' }}
            />
          </span>
          {/* <img src="diahome.svg" className="name" /> */}
        </div>
        <div className="menu-items">
          <div className="items" onClick={employee}>
            <img src="employees.svg" className="logo" />
            <span>ALL EMPLOYEES</span>
          </div>
          <div className="items" onClick={roaster}>
            <img
              src="roaster.svg"
              className="logo"
              style={{ padding: "5px" }}
            />
            <span>ROASTER MANAGEMENT</span>
          </div>
          {/* <div
            className="items"
            //  onClick={toSupportCenter}
          >
            <img
              src="support.svg"
              className="logo"
              style={{ padding: "5px" }}
            />
            <span>SUPPORT CENTER</span>
          </div> */}
          <div className="items" onClick={Medicine}>
            <img
              src="medicine.svg"
              className="logo"
              style={{ padding: "5px" }}
            />
            <span>MEDICINE ONBOARD</span>
          </div>
          <div className="items" onClick={tests}>
            <img src="tests.svg" className="logo" style={{ padding: "5px" }} />
            <span>TEST ONBOARD</span>
          </div>
          {/* <div className="items active" onClick={toreports}>
            <img src="report.svg" className="logo" style={{ padding: "5px" }} />
            <span>UPLOAD REPORTS</span>
          </div> */}
        </div>
      </div>
      <div className="right-area medicine">
        <Header name="Upload Test Reports" />
        <ReportArea updateList={updateList} setMsgData={setMsgData} />
      </div>
    </>
  );
}

export default Reports;
