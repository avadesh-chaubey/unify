import React, { useState } from 'react';
import config from '../../app.constant';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton 
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#fff",
    width: '34.5rem',
    "&.Mui-focused fieldset": {
      borderColor: "unset",
      // borderWidth: "2px"
    }
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

export default function TagCategoryDialog (props) {
  const {
    actionType,
    open,
    handleCloseDialog,
    setCategoryList,
    setTagList,
    setMsgData,
    setLoader
  } = props;
  const classes = useStyles();
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  const handleCategory = (e) => {
    e.preventDefault();
    setNewCategory(e.target.value);
  };

  const handleTag = (e) => {
    e.preventDefault();
    setNewTag(e.target.value);
  };

  const addNewCategory = () => {
    setLoader(true);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem('token')),
        "Content-type": "application/json",
      }
    };

    const data = {
      categoryName: newCategory
    };

    axios.post(`${config.API_URL}/api/cms/category`, data, headers)
    .then(res => {
      setMsgData({
        message: 'Added New Category successfully !'
      });
      setCategoryList((prev) => {
        return [
          ...prev,
          res.data.data
        ];
      });
      setLoader(false);
      handleCloseDialog();
    })
    .catch(err => {
      setLoader(false);

      if (err.response !== undefined) {
        setMsgData({
          message: err.response.data.errors[0].message,
          type: 'error'
        });
      } else {
        setMsgData({
          message: 'Error occurred while saving category',
          type: 'error'
        });
      }

      handleCloseDialog();
    });
  };

  const addNewTag = () => {
    setLoader(true);
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem('token')),
        "Content-type": "application/json",
      }
    };

    const data = {
      tagName: newTag
    };

    axios.post(`${config.API_URL}/api/cms/tag`, data, headers)
    .then(res => {
      setMsgData({
        message: 'Added New Tag successfully !'
      });
      setTagList((prev) => {

        return [
          ...prev,
          res.data.data
        ];
      });
      setLoader(false);
      handleCloseDialog();
    })
    .catch(err => {
      setLoader(false);

      if (err.response !== undefined) {
        setMsgData({
          message: err.response.data.errors[0].message,
          type: 'error'
        });
      } else {
        setMsgData({
          message: 'Error occurred while saving tag',
          type: 'error'
        });
      }

      handleCloseDialog();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="dialog-category-title"
    >
      <DialogTitle
        id="customized-dialog-title"
        style={{ paddingBottom: 0, paddingLeft: 25 }}
        onClose={handleCloseDialog}
      >
        Add {actionType === 'Tag' ? 'Tag' : 'Category'}
      </DialogTitle>
      <DialogContent>
        {actionType === 'Tag'
          ? (
            <TextField
              id="add-notes"
              autoFocus={true}
              className={`${classes.root} consultation-field`}
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="Enter new tag name"
              variant="outlined"
              onChange={handleTag}
              color="primary"
            />
          ) : (
            <TextField
              id="add-notes"
              autoFocus={true}
              className={`${classes.root} consultation-field`}
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="Enter new category name"
              variant="outlined"
              onChange={handleCategory}
              color="primary"
            />
          )}
      </DialogContent>
      <DialogActions style={{ paddingRight: 22}}>
        {
          actionType === 'Tag'
            ? (
              <Button
                variant="contained"
                color="primary"
                onClick={addNewTag}
              >
                Add
              </Button>
            )
            : (
              <Button
                variant="contained"
                color="primary"
                onClick={addNewCategory}
              >
                Add
              </Button>
            )
        }
      </DialogActions>
    </Dialog>
  )
}
