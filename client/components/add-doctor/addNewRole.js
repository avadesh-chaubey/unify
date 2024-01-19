import React, { useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { Button, TextField } from "@material-ui/core";

export default function AddNewRole(props) {
  const {setLoader, setMsgData} = props;
  const [roleName, setRoleName] = useState('');
  const [roleErr, setRoleErr] = useState('');

  const onChangeRoleName = (e) => {
    const newRoleName = e.target.value;
    const blockSpecialChar = /^[^*=+_<>|/?/\":%#^!~[\]{}`\\()';@&$]+$/;

    // Allow characters which does not contain special character
    setRoleErr((newRoleName.length && !blockSpecialChar.test(newRoleName))
      ? 'Please provide alphabet and numbers only'
      : ''
    );
    setRoleName(newRoleName);
  };

  const resetField = (e) => {
    setRoleName('');
  };

  const onSaveClick = (e) => {
    e.preventDefault();

    if (roleName === '') {
      // Prevent creating role blank
      setRoleErr('Please enter Role Name');
      return ;
    } else if (roleErr !== '') {
      // Prevent proceeding forward incase validation error still persist
      return ;
    }

    setRoleErr('');
    setLoader(true);
    const headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    const roleData = {
      role: roleName.trim(),
      isRoleEnabled: true,
      createdBy: `${userDetails.userFirstName} ${userDetails.userLastName}`,
      updatedBy: `${userDetails.userFirstName} ${userDetails.userLastName}`
    };

    axios.post(`${config.API_URL}/api/users/createrole`, roleData, { headers })
      .then(res => {
        setLoader(false);
        // After role has been added successfully remove it from text field
        setRoleName('');
        setMsgData({
          message: 'Role created successfully'
        });
      })
      .catch(err => {
        setLoader(false);
        setMsgData({
          message: !!err.response ? err.response.data[0].message : 'Error occurred while creating New Role',
          type: 'error'
        });
      });
  };

  return (
    <div className="accessPermission role-form-main">
      <TextField
        id="title"
        error={Boolean(roleErr)}
        helperText={Boolean(roleErr) ? roleErr : ''}
        className="add-role-field"
        placeholder="Role Name"
        variant="outlined"
        value={roleName}
        onChange={onChangeRoleName}
      />

      <div className="action">
        <Button
          size="small"
          variant="outlined"
          className="cancel"
          onClick={resetField}
        >
          CLEAR
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          className="primary-button forward"
          onClick={onSaveClick}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}