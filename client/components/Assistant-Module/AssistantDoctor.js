import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Grid,
} from "@material-ui/core";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { useCookies } from "react-cookie";
import fetchAssistantDoctorList from "../Assistant-Module/fetch/AssistantDataHandler";
import AsstPrescriptionDetails from "./AsstPrescriptionDetails";
import fetchPrescriptionData from "./fetch/PrescriptionDataHandler";
import { assistantModuleStyle } from "./AssistantModuleStyle";
const useStyles = makeStyles((theme) => assistantModuleStyle);

export default function AssistantDoctor(props) {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [cookies, setCookie] = useCookies(["name"]);
  const [assistantList, setAssistantList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedCardData, setSelectedCardData] = useState(0);
  console.log("=====>selectedDoctor", selectedDoctor);
  const handleCardClick = (uniqueId, i) => {
    const PrescriptionListData = fetchPrescriptionData(uniqueId);
    const doctorDetails = assistantList.find((ele) => {
      return ele.uniqueId == uniqueId;
    });
    setSelectedCard(PrescriptionListData);
    setSelectedCardData(i);
    setSelectedDoctor(doctorDetails);
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
      const response = fetchAssistantDoctorList();
      setAssistantList(response.data);
      setSelectedDoctor(response.data[0]);
      console.log("=====>fetchAssistantDoctorList", response.data);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Grid container>
        <Grid item xs={4}>
          <div>
            {assistantList.map((doct, i) => (
              <Card
                className={
                  selectedCardData == i
                    ? classes.mainViewCardActive
                    : classes.mainViewCard
                }
                onClick={() => handleCardClick(doct.uniqueId, i)}
              >
                <CardActionArea style={{ height: "100%" }}>
                  <CardContent>
                    <div className={classes.cardContantDiv}>
                      <span style={{ fontWeight: "bold" }}>
                        {doct.userFirstName + " " + doct.userLastName}
                      </span>
                      <span className={classes.doctorSpecialization}>
                        {doct.specialization}
                      </span>
                    </div>
                    <div className={classes.timeIconDiv}>
                      <DateRangeIcon className={classes.timeIcon} />
                      {doct.appointmentDate}
                    </div>
                    <div className={classes.dateIconDiv}>
                      <WatchLaterIcon className={classes.dateIcon} />
                      {doct.showOnboardingTime}
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        </Grid>
        <Grid item xs={8} style={{ marginTop: "15px" }}>
          <AsstPrescriptionDetails
            PrescriptionListData={selectedCard}
            doctorDetails={selectedDoctor}
          />
        </Grid>
      </Grid>
    </>
  );
}
