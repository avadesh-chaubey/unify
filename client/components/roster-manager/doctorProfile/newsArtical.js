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
import Lightbox from "react-awesome-lightbox";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import config from "../../../app.constant";
import axiosInstance from "../../../utils/apiInstance";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  articalDetails: {},
  articalName: {
    fontSize: "18px",
  },
  articalTag: {
    fontSize: "12px",
    margin: "10px 0",
  },
  articalTagEle: {
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

function NewsArtical(props) {
  const {
    articalImageArr,
    setArticalImageArr,
    allArticle,
    setAllArticle,
    setMsgData,
    doctorProfileId,
  } = props;
  const [showImage, setShowImage] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [articalFile, setArticalFile] = useState("");
  const [videoName, setVideoName] = useState("");
  const [docList, setDocList] = useState([]);
  const [docArr, setDocArr] = useState([]);

  const classes = useStyles();

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
    var articleData;
    articalImageArr.map((articleId) => {
      axios
        .get(config.API_URL + `/api/partner/tagarticle/${articleId}`, {
          headers,
        })
        .then((response) => {
          articleData = response.data.data;
          setAllArticle([...allArticle, articleData]);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    });
  }, [articalImageArr]);

  const onAwardClick = (item) => {
    console.log("item:: ", item);
    setImageFile(item);
    setShowImage(true);
  };
  const onUploadArtical = () => {
    console.log("onUploadArtical");
    setOpenUploadArtical(true);
    setArticalFile("");
    setVideoName("");
    setDocArr([]);
  };

  const [openUploadArtical, setOpenUploadArtical] = useState(false);

  const closeUploadArtical = () => {
    console.log("closeUploadArtical: ");
    setOpenUploadArtical(false);
  };
  const changeArtical = (e) => {
    console.log("changeArtical");
    const files = e.target.files[0];
    console.log("files: ", files);
    if (!files) {
      setArticalFile("");
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
        setTimeout(
          () =>
            console.log(
              "progress:  ",
              Math.round((100 * data.loaded) / data.total)
            ),
          1000
        );
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
        setArticalFile(data.fileName);
      })
      .catch((error) => {
        setMsgData({
          message: "Error occured while uploading image",
          type: "error",
        });
      });
  };

  const updateDocArr = (e, arr) => {
    e.preventDefault();
    // console.log("arr: ", arr);
    setDocArr(arr);
  };

  const articalSubmit = () => {
    let temp2 = [];
    docArr.map((item) => {
      temp2.push(item.id);
    });
    if (articalFile == "" || docArr.length < 1 || videoName == "") {
      setMsgData({
        message: "All fields are required while uploading image",
        type: "error",
      });
      return false;
    }

    let obj = {
      description: videoName,
      doctorIdList: temp2,
      url: articalFile,
    };
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    axios
      .post(config.API_URL + "/api/partner/tagarticle", obj, {
        headers,
      })
      .then((response) => {
        const data = response.data.data;
        console.log("data in uploadArticle: ", data.id);
        articalImageArr.push(data.id);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    let articleTemp = [...allArticle];
    articleTemp.push(obj);
    closeUploadArtical();
    setAllArticle(articleTemp);
    setArticalFile("");
  };

  return (
    <div>
      {!!showImage && (
        <Lightbox
          onClose={() => setShowImage(!showImage)}
          title={imageFile}
          image={config.API_URL + "/api/utility/download/" + imageFile}
        />
      )}
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
              Articles
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
            <div style={{ width: "100%" }}>
              <div className="scrollOuter">
                <div className="scrollInner">
                  {allArticle &&
                    allArticle.length > 0 &&
                    allArticle.map((item, index) => {
                      return (
                        <div class="image" key={index}>
                          <img
                            src={
                              config.API_URL +
                              "/api/utility/download/" +
                              item.url
                            }
                            onClick={(e) => onAwardClick(item.url)}
                          />
                          <div className={classes.articalDetails}>
                            <div className={classes.articalName}>
                              {item.description}
                            </div>
                            <div className={classes.articalTag}>
                              {item.doctorIdList.map((data) =>
                                docList.map((doc) => {
                                  if (doc.id === data) {
                                    return (
                                      <span className={classes.articalTagEle}>
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

                  {doctorProfileId == "" || allArticle.length > 0
                    ? ""
                    : "No Data to Show"}

                  {doctorProfileId == "" && (
                    <div className="uploadArticle" onClick={onUploadArtical}>
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
        open={openUploadArtical}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Upload Articles</DialogTitle>
        <DialogContent className="doctorAwards">
          <div>
            {/* onClick={changeProfile} */}
            <div className="uploadDoc">
              <span>
                <input
                  type="file"
                  accept="image/*"
                  id="articalFile"
                  onChange={changeArtical}
                  style={{ display: "none" }}
                />
              </span>
              {articalFile != "" && (
                <label htmlFor="articalFile" style={{ cursor: "pointer" }}>
                  <img
                    src={
                      config.API_URL + "/api/utility/download/" + articalFile
                    }
                  />
                </label>
              )}
              {articalFile == "" && (
                <label htmlFor="articalFile" style={{ cursor: "pointer" }}>
                  <img src="../uploadAward.svg" />
                </label>
              )}
            </div>
            {/* {console.log("docList: ", docList)} */}
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
                  // helperText={
                  //   displayValidationErr && !docArr.length
                  //     ? "Please select Employee from given option"
                  //     : ""
                  // }
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
          <Button onClick={closeUploadArtical} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={articalSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewsArtical;
