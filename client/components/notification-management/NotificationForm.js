import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import axiosInstance from "../../utils/apiInstance";
import config from "../../app.constant";
import {
  Container,
  TextField,
  FormControl,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import SimpleBar from "simplebar-react";
import timeArr from "../../data/timeRoster.json";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";

export default function NotificationForm(props) {
  const { setLoader, setMsgData } = props;
  const [bannerImage, setBannerImage] = useState("");
  const [bannerImgName, setBannerImgName] = useState("");
  const [bannerImgErr, setBannerImgErr] = useState("");
  const [uploadImgName, setUploadImgName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [btnCaption, setBtnCaption] = useState("");
  const [notificationDate, setNotificationDate] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [displayErr, setDisplayErr] = useState(false);
  const [filter01, setFilter01] = useState("all branches");
  const [filter02, setFilter02] = useState("staff");
  const [searchSpecific, setSearchSpecific] = useState("");

  const fieldValidationVal = useMemo(() => {
    return (
      title !== "" &&
      description !== "" &&
      bannerImgName !== "" &&
      btnCaption !== "" &&
      notificationDate !== ""
    );
  }, [
    title,
    description,
    bannerImgName,
    notificationDate,
    btnCaption,
    notificationTime,
  ]);

  const uploadBannerImage = (e) => {
    e.preventDefault();
    let validationErr = "";
    const allowedFileSize = 2048;
    const allowedFileType = "jpg, jpeg, png";
    const file = e.target.files[0];
    const getFileSize = file.size / 1024;

    // Image validation
    let getImgExt = file.name.split(".")[1];

    if (allowedFileType.indexOf(getImgExt) < 0) {
      validationErr =
        "Only jpeg, jpg and png files are allowed for Banner Image";
      setBannerImgErr(validationErr);
      return;
    } else if (getFileSize > allowedFileSize) {
      validationErr =
        "Max file size exceeded. File size should be less than 2MB.";
      setBannerImgErr(validationErr);
      return;
    }

    setBannerImgErr("");
    setBannerImage(file);
    setBannerImgName(URL.createObjectURL(file));
    uploadImage(e, file);
  };

  const removeBannerImg = (e) => {
    e.preventDefault();
    setBannerImage("");
    setBannerImgName("");
  };

  const [dateError, setDateError] = useState("");
  const [dateBool, setDateBool] = useState(false);

  const handlePastDate = (e) => {
    const DOB = e.target.value;
    const dateNow = new Date();
    const dateInput = new Date(DOB);
    if (dateNow.getDate() > dateInput.getDate()) {
      setDateBool(true);
      setDateError("Date cannot be past date");
    } else {
      setDateBool(false);
      setNotificationDate(DOB);
      setDateError("");
    }
  };

  const uploadImage = (e, ImgFile) => {
    e.preventDefault();
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
          () => setProgress(Math.round((100 * data.loaded) / data.total)),
          1000
        );
      },
    };

    let imageData = {
      file: ImgFile,
    };

    axiosInstance
      .post(config.API_URL + "/api/utility/upload", imageData, configs)
      .then((response) => {
        const data = response.data;
        setBannerImage((prevState) => ({
          ...prevState,
          uploadedFileName: data.fileName,
        }));
        // On edit mode, update the banner image also
        setUploadImgName(data.fileName);
        setProgress(0);
      })
      .catch((error) => {
        setMsgData({
          message: "Error occured while uploading image",
          type: "error",
        });
      });
  };

  const sendNotification = (e) => {
    e.preventDefault();

    if (!fieldValidationVal) {
      setDisplayErr(true);
    }
    setDisplayErr(false);
    console.log("Redy to send notfication");
  };

  return (
    <>
      <Container fixed className="blog-main-container">
        <SimpleBar className="blog-form-scroll">
          <Container className="blog-details-container">
            <FormControl className="form-control-fields">
              <TextField
                required
                error={displayErr && title === ""}
                id="title"
                label="Title:"
                className="post-type"
                variant="filled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                helperText={
                  displayErr && title === "" ? "Please enter the title." : ""
                }
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                required
                id="title"
                error={displayErr && description === ""}
                label="Description:"
                className="post-type"
                variant="filled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText={
                  displayErr && description === ""
                    ? "Please enter Meta Description for the page"
                    : ""
                }
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                label="Button Caption:"
                className="post-type"
                variant="filled"
                value={btnCaption}
                onChange={(e) => setBtnCaption(e.target.value)}
              />
            </FormControl>
            <p
              style={{
                color: "#7B7B7B",
                marginLeft: "10px",
                marginBottom: "-10px",
              }}
            >
              Banner Image: *
            </p>
            <FormControl
              className="form-control-fields"
              style={{ marginBottom: 135 }}
            >
              <div className="upload-option banner-image-div">
                <input
                  required
                  type="file"
                  className="choose"
                  id="corporateId"
                  onChange={uploadBannerImage}
                />
                <label
                  htmlFor="corporateId"
                  className={`${
                    bannerImgName === ""
                      ? "banner-content"
                      : "banner-image-uploaded"
                  }`}
                  style={{ padding: "2px" }}
                >
                  <div>
                    <div>
                      <img src="/logo/upload_icon.svg" />
                    </div>
                    <strong className="notification-img-heading">
                      Drag and Drop your Banner Image for Notifications here to
                      Upload
                    </strong>
                    <p className="notification-img-subheader">
                      Image Size: (1080 * 1080)
                    </p>
                    <div className="upload-instruction">
                      <Button
                        disabled
                        variant="contained"
                        className="upload-doc-1"
                      >
                        Or select files to upload
                      </Button>
                    </div>
                  </div>
                </label>
                {!!(bannerImgName !== "") && (
                  <>
                    <div className="img-preview-div">
                      <img
                        id="ImgPreview"
                        src={bannerImgName}
                        className="preview1 banner-spec"
                        alt="banner image"
                      />
                      <div
                        id="removeImage1"
                        className="rmv"
                        onClick={removeBannerImg}
                      >
                        <Grid item xs={8}>
                          <DeleteOutlinedIcon className="del-icon" />
                        </Grid>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {displayErr && bannerImgName === "" ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "red",
                    position: "relative",
                    top: 110,
                    left: 10,
                  }}
                >
                  Please upload Banner Image
                </p>
              ) : (
                ""
              )}
              {bannerImgErr !== "" ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "red",
                    position: "relative",
                    top: 110,
                    left: 10,
                  }}
                >
                  {bannerImgErr}
                </p>
              ) : (
                ""
              )}
            </FormControl>

            <FormControl className="notification-date-time">
              <TextField
                required
                id="title"
                type="date"
                label="Date:"
                error={(displayErr && notificationDate === "") || dateBool}
                InputLabelProps={{ shrink: true }}
                style={{ position: "relative", top: 10, width: "80%" }}
                className="post-type"
                variant="filled"
                value={notificationDate}
                onChange={handlePastDate}
                helperText={
                  displayErr && notificationDate === ""
                    ? "Please enter the Date"
                    : dateBool
                    ? dateError
                    : ""
                }
              />

              <TextField
                required
                select
                id="title"
                label="Time:"
                error={displayErr && notificationTime === ""}
                style={{ position: "relative", top: 10, width: "20%" }}
                className="post-type"
                variant="filled"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              >
                {timeArr.length &&
                  timeArr.map((data) => (
                    <MenuItem key={data.id} value={data.label}>
                      {data.label}
                    </MenuItem>
                  ))}
              </TextField>
            </FormControl>
            <p
              style={{
                color: "#7B7B7B",
                marginLeft: "10px",
                marginTop: "30px",
                marginBottom: "-15px",
              }}
            >
              Filters: *
            </p>
            <FormControl style={{ marginTop: "30px" }}>
              <div style={{ display: "inline-flex" }}>
                <FormControlLabel
                  className="checkbox-root"
                  control={
                    <Checkbox
                      icon={
                        <CheckBoxOutlineBlankOutlinedIcon className="notification-checkbox-icons" />
                      }
                      checkedIcon={
                        <CheckBoxOutlinedIcon className="notification-checkbox-icons" />
                      }
                    />
                  }
                />
                <TextField
                  // required
                  id="title"
                  select
                  // label="Hospital Branches"
                  // error={displayErr && notificationDate === ''}
                  InputLabelProps={{ shrink: true }}
                  style={{ position: "relative", top: 10, width: "100%" }}
                  // className="post-type"
                  variant="filled"
                  value={filter01}
                  onChange={(e) => setFilter01(e.target.value)}
                  defaultValue="all branches"
                >
                  <MenuItem value="all branches">
                    All Hospital Branches
                  </MenuItem>
                </TextField>
              </div>

              <div style={{ display: "inline-flex" }}>
                <FormControlLabel
                  className="checkbox-root"
                  control={
                    <Checkbox
                      icon={
                        <CheckBoxOutlineBlankOutlinedIcon
                          style={{ height: 20, width: 20 }}
                          className="notification-checkbox-icons"
                        />
                      }
                      checkedIcon={
                        <CheckBoxOutlinedIcon className="notification-checkbox-icons" />
                      }
                    />
                  }
                />
                <TextField
                  // required
                  id="title"
                  select
                  // label="Hospital Branches"
                  InputLabelProps={{ shrink: true }}
                  style={{ position: "relative", top: 10, width: "100%" }}
                  // className="post-type"
                  variant="filled"
                  value={filter02}
                  onChange={(e) => setFilter02(e.target.value)}
                >
                  <MenuItem value="staff">
                    Doctor, Hospital Staff, Patient
                  </MenuItem>
                </TextField>
              </div>
              <div style={{ display: "inline-flex" }}>
                <FormControlLabel
                  className="checkbox-root"
                  control={
                    <Checkbox
                      icon={
                        <CheckBoxOutlineBlankOutlinedIcon className="notification-checkbox-icons" />
                      }
                      checkedIcon={
                        <CheckBoxOutlinedIcon className="notification-checkbox-icons" />
                      }
                    />
                  }
                />
                <TextField
                  required
                  id="title"
                  placeholder="Search Doctor / Hospital Staff / Patient name"
                  style={{ position: "relative", top: 10, width: "100%" }}
                  // className="post-type"
                  variant="filled"
                  value={searchSpecific}
                  onChange={(e) => setSearchSpecific(e.target.value)}
                />
              </div>
            </FormControl>

            <div className="notification-mgmt-group">
              <Button
                disabled={!fieldValidationVal}
                id="go-login"
                size="small"
                variant="contained"
                color="primary"
                className={`${
                  !fieldValidationVal
                    ? "disabled-notify-btn"
                    : "notify-send-btn"
                }`}
                onClick={sendNotification}
              >
                SEND
              </Button>
            </div>
          </Container>
        </SimpleBar>

        <Container className="category-tag-div">
          <img src="/notification_phone.png" className="notify-phone" />
          <div className="notify-demo">
            {!!(bannerImgName !== "") && (
              <>
                <div className="img-preview-div notification-banner">
                  <img
                    id="ImgPreview"
                    src={`${bannerImgName}`}
                    className="preview1 notification-banner-prev"
                  />
                </div>
              </>
            )}
            {(title !== "" || description !== "") && (
              <div className="caption-div">
                <p className="title-caption">{title}</p>
                <p className="description-caption">{description}</p>
              </div>
            )}
          </div>
        </Container>
      </Container>
    </>
  );
}
