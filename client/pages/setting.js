import React, { useEffect, useState } from "react";
import { useRouter, router } from "next/router";
import Head from "next/head";
import Header from "../components/header/header";
import Charges from "../components/setting/charges";
import { CircularProgress, Tab, Tabs } from "@material-ui/core";
import Sidenavbar from '../components/dashboard/Sidenavbar';
import MessagePrompt from "../components/messagePrompt";
import SettingsTabPanel from "../components/setting/settingsTabPanel";
import HospitalInfoTab from "../components/setting/hospitalInfoTab";
import Pharmacy from "../components/setting/pharmacy";

const TITLE = "Unify Care - Settings";

function Setting() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [msgData, setMsgData] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [generalTabPerm, setGeneralTabPerm] = useState([]);
  const [hospitalInfoPerm, setHospitalInfoPerm] = useState([]);
  const [pharmacyPerm, setPharmacyPerm] = useState([]);

  const handleTabChange = (e, tabValue) => {
    e.preventDefault();
    setCurrentTab(tabValue);
  };

  useEffect(() => {
    const getUserPermission = JSON.parse(localStorage.getItem('rolePermission'));

    // Segregate the view / edit access for all tabs
    if (getUserPermission !== null) {
      setGeneralTabPerm(getUserPermission.settings.accessTypes.filter(i => i.name === 'General')[0]);
      setHospitalInfoPerm(getUserPermission.settings.accessTypes.filter(i => i.name === 'Hospital Information')[0]);
      setPharmacyPerm(getUserPermission.settings.accessTypes.filter(i => i.name === 'Pharmacy')[0]);
    }

    // Page Level Access: Check the permission of the user with role for the access to settings page
    if (getUserPermission !== null && (!getUserPermission.settings.viewChecked && !getUserPermission.settings.editChecked)) {
      setLoader(true);
      setMsgData({
        message: 'Unauthorized Access. Request your Administrator for the access',
        type: 'error'
      });
      // Redirect user to Portals Page
      router.push('/portals');
    }
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
      <div className="right-area settingFee">
        <Header name="Settings" />
        <hr />
        <Tabs
          aria-label="settings-tabs"
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          TabIndicatorProps={{
            style: {
              display: 'none',
            }
          }}
        >
          <Tab
            label="General"
            className={`settings-tab-main ${currentTab === 0 ? "settings-active-tab" : ''}`}
          />
          <Tab label="Hospital Information" className={currentTab === 1 ? "settings-active-tab" : ''} />
          <Tab label="Pharmacy" className={currentTab === 2 ? "settings-active-tab" : ''} />
        </Tabs>
        <hr className="tab-lines" />

        <SettingsTabPanel value={currentTab} index={0}>
          <Charges setMsgData={setMsgData} generalTabPerm={generalTabPerm} />
        </SettingsTabPanel>
        <SettingsTabPanel value={currentTab} index={1}>
          <HospitalInfoTab setMsgData={setMsgData} hospitalInfoPerm={hospitalInfoPerm} />
        </SettingsTabPanel>
        <SettingsTabPanel value={currentTab} index={2}>
          <Pharmacy setMsgData={setMsgData} pharmacyPerm={pharmacyPerm} />
        </SettingsTabPanel>
      </div>
    </>
  );
}

export default Setting;
