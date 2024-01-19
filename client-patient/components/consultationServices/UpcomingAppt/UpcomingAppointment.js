import React, { useState, useEffect } from "react";
import HeadBreadcrumbs from "../../common/headBreadcrumbs";
// import UpcomingApptList from "./UpcomingApptList";
import UpcomingApptList from "./UpcomingApptList";
import { useCookies } from "react-cookie";
import config from "../../../app.constant";
import axios from "axios";
import upcomingApptList from "./UpcomingApptList";
import VideoCallUi from "../../appointmentetails/videoCallUiNew";
import ChatSection from "../../appointmentetails/chatSection";

export default function UpcomingAppointment(props) {
  const {firebase} = props;
  const [upComingAptList, setUpComingAptList] = useState([]);
  const [cookies, setCookie] = useCookies(["name"]);
  const [showVid, setShowVid] = useState("no");
	const [showChat, setShowChat] = useState(false);
  const [appointment, setAppointment] = useState({});
  const getData = async () => {
    try {
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: cookie,
      };
      const url =
        config.API_URL +
        "/api/patient/v1/opd/upcomingappointments?PatientUID=2077930&date=2021-12-01";
      const response = await axios.get(url, { headers });
      setUpComingAptList(response.data.data);
      console.log("======response", response.data.data);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {/* <HeadBreadcrumbs
        title1={"Consults"}
        title2={""}
        title3={"Upcoming Appointment"}
        mainTitle={"Upcoming Appointment"}
      /> */}
      
      {showVid === "no" && <div>
        <HeadBreadcrumbs
          titleArr={["Consults"]}
          lastTitle={"Upcoming Appointments"}
          mainTitle={"Upcoming Appointments"}
        />
        <UpcomingApptList upComingAptList={upComingAptList} setShowVid = {setShowVid} setAppointment = {setAppointment}/>
      </div>}
      {showVid === "yes" && 
        <div>
          <HeadBreadcrumbs
            titleArr={["Consults", "Past Appointments", "Upcoming Appointments","Waiting Scren"]}
            lastTitle={"Video Call"}
            mainTitle={"Video Call"}
          />
          <div style={showChat === true? {width:"70%", float:"left"}:{width:"100%", float:"left"}}>
            <VideoCallUi setShowVid = {setShowVid} showChat = {showChat} setShowChat = {setShowChat} />
          </div>
          <div style={showChat === true ?{float:"left", width:"28%"}:{display:"none"}}>
            <ChatSection firebase = {firebase} appointmentObj = {appointment}/>
          </div>
        </div>
      }

      <br />
      <br />
    </>
  );
}
