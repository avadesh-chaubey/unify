import React, {useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    Typography ,
  } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import firebase from 'firebase';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  changeBorderRadius: {
    borderRadius: 0,
  }
});

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    width: 400
  },
  marginConfirmPass: {
    margin: theme.spacing(1),
    width: 400
  }
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ChangeUserPassword = ({open, closeDialog, props}) => {
  const classes = useStyles();
  const [cookies] = useCookies(["name"]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completeWithErr, setCompleteWithErr] = useState({});

  useEffect(() => {
    if (newPassword !== '' && newPassword.length < 6) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        newPassErr: 'Password should not be less than 6 letters',
      }));
    } else if (confirmPassword !== '' && confirmPassword.length < 6) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        confirmPassErr: 'Password should not be less than 6 letters',
      }));
    } else if (newPassword.length && oldPassword === newPassword) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        newPassErr: 'New Password cannot be same as Old Password',
      }));
    }
  }, [oldPassword, newPassword, confirmPassword]);

  const handleOldPassChange = (e) => {
    e.preventDefault();

    if (e.target.value.length) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        oldPassErr: '',
      }));
    }
    setOldPassword(e.target.value);
  };

  const handleNewPassChange = (e) => {
    e.preventDefault();

    if (e.target.value.length) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        newPassErr: '',
      }));
    }
    setNewPassword(e.target.value);
  };

  const handleConfirmPassChange = (e) => {
    e.preventDefault();
    const confirmPass = e.target.value;

    if (confirmPass.length) {
      setCompleteWithErr(prevState => ({
        ...prevState,
        confirmPassErr: '',
      }));
    }
    setConfirmPassword(confirmPass);
  };
  
  const handleCloseDialog = (e) => {
    e.preventDefault();

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCompleteWithErr({});

    // Reset all the form fields & close dialog
    closeDialog(e);
  }

  const validateField = () => {
    // Password field should not empty
    const oldPassErr = !oldPassword.length ? 'Please provide your current password' : '';
    const newPassErr = !newPassword.length ? 'Please provide your new password' : '';
    const confirmPassErr = !confirmPassword ? 'Please provide your new password' : '';
    
    setCompleteWithErr(prevState => ({
      ...prevState,
      oldPassErr: oldPassErr,
      newPassErr: newPassErr,
      confirmPassErr: confirmPassErr,
    }));

    return oldPassword === '' || newPassword === '' || confirmPassword === '';
  }

  const handleComplete = (e) => {
    if (validateField()) {
      return ;
    }
    
    let header = {
      authtoken: cookies['express:sess'],
    };

    axios.post(
      `${config.API_URL}/api/users/resetpassword`,
      {
        oldpassword: oldPassword,
        newpassword: newPassword,
      },
      {
        headers: {
          ...header,
        },
      }
    )
    .then((res) => {
      console.log("Reset Password Success", res);
      props.setMsgData({ message: 'Password changed successfully!' });
      handleCloseDialog(e);
    })
    .catch((err) => {
      console.log("Error Reset Password", err);
      if (err.hasOwnProperty('response')) {
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      } else {
        props.setMsgData({ message: 'Error occurred... Try again later', type: "error" });
      }
      handleCloseDialog(e);
    });
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ paddingBottom: 0, paddingLeft: 25 }}
          onClose={handleCloseDialog}
        >
          Change Password
        </DialogTitle>
        <DialogContent>
          <TextField
            error={Boolean(completeWithErr?.oldPassErr)}
            type="password"
            className={classes.margin}
            id="old-password"
            label="Old Password"
            onChange={handleOldPassChange}
            value={oldPassword}
            helperText={completeWithErr?.oldPassErr}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />

          <TextField
            error={Boolean(completeWithErr?.newPassErr)}
            type="password"
            className={classes.margin}
            id="new-password"
            label="New Password"
            onChange={handleNewPassChange}
            value={newPassword}
            helperText={completeWithErr?.newPassErr}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />

          <TextField
            error={Boolean(completeWithErr?.confirmPassErr)}
            type="password"
            className={classes.marginConfirmPass}
            id="confirm-password"
            label="Confirm Password"
            onChange={handleConfirmPassChange}
            value={confirmPassword}
            helperText={completeWithErr?.confirmPassErr}
            InputLabelProps={{
              shrink: true,
            }}
          />          
        </DialogContent>
        <DialogActions style={{ paddingRight: 22}}>
          <Button
            className="loginBtn primary-button"
            variant="contained"
            onClick={handleComplete}
            color="secondary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ChangeUserPassword;