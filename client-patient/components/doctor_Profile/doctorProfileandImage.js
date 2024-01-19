import React, { useState, useEffect } from "react";
import { makeStyles, Button } from "@material-ui/core";
import router from "next/router";
import DoctorOtherInformation from "./DoctorOtherInformation";
import Textimonials from "./Textimonials";
import DoctorVideos from "./DoctorVideos";
import Articles from "./Articles";
import DoctorProfileImgCard from "./DoctorProfileImgCard";
import About from "./About";
import HeadBreadcrumbs from "../common/headBreadcrumbs";
import { useCookies } from "react-cookie";
import config from "../../app.constant";
import axios from "axios";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    padding: "10px 0",
    position: "relative",
    marginLeft: "60px",
    marginRight: "15px",
  },
}));
function DoctorProfileandImage(props) {
  const router2 = useRouter();
  const { id } = router2.query;
  console.log("======>id", id);
  const classes = useStyles();
  const [doctorSelected, setDoctorSelected] = useState({});
  const [cookies, setCookie] = useCookies([id]);
  const [facebookId, setFacebookId] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [workshopLink, setWorkshopLink] = useState("");
  const [buttonCaption, setButtonCaption] = useState("");
  const [doctorProfileId, setDoctorProfileId] = useState("");
  const [doctorFullName, setDoctorFullName] = useState("");
  const [profileImageName, setProfileImageName] = useState("");
  const [about, setAbout] = useState("");
  const [testimonialList, setTestimonialList] = useState([]);
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
  const [showProfileData, setShowProfileData] = useState({});

  const bookAppointment = () => {
    router.push("/bookslot");
  };
  const goBack = () => {
    router.push("/doctorresult");
  };
  const headers = {
    authtoken: cookies["cookieVal"],
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(config.API_URL + "/api/partner/doctorprofile/" + id, {
        headers,
      })
      .then((response) => {
        setShowProfileData(response.data.data);
        console.log("======>response", response.data);
        if (!response.data) {
          console.log("======>ifRuning", response);
          setDoctorFullName("");
          setProfileImageName("");
          setAwardsImageArr([]);
          setVideoArr([]);
          setFacebookId("");
          setLinkedinId("");
          setWorkshopLink("");
          setButtonCaption("");
          setSpecializationList([]);
          setQualificationList([]);
          setExperienceList([]);
          setDoctorProfileId("");
          setAbout("");
          setTestimonialList("");
          return false;
        } else {
          console.log("get-data: ", response.data);
          setDoctorFullName(response.data.doctorFullName);
          setProfileImageName(response.data.profileImageName);
          setAwardsImageArr(response.data.awardAndRecognitionImageUrlList);
          setFacebookId(response.data.facebookProfileUrl);
          setLinkedinId(response.data.linkedInProfileUrl);
          setWorkshopLink(response.data.podcastWorkshopUrl);
          setButtonCaption(response.data.podcastWorkshopButtonCaption);
          setSpecializationList(response.data.specializationList);
          setQualificationList(response.data.qualificationList);
          setExperienceList(response.data.experienceList);
          setDoctorProfileId(response.data.id);
          setAbout(response.data.about);
          setTestimonialList(response.data.testimonials);
          setVideoArr(response.data.videoUrlList);
          console.log("======>videoUrlList", response.data.videoUrlList);
        }
      })
      .catch((err) => {
        console.log("========>err", err);
      });
  }, [id]);

  return (
    <>
      <HeadBreadcrumbs
        titleArr={[
          "Home",
          "Book Appointment",
          "Consultation Services",
          "Select Doctor",
          "Select Slot",
        ]}
        lastTitle={"View Profile"}
        mainTitle={"Doctor Profile"}
      />
      <div className={classes.root}>
        <DoctorProfileImgCard showProfileData={showProfileData} />
        <About showProfileData={showProfileData} />
        <hr />
        <DoctorOtherInformation showProfileData={showProfileData} />
        <hr />
        <Textimonials showProfileData={showProfileData} />
        <hr />
        <DoctorVideos showProfileData={showProfileData} />
        <hr />
        <Articles showProfileData={showProfileData} />
        <div
          style={{
            justifyContent: "end",
            display: "flex",
            marginTop: "25px",
          }}
        >
          <Button
            variant="contained"
            style={{
              border: "1px solid #502E92",
              background: "none",
              boxShadow: "none",
              width: "130px",
              height: "40px",
              color: "#502E92",
              marginRight: "35px",
              textTransform: "capitalize",
            }}
            onClick={goBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            style={{
              border: "1px solid #502E92",
              background: "none",
              boxShadow: "none",
              width: "210px",
              height: "40px",
              color: "#502E92",
              marginRight: "35px",
              textTransform: "capitalize",
            }}
            onClick={bookAppointment}
          >
            Book Appointment
          </Button>
        </div>
        <br />
        <br />
      </div>
    </>
  );
}

export default DoctorProfileandImage;
