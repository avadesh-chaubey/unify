import { useState, useContext, useEffect } from "react";
import { StepUpdateContext } from "../../context/registerStep";
import UserUpdateProvider from "../../context/basiciSignup";
import PersonalDetails from "./personalDetails";
import ProfessionalDetails from "./professionalDetails";
import AvailabilitySlot from "./availabilitySlot";
import ConsultFee from "./consultFee";
import BankDetails from "./bankDetails";
function Form({ userData, type, setMsgData }) {
  console.log("props, ",setMsgData)
  const { step, newStep } = useContext(StepUpdateContext);
  const [pageName, setPageName] = useState(0);
  // { key: 'register', num: 0 }, { key: 'verification', num: 1 },
  const allSteps = [
    { key: "personaldetails", num: 0 },
    { key: "profDetails", num: 1 },
    { key: "availibilitySlots", num: 2 },
    { key: "consultFee", num: 3 },
    { key: "bankDetails", num: 4 },
    { key: "finalpage", num: 6 },
  ];

  useEffect(() => {
    const name = allSteps[parseInt(step)].key;
    setPageName(name);
  }, [step]);

  return (
    <UserUpdateProvider>
      <div className="form-area">
        {pageName === "personaldetails" && (
          <div>
            {/* adding company information form step 3 */}
            {/* <CompanyInfo type={type} userData={userData}/> */}
            <PersonalDetails setMsgData = {setMsgData} />
          </div>
        )}
        {pageName === "profDetails" && (
          <div>
            {/* adding authority sign form step 3 */}
            {/* <AuthoritySign type={type} userData={userData} /> */}
            <ProfessionalDetails />
          </div>
        )}
        {pageName === "availibilitySlots" && (
          <div>
            {/* adding bank details form step 3 */}
            {/* <BankAccount type={type} userData={userData} /> */}
            <AvailabilitySlot />
          </div>
        )}
        {pageName === "consultFee" && (
          <div>
            {/* adding final page form step 3 */}
            {/* <FinalMessage type={type} /> */}
            <ConsultFee />
          </div>
        )}
        {pageName === "bankDetails" && (
          <div>
            {/* adding final page form step 3 */}
            {/* <FinalMessage type={type} /> */}
            <BankDetails />
          </div>
        )}
      </div>
    </UserUpdateProvider>
  );
}

export default Form;
