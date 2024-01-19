import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../../components/header/header";
import FilterArea from "../../components/listing/filter-area";
import EmployeeTable from "../../components/listing/employee-table";
import { useRouter } from "next/router";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";

const TITLE = "Unify Care - All Employees";

function Listing() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [updateList, setUpdateList] = useState("");
  const [msgData, setMsgData] = useState({});
  const [desigFilterVal, setDesigFilterVal] = useState("all");
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

  const reports = () => {
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
      <Sidenavbar />
      <div className="right-area listing">
        <Header name="All Employees" />

        <FilterArea
          updateList={setUpdateList}
          setMsgData={setMsgData}
          setDesigFilterVal={setDesigFilterVal}
        />

        <EmployeeTable
          updateList={updateList}
          setMsgData={setMsgData}
          desigFilterVal={desigFilterVal}
        />
      </div>
    </>
  );
}

export default Listing;
