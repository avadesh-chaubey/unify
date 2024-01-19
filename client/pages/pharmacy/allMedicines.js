import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Header from "../../components/header/header";
import FilterArea from "../../components/medicines/filter-area";
import EmployeeTable from "../../components/medicines/medicine-table";
import { useRouter } from "next/router";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";

const TITLE = "Unify Care: Medicine Onboard";

function Medicines() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [updateList, setUpdateList] = useState("");
  const [msgData, setMsgData] = useState({});
  const [addMedFlag, setAddMedFlag] = useState(false);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
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
      <Sidenavbar />

      <div className="right-area medicine">
        <Header name="All Medicines" />

        <FilterArea updateList={setUpdateList} setMsgData={setMsgData} setAddMedFlag={setAddMedFlag} />

        <EmployeeTable
          updateList={updateList}
          update={setUpdateList}
          setMsgData={setMsgData}
          addMedFlag={addMedFlag}
          setAddMedFlag={setAddMedFlag}
        />
      </div>
    </>
  );
}

export default Medicines;
