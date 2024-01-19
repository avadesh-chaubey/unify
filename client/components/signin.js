import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CircularProgress from "@material-ui/core/CircularProgress";
import useRequest from '../hooks/use-request';
import { useRouter } from "next/router";

const passwordType = {
   password: 'password',
   text: 'text'
}

const MIN_PASSWORD_LENGTH = 6;

function Signin() {

   const Router = useRouter();

   const [emailId, setEmailId] = useState('')
   const [password, setPassword] = useState('')
   const [emailError, setEmailError] = useState(false)
   const [passwordError, setPasswordError] = useState(false)
   const [validationErr, setValidationErr] = useState(false)

   const [loader, setLoader] = React.useState(false);

   const [signinPasswordType, setSigninPasswordType] = useState(passwordType.password)

   const { doRequest, errors } = useRequest({
      url: '/api/users/employeesignin',
      method: 'post',
      body: {
         emailId,
         password
      },
      onSuccess: (response) => {
         setLoader(false)
         console.log(response)
      }
   });

   const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

   const validateEmailId = (email) => {
      setEmailId(email);

      if (expression.test(String(email).toLowerCase())) {
         setEmailError(false);
      } else {
         setEmailError(true);
      }
   }
   const validatePassword = (pwd) => {
      setPassword(pwd);

      if (pwd.length < MIN_PASSWORD_LENGTH) {
         setPasswordError(true);
      } else {
         setPasswordError(false);
      }
   }

   const userSigninHandler = async (event) => {
      event.preventDefault()
      setValidationErr(false)
      if (emailId && password) {
         setLoader(true);
         await doRequest();
      } else {
         setValidationErr(true)
      }
   }

   return <>
      {loader && !errors && (
         <div className="loader">
            <CircularProgress color="secondary" />
         </div>
      )}
      <div className="formstart">
         <form noValidate autoComplete="off" onSubmit={userSigninHandler}>
            <div>
               <TextField
                  required
                  label="Email"
                  autoComplete="off"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  className={"inputtexts"}
                  helperText={emailError ? <span style={{ color: "red" }}>Please Enter valid email address</span> : validationErr && emailId === '' ? <span style={{ color: "red" }}>required</span> : ''}
                  value={emailId}
                  onChange={(e) => validateEmailId(e.target.value)}
               />
            </div>
            <div className="relative">
               <TextField
                  required
                  label="Password"
                  type={signinPasswordType}
                  autoComplete="off"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  className={"inputtexts"}
                  helperText={passwordError ? <span style={{ color: "red" }}>Password must be 6 character or more</span> : validationErr && password === '' ? <span style={{ color: "red" }}>required</span> : ''}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
               />
               {signinPasswordType === passwordType.password ? <VisibilityOffIcon className="viewOption" onClick={(e) => setSigninPasswordType(passwordType.text)} /> : <VisibilityIcon className="viewOption" onClick={(e) => setSigninPasswordType(passwordType.password)} />}
            </div>
            <div className="action">
               <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  type="submit"
               >
                  SIGN-IN
               </Button>
            </div>
         </form>
         {errors}
      </div>
   </>
}

export default Signin