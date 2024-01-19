import ResetPasswordForm from '../components/agency-home/ResetPassword';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '10px',
    transition: transitions.SCALE
 }

const passwordReset = () => {
  return <>
    <AlertProvider template={AlertTemplate} {...options}>
      <ResetPasswordForm />
    </AlertProvider>
  </>
}

export default passwordReset;