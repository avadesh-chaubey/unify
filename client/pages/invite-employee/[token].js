import { useRouter } from 'next/router'
import React from 'react';
import useRequest from '../../hooks/use-request';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState } from 'react';
import Icon from '@material-ui/core/Icon';

const EmailVerify = () => {
   const router = useRouter();

   const { token } = router.query;

   const [message, setMessage] = React.useState("Set New Password");
   const [loader, setLoader] = React.useState(false);
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [errMsg, setErrMsg] = useState(false);

   const { doRequest, errors, errorMessage } = useRequest({
      url: '/api/users/resetpassword',
      method: 'post',
      body: {
         key: token,
         password: password
      },
      onSuccess: (response) => {
         setmessage('Password Reset successfully, please login to continue');
         router.push('/login');
      }
   });
   console.log('errorMessage', errorMessage);


   const onSubmit = (event) => {
      event.preventDefault();
      doRequest();
   };

   return <>
      <h2>Please Set New Password </h2>
      {errors}
      <div className="form-input">
         <form noValidate autoComplete="off" onSubmit={onSubmit}>
            <div className="break"></div>
            <TextField
               required label="Password"
               style={{ margin: 8 }} margin="normal"
               InputLabelProps={{ shrink: true }}
               className={"half-div " + (errMsg && password === '' ? 'err' : '')}
               value={password}
               type='password'
               onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
               required label="Confirm Password"
               style={{ margin: 8 }} margin="normal"
               InputLabelProps={{ shrink: true }}
               className={"half-div " + (errMsg && confirmPassword === '' ? 'err' : '')}
               value={confirmPassword}
               type='password'
               onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="action">
               <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  className="primary-button forward"
                  type="submit">
                  Reset Password
            <Icon className="fa fa-chevron-right"></Icon>
               </Button>
            </div>
         </form>
      </div>
   </>
}

export default EmailVerify