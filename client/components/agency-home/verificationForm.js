import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import { StepUpdateContext } from '../../context/registerStep'
import { UserUpdateContext } from '../../context/basiciSignup'
import { useRouter } from 'next/router'
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { useAlert, types } from 'react-alert';
import config from '../../app.constant';
import {useCookies } from "react-cookie";

function VerificationForm({ userData, type }) {

   const router = useRouter()
   const alert = useAlert()

   const { step, newStep } = useContext(StepUpdateContext);
   const { user } = useContext(UserUpdateContext);

   const [userEmail, setUserEmail] = useState('')
   const [loader, setLoader] = useState(false)

   const [errMsg, setErrMsg] = useState(false)
   const [emailOTP, setEmailOTP] = useState('')
   const [userInfo, setUserInfo] = useState('');
   const [cookies, setCookie] = useCookies(['name']);
   useEffect(() => {
      if (process.browser) {
         setUserInfo(JSON.parse(localStorage.getItem('agencyinfo')));
         setUserEmail(JSON.parse(localStorage.getItem('agencyinfo')).emailId);
         console.log("userInfo: ",userInfo)
      }
      console.log("userInfo: ",userInfo)
   }, [])
   const submitVerification = async (e) => {
      e.preventDefault()
      if (emailOTP === '') {
         setErrMsg(true)
         alert.show('All fields are required', { type: 'error' })
         return false
      }

      setLoader(true)
      await axios.post(config.API_URL + '/api/users/emailotpsignin', {
         emailId: userEmail,
         otp: emailOTP,
      })
         .then((response) => {
            console.log('response: ',response);
            setLoader(false)
            if(response.data.token){
               if(process.browser){
                 setCookie('express:sess', response.data.token, { path: '/' });
               }
             }
            router.push('/companydetails')
            // newStep(parseInt(step) + 1)
         })
         .catch(error => {
            setLoader(false)
            alert.show('API error', { type: 'error' })
            console.log(error);
         });
   }

   const goBackBasicPage = (e) => {
      e.preventDefault()
      router.push('/register')
   }

   const [emailotpActive, setEmailotpActive] = useState(true)
   const [emailTimer, setEmailTimer] = useState(30)
   let emailotpInterval;

   const sendEmailOTP = (e) => {
      let count = 30;
      setEmailotpActive(false)
      emailotpInterval = setInterval(function () {
         if (count < 1) {
            clearInterval(emailotpInterval)
            setEmailotpActive(true)
         }
         count--;
         setEmailTimer(count)
      }, 1000)

      setLoader(true)
      axios.post(config.API_URL + '/api/users/sendemailotp', { emailId: userEmail })
         .then(() => {
            setLoader(false)
         })
         .catch(error => {
            setLoader(false)
            console.log(error);
         });
   }

   useEffect(() => {

      // if (Object.keys(userData).length !== 0) {
      //    setUserEmail(userData.emailId)
      // } else {
      //    setUserEmail(user.data.emailId)
      // }
      let count2 = 30;
      setEmailotpActive(false)
      emailotpInterval = setInterval(function () {
         if (count2 < 1) {
            clearInterval(emailotpInterval)
            setEmailotpActive(true)
         }
         count2--;
         setEmailTimer(count2)
      }, 1000)

   }, [user])

   return <>
      {/* {loader && <div className="loader"><CircularProgress color="secondary" /><div className="text">Uploading Contact Verification</div></div>} */}
      {/* <h2>Email Verification</h2> */}
      <div className='otpVerification landing-page'>
      <Container maxWidth="xl" style={{width:'80%'}}>
      <div style={{paddingTop:'4%'}}>
            <Card style={{width:'20%', height:'100%',float:'left',boxShadow:'none'}}>
               <CardActionArea className="area">
               <CardMedia
                  component="img"
                  // className="sec-img"
                  alt="Logo"
                  image="/logo/unifycare_home_logo.png"
                  title="Logo"
                  style={{width:'80%',height:'80%'}}
               />
               </CardActionArea>
            </Card>
            {/* <Card style={{width:'20%', height:'100%',float:'right',boxShadow:'none'}}>
               <CardActionArea className="area">
               <CardMedia
                  component="img"
                  // className="sec-img"
                  alt="cross"
                  image="crossIcon.png"
                  title="cross"
                  style={{width:'12%',height:'80%'}}
               />
               </CardActionArea>
            </Card> */}
            <div style={{textAlign:'end'}}>
               <img style={{height:'25px', cursor:'pointer'}} src="crossIcon.png" onClick={goBackBasicPage}/>
            </div>
         </div>
      </Container>
      <Container component="main" maxWidth="sm" className='mainContainer' style={{paddingTop:'4%'}}>
         <CssBaseline />
            <div style={{textAlign:'center'}}>
            {/*  display: 'flex',, flexDirection: 'column', alignItems: 'center' */}
            <Typography component="h1" variant="h5" >
            {/* style={{position:'absolute',left:'38%'}} */}
              OTP verification
            </Typography>
            <div style={{marginTop:'15px'}}>
            <Typography paragraph style={{fontSize:'13px'}}>
                     Please Enter the OTP send to your work Email<br />
                     <span style={{fontWeight:'bold'}}>
                     {userEmail}
                     </span>
                     
            </Typography>
            </div>
            
            {/* <div className="form-input"> */}
               <form noValidate autoComplete="off" onSubmit={submitVerification}>
                  <div className="verify-div">
                     <TextField 
                        required 
                        // fullWidth
                        style={{width:'60%'}}
                        label="Email OTP" 
                        margin="normal" 
                        variant="filled"
                        // InputLabelProps={{ shrink: true }} 
                        className={(errMsg && emailOTP === '' ? 'err' : '')} 
                        value={emailOTP} 
                        onChange={(e) => setEmailOTP(e.target.value)} 
                        />
                        <div className='resendSec'>
                           {!emailotpActive ? <><span className="resend">RESEND</span> &nbsp;&nbsp; 0:{emailTimer > 0 && emailTimer + ' Secs'}</> : <span className="resend active" onClick={sendEmailOTP}>RESEND</span>}
                        </div>
                  </div>
                  
                  <div className="action">
                     {/* <Button size="small" variant="contained" onClick={goBackBasicPage} className="back"><Icon className="fa fa-chevron-left"></Icon>BACK</Button> */}
                     <Button 
                     style={{
                        marginTop:'30%',
                        color:'#000',
                        fontWeight:'bold',
                        fontSize:'14px',
                        width:'125px',
                        padding:'8px',
                        borderRadius: '20px'
                     }}
                     size="small" 
                     variant="contained" 
                     color="secondary" 
                     className="primary-button forward" 
                     type="submit">Confirm</Button>
                  </div>
               </form>
            {/* </div> */}
            </div>
         </Container>
      </div>
      
      
   </>
}

export default VerificationForm