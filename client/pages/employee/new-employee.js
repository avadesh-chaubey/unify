import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { useAlert, types } from 'react-alert'
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import axios from 'axios';

const NewEmployee = (currentUser) => {
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [experinceInYears, setExperinceInYears] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [profileImageName, setProfileImageName] = useState('');
  const [designation, setDesignation] = useState('');
  const [loader, setLoader] = useState(false)

  const [errMsg, setErrMsg] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/partner/employee',
    method: 'post',
    body: {
      userFirstName,
      userLastName,
      emailId,
      phoneNumber,
      userType,
      dateOfBirth,
      experinceInYears,
      highestQualification,
      department,
      specialization,
      profileImageName,
      designation
    },
    onSuccess: () => Router.push('/partnerHomePage'),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    setErrMsg(false)

    doRequest();
  };

  const signout = async () => {
    await axios.post('/api/users/signout')
      .then(() => {
        Router.push('/')
      })
      .catch(error => {
        console.log(error);
        alert.show('API error', { type: 'error' })
      });
  }

  return <>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#2b2b2b",
      }}
    >
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className="primary-button"
        onClick={signout}
        style={{ margin: "20px 20px 20px 1250px" }}
      >
        Logout
          </Button>
    </div>
    {loader && <div className="loader"><CircularProgress color="secondary" /><div className="text">Uploading Employee Details</div></div>}
    <h2>Add New Employee</h2>
    {errors}
    <div className="form-input">
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <div className="break"></div>
        <TextField
          required
          label="First Name"
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && userFirstName === '' ? 'err' : '')}
          value={userFirstName}
          onChange={(e) => setUserFirstName(e.target.value)}
        />
        <TextField
          required
          label="Last Name"
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && userLastName === '' ? 'err' : '')}
          value={userLastName}
          onChange={(e) => setUserLastName(e.target.value)}
        />
        <TextField
          required
          label="Work Email"
          style={{ margin: 8 }}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && emailId === '' ? 'err' : '')}
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <TextField
          required
          label="Phone"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && phoneNumber === '' ? 'err' : '')}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          required label="User Type"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && userType === '' ? 'err' : '')}
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        />
        <TextField
          required label="Date Of Birth"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && dateOfBirth === '' ? 'err' : '')}
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <TextField
          required label="Experince In Years"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && experinceInYears === '' ? 'err' : '')}
          value={experinceInYears}
          onChange={(e) => setExperinceInYears(e.target.value)}
        />
        <TextField
          required label="Highest Qualification"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && highestQualification === '' ? 'err' : '')}
          value={highestQualification}
          onChange={(e) => setHighestQualification(e.target.value)}
        />
        <TextField
          required label="Department"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && department === '' ? 'err' : '')}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <TextField
          required label="Specialization"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && specialization === '' ? 'err' : '')}
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <TextField
          required label="Profile Image Name"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && profileImageName === '' ? 'err' : '')}
          value={profileImageName}
          onChange={(e) => setProfileImageName(e.target.value)}
        />
        <TextField
          required label="Designation"
          style={{ margin: 8 }} margin="normal"
          InputLabelProps={{ shrink: true }}
          className={"half-div " + (errMsg && designation === '' ? 'err' : '')}
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <div className="action">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button forward"
            type="submit">
            NEXT
            <Icon className="fa fa-chevron-right"></Icon>
          </Button>
        </div>
      </form>
    </div>
  </>
};

export default NewEmployee;
