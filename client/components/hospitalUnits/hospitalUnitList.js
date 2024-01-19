import React, { useState, useEffect } from "react";
import { Tooltip, Card, CardActionArea, CardContent } from "@material-ui/core";
import { getHexColor } from "../../utils/nameDP";

export default function HospitalUnitList(props) {
  const {
    unitList,
    selectedCard,
    setSelectedCard,
    setSelectedUnitDetails,
    setLoader,
  } = props;

  const handleUnitChange = (e, selectedIndex) => {
    e.preventDefault();
    setLoader(true);
    setSelectedCard(selectedIndex);
    const filterSelectedUnit = unitList.filter(
      (data, index) => index === selectedIndex
    );
    setSelectedUnitDetails(filterSelectedUnit[0]);
    setTimeout(() => setLoader(false), 500);
  };

  return (
    <div className="mainView">
      {unitList.length ? (
        <div className="hospital-list doctor-list-scroll centre-unit-list">
          {unitList.map((doct, i) => (
            <Card
              id={`doc-list-${doct.id}`}
              className={`doctorcard centre-unit-card ${
                i === selectedCard ? "activeCard" : ""
              }`}
              key={i}
            >
              <CardActionArea
                onClick={(e) => handleUnitChange(e, i)}
                style={{ height: "100%" }}
              >
                <CardContent>
                  <div className="docDetails hospitalDetails" style={{ width: "100%" }}>
                    <Tooltip
                      title={`${doct.legalName}`}
                      placement="right-start"
                      arrow
                    >
                      <span
                        className="docName hospital-unit-width"
                        style={{ fontWeight: "bold" }}
                      >
                        {doct.legalName}
                      </span>
                    </Tooltip>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 13,
                        marginTop: "4px",
                      }}
                    >
                      {doct.addressLine1} <br /> {doct.addressLine2} <br />{" "}
                      {doct.city}, {doct.state}, {doct.country}
                    </span>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%" }}>
          <h3>No Hospital Unit Added Yet.</h3>
        </div>
      )}
    </div>
  );
}
