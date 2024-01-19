import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { useAlert, types } from 'react-alert';
import config from '../../app.constant';
import Head from 'next/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const TITLE = "Unify Care - Reset Password";

function ResetPasswordForm({ userData, type }) {
  const router = useRouter()
  const { key } = router.query
  const alert = useAlert()
  const [loader, setLoader] = useState(false)
  const [errMsg, setErrMsg] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitVerification = async (e) => {
    e.preventDefault();
    if (password === '' && confirmPassword === '') {
      setErrMsg(true)
      alert.show('All fields are required', { type: 'error' })
      return false
    } else if (confirmPassword !== password) {
      setErrMsg(true)
      alert.show('Password not matching', { type: 'error' })
      return false
    }

    setLoader(true);
    await axios.post(`${config.API_URL}/api/users/resetpasswordwithkey`, {
      password: password,
      key: key,
    })
      .then((response) => {
        // Reset form fields
        setLoader(false);
        setErrMsg(false);
        setPassword('');
        setConfirmPassword('');

        router.push('/resetPasswordResponse')
      })
      .catch(error => {
        // Reset form fields
        setLoader(false);
        setErrMsg(false);
        setPassword('');
        setConfirmPassword('');

        alert.show(error.response.data.errors[0].message, { type: 'error' })
        console.log('Reset Password Failed', error);
      });
  };

  const goBackBasicPage = (e) => {
    e.preventDefault()
    router.push('/login')
  };

  return <>
    {loader && (
      <div className="loader">
        <CircularProgress color="secondary" />
      </div>
    )}
    <Head>
      <title>{ TITLE }</title>
      <link rel="icon" href="/favicon.png" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </Head>
    <style global jsx> {`
      body {
        background-color: #fff !important;
      }
    `}
    </style>
    <div className="otpVerification landing-page" style={{ height: '100vh' }}>
      <Container maxWidth="xl" style={{ width: '90%' }}>
        <div style={{ paddingTop: '4%' }}>
          <Link
            style={{ width: '25%', height: '100%', float: 'left', boxShadow: 'none' }}
            href="/"
          >
            <img
              style={{ width: '80%', height: '80%' }}
              src="/logo/unifycare_home_logo.png"
              alt="unifycare"
            />
          </Link>

          <div style={{ textAlign: 'end' }}>
            <img
              style={{ height: '25px', cursor: 'pointer' }}
              src="crossIcon.png"
              onClick={goBackBasicPage}
            />
          </div>
        </div>
      </Container>
      <Container component="main" maxWidth="sm" className='mainContainer' style={{ paddingTop: '8%' }}>
        <CssBaseline />
        <div style={{ textAlign: 'center' }}>
          <Typography component="h1" variant="h5" >
            <strong style={{color:"#000000A1"}}>Reset Password</strong>
          </Typography>

          <form noValidate autoComplete="off" onSubmit={submitVerification} style={{marginTop:"15px"}}>
            <div className="verify-div">
              <TextField
                required
                className="cursorColor"
                error={errMsg && password === ''}
                type="password"
                style={{ width: '60%' }}
                label="New Password"
                margin="normal"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                required
                className="cursorColor"
                error={password !== confirmPassword}
                type="password"
                style={{ width: '60%' }}
                label="Confirm Password"
                margin="normal"
                variant="filled"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="action">
              <Button
                style={{
                  marginTop: '7%',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  width: '125px',
                  padding: '8px',
                  borderRadius:"20px"
                }}
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button resetBtn"
                type="submit"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  </>
};

export default ResetPasswordForm;