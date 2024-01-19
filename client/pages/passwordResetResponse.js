// import ResetPasswordForm from '../components/agency-home/ResetPassword';
import ForgotPasswordResponse from '../components/agency-home/ForgotPasswordResponse';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '10px',
    transition: transitions.SCALE
 }

const passwordResetResponse = () => {
  return <>
    <AlertProvider template={AlertTemplate} {...options}>
      <ForgotPasswordResponse />
    </AlertProvider>
  </>
}

export default passwordResetResponse;