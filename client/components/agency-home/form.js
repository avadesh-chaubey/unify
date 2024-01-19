import { useState, useContext, useEffect } from 'react';
import { StepUpdateContext } from '../../context/registerStep'
import UserUpdateProvider from '../../context/basiciSignup';
import CompanyInfo from './companyInfo';
import AuthoritySign from './authoritySign';
import BankAccount from './bankAccount';
import FinalMessage from './finalMessage';
import LogoPrescription from './logoprescription';

function Form({ userData, type, setMessage, partnerId, addNewUnitPerm }) {
  const { step, newStep } = useContext(StepUpdateContext);
  const [pageName, setPageName] = useState(0)
   // { key: 'register', num: 0 }, { key: 'verification', num: 1 },
  const allSteps = [
    { key: 'companydetails', num: 0 },
    { key: 'authority', num: 1 },
    { key: 'bankdetails', num: 2 },
    { key: 'logoprescription', num: 3 },
    { key: 'finalpage', num: 4 }
  ];

  useEffect(() => {
    const name = allSteps[parseInt(step)].key
    setPageName(name)
  }, [step])

  return <UserUpdateProvider>
    <div className="form-area">
      {pageName === 'companydetails' && <div>
      {/* adding company information form step 3 */}
      <CompanyInfo
        partnerId={partnerId}
        type={type}
        userData={userData}
        setMsgData={setMessage}
        addNewUnitPerm={addNewUnitPerm}
      />
      </div>}
      {pageName === 'authority' && <div>
        {/* adding authority sign form step 3 */}
        <AuthoritySign
          partnerId={partnerId}
          type={type}
          userData={userData}
          setMsgData={setMessage}
          addNewUnitPerm={addNewUnitPerm}
        />
      </div>}
      {pageName === 'bankdetails' && <div>
        {/* adding bank details form step 3 */}
        <BankAccount
          partnerId={partnerId}
          type={type}
          userData={userData}
          setMsgData={setMessage}
          addNewUnitPerm={addNewUnitPerm}
        />
      </div>}
      {pageName === 'logoprescription' && <div>
        {/* adding bank details form step 3 */}
        <LogoPrescription
          partnerId={partnerId}
          type={type}
          userData={userData}
          setMsgData={setMessage}
          addNewUnitPerm={addNewUnitPerm}
        />
      </div>}
      {pageName === 'finalpage' && <div>
        {/* adding final page form step 3 */}
        <FinalMessage type={type} />
      </div>}
    </div>
  </UserUpdateProvider>
};

export default Form