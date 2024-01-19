import React, { useState, useEffect } from "react";
import { createImageFromInitials } from "../../utils/nameDP";
import config from "../../app.constant";
import StarIcon from "@material-ui/icons/Star";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import educationnames from "../../data/educationName.json";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Specilizations from "./doctorProfile/specilizations";
import Education from "./doctorProfile/education";
import Experience from "./doctorProfile/experience";
import Awards from "./doctorProfile/awards";
import Video from "./doctorProfile/video";
import NewsArtical from "./doctorProfile/newsArtical";
import Testimonials from "./doctorProfile/testimonials";
import About from "./doctorProfile/about";
import SocialMedia from "./doctorProfile/socialMedia";
import Podcast from "./doctorProfile/podcast";

import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme) => ({}));
function Profile(props) {
  let doctorSelected = props.doctorSelected;
  const setMsgData = props.setMsgData;
  const [loader, setLoader] = useState(false);
  const [facebookId, setFacebookId] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [workshopLink, setWorkshopLink] = useState("");
  const [buttonCaption, setButtonCaption] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [articalFile, setArticalFile] = useState("");
  const [awardsImageArr, setAwardsImageArr] = useState([]);
  const [articalImageArr, setArticalImageArr] = useState([]);
  const [videoArr, setVideoArr] = useState([]);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [specilization, setSpecilization] = useState("");
  const [specializationList, setSpecializationList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [rating, setRating] = useState(3);
  const [tempRating, setTempRating] = useState(rating);
  const [showProfileData, setShowProfileData] = useState({
    name: "",
    specialization: "",
    experience: "",
    qualification: "",
    rating: "",
  });
  const [facebookError, setFacebookError] = useState("");
  const [linkedInError, setLinkedInError] = useState("");
  const [updateData, setUpdateData] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [allArticle, setAllArticle] = useState([]);
  const [doctorProfileId, setDoctorProfileId] = useState("");
  const [doctorFullName, setDoctorFullName] = useState("");
  const [profileImageName, setProfileImageName] = useState("");
  const [about, setAbout] = useState("");
  const [testimonialList, setTestimonialList] = useState([]);

  useEffect(() => {
    if (doctorSelected.id) {
      setProfileImageName(doctorSelected.profileImageName);
      setShowProfileData({
        name: doctorSelected.userFirstName + " " + doctorSelected.userLastName,
        specialization: doctorSelected.specialization,
        experience: doctorSelected.experinceInYears,
        qualification: doctorSelected.qualificationList,
        rating: rating,
      });
      setFName(doctorSelected.userFirstName);
      setSpecilization(doctorSelected.specialization);
      setExperience(doctorSelected.experinceInYears);
      setQualification(doctorSelected.qualificationList);

      let headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };
      setLoader(true);
      axios
        .get(
          config.API_URL +
            `/api/partner/doctorprofile/` +
            doctorSelected.uniqueId,
          {
            headers,
          }
        )
        .then((response) => {
          setLoader(false);
          // console.log("get-response: ", response);
          let data = response.data.data;
          if (data == "" || data == null) {
            setUpdateData(true);
            setDoctorFullName("");
            setProfileImageName("");
            setAwardsImageArr([]);
            setVideoArr([]);
            setAllVideos([]);
            setAllArticle([]);
            setFacebookId("");
            setLinkedinId("");
            setWorkshopLink("");
            setButtonCaption("");
            setSpecializationList([]);
            setQualificationList([]);
            setExperienceList([]);
            setArticalImageArr([]);
            setDoctorProfileId("");
            setAbout("");
            setTestimonialList([]);
            return false;
          } else {
            // console.log("get-data: ", data);
            setDoctorFullName(data.doctorFullName);
            setAllArticle([]);
            setAllVideos([]);
            setUpdateData(false);
            setProfileImageName(data.profileImageName);
            setAwardsImageArr(data.awardAndRecognitionImageUrlList);
            setFacebookId(data.facebookProfileUrl);
            setLinkedinId(data.linkedInProfileUrl);
            setWorkshopLink(data.podcastWorkshopUrl);
            setButtonCaption(data.podcastWorkshopButtonCaption);
            setSpecializationList(data.specializationList);
            setQualificationList(data.qualificationList);
            setExperienceList(data.experienceList);
            setDoctorProfileId(data.id);
            setAbout(data.about);
            setArticalImageArr(data.newArticleList);
            setTestimonialList(data.testimonials);
            setVideoArr(
              data.videoUrlList.length > 0
                ? data.videoUrlList
                : data.videoTagList.length > 0
                ? data.videoTagList
                : []
            );
          }
        })
        .catch((error) => {
          setLoader(false);
          // props.setMsgData({
          //   message: error.response.data.errors[0].message,
          //   type: "error",
          // });
        });
    }
  }, [doctorSelected]);

  const [checkLinked, setCheckLinked] = useState(false);
  const [checkFacebook, setCheckFacebook] = useState(false);

  const handleLinkedIn = (e) => {
    const getLinkedInUrl = e.target.value;
    const expression =
      "((http|https)://)(www.linkedin)?" +
      "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
      "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    const regex = new RegExp(expression);
    setLinkedinId(getLinkedInUrl);
    setCheckLinked(false);

    if (getLinkedInUrl === "") {
      setLinkedInError("Please provide the LinkedIn URL");
      setCheckLinked(true);
    } else if (!regex.test(`http://${getLinkedInUrl}`)) {
      setLinkedInError("Please enter the valid LinkedIn URL");
      setCheckLinked(true);
    } else {
      setLinkedInError("");
      setCheckLinked(false);
    }
  };

  const handleFacebook = (e) => {
    const getFacebookUrl = e.target.value;
    const expression =
      "((http|https)://)(www.facebook)?" +
      "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
      "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    const regex = new RegExp(expression);
    setFacebookId(getFacebookUrl);
    setCheckFacebook(false);
    if (getFacebookUrl === "") {
      setFacebookError("Please provide the Facebook URL");
      setCheckFacebook(true);
    } else if (!regex.test(`http://${getFacebookUrl}`)) {
      setFacebookError("Please enter the valid Facebook URL");
      setCheckFacebook(true);
    } else {
      setFacebookError("");
      setCheckFacebook(false);
    }
  };

  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  const changeProfile = (e) => {
    console.log("changeProfile:");
    const files = e.target.files[0];
    console.log("files: ", files);
    if (!files) {
      setProfilePic("");
      return;
    }

    fileToDataUri(files).then((dataUri) => {
      console.log("dataUri: ", dataUri);
      setProfilePic(dataUri);
    });
  };

  const submitData = () => {
    let obj = {
      doctorFullName: doctorFullName,
      profileImageName: profileImageName,
      // superSpeciality,
      id: doctorSelected.id,
      doctorFullName:
        doctorSelected.userFirstName + " " + doctorSelected.userLastName,
      rating: rating,
      experinceInYears: experience,
      about: about,
      specializationList: specializationList,
      qualificationList: qualificationList,
      experienceList: experienceList,
      awardAndRecognitionImageUrlList: awardsImageArr,
      // awardAndRecognitionsList: awardsImageArr,
      videoUrlList: videoArr,
      videoTagList: videoArr,
      newArticleList: articalImageArr,
      linkedInProfileUrl: linkedinId,
      facebookProfileUrl: facebookId,
      podcastWorkshopUrl: workshopLink,
      podcastWorkshopButtonCaption: buttonCaption,
      testimonials: testimonialList,
    };
    let updatedObj = {
      doctorProfileId: doctorProfileId,
      rating: rating,
      experienceList: experienceList,
      linkedInProfileUrl: linkedinId,
      facebookProfileUrl: facebookId,
      podcastWorkshopUrl: workshopLink,
      podcastWorkshopButtonCaption: buttonCaption,
      testimonials: testimonialList,
    };
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    // return false
    setLoader(true);
    if (checkLinked === false && checkFacebook === false) {
      if (doctorProfileId == "") {
        console.log("obj: ", obj);
        axios
          .post(config.API_URL + "/api/partner/doctorprofile", obj, {
            headers,
          })
          .then((response) => {
            setLoader(false);
            // console.log(response.data);
            // alert.show("Roster Updated", { type: "success" });
            setMsgData({
              message: "Doctor Profile Saved Successfully",
              type: "success",
            });
          })
          .catch((error) => {
            setLoader(false);
            // alert.show(error.response.data.errors[0].message, { type: "error" });
            setMsgData({
              message: error.response.data.errors[0].message,
              type: "error",
            });
          });
      } else {
        console.log("doctorProfileId: ", doctorProfileId);
        // obj.doctorProfileId = doctorProfileId;
        console.log("updatedObj : ", updatedObj);
        // return false;
        axios
          .put(config.API_URL + "/api/partner/doctorprofile", updatedObj, {
            headers,
          })
          .then((response) => {
            setLoader(false);
            // console.log(response.data);
            // alert.show("Roster Updated", { type: "success" });
            props.setMsgData({
              message: "Dcotor Profile Updated Successfully",
              type: "success",
            });
          })
          .catch((error) => {
            setLoader(false);
            // alert.show(error.response.data.errors[0].message, { type: "error" });
            // props.setMsgData({
            //   message: error.response.data.errors[0].message,
            //   type: "error",
            // });
          });
      }
    } else {
      setLoader(false);
      setMsgData({
        message: "Please Check Validations in Social Media section",
        type: "error",
      });
    }
  };

  return (
    <div className="docProfile">
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}

      <div className="profileImage">
        <div className="docImage">
          {profilePic === "" && (
            <img
              // src={
              //   `${config.API_URL}/api/utility/download/` +
              //   doct.profileImageName
              // }
              src={
                doctorSelected.profileImageName &&
                doctorSelected.profileImageName != "NA" &&
                doctorSelected.profileImageName != undefined
                  ? `${config.API_URL}/api/utility/download/` +
                    doctorSelected.profileImageName
                  : createImageFromInitials(
                      100,
                      `${
                        doctorSelected.userFirstName +
                        " " +
                        doctorSelected.userLastName
                      }`,
                      "#00888a"
                    )
              }
            />
          )}
          {profilePic != "" && <img src={profilePic} />}
        </div>
        <div className="docInfo">
          <div className="name">{showProfileData.name}</div>
          <div className="specialization">
            {showProfileData.specialization},{" "}
            {showProfileData.experience + " Years Exp."}
          </div>
          {showProfileData.qualification &&
            showProfileData.qualification.length > 0 &&
            showProfileData.qualification.map((item, index) => (
              <span className="qualification" key={index}>
                {item}
                <span>, </span>
              </span>
            ))}

          {/* <div className="rating">
            Rating {rating} - 
            <StarIcon />
          </div>
          <div className="editIcon" onClick={editProfile}>
            <EditIcon />
          </div> */}
        </div>
      </div>
      <div className="docDetails">
        <About
          about={about}
          setAbout={setAbout}
          setMsgData={setMsgData}
          doctorProfileId={doctorProfileId}
        />

        {specializationList && specializationList.length > 0 && (
          <Specilizations
            doctorProfileId={doctorProfileId}
            specializationList={specializationList}
            setSpecializationList={setSpecializationList}
            setMsgData={setMsgData}
          />
        )}

        {/* Education */}
        {qualificationList && qualificationList.length > 0 && (
          <Education
            doctorProfileId={doctorProfileId}
            qualificationList={qualificationList}
            setQualificationList={setQualificationList}
            setMsgData={setMsgData}
          />
        )}
        {/* Experience */}
        <Experience
          experienceList={experienceList}
          setExperienceList={setExperienceList}
          setMsgData={setMsgData}
        />

        {/* Awards and Recognitions  */}
        <Awards
          awardsImageArr={awardsImageArr}
          setAwardsImageArr={setAwardsImageArr}
          setMsgData={setMsgData}
          doctorProfileId={doctorProfileId}
        />

        {/* Testimonials */}
        <Testimonials
          testimonialList={testimonialList}
          setTestimonialList={setTestimonialList}
          setMsgData={setMsgData}
        />

        {/* Video */}
        <Video
          videoArr={videoArr}
          setVideoArr={setVideoArr}
          allVideos={allVideos}
          setAllVideos={setAllVideos}
          setMsgData={setMsgData}
          doctorProfileId={doctorProfileId}
        />

        {/* News and Artical */}
        <NewsArtical
          articalImageArr={articalImageArr}
          setArticalImageArr={setArticalImageArr}
          allArticle={allArticle}
          setAllArticle={setAllArticle}
          setMsgData={setMsgData}
          doctorProfileId={doctorProfileId}
        />

        {/* SocialMedia */}
        <SocialMedia
          facebookId={facebookId}
          facebookError={facebookError}
          linkedInError={linkedInError}
          handleFacebook={handleFacebook}
          handleLinkedIn={handleLinkedIn}
          linkedinId={linkedinId}
          setMsgData={setMsgData}
        />

        {/* Podcast */}
        <Podcast
          workshopLink={workshopLink}
          setWorkshopLink={setWorkshopLink}
          buttonCaption={buttonCaption}
          setButtonCaption={setButtonCaption}
          setMsgData={setMsgData}
        />

        <div className="action">
          <Button
            id="update-time-slot"
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button forward"
            // type="submit"
            onClick={submitData}
            style={{
              float: "right",
              margin: "20px 15px",
              borderRadius: "40px",
              width: "120px",
            }}
          >
            {updateData ? "SAVE" : "UPDATE"}
          </Button>
        </div>
      </div>

      {/* <Dialog
        open={openUpdateProfile}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update Profile</DialogTitle>
        <DialogContent>
          <div className="fullDiv">
            <span style={{margin:"10px", float:"left"}}>Rating: </span> 
            <div style={{margin:"6px 0", float:"left"}}>
            <Rating name="half-rating" defaultValue={2.5} value={tempRating} precision={0.5}  onChange={(event, newValue) => {
            setTempRating(newValue);
          }}/>
            </div>
          </div>
       
        </DialogContent>
        <DialogActions>
         
          <Button onClick={closeUpdateProfile} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateProfileSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* <Dialog
        open={openUpdateExp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="uploadSec"
      >
        <DialogTitle id="alert-dialog-title">Update Experience</DialogTitle>
        <DialogContent>
          <div className="fullDiv">

          </div>
       
        </DialogContent>
        <DialogActions>
         
          <Button onClick={closeUpdateExp} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={updateExpSubmit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}

export default Profile;
