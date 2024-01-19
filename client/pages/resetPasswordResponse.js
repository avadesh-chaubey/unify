// import ResetPasswordForm from '../components/agency-home/ResetPassword';
import ResetPasswordResponse from '../components/agency-home/ResetPasswordResponse';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '10px',
    transition: transitions.SCALE
 }

const resetPasswordResponse = () => {
  return <>
    <AlertProvider template={AlertTemplate} {...options}>
      <ResetPasswordResponse />
    </AlertProvider>
  </>
}

export default resetPasswordResponse;