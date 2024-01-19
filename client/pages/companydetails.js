import { useState, useEffect } from "react";
import Form from "../components/agency-home/form";
import StepUpdateProvider from "../context/registerStep";
import Steps from "../components/agency-home/steps";
import { useRouter } from "next/router";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";
import MessagePrompt from "../components/messagePrompt";
import { CircularProgress } from "@material-ui/core";

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: "10px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const TITLE = "Unify Care - Add Hospital Unit";

function CompanyDetails() {
  const router = useRouter();
  const [stepName, setStepName] = useState(0);
  const [userData, setUserData] = useState({});
  const [pageType, setPageType] = useState('agency');
  const [message, setMessage] = useState('agency');
  const [addNewUnitPerm, setAddNewUnitPerm] = useState('');
  const [loader, setLoader] = useState(false);
  const partnerId = router.query?.partnerId ?? '';

  useEffect(() => {
    if (router.asPath.includes("authoritySign")) {
      setStepName("authority");
    } else if (router.asPath.includes("bankAccount")) {
      setStepName("bankdetails");
    } else if (router.asPath.includes("logoprescription")) {
      setStepName("logoprescription");
    } else if (router.asPath.includes("companydetails") && stepName !== 0) {
      setStepName("companydetails");
    }

    if (localStorage.hasOwnProperty('userDetails')) {
      setPageType('hospitalUnit')
    }

    // Fetch the role-permission to get the permission for accessing this page
    if (localStorage.hasOwnProperty('rolePermission')) {
      // Fetch the access permission for employee onboarding page
      const getUserPermission = JSON.parse(localStorage.getItem('rolePermission')).employeeOnboarding;
      const addNewUnitAccess = getUserPermission.accessTypes.filter(i => i.name === 'Add New Unit')[0];
      setAddNewUnitPerm(addNewUnitAccess);

      // Page Level Access: Check the permission of the user with role for the access to settings page
      if (!addNewUnitAccess.viewChecked && !addNewUnitAccess.editChecked) {
        setLoader(true);
        setMessage({
          message: 'Unauthorized Access. Request your Administrator for the access',
          type: 'error'
        });
        // Redirect user to Portals Page
        router.push('/portals');
      }
    }
  }, [router]);

  return (
    <>
      <AlertProvider template={AlertTemplate} {...options}>
        {loader && (
          <div className="loader">
            <CircularProgress color="secondary" />
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
        <MessagePrompt msgData={message} />
        <StepUpdateProvider>
          <div className="register-agency">
            <div className="register-menu">
              <Steps name={stepName} type={"agency"} />
            </div>
            <div className="register-body">
              <Form
                userData={userData}
                type={pageType}
                setMessage={setMessage}
                partnerId={partnerId}
                addNewUnitPerm={addNewUnitPerm}
              />
            </div>
          </div>
        </StepUpdateProvider>
      </AlertProvider>
    </>
  );
}

export default CompanyDetails;
