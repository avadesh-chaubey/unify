import { Typography, Card, Grid, CardContent } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { styleobj } from "../HomeScreen/HomeScreenStyle";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import config from "../../../../app.constant";
import axios from "axios";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => styleobj);

export default function UpcomingApptCard(props) {
  const classes = useStyles();
  const router = useRouter();
  const [upComingAptList, setUpComingAptList] = useState([]);

  const getFormateDate = (value) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let newdate = new Date(value);
    // newdate.setDate(newdate.getDate() + value);
    const dd = newdate.getDate();
    const mm = monthNames[newdate.getMonth()];
    const y = newdate.getFullYear();
    const formattedDate = dd + " " + mm + " " + y;
    console.log("======>time", hh);
    const hh = newdate.getHours();
    const min = newdate.getMinutes();
    const time = getTime(hh, min);
    return formattedDate + ", " + time;
  };

  const getTime = (hh, mm) => {
    let z = hh < 12 ? "AM" : "PM";
    let h = hh > 12 ? hh - 12 : hh;
    let hours = h < 10 ? "0" + h : h;
    let min = mm == 0 ? "00" : mm;
    return hours + ":" + min + " " + z;
  };

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
  const appointmentList = [
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "video_icon.svg",
      videoText: "Video",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      callstart: "Call will start 5 mins before",
      buttion1: "Reschedule",
      buttion2: "Join Call",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "video_icon.svg",
      videoText: "Video",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      callstart: "Call will start 5 mins before",
      buttion1: "Reschedule",
      buttion2: "Join Call",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "video_icon.svg",
      videoText: "Video",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      callstart: "Call will start 5 mins before",
      buttion1: "Reschedule ",
      buttion2: "Join Call",
    },
  ];
  const userDetail = (ele) => {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <Typography className={classes.nameTypo}>
            {ele.patientName}
            {","}&nbsp;3M
          </Typography>
          <Typography
            style={{
              color: "#818080",
              fontSize: "11px",
              textTransform: "capitalize",
              marginLeft: "15px",
              marginTop: "-15px",
            }}
          >
            Relation&nbsp;
            {ele.relationShip}
          </Typography>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="video_icon.svg"
              style={{
                width: "25px",
                height: "25px",
                opacity: "1",
                // marginLeft: "10px",
              }}
            />
            <Typography
              style={{
                marginLeft: "5px",
                color: "#595757",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Video
            </Typography>
          </div>
        </div>
      </div>
    );
  };
  const actionBtn = (ele) => {
    return (
      <>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <div className={classes.btnDiv} onClick={onRescheduleClick}>
            Reschedule
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <div className={classes.btnDiv} onClick={onJoinCallClick}>
            Join Call
          </div>
          {/* <Typography
            style={{
              fontSize: "10px",
              marginTop: "15px",
              textAlign: "center",
              marginRight: "25px",
              color: "#555555",
            }}
          >
            Call will start 5 mins before
          </Typography> */}
        </div>
      </>
    );
  };
  const [cookies, setCookie] = useCookies(["name"]);

  const headers = {
    authtoken: cookies["cookieVal"],
  };
  useEffect(() => {
    axios
      .get(config.API_URL + "/api/partner/searchdoctor", { headers })
      .then((res) => {
        console.log("res searchdoctor: ", res);
      })
      .catch((err) => {
        console.log("err searchdoctor", err);
      });
  }, []);
  const onRescheduleClick = () => {
    console.log("onRescheduleClick");
    router.push("/bookslot");
  };
  const onJoinCallClick = () => {
    console.log("onJoinCallClick");
    router.push("/pastApmt/waitingScreen");
  };
  const reportUploadHandler = () => {
    router.push("/view-report");
  };
  return (
    <>
      <Grid container justifyContent="center">
        {upComingAptList &&
          upComingAptList.map((ele, i) => {
            return (
              <Grid
                item
                xs={3}
                style={{ marginTop: "10px", marginLeft: "20px" }}
              >
                <Card
                  style={{
                    backgroundColor: "#F8F6F6",
                    boxShadow: "none",
                    marginTop: "10px",
                  }}
                >
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            float: "left",
                            textAlign: "left",
                            position: "relative",
                            width: "280px",
                          }}
                        >
                          {userDetail(ele)}

                          <Typography className={classes.nameDoctor}>
                            {ele.careproviderName}
                          </Typography>
                          <Typography
                            style={{
                              color: "#818080",
                              fontSize: "11px",
                              textTransform: "capitalize",
                              display: "inline",
                              marginTop: "5px",
                              whiteSpace: "nowrap",
                              marginLeft: "15px",
                            }}
                          >
                            ({ele.careproviderSpeciality})
                          </Typography>
                          <Typography
                            style={{
                              color: "#818080",
                              fontSize: "11px",
                              textTransform: "capitalize",
                              marginLeft: "15px",
                              marginTop: "5px",
                            }}
                          >
                            {ele.careproviderQualification}
                            {","}&nbsp;
                            {ele.experience}&nbsp;Years
                          </Typography>
                          <Typography
                            style={{
                              display: "flex",
                              fontSize: "11px",
                              alignItems: "center",
                              color: "#818080",
                              marginTop: "5px",
                            }}
                          >
                            <img
                              src="/clock_icon.svg"
                              style={{
                                marginRight: "7px",
                                width: "25px",
                                marginLeft: "7px",
                              }}
                            />
                            {getFormateDate(ele.slotStartDttm)}
                            <img
                              src="/upload_icon.svg"
                              style={{
                                marginLeft: "20px",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                            <Typography
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                                cursor: "pointer",
                                color: "#502E92",
                              }}
                              onClick={reportUploadHandler}
                            >
                              Upload Doc
                            </Typography>
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>{actionBtn(ele)}</div>
                    <Typography
                      style={{
                        fontSize: "10px",
                        marginTop: "5px",
                        textAlign: "center",
                        color: "#555555",
                        marginLeft: "150px",
                      }}
                    >
                      Call will start 5 mins before
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
