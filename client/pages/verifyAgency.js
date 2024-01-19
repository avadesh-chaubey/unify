import Form from '../components/agency-home/form';
import StepUpdateProvider from '../context/registerStep';
import Steps from '../components/agency-home/steps';

function VerifyAgency() {

   return <>
      <StepUpdateProvider>
         <div className="register-agency">
            <div className="register-menu">
               <Steps />
            </div>
            <div className="register-body">
               <Form />
            </div>
         </div>
      </StepUpdateProvider>
   </>
}

export default VerifyAgency