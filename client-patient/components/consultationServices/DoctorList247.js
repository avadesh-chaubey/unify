import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";

export default function DoctorList(props) {
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

  const handleCardClick = (i) => {
    setSelectListCard(i);
  };

  const getDoctorList = () => {
    return doctorList.map((ele, i) => {
      return (
        <>
          <Card
            className={
              selectListCard == i
                ? "doctorlistCardActive247"
                : "doctorlistCard247"
            }
            onClick={() => handleCardClick(i)}
          >
            <CardActionArea>
              <CardContent>
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    float: "left",
                  }}
                >
                  <img
                    src={ele.img}
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
                        marginLeft: "15px",
                        color: "#424242",
                        marginBottom: "-10px",
                      }}
                    >
                      {ele.name}
                    </Typography>
                    <Typography
                      style={{
                        color: "#818080",
                        fontSize: "12px",
                        textTransform: "capitalize",
                        marginLeft: "15px",
                      }}
                    >
                      {ele.speciality} &nbsp;&nbsp; {ele.quilification}
                    </Typography>
                    <Typography
                      style={{
                        color: "#555555",
                        fontSize: "13px",
                        textTransform: "capitalize",
                        marginLeft: "15px",
                        wordBreak: "break-word",
                        width: "calc(100% - 110px)",
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
                      {ele.location}
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
                      {ele.timing}
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginTop: "46px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div className="btnDiv">Video Consultation</div>
                  </div>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        </>
      );
    });
  };
  return <>{doctorList && getDoctorList()}</>;
}
