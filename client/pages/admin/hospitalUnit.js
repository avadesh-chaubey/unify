import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import config from "../../app.constant";
import Head from "next/head";
import Header from "../../components/header/header";
import { CircularProgress, Grid } from "@material-ui/core";
import Sidenavbar from "../../components/dashboard/Sidenavbar";
import MessagePrompt from "../../components/messagePrompt";
import AddNewUnitBar from "../../components/hospitalUnits/addNewUnitBar";
import HospitalUnitList from "../../components/hospitalUnits/hospitalUnitList";
import HospitalUnitDetails from "../../components/hospitalUnits/hospitalUnitDetails";

export default function hospitalUnit() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});
  const [unitList, setUnitList] = useState("");
  const [originalUnitList, setOriginalUnitList] = useState("");
  const [selectedCard, setSelectedCard] = useState(0);
  const [getSelectedUnitDetails, setSelectedUnitDetails] = useState(0);
  const [unitCities, setUnitCities] = useState([]);
  const TITLE = "Unify Care - Hospital Units";

  useEffect(() => {
    getAllUnits();
  }, []);

  const getAllUnits = () => {
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    axios
      .get(`${config.API_URL}/api/partner/allpartner`, { headers })
      .then((res) => {
        const city = [];
        const listOfUnit = res.data.data;
        listOfUnit.map((units) => {
          city.push(units.city);
        });
        const allCities = city.reduce(function (a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);
        setUnitCities(allCities);
        setUnitList(listOfUnit);
        setOriginalUnitList(listOfUnit);
        setSelectedUnitDetails(listOfUnit[getSelectedUnitDetails]);
      })
      .catch((err) => {
        if (
          err.response !== undefined &&
          err.response.data.errors[0].message === "No Partner found"
        ) {
          setMsgData({
            message: "No Added Hospital Units",
            type: "error",
          });
        } else {
          setMsgData({
            message: "Error occured while fetching hospital units",
            type: "error",
          });
        }
      });
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <Head>
        <title>{TITLE}</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <Sidenavbar />
      <div className="right-area">
        <MessagePrompt msgData={msgData} />
        <Header name="Hospital Units" />
        <AddNewUnitBar
          router={router}
          unitList={unitList}
          unitCities={unitCities}
          setUnitList={setUnitList}
          setSelectedCard={setSelectedCard}
          setSelectedUnitDetails={setSelectedUnitDetails}
          setLoader={setLoader}
          setMsgData={setMsgData}
          originalUnitList={originalUnitList}
          getSelectedUnitDetails={getSelectedUnitDetails}
          setOriginalUnitList={setOriginalUnitList}
        />
        <div className="hospital-unit-body">
          <Grid
            container
            direction="row"
            justifycontent="space-evenly"
            alignItems="flex-start"
          >
            <Grid item xs={4}>
              <HospitalUnitList
                unitList={unitList}
                selectedCard={selectedCard}
                setLoader={setLoader}
                setSelectedCard={setSelectedCard}
                setSelectedUnitDetails={setSelectedUnitDetails}
              />
            </Grid>
            <Grid item xs={8}>
              <HospitalUnitDetails
                getSelectedUnitDetails={getSelectedUnitDetails}
                setMsgData={setMsgData}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}
