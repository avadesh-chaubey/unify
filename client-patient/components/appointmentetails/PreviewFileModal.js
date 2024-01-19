import React, {useEffect, useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import config from "../../app.constant";
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  Typography,
  InputLabel,
  Input,
  InputAdornment,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
// import workerSrc from "../pdf-worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

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
});

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
      // backgroundColor: '#cacaca',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    margin: {
      margin: theme.spacing(1),
      width: 260
    },
    formControl: {
      margin: theme.spacing(1),
      width: '98%',
    },
    dateField: {
      backgroundColor: '#fff',
    },
    alignField: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function PreviewFileModal(params) {
  const {
    file,
    openModal,
    modalFunc,
    sendToUser,
    appointmentObj,
    setFileDesc,
    showVideoSec
  } = params;
  const classes = useStyles();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [attachmentData, setAttachmentData] = useState({});
  const [cookies, SetCookies] = useCookies(['name']);
  const [fileData, setFileData] = useState({});
  const [docCategories, setDocCategories] = useState([]);
  const [selectDate, setSelectDate] = useState('');
  const [err, setErr] = useState({});

  const headers = {
    authtoken: cookies['cookieVal'],
  };

  const handleClose = () => {
    setErr({});
    modalFunc(false);
  };

  console.log("file: ",file);

  const handleChange = (event) => {
    console.log('category', event.target.value);
    const selectedVal = event.target.value;

    if (selectedVal !== '') {
      setCategory(selectedVal);
      setErr(prevState => ({
        ...prevState,
        categoryErr: false
      }));
    }
  };

  const onTitleChange = (event) => {
    const fileTitle = event.target.value;

    setTitle(fileTitle);
    setErr(prevState => ({
      ...prevState,
      titleErr: false
    }));
  }

  const dateSelection = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate) {
      setSelectDate(selectedDate);
      setErr(prevState => ({
        ...prevState,
        dateErr: false,
      }))
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        //console.log(resolve(xhr.response));
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      // this helps us get a blob
      xhr.responseType = "blob";

      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const validateField = () => {
    const categoryErr = category === '' ? 'Please select the category' : '';
    const dateErr = selectDate === '' ? 'Please select the date' : '';
    const titleErr = title === '' ? 'Please provide the title of document' : '';

    setErr(prevState => {
      return {
        ...prevState,
        categoryErr: categoryErr,
        dateErr: dateErr,
        titleErr: titleErr
      }
    });

    return ( (category !== '') && (selectDate !== '') && (title !== '') );
  }

  const sendItems = (event) => {
    event.preventDefault();
    
    // Validation of form fields
    const validation = validateField();
    if (!validation) {
      return ;
    }
    setFileDesc({
      fileTitle: title,
      fileCategory: category,
      fileDate: selectDate,
      fileType: file.fileType === 'file' ? 'file' : 'image'
    });
    const name = file.name;
    const fileExt = name.split('.')[1];

    if (file.fileType === 'image') {
      // Convert the file data to blob
      uriToBlob(URL.createObjectURL(file)).then((blob) => {
        const data = {
          blob: blob,
          uri: file,
          metadata: file.type,
          type: "image",
          fileExtension: fileExt,
        };

        setAttachmentData(data);
        modalFunc(false);
      });
    } else {
      // Convert the file data to blob
      uriToBlob(URL.createObjectURL(file)).then((blob) => {
        const data = {
          blob: blob,
          uri: file,
          metadata: file.type,
          type: "file",
          fileExtension: fileExt,
        };

        setAttachmentData(data);
        modalFunc(false);
      });
    }
  }

  // Function to create unique id for message
  const create_UUID = () => {
    let getTime = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (getTime + Math.random()*16)%16 | 0;
        getTime = Math.floor(getTime/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
  useEffect(() => {
    axios.get(`${config.API_URL}/api/utility/documents-categories`, { headers })
      .then(res => setDocCategories(res.data))
      .catch(err => {
        setMsgData({
          message:'Error occurred while fetching document categories',
          type: "error"
        });
        console.log('Error occurred while fetching document categories', err);
      });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(attachmentData)) {
      const data = [{
        id: create_UUID(),
        file: file,
        title: title,
        text: title,
        category: category,
        fileType: attachmentData.type,
        attachmentsData: attachmentData,
      }];

      // Function to send attachment as message and store file at firebase
      sendToUser(data);
    }
    
  }, [attachmentData]);
  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }
  return (
  <React.Fragment>
    <div>
      <Dialog className="previewFileDig" onClose={handleClose} aria-labelledby="customized-dialog-title" open={openModal}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Preview File
        </DialogTitle>
        <DialogContent dividers className="previewFileSec">
          <div style={{ width: '100%', margin: 'auto'}}>
            <div className={ file.fileType !== 'file' ? 'preview-image-div' : '' }>
              {console.log("object : ",URL.createObjectURL(file))}
              {
                file.fileType === 'file'
                ? (
                    // <iframe
                    //   src={URL.createObjectURL(file)}
                    //   height={200}
                    //   width={550}
                    // />
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      {Array.from({ length: numPages }, (_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      ))}
                    </Document>
                  )
                : (
                    <img
                      className="center-line-preview-image"
                      src={URL.createObjectURL(file)}
                      height={200}
                    />
                  )
              }
            </div>

            <div className="preview-modal-inline">
              <TextField
                required
                error={Boolean(err?.titleErr)}
                className={`${classes.margin} preview-form`}
                id="title"
                label="Title"
                onChange={onTitleChange}
                value={title}
                helperText={ err?.titleErr }
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                error
                id="date"
                required
                label="Date"
                type="date"
                error={Boolean(err?.dateErr)}
                helperText={err?.dateErr}
                className={`${classes.margin} preview-form`}
                value={selectDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={dateSelection}
              />
            </div>

            <FormControl
              className={classes.formControl}
              error={Boolean(err?.categoryErr)}
            >
              <InputLabel
                shrink
                id="demo-simple-select-outlined-label"
              >
                Category
              </InputLabel>
              <Select
                labelId="Category"
                id="category"
                value={category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="" disable>
                  <em>Select Category</em>
                </MenuItem>
                {
                  docCategories.length && docCategories.map(d => (
                  <MenuItem value={d}>{d}</MenuItem>
                  ))
                }
              </Select>
              {
                err?.categoryErr && (
                  <FormHelperText className="preview-form-category">
                    {err?.categoryErr}
                  </FormHelperText>
                )
              }
              
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={sendItems}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  </React.Fragment>
  );
}