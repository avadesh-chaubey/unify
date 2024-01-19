import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import axiosInstance from "../../utils/apiInstance";
import config from "../../app.constant";
import {
  Container,
  TextField,
  FormControl,
  FormControlLabel,
  Link,
  Chip,
  Grid,
  Checkbox,
  FormGroup,
  Button,
  Popover,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import TagCategoryDialog from "./TagCategoryDialog";
import router from "next/router";
import dynamic from "next/dynamic";
import NewBlogBtn from "./NewBlogBtn";
import EditBlogBtn from "./EditBlogBtn";
import SimpleBar from "simplebar-react";
import FileUploadProgress from "./FileUploadProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import btoa from "btoa";

// Imported FroalaEditor like this to fix ssr issue with editor
const FroalaEditor = dynamic(
  async () => {
    const values = await Promise.all([
      import("react-froala-wysiwyg"), // must be first import since we are doing values[0] in return
      import("froala-editor/js/plugins.pkgd.min.js"),
      import("froala-editor/js/plugins/link.min"),
      import("froala-editor/js/plugins/lists.min"),
      import("froala-editor/js/plugins/font_family.min"),
      import("froala-editor/js/plugins/font_size.min"),
      import("froala-editor/js/plugins/colors.min"),
      import("froala-editor/js/plugins/image.min"),
      import("froala-editor/js/plugins/image_manager.min"),
      import("froala-editor/js/plugins/paragraph_format.min"),
      import("froala-editor/js/plugins/paragraph_style.min"),
      import("froala-editor/js/plugins/align.min"),
    ]);
    return values[0];
  },
  {
    loading: () => <p>LOADING!!!</p>,
    ssr: false,
  }
);

export default function BlogContainer(props) {
  const { setLoader, setMsgData, blogId } = props;
  const [bannerImage, setBannerImage] = useState("");
  const [bannerImgName, setBannerImgName] = useState("");
  const [bannerImgErr, setBannerImgErr] = useState("");
  const [uploadImgName, setUploadImgName] = useState("");
  const [publish, setPublish] = useState("PUBLISH");
  const [category, setCategory] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [title, setTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaKeywordsArr, setMetaKeywordsArr] = useState([]);
  const [metaDescription, setMetaDescription] = useState("");
  const [seoUrl, setSeoUrl] = useState("");
  const [content, setContent] = useState("Add your content here...");
  const [authorName, setAuthorName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [getBlogId, setGetBlogId] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayErr, setDisplayErr] = useState(false);
  const [seoErr, setSeoErr] = useState("");
  const [blogSortOrder, setBlogSortOrder] = useState("");
  const [blogSortErr, setBlogSortErr] = useState("");
  const [buttonCaption, setButtonCaption] = useState("");
  const [publishCheck, setPublishCheck] = useState(false);
  const [publishInHomePage, setPublishInHomePage] = useState(false);
  const [dontPublishInHomePage, setDontPublishInHomePage] = useState(false);
  const [authTok, setAuthTok] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [presentationDate, setPresentationDate] = useState("mm/dd/yyyy");
  const [dateRange, setDateRange] = useState({});
  const [appDateRange, setAppDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSeoUrl = (e) => {
    const getSeoUrl = e.target.value;
    const expression =
      "((http|https)://)(www.)?" +
      "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
      "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    const regex = new RegExp(expression);
    setSeoUrl(getSeoUrl);

    if (getSeoUrl === "") {
      setSeoErr("Please provide the SEO URL");
    } else if (!regex.test(`http://${getSeoUrl}`)) {
      setSeoErr("Please enter the valid SEO URL");
    } else {
      setSeoErr("");
    }
  };

  useEffect(() => {
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };
    setAuthTok(JSON.parse(localStorage.getItem("token")));
    // Api to get all tags
    axios
      .get(`${config.API_URL}/api/cms/category`, headers)
      .then((res) => setCategoryList(res.data.data))
      .catch((err) =>
        setMsgData({
          message: "Unable to fetch category option",
          type: "error",
        })
      );

    // Api to get all categories
    axios
      .get(`${config.API_URL}/api/cms/tag`, headers)
      .then((res) => setTagList(res.data.data))
      .catch((err) =>
        setMsgData({
          message: "Unable to fetch tags option",
          type: "error",
        })
      );
  }, []);

  const handlePublishCheck = () => {
    console.log("publishCheck: ", publishCheck);
    setPublishCheck(!publishCheck);
  };

  useEffect(() => {
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };

    if (blogId !== "" && editDetails === "") {
      axios
        .get(`${config.API_URL}/api/cms/blog/${blogId}`, headers)
        .then((res) => {
          setEditDetails(res.data);
          // localStorage.setItem('blog-post', JSON.stringify(res.data));
        })
        .catch((err) => {
          setMsgData({
            message: "Error occured while getting blog details",
            type: "error",
          });
        });
    }

    if (editDetails !== "") {
      setTitle(editDetails.data.title);
      setAuthorName(editDetails.data.authorName);
      setSeoUrl(editDetails.data.seoUrl);
      setMetaDescription(editDetails.data.metaDescription);
      setMetaKeywords(editDetails.data.metaKeywords.toString());
      setMetaKeywordsArr(editDetails.data.metaKeywords);
      setCategory(editDetails.data.categories);
      setTags(editDetails.data.tags);
      setUploadImgName(editDetails.data.titleImageUrl);
      setBannerImage(editDetails.data.titleImageUrl);
      setBannerImgName(
        `${config.API_URL}/api/utility/download/${editDetails.data.titleImageUrl}`
      );
      setPublish("PUBLISH");
      const decodeContent = editDetails.data.content.includes("<p>")
        ? editDetails.data.content
        : atob(editDetails.data.content);
      setContent(decodeContent);
      setIsPublish(editDetails.data.isPublished);
      setBlogSortOrder(editDetails.data.sorting);
      setButtonCaption(editDetails.data.buttonCaption);
      setPublishInHomePage(editDetails.data.publishOnHomePage);
    }
  }, [blogId, editDetails]);

  // Functions to reset fields of the form
  const resetAllFields = () => {
    setTitle("");
    setMetaKeywords("");
    setMetaDescription("");
    setMetaKeywordsArr([]);
    setSeoUrl("");
    setContent("");
    setAuthorName("");
    setIsPublish("");
    setBlogSortOrder("");
    setButtonCaption("");
    setBannerImage("");
    setBannerImgName("");
    setCategory([]);
    setCategoryList([]);
    setTags([]);
    setTagList([]);
    setPublishInHomePage(false);
    setDontPublishInHomePage(false);
  };

  const fieldValidationVal = useMemo(() => {
    const urlExp =
      "((http|https)://)(www.)?" +
      "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
      "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    const regex = new RegExp(urlExp);

    return (
      title !== "" &&
      bannerImgName !== "" &&
      metaDescription !== "" &&
      seoUrl !== "" &&
      regex.test(`http://${seoUrl}`) &&
      authorName !== ""
    );
  }, [title, bannerImgName, metaDescription, authorName, seoUrl]);

  const uploadBannerImage = (e) => {
    e.preventDefault();
    let validationErr = "";
    const allowedFileSize = 5120;
    const allowedFileType = "jpg, jpeg, png, JPG, JPEG, PNG";
    const file = e.target.files[0];
    const getFileSize = file.size / 1024;
    console.log("getFileSize: ", getFileSize, " file.size: ", file.size);
    // Image validation
    let getImgExt = file.name.split(".")[1];

    if (allowedFileType.indexOf(getImgExt) < 0) {
      validationErr =
        "Only jpeg, jpg and png files are allowed for Banner Image";
      setBannerImgErr(validationErr);
      return;
    } else if (getFileSize > allowedFileSize) {
      validationErr =
        "Max file size exceeded. File size should be less than 5MB.";
      setBannerImgErr(validationErr);
      return;
    }

    e.target.value = null;
    setBannerImgErr("");
    setBannerImage(file);
    uploadImage(e, file);
  };

  const removeBannerImg = (e) => {
    e.preventDefault();
    setBannerImage("");
    setBannerImgName("");
  };

  const handlePreview = (e) => {
    e.preventDefault();
    saveDraft(e, "save-preview");
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (publishCheck === false) {
      return false;
    }
    // Return when validation gets failed
    // if (!fieldValidationVal || Boolean(blogSortErr)) {
    //   setDisplayErr(true);
    //   return;
    // }
    // setDisplayErr(false);

    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      headers: {
        authtoken: token,
        "Content-type": "application/json",
      },
    };

    const data = {
      title: title,
      metaKeywords: metaKeywordsArr,
      metaDescription: metaDescription,
      seoUrl: seoUrl,
      titleImageUrl: "lol.jpg", // bannerImage !== "" ? bannerImage : uploadImgName,
      content: btoa(content),
      categories: category,
      tags: tags,
      authorName: authorName,
      isPublished: true,
      publishOnHomePage: publishInHomePage,
      buttonCaption: buttonCaption,
      sorting: blogSortOrder,
      action: false,
    };

    if (blogId !== '') {
      data.blogId = blogId;
    }

    axios
      .post(`${config.API_URL}/api/cms/blog`, data, headers)
      .then((res) => {
        const data = res.data;
        // localStorage.setItem(`blog-post`, JSON.stringify(data));
        setMsgData({
          message: `${
            publish === "PUBLISH" ? "Published" : "Unpublished"
          } blog successfully!`,
        });

        if (blogId === '') {
          // Reset fields after Save Draft successfully
          resetAllFields();
        }

        setLoader(false);
        // pushNotification();
      })
      .catch((err) => {
        setLoader(false);

        if (!err.response) {
          console.log("Blog Publish Error", err.response);
          setMsgData({ message: err.response.data[0].message, type: "error" });
        } else {
          setMsgData({
            message: "Error occurred while publish blog",
            type: "error",
          });
        }
        setPublish("PUBLISH");
      });
  };

  const pushNotification = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      headers: {
        authtoken: token,
        "Content-type": "application/json",
      },
    };
    const user = JSON.parse(localStorage.getItem("userDetails"));
    const data = {
      userId: user.id,
      appointmentId: "6114ae06f487e8001b2d03e0",
      title: title,
      body: {
        title: title,
        token: token,
        messageType: "admin-text",
      },
    };
    axios
      .post(`${config.API_URL}/api/notification/push`, data, headers)
      .then((res) => {
        console.log("Push Notification", res);
      })
      .catch((err) => {
        console.log("Push Notification Error", err);
      });
  };

  const updateCategory = (e, categoryArr) => {
    e.preventDefault();
    setCategory(categoryArr);
  };

  const updateTags = (e, tagArr) => {
    e.preventDefault();
    setTags(tagArr);
  };

  const addNewMetaKeyword = (e) => {
    e.preventDefault();
    const metakeywords = e.target.value;
    const splitKeyword = metakeywords.split(",");
    const trimSpaces = splitKeyword.map((word) => word.replace(" ", ""));

    setMetaKeywords(e.target.value);
    setMetaKeywordsArr(trimSpaces);
  };

  const handleChange = (model) => {
    setContent(model);
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
        const data = response.data.data;
        setBannerImage(data.fileName);
        setBannerImgName(
          `${config.API_URL}/api/utility/download/${data.fileName}`
        );
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

  const saveDraft = (e, actionType = "") => {
    if (publishCheck === true) {
      console.log("dont save");
      return false;
    }
    // Return when validation gets failed
    if (!fieldValidationVal || Boolean(blogSortErr)) {
      console.log("validation failed!");
      setDisplayErr(true);
      return;
    }
    console.log("validation passed!");
    setDisplayErr(false);

    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      headers: {
        authtoken: token,
        "Content-type": "application/json",
      },
    };

    const data = {
      title: title,
      metaKeywords: metaKeywordsArr,
      metaDescription: metaDescription,
      seoUrl: seoUrl,
      titleImageUrl: bannerImage,
      content: btoa(content),
      categories: category,
      tags: tags,
      authorName: authorName,
      isPublished: false,
      publishOnHomePage: publishInHomePage,
      buttonCaption: buttonCaption,
      sorting: blogSortOrder,
      action: false,
    };

    if (blogId !== '') {
      data.blogId = blogId;
    }

    axios
      .post(`${config.API_URL}/api/cms/blog`, data, headers)
      .then((res) => {
        // localStorage.setItem('blog-post', JSON.stringify(res.data));
        // Reset fields after Save Draft successfully
        resetAllFields();
        setMsgData({
          message: "Saved Draft successfully!",
        });
        if (actionType === "save-preview") {
          setGetBlogId(res.data.data.blogId);
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setMsgData({
          message: "Error occured while saving Draft!",
          type: "error",
        });
      });
  };

  const saveChanges = (e, actionType = "") => {
    if (publishCheck === true) {
      return false;
    }
    // Return when validation gets failed
    if (!fieldValidationVal || Boolean(blogSortErr)) {
      setDisplayErr(true);
      return;
    }
    setDisplayErr(false);

    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      headers: {
        authtoken: token,
        "Content-type": "application/json",
      },
    };

    const data = {
      title: title,
      metaKeywords: metaKeywordsArr,
      metaDescription: metaDescription,
      seoUrl: seoUrl,
      titleImageUrl: bannerImage,
      content: btoa(content),
      categories: category,
      tags: tags,
      authorName: authorName,
      isPublished: isPublish,
      blogId: blogId,
      sorting: blogSortOrder,
      action: false,
    };

    axios
      .post(`${config.API_URL}/api/cms/blog`, data, headers)
      .then((res) => {
        console.log(res);
        setMsgData({
          message: "Saved changes successfully!",
        });
        if (actionType === "savePreview") {
          router.push(`/previewTemplate?blogId=${res.data.data.blogId}`);
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setMsgData({
          message: "Error occured while saving Draft!",
          type: "error",
        });
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActionType("");
  };

  useEffect(() => {
    // useEffect for Preview Functionality after
    // saving the data as draft and redirecting to preview template
    if (getBlogId !== "") {
      router.push(`/previewTemplate?blogId=${getBlogId}`);
    }
  }, [getBlogId]);

  const handleSortingChange = (e) => {
    const sortNum = e.target.value;
    setBlogSortErr("");
    const numberValidationRegex = new RegExp("^[0-9]+$");

    if (!numberValidationRegex.test(sortNum)) {
      // Accept only number here
      setBlogSortErr("Please enter only number");
    }
    setBlogSortOrder(sortNum);
  };

  const handlePublishHomePage = (e, label) => {
    e.preventDefault();
    setPublishCheck(!publishCheck);

    // If publish home page is selected then disable another and vice-versa
    if (label === "publishHomePage") {
      setPublishInHomePage(true);
      setDontPublishInHomePage(false);
    } else {
      setPublishInHomePage(false);
      setDontPublishInHomePage(true);
    }
  };

  // Popover open & id for calender
  const openCalendar = Boolean(anchorEl);
  const id = openCalendar ? "simple-popover" : undefined;

  // Function to close the calender popover and reset values
  const onClosePopOver = (e) => {
    e.preventDefault();

    setAnchorEl(null);
  };

  const onDateChange = (item) => {
    setAppDateRange([item.selection]);
    setDateRange([item.selection][0]);
    const appStartDate = moment([item.selection][0].startDate).format(
      "DD MMM, YYYY"
    );
    const appEndDate = moment([item.selection][0].endDate).format(
      "DD MMM, YYYY"
    );

    const cmsDateRange = `${appStartDate} - ${appEndDate}`;
    setPresentationDate(cmsDateRange);
  };

  // Functions related to calender handle events
  const handleCalenderEvent = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    // setStartDateFilter(true);
    // setStartSearch(false);
  };

  return (
    <>
      <TagCategoryDialog
        open={openDialog}
        actionType={actionType}
        handleCloseDialog={handleCloseDialog}
        setCategoryList={setCategoryList}
        setTagList={setTagList}
        setMsgData={setMsgData}
        setLoader={setLoader}
      />
      <Container fixed className="blog-main-container">
        <SimpleBar className="blog-form-scroll">
          <Container className="blog-details-container">
            <FormControl className="form-control-fields">
              <TextField
                error={displayErr && title === ""}
                id="title"
                label="Title*"
                className="post-type2"
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
                id="title"
                label="Meta Keywords"
                className="post-type2"
                variant="filled"
                value={metaKeywords}
                onChange={addNewMetaKeyword}
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                multiline
                rows={8}
                error={displayErr && metaDescription === ""}
                label="Meta Description*"
                className="post-type"
                variant="filled"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                helperText={
                  displayErr && metaDescription === ""
                    ? "Please enter Meta Description for the page"
                    : ""
                }
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                error={displayErr && (seoErr !== "" || seoUrl === "")}
                label="SEO URL*"
                className="post-type"
                variant="filled"
                value={seoUrl}
                onChange={handleSeoUrl}
                helperText={
                  displayErr && seoErr !== ""
                    ? seoErr
                    : displayErr && seoUrl === ""
                    ? "Please provide SEO URL"
                    : ""
                }
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                label="Button Caption"
                className="post-type"
                variant="filled"
                value={buttonCaption}
                onChange={(e) => setButtonCaption(e.target.value)}
              />
            </FormControl>

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
                  {!!(progress > 0 && progress < 100) ? (
                    <FileUploadProgress progress={progress} />
                  ) : (
                    <div>
                      <div>
                        <img src="/logo/upload_icon.svg" />
                      </div>
                      <strong className="banner-img-heading">
                        Drag and drop your Banner Image Here to Upload
                      </strong>
                      {/* <p className="banner-image-paragraph2">
                        Browse to select Image
                      </p> */}
                    </div>
                  )}
                  <Button
                    variant="outlined"
                    component="span"
                    onChange={uploadBannerImage}
                    style={{
                      border: "0.5px solid #707070",
                      backgroundColor: "#F1F1F1",
                      backgroundImage: "linear-gradient(#FFFFFF, #808080)",
                      textTransform: "capitalize",
                      // marginTop: "5px",
                      height: "25px",
                      color: "#636060",
                    }}
                  >
                    Or Select Files to Upload
                  </Button>
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

            <FormControl className="form-control-fields">
              <div style={{ paddingTop: 10 }}></div>
              <FroalaEditor
                tag="textarea"
                config={{
                  placeholderText: "Please enter the Content of the Blog!",
                  charCounterCount: false,
                  fontFamilySelection: true,
                  pluginsEnabled: [
                    "link",
                    "lists",
                    "fontFamily",
                    "fontSize",
                    "image",
                    "imageManager",
                    "paragraphStyle",
                    "paragraphFormat",
                  ],
                  // requestHeaders: {
                  //   authtoken: authTok
                  // },
                  // imageUploadURL: config.API_URL + "/api/utility/upload",
                  // imageUploadMethod: 'POST',
                  events: {
                    "image.beforeUpload": function (images) {
                      // Return false if you want to stop the image upload.
                      console.log("images: ", images[0]);
                      console.log("this: ", this);
                      let configs = {
                        headers: {
                          authtoken: JSON.parse(localStorage.getItem("token")),
                        },
                        transformRequest: function (obj) {
                          var formData = new FormData();
                          for (var prop in obj) {
                            formData.append(prop, obj[prop]);
                          }
                          return formData;
                        },
                      };

                      let imageData = {
                        file: images[0],
                      };
                      let data;
                      axiosInstance
                        .post(
                          config.API_URL + "/api/utility/upload",
                          imageData,
                          configs
                        )
                        .then((response) => {
                          console.log("response: ", response);
                          data = response.data.data;
                          this.image.insert(
                            config.API_URL +
                              "/api/utility/download/" +
                              response.data.data.fileName
                          );
                        })
                        .catch((error) => {
                          console.log("error: ", error);
                        });
                      return false;
                    },
                    "image.uploaded": function (response) {
                      console.log("response: ", response);
                    },
                    "image.inserted": function ($img, response) {
                      // Image was inserted in the editor.
                      console.log("$img: ", $img);
                      console.log("response: ", response);
                    },
                    "image.replaced": function ($img, response) {
                      // Image was replaced in the editor.
                    },
                    "image.error": function (error, response) {
                      console.log("error: ", error);
                    },
                  },
                }}
                model={content}
                onModelChange={handleChange}
              />
              {displayErr && content === "" ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "red",
                  }}
                >
                  Please add some content to add details about the page
                </p>
              ) : (
                ""
              )}
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                label="Sorting"
                error={blogSortErr !== ""}
                style={{ position: "relative", top: 10 }}
                className="post-type"
                variant="filled"
                value={blogSortOrder}
                onChange={handleSortingChange}
                helperText={blogSortErr !== "" ? blogSortErr : ""}
              />
            </FormControl>

            <FormControl className="form-control-fields">
              <TextField
                id="title"
                label="Author Name*"
                error={displayErr && authorName === ""}
                style={{ position: "relative", top: 10 }}
                className="post-type"
                variant="filled"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                helperText={
                  displayErr && authorName === ""
                    ? "Please enter the Author Name"
                    : ""
                }
              />
            </FormControl>
            <FormGroup row className="publishCheck">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={publishCheck}
                    onChange={(e) =>
                      handlePublishHomePage(e, "publishHomePage")
                    }
                    name="checkedA"
                  />
                }
                label="Publish on home page"
              />
              {/* handlePublishHomePage */}
              <FormControlLabel
                className="dontPublish"
                control={
                  <Checkbox
                    checked={!publishCheck}
                    onChange={(e) =>
                      handlePublishHomePage(e, "dontPublishHomePage")
                    }
                    name="checkedA"
                  />
                }
                label="Don't publish on home page"
              />
            </FormGroup>
            <div
              className="blog-button-groups"
              style={{
                display: "flex",
                flexDirection: "row",
                position: "relative",
                left: "20%",
              }}
            >
              {blogId !== "" ? (
                <EditBlogBtn
                  publish={publish}
                  saveChanges={saveChanges}
                  uploadImage={uploadImage}
                  handlePublish={handlePublish}
                  handlePreview={handlePreview}
                  publishCheck={publishCheck}
                />
              ) : (
                <NewBlogBtn
                  publish={publish}
                  saveDraft={saveDraft}
                  handlePublish={handlePublish}
                  handlePreview={handlePreview}
                  publishCheck={publishCheck}
                />
              )}
            </div>
          </Container>
        </SimpleBar>

        <Container className="category-tag-div">
          <Typography className="TypoCategory">Category</Typography>
          <Autocomplete
            multiple
            id="tags-filled"
            options={categoryList.map((option) => option.categoryName)}
            freeSolo
            value={category}
            onChange={updateCategory}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                id="title"
                variant="filled"
                label="Category"
              />
            )}
          />
          <div style={{ paddingBottom: 2, paddingTop: 2, marginTop: 5 }}></div>
          <Link
            className="add-category-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActionType("Category");
              setOpenDialog(true);
            }}
          >
            + Add Category
          </Link>

          <FormControl variant="filled" style={{ marginTop: 25 }}>
            <Typography className="TypoTags">Tags</Typography>
            <Autocomplete
              multiple
              id="tags-filled"
              options={tagList.map((option) => option.tagName)}
              freeSolo
              value={tags}
              onChange={updateTags}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Tag"
                  id="title"
                />
              )}
            />
            <div
              style={{ paddingBottom: 2, paddingTop: 2, marginTop: 5 }}
            ></div>
            <Link
              className="add-category-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActionType("Tag");
                setOpenDialog(true);
              }}
            >
              + Add Tag
            </Link>
          </FormControl>
          <FormControl className="form-control-fields">
            <TextField
              type="text"
              value={presentationDate}
              label="Date & Time:"
              // className="blog-calender-popover"
              style={{ float: "right" }}
              aria-describedby={id}
              variant="filled"
              color="primary"
              onClick={handleCalenderEvent}
              InputProps={{
                endAdornment: (
                  <img
                    src="/calender icon.svg"
                    alt="calendar-icon"
                    className="banner-calendar-icon"
                  />
                ),
              }}
            />
            <Popover
              id={id}
              open={openCalendar}
              anchorEl={anchorEl}
              onClose={onClosePopOver}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              className="dateRangeBlog"
            >
              <DateRangePicker
                onChange={onDateChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={appDateRange}
                direction="horizontal"
                showMonthAndYearPickers={false}
              />
            </Popover>
          </FormControl>
        </Container>
      </Container>
    </>
  );
}
