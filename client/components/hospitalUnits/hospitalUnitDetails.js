import React, {useState, useEffect } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import UnitTabPanel from './unitTabPanel';
import EstablishmentDetails from './establishmentDetails';
import AuthorizedSignatory from './authorizedSignatory';
import BankDetailsForm from './bankDetailsForm';
import LogoAndPrescription from './logoAndPrescription';

export default function HospitalUnitDetails (props) {
  const {getSelectedUnitDetails, setMsgData} = props;
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (e, tabValue) => {
    e.preventDefault();
    setCurrentTab(tabValue);
  };

  return (
    <div>
      <Tabs
        aria-label="support-center-tabs"
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
          label="Establishment Details"
          className={currentTab === 0 ? "hospital-unit-active-tab" : ''}
        />
        <Tab label="Authorized Signatory" className={currentTab === 1 ? "hospital-unit-active-tab" : ''} />
        <Tab label="Bank Details" className={currentTab === 2 ? "hospital-unit-active-tab" : ''} />
        <Tab label="Logo &amp; Prescription" className={currentTab === 3 ? "hospital-unit-active-tab" : ''} />
      </Tabs>

      <UnitTabPanel value={currentTab} index={0}>
        <EstablishmentDetails getSelectedUnitDetails={getSelectedUnitDetails} />
      </UnitTabPanel>
      <UnitTabPanel value={currentTab} index={1}>
        <AuthorizedSignatory getSelectedUnitDetails={getSelectedUnitDetails} />
      </UnitTabPanel>
      <UnitTabPanel value={currentTab} index={2}>
        <BankDetailsForm getSelectedUnitDetails={getSelectedUnitDetails} />
      </UnitTabPanel>
      <UnitTabPanel value={currentTab} index={3}>
        <LogoAndPrescription getSelectedUnitDetails={getSelectedUnitDetails} setMsgData={setMsgData} />
      </UnitTabPanel>
    </div>
  );
}
