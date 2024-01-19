import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import router from "next/router";

const useStyles = makeStyles((theme) => ({
  specialityTypo: {
    color: "#818080",
    fontSize: "12px",
    textTransform: "capitalize",
    marginLeft: "15px",
    width: "350px",
  },
  noRecords: {
    textAlign: "center",
    fontSize: "40px",
    color: "#797979",
    marginTop: "20%",
    fontFamily: "Avenir_black !important",
  },
}));
import config from "../../app.constant";

export default function DoctorList(props) {
  const { doctList, docSelect, setView} = props;
  const classes = useStyles();
  const [selectListCard, setSelectListCard] = useState(0);

  const list = [
    {
      name: "Dr. Priti Chopra",
      speciality: "Pediatrician",
      quilification: "MD, MBBS, 12 yrs",
      location: "Madhukar Rainbow Children Hospital & Birth Right, Delhi",
      timing: "Available Today",
      img: "PritiChopra.png",
    },
    {
      name: "Dr. Naresh Chopra",
      speciality: "Pediatrician",
      quilification: "MD, MBBS, 12 yrs",
      location: "Madhukar Rainbow Children Hospital & Birth Right, Delhi",
      timing: "Available Today",
      img: "Doctor2.png",
    },
    {
      name: "Dr. Suman Chopra ",
      speciality: "Pediatrician",
      quilification: "MD, MBBS, 12 yrs",
      location: "Madhukar Rainbow Children Hospital & Birth Right, Delhi",
      timing: "Available Today",
      img: "Doctor3.png",
    },
  ];
  const [doctorList, setDoctorList] = useState(list);
  console.log("=====>doctList12: ", doctList);

  const bookSlotBtnPhysical = (id) => {
    console.log("======>idDocList", id)
    docSelect(id, "physical");
    
    // setView("4");
    // router.push("/bookslot?id=" + id);
  };

  const bookSlotBtnVideo = (id) => {
    docSelect(id, "video");
    // setView("4");
    // router.push("/bookslot");
  };

  const getDoctorList2 = () => {
    console.log("======>getDoctorList2", doctList);
    return doctList.map((ele, i) => {
      console.log("======>ele", ele, ele.sessionDefinitionUID)
      return (
        <>
          <Card className="doctorlistCard">
            <CardContent>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  float: "left",
                }}
              >
                <img
                  src={`${
                    config.API_URL +
                    "/api/utility/download/" +
                    ele.careProviderImageUrl
                  }`}
                  style={{
                    width: "120px",
                    height: "120px",
                    alignItems: "center",
                    marginBottom: "15px",
                    float: "left",
                  }}
                />
                <div
                  style={{
                    float: "left",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: "bold",
                      paddingBottom: "10px",
                      textTransform: "capitalize",
                      fontSize: "20px",
                      fontFamily: "Avenir_heavy !important",
                      marginLeft: "15px",
                      color: "#424242",
                      marginBottom: "-10px",
                    }}
                  >
                    {`${ele.careProviderName}`}
                  </Typography>
                  <Typography className={classes.specialityTypo}>
                    {`${ele.speciality},  ${ele.careProviderQualification},  ${ele.experience} yrs `}
                  </Typography>
                  <Typography
                    style={{
                      color: "#555555",
                      fontSize: "13px",
                      textTransform: "capitalize",
                      marginLeft: "15px",
                      wordBreak: "break-word",
                      width: "350px",
                      // width: "calc(100% - 110px)",
                      display: "flex",
                      marginTop: "5px",
                    }}
                  >
                    <img
                      src="/location_logo.svg"
                      style={{
                        color: "green",
                        width: "20px",
                        height: "20px",
                        marginTop: "5px",
                        marginRight: "7px",
                      }}
                    />
                    {ele.hospitalUnit}
                  </Typography>
                  <Typography
                    style={{
                      color: "#555555",
                      fontSize: "13px",
                      textTransform: "capitalize",
                      marginLeft: "15px",
                      marginTop: "5px",
                      display: "inline-flex",
                    }}
                  >
                    <img
                      src="/clock_icon.svg"
                      style={{
                        color: "green",
                        width: "20px",
                        height: "20px",
                        marginRight: "7px",
                      }}
                    />
                    Available Today
                    {/* {ele.avaiability} */}
                  </Typography>
                </div>
                <div style={{ marginTop: "20px", display: "inline-flex" }}>
                  <div
                    className="btnDiv"
                    onClick={() =>
                      bookSlotBtnPhysical(ele.sessionDefinitionUID)
                    }
                  >
                    Physical Consultation
                  </div>
                </div>
                <div style={{ marginTop: "10px", display: "inline-flex" }}>
                  <div
                    className="btnDiv"
                    onClick={() => bookSlotBtnVideo(ele.sessionDefinitionUID)}
                  >
                    Video Consultation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    });
  };
  const emptyList = () => {
    return <div className={classes.noRecords}>No Record Found</div>;
  };
  return (
    <>
      {doctList && doctList.length > 0 && getDoctorList2()}
      {doctList && doctList.length < 1 && emptyList()}
    </>
  );
}
