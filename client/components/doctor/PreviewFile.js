import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  InputLabel,
  Input,
  InputAdornment,
  TextField,
  FormControl,
  Select,
  MenuItem
} from '@material-ui/core';

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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));



export default function PreviewCard({ file, sendToUser }) {
  const classes = useStyles();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [attachmentData, setAttachmentData] = useState({});
  const [fileData, setFileData] = useState({});

  const handleChange = (event) => {
    console.log('category', event.target.value);
    setCategory(event.target.value);
  };

  const onTitleChange = (event) => {
    const fileTitle = event.target.value;
    setTitle(fileTitle);
  }

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

  const sendItems = (event) => {
    event.preventDefault();

    // Convert the file data to blob
    uriToBlob(file).then((blob) => {
      const data = {
        blob: blob,
        uri: file,
        metadata: file.type,
        type: "image",
        fileExtension: "jpg",
      };

      setAttachmentData(data);
    });
  }

  // Function to create unique id for message
  const create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

  useEffect(() => {
    if (!_.isEmpty(attachmentData)) {
      const data = [{
        id: create_UUID(),
        file: file,
        title: title,
        text: title,
        category: category,
        fileType: 'image',
        attachmentsData: attachmentData,
      }];

      // Function to send attachment as message and store file at firebase
      sendToUser(data);
    }
    
  }, [attachmentData]);


  return(
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          <strong>Preview File</strong>
        </Typography>

        <div style={{ width: '500px'}}>
          {
            file.fileType === 'document'
            ? (<iframe src={URL.createObjectURL(file)} height={200} width={400} />)
            : (<img src={URL.createObjectURL(file)} height={200} width={400} />)
          }
          
          <br />
          <div>
            <TextField
              className={classes.margin}
              id="title"
              label="Title"
              onChange={onTitleChange}
              value={title}
              inputProps={{
                startAdonment: (
                  <InputAdornment postion="start">
                    Title
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
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
              <MenuItem value="Test Report">Test Report</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
        </FormControl>
          </div>
        </div>
      </CardContent>

      <CardActions>
        <Button color="primary" size="small" onClick={sendItems}>Send</Button>
      </CardActions>
    </Card>
  );
};
