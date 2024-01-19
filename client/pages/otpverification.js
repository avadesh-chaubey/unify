import VerificationForm from '../components/agency-home/verificationForm';
import { useAlert, types } from 'react-alert'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '10px',
    // you can also just use 'scale'
    transition: transitions.SCALE
 }
function OtpVerification () {
    return<>
        {/* <p>Otp verificationForm</p> */}
        <AlertProvider template={AlertTemplate} {...options}>
            <VerificationForm />
        </AlertProvider>
    </>
}

export default OtpVerification;