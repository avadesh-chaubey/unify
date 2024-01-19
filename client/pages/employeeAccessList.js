import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../components/header/header";
import MessagePrompt from "../components/messagePrompt";
import Sidenavbar from '../components/dashboard/Sidenavbar';
import EmployeeTable from '../components/superAdmin/employeeTable';

const TITLE = "Unify Care - Employee Access List";

function employeeAccessList() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [originalEmpRow, setOrginalEmpRow] = useState([]);
  const [empRow, setEmpRow] = useState([]);
  const [totalRow, setTotalRow] = useState(0);

  return (
    <div>
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
      <div className="right-area listing">
        <Header name="Employee Access List" />
        <EmployeeTable
          empRow={empRow}
          totalRow={totalRow}
          setLoader={setLoader}
          setEmpRow={setEmpRow}
          setMsgData={setMsgData}
          searchTerm={searchTerm}
          setTotalRow={setTotalRow}
          originalEmpRow = {originalEmpRow}
          setOrginalEmpRow={setOrginalEmpRow}
        />
      </div>
    </div>
  )
}

export default employeeAccessList
