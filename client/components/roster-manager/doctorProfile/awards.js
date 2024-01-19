import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Lightbox from "react-awesome-lightbox";
import TextField from "@material-ui/core/TextField";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import config from "../../../app.constant";
import axiosInstance from "../../../utils/apiInstance";

const useStyles = makeStyles((theme) => ({
  awardName: {
    fontSize: "14px",
    fontWeight: "bold",
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#424242",
    marginBottom: "5px",
  },
  awardDate: {
    fontSize: "14px",
    color: "#424242",
  },
}));

// const objTemp = {
//   description: "certName certName",
//   imageUrl: "f3f90c30-5e5c-11ec-87e9-6349f791f1d9_image2.jpg",
//   date: moment(new Date()).format("DD MMM YYYY"),
// };

function Awards(props) {
  const { awardsImageArr, setAwardsImageArr, setMsgData, doctorProfileId } =
    props;
  const [showImage, setShowImage] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [openUploadAward, setOpenUploadAward] = useState(false);
  const [awardFile, setAwardFile] = useState("");
  const classes = useStyles();
  const [certName, setCertName] = useState("");
  const [tempAwardsList, setTempAwardsList] = useState([]);

  const onAwardClick = (item) => {
    console.log("item:: ", item);
    setImageFile(item.imageUrl);
    setShowImage(true);
  };

  const onUploadAward = () => {
    console.log("onUploadAward");
    setOpenUploadAward(true);
  };

  const closeUploadAward = () => {
    console.log("closeUploadAward: ");
    setOpenUploadAward(false);
  };

  const changeAward = (e) => {
    console.log("changeAward");
    const files = e.target.files[0];
    console.log("files: ", files);
    if (!files) {
      setAwardFile("");
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
        // setTimeout(() => setProgress(Math.round((100 * data.loaded) / data.total)), 1000);
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
        setAwardFile(data.fileName);
      })
      .catch((error) => {
        console.log("error: ", error);
        setMsgData({
          message: "Error occured while uploading image",
          type: "error",
        });
      });

    // fileToDataUri(files)
    // .then(dataUri => {
    //   console.log("dataUri: ",dataUri);
    //   setAwardFile(dataUri)
    // })
  };
  const awardSubmit = () => {
    if (certName && awardFile) {
      // console.log("awardSubmit");
      // let temp = [...awardsImageArr];
      let obj = {
        description: certName,
        imageUrl: awardFile,
        date: moment(new Date()).format("DD MMM YYYY"),
      };
      // temp.push(obj);
      // console.log("temp: ", temp);
      setAwardsImageArr([...awardsImageArr, obj]);
      closeUploadAward();
      setAwardFile("");
      setCertName("");
    } else {
      props.setMsgData({
        message: "All fields are required",
        type: "error",
      });
    }
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
              Awards and Recognitions
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: "block" }}>
            <div style={{ width: "100%" }}>
              <div className="scrollOuter">
                <div className="scrollInner">
                  {awardsImageArr &&
                    awardsImageArr.length > 0 &&
                    awardsImageArr.map((item,index) => {
                      if (item != "NA") {
                        return (
                          <div class="image" key={index}>
                            <img
                              src={
                                config.API_URL +
                                "/api/utility/download/" +
                                item.imageUrl
                              }
                              onClick={(e) => onAwardClick(item)}
                            />
                            <div className={classes.awardName}>
                              {item.description}
                            </div>
                            <div className={classes.awardDate}>{item.date}</div>
                          </div>
                        );
                      }
                    })}

                  {doctorProfileId == "" || awardsImageArr.length > 0
                    ? ""
                    : "No Data to Show"}
                  {doctorProfileId == "" && (
                    <div className="uploadDiv" onClick={onUploadAward}>
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
        open={openUploadAward}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">
          Upload Awards And Recognition
        </DialogTitle>
        <DialogContent className="doctorAwards">
          <div>
            {/* onClick={changeProfile} */}
            <div className="uploadDoc">
              <span>
                <input
                  type="file"
                  accept="image/*"
                  id="awardFile"
                  onChange={changeAward}
                  style={{ display: "none" }}
                />
              </span>
              {awardFile != "" && (
                <label htmlFor="awardFile" style={{ cursor: "pointer" }}>
                  <img
                    src={config.API_URL + "/api/utility/download/" + awardFile}
                  />
                </label>
              )}
              {awardFile == "" && (
                <label htmlFor="awardFile" style={{ cursor: "pointer" }}>
                  <img src="../uploadAward.svg" />
                </label>
              )}
            </div>
            <TextField
              value={certName}
              id="outlined-basic"
              placeholder="Enter Award/Certification Name"
              variant="outlined"
              style={{ margin: "10px 0", width: "97%" }}
              onChange={(e) => setCertName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUploadAward} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={awardSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Awards;
