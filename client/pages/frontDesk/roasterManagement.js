import { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Head from "next/head";
import Header from "../../components/header/header";
import FilterArea from "../../components/listing/filter-area";
import DocList from "../../components/roster-manager/docList";
import { useRouter } from "next/router";
import MessagePrompt from "../../components/messagePrompt";
import Sidenavbar from "../../components/dashboard/Sidenavbar";
import EmployeListTab from "../../components/roster-manager/employeListTab";

// const useStyles = makeStyles({
//   table: {
//     width: 1200,
//   },
//   root: {
//     width: 1300,
//     height: 800,
//     margin: 50,
//   },
// });

const PAGE_TITLE = `Unify Care : Roaster Management`;

const RosterManagerHomePage = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [updateList, setUpdateList] = useState("");
  const [msgData, setMsgData] = useState({});
  const [desigFilterVal, setDesigFilterVal] = useState("all");
  const [doctorSelected, setDoctorSelected] = useState({});
  const [dataDraft, setDataDraft] = useState(false);

  useEffect(() => {
    // ----------- Commenting out the authentication lines untill Session Name gets renamed in Manage Role & Permission Page -------
    // Get user-permission for checking page level access to profile / rosterManager Page
    // const getUserPermission = JSON.parse(localStorage.getItem('rolePermission'));

    // Page Level Access: Check the permission of the user with role for the access to settings page
    // if (getUserPermission !== null && (!getUserPermission.front_desk.viewChecked && !getUserPermission.front_desk.editChecked)) {
    //   setLoader(true);
    //   setMsgData({
    //     message: 'Unauthorized Access. Request your Administrator for the access',
    //     type: 'error'
    //   });
    //   // Redirect user to Portals Page
    //   router.push('/portals');
    // }
  }, []);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{PAGE_TITLE}</title>
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
      <div className="right-area listing overflow">
        <Header name="Roaster Management" />

        {/* <FilterArea updateList={setUpdateList} setMsgData={setMsgData} setDesigFilterVal={setDesigFilterVal} /> */}

        <DocList
          updateList={updateList}
          setMsgData={setMsgData}
          // dataDraft={dataDraft}
          desigFilterVal={desigFilterVal}
          setDoctorSelected={setDoctorSelected}
          doctorSelected={doctorSelected}
        />
        <div className="rosterTab">
          <EmployeListTab
            // setDataDraft={setDataDraft}
            doctorSelected={doctorSelected}
            setMsgData={setMsgData}
          />
        </div>
      </div>
    </>
  );
};

export default RosterManagerHomePage;
