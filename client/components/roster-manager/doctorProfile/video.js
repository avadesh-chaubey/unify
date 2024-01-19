import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import VideoThumbnail from "react-video-thumbnail";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ReactPlayer from "react-player";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import config from "../../../app.constant";
import axiosInstance from "../../../utils/apiInstance";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme) => ({
  videoDetails: {},
  videoName: {
    fontSize: "18px",
  },
  videoTag: {
    fontSize: "12px",
    margin: "10px 0",
  },
  videoTagEle: {
    fontSize: "12px",
    marginRight: "5px",
    fontSize: "12px",
    color: "#CECECE",
    border: "1px solid",
    borderRadius: "5px",
    padding: "0px 3px",
    display: "inline-block",
    marginTop: "5px",
  },
}));
function Video(props) {
  const {
    videoArr,
    setVideoArr,
    allVideos,
    setAllVideos,
    setMsgData,
    doctorProfileId,
  } = props;
  const [videoFile, setVideoFile] = useState("");
  const [docList, setDocList] = useState([]);
  const [docArr, setDocArr] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [playVidUrl, setPlayVidUrl] = useState("");
  const [progress, setProgress] = useState(50);
  const [showProgLoader, setShowProgLoader] = useState(false);
  const [tempVidArr, setTempVidArr] = useState([]);
  const [playName, setPlayName] = useState("");
  const classes = useStyles();

  const showVidPlayer = (item, name) => {
    console.log("showVidPlayer", item);
    setPlayVidUrl(item);
    setPlayName(name);
    setOpen(true);
  };
  const [open, setOpen] = React.useState(false);
  const [openUploadVideo, setOpenUploadVideo] = useState(false);

  const closeUploadVideo = () => {
    console.log("closeUploadVideo: ");
    setOpenUploadVideo(false);
    setVideoFile("");
    setVideoName("");
    setDocArr([]);
  };
  const onUploadVideo = () => {
    console.log("onUploadVideo: ");
    setOpenUploadVideo(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPlayVidUrl("");
  };

  useEffect(() => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    axios
      .get(
        config.API_URL + `/api/partner/searchdoctorprofile?doctorName=` + "",
        {
          headers,
        }
      )
      .then((response) => {
        const data = response.data.data;
        setDocList(data);
        console.log("data in searchdoctorprofile: ", data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    var videoData;
    videoArr &&
      videoArr.map((videoId) => {
        axios
          .get(config.API_URL + `/api/partner/tagvideo/${videoId}`, {
            headers,
          })
          .then((response) => {
            videoData = response.data.data;
            console.log("data in videoData ", videoData);
            setAllVideos([...allVideos, videoData]);
            setTempVidArr([...tempVidArr, videoData]);
          })
          .catch((error) => {
            console.log("error: ", error);
          });
      });
  }, [videoArr]);

  const updateDocArr = (e, arr) => {
    e.preventDefault();
    console.log("arr: ", arr);
    setDocArr(arr);
  };

  const changeVideo = (e) => {
    console.log("changeVideo", e.target.files[0].size);
    const files = e.target.files[0];
    const fileSize = e.target.files[0].size;
    if (fileSize >= 1000000) {
      setMsgData({
        message: "File size exceeds 1 MB",
        type: "error",
      });
      return;
    }
    console.log("files: ", files);
    if (!files) {
      setVideoFile("");
      return;
    }

    let configs = {
      headers: { authtoken: JSON.parse(localStorage.getItem("token")) },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
      onUploadProgress: (data) => {
        //Set the progress value to show the progress bar
        setShowProgLoader(true);
        let tempProg = Math.round((100 * data.loaded) / data.total);
        setProgress(tempProg);
        setTimeout(() => console.log("progress:  ", tempProg), 1000);
        if (tempProg == 100) {
          setShowProgLoader(false);
        }
      },
    };

    let imageData = {
      file: files,
    };

    axiosInstance
      .post(config.API_URL + "/api/utility/upload", imageData, configs)
      .then((response) => {
        const data = response.data.data;
        console.log("data in upload: ", data);
        setVideoFile(data.fileName);
      })
      .catch((error) => {
        console.log("error: ", error);
        setMsgData({
          message: "Error occured while uploading video",
          type: "error",
        });
        setShowProgLoader(false);
      });
  };

  const videoSubmit = () => {
    console.log("videoSubmit");
    console.log("videoFile: ", videoFile);
    console.log("docArr: ", docArr);
    let temp2 = [];
    docArr.map((item) => {
      temp2.push(item.id);
    });
    console.log("temp2: ", temp2);
    if (videoFile == "" || docArr.length < 1 || videoName == "") {
      console.log("error all required: ");
      setMsgData({
        message: "All fields are required while uploading image",
        type: "error",
      });
      return false;
    }

    let obj = {
      name: videoName,
      doctorIdList: temp2,
      url: videoFile,
    };
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    axios
      .post(config.API_URL + "/api/partner/tagvideo", obj, {
        headers,
      })
      .then((response) => {
        const data = response.data.data;
        console.log("data in uploadVideo: ", data.id);
        videoArr.push(data.id);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    let videotemp = [...allVideos];
    videotemp.push(obj);
    setAllVideos(videotemp);
    closeUploadVideo();
  };

  return (
    <div>
      <div className="accordianDiv">
        <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
          <AccordionSummary
            expandIcon={
              <img
                src="../arrowUp.svg"
                style={{ width: "20px", height: "10px" }}
              />
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ color: "#343434", fontWeight: 600 }}>
              Videos
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
            <div style={{ width: "100%" }}>
              <div className="scrollOuter">
                <div className="scrollInner">
                  {allVideos.length > 0 &&
                    allVideos.map((item, index) => {
                      return (
                        <div className="videoSec" key={index}>
                          <VideoThumbnail
                            videoUrl={
                              config.API_URL +
                              "/api/utility/download/" +
                              item.url
                            }
                          />
                          <div
                            className="videoLayer"
                            onClick={(e) => showVidPlayer(item.url, item.name)}
                          >
                            <PlayArrowIcon />
                          </div>
                          <div className={classes.videoDetails}>
                            <div className={classes.videoName}>{item.name}</div>
                            <div className={classes.videoTag}>
                              {item.doctorIdList.map((data) =>
                                docList.map((doc) => {
                                  if (doc.id === data) {
                                    return (
                                      <span className={classes.videoTagEle}>
                                        {doc.doctorFullName}
                                      </span>
                                    );
                                  }
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {doctorProfileId == "" || allVideos.length > 0
                    ? ""
                    : "No Data to Show"}
                  {doctorProfileId == "" && (
                    <div className="uploadVideo" onClick={onUploadVideo}>
                      <img src="../uploadAward.svg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="videoPlayer"
      >
        <DialogTitle id="alert-dialog-title">{playName}</DialogTitle>
        <DialogContent>
          <ReactPlayer
            // playing
            url={config.API_URL + "/api/utility/download/" + playVidUrl}
            width="100%"
            height="100%"
            controls={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUploadVideo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Upload Videos</DialogTitle>
        <DialogContent className="doctorAwards">
          {showProgLoader && (
            <div className="loader">
              <CircularProgress
                variant="determinate"
                value={progress}
                color="secondary"
              />
              <div className="textStyle">{progress}</div>
            </div>
          )}
          <div>
            <div className="uploadDoc">
              <span>
                <input
                  type="file"
                  id="videoFile"
                  onChange={changeVideo}
                  style={{ display: "none" }}
                  accept="video/*"
                />
              </span>
              {videoFile != "" && (
                <label htmlFor="videoFile" style={{ cursor: "pointer" }}>
                  <ReactPlayer
                    // playing
                    url={config.API_URL + "/api/utility/download/" + videoFile}
                    width="100%"
                    height="100%"
                    controls={true}
                  />
                </label>
              )}
              {videoFile == "" && (
                <label htmlFor="videoFile" style={{ cursor: "pointer" }}>
                  <img src="../uploadAward.svg" />
                </label>
              )}
            </div>
            <Autocomplete
              multiple
              id="tags-standard"
              options={docList}
              getOptionLabel={(option) => option.doctorFullName || ""}
              onChange={updateDocArr}
              value={docArr}
              style={{ width: "575px", padding: "10px 0" }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.doctorFullName}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="title"
                  // error={displayValidationErr && !docArr.length}
                  variant="outlined"
                  placeholder={docArr.length ? "" : "Search By Employee Name"}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment>
                          <SearchIcon
                            style={{ display: docArr.length ? "none" : "" }}
                          />
                          {params.InputProps.startAdornment}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            <TextField
              value={videoName}
              id="outlined-basic"
              placeholder="Enter Award/Certification Name"
              variant="outlined"
              style={{ margin: "10px 0", width: "575px" }}
              onChange={(e) => setVideoName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUploadVideo} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={videoSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Video;
