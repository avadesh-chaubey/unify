import { Typography, Card, Grid, CardContent } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { PastAppointmentStyle } from "./PastAppointmentStyle";
const useStyles = makeStyles((theme) => PastAppointmentStyle);

export default function pastApptList(props) {
  const classes = useStyles();
  const router = useRouter();
  const { pastAppointment } = props;
  const reportUploadHandler = () => {
    router.push("/view-report");
  };
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
      img: "Aryapic.png",
      callstart: "4 days left in your appointment",
      buttion1: "Follow-up Appointment",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "physical_icon.svg",
      videoText: "Physical",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      img: "Aryapic.png",
      //   callstart: "Please reach 5 mins before",
      buttion1: "Book Again",
    },
    {
      name: "Arya Sharma, 3M",
      relation: "Relation Son",
      videoimg: "physical_icon.svg",
      videoText: "Physical",
      doctorName: "Dr. Priti Chopra",
      speciality: "(Pediatrician)",
      quilification: "MD, MBBS, 12 yrs",
      timing: "26 Sep 2021, 9:30 AM",
      img: "Aryapic.png",
      //   callstart: "Please reach 5 mins before",
      buttion1: "Book Again",
    },
  ];
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
            {/* {ele.relationShip} */} Son
          </Typography>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="physical_icon.svg"
              style={{
                width: "25px",
                height: "25px",
                opacity: "1",
              }}
            />
            <Typography
              style={{ marginLeft: "5px", color: "#595757", fontSize: "12px" }}
            >
              Physical
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
            marginTop: "50px",
          }}
        >
          <div className={classes.btnDiv}>Follow-up Appointment</div>
        </div>
        <Typography
          style={{
            fontSize: "10px",
            marginTop: "15px",
            textAlign: "center",
            marginRight: "25px",
            color: "#555555",
          }}
        >
          4 days left in your Appointment
        </Typography>
      </>
    );
  };

  return (
    <>
      <Grid container justifyContent="center">
        {pastAppointment &&
          pastAppointment.map((ele, i) => {
            return (
              <Grid
                item
                xs={11}
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
                        <img
                          src="Aryapic.png"
                          style={{
                            width: "120px",
                            alignItems: "center",
                            float: "left",
                          }}
                        />
                        <div
                          style={{
                            float: "left",
                            textAlign: "left",
                            position: "relative",
                            width: "450px",
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
                            }}
                          >
                            {/* ({ele.careproviderSpeciality}) */}(OBSTETRICS
                            AND GYNAECOLOGY)
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
                            {/* {ele.experience}&nbsp;Years */}10 Years
                          </Typography>
                          <Typography
                            style={{
                              display: "flex",
                              fontSize: "12px",
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
                                marginLeft: "40px",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                              }}
                            />
                            <Typography
                              style={{
                                fontSize: "12px",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={reportUploadHandler}
                            >
                              Upload Doc
                            </Typography>
                          </Typography>
                        </div>
                      </div>
                      <div>{actionBtn(ele)}</div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
