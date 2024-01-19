import axios from 'axios';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import MessagePrompt from "../components/messagePrompt";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const DoRequest = ({ url, method, body, onSuccess, onError }) => {
  const classes = useStyles();
  const [errors, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [msgData, setMsgData] = useState({});

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props, withCredentials: true });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      // onError hander display error message while login
      if (onError) {
        onError(error.response);
      }

      if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
        setErrorMessage(error.response.data[0].message);
        setErrors(
          <div className={classes.root}>
            <MessagePrompt msgData={{ message:error.response.data[0].message, type: "error" }} />
          </div>
        );
      }
    }
  };

  return { doRequest, errors, errorMessage };
};

export default DoRequest;