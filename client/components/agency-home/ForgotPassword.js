import { useState } from 'react';
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

const TITLE = "Unify Care - Forgot Password";

function ForgotPaswordForm(props) {
  // console.log("props: ",props)
  const router = useRouter();
  const alert = useAlert();
  const [errMsg, setErrMsg] = useState(false);
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);

  const submitVerification = async (e) => {
    e.preventDefault()
    if (email === '') {
      setErrMsg(true);
      // alert.show('All fields are required', { type: 'error' });
      props.setMsgData({ message: 'All fields are required', type: "error" });

      return false;
    }

    setLoader(true)
    await axios.post(config.API_URL + '/api/users/forgotpassword', {
      emailId: email,
    })
      .then((response) => {
        console.log('Forgot API Response:', response);
        localStorage.setItem('userEmail', email);
        router.push('/passwordResetResponse')
        setLoader(false)
      })
      .catch(error => {
        setLoader(false)
        // alert.show('Error occurred while sending reset link', { type: 'error' });
        props.setMsgData({
          message:
            error.response.data[0].message === "Invalid credentials"
              ? "Invalid Email ID"
              : error.response.data[0].message,
          type: "error",
        });
        console.log('Forgot Password err', error);
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
          <Typography component="h1" variant="h5" style={{color:"#000000A1"}} >
            <strong>Forgot Password?</strong>
          </Typography>

          <div style={{ marginTop: '15px' }}>
            <Typography
              paragraph
              style={{ fontSize: '12pt', color: '#6b6974', fontWeight: 500 }}
            >
              Please enter your registered email:
              </Typography>
          </div>

          <form noValidate autoComplete="off" onSubmit={submitVerification}>
            <div className="verify-div">
              <TextField
                required
                style={{ width: '60%' }}
                label="Enter Email"
                margin="normal"
                variant="filled"
                className={`${(errMsg && email === '' ? 'err' : '')} cursorColor`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="action">
              <Button
                style={{ marginTop: '7%',borderRadius:"20px", fontWeight: 'bold', fontSize: '14px', width: '125px', padding: '8px' }}
                size="small"
                variant="contained"
                color="secondary"
                className="primary-button resetBtn"
                type="submit">SUBMIT</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  </>
}

export default ForgotPaswordForm;