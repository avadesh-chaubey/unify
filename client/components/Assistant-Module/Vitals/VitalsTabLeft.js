import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Grid,
  Button,
  Divider,
} from "@material-ui/core";
import VitalsTabRight from "./VitalsTabRight";

export default function VitalsTab() {
  return (
    <>
      <Grid container>
        <Grid item xs={5} style={{ marginTop: "25px", marginLeft: "10px" }}>
          <div style={{ display: "flex" }}>
            <Button
              style={{
                width: "50%",
                // height: "59px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              Blood Pressure (mm Hg)
            </Button>
            <Button
              style={{
                width: "35%",
                // height: "59px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              Height (cms)
            </Button>
          </div>
          <div style={{ display: "flex", marginTop: "20px" }}>
            <Button
              style={{
                width: "25%",
                // height: "59px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              BMI
            </Button>
            <Button
              style={{
                width: "44%",
                // height: "59px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              Pluse (beats/min)
            </Button>
            <Button
              style={{
                width: "35%",
                // height: "59px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              Weight (kgs)
            </Button>
          </div>
          <div
            style={{ display: "flex", marginTop: "20px", marginBottom: "25px" }}
          >
            <Button
              style={{
                width: "45%",
                // height: "54px",
                borderRadius: "30px",
                background: "#452D7B",
                textTransform: "capitalize",
                padding: "18px",
                color: "#FFFFFF",
                marginRight: "25px",
              }}
            >
              Temperature
            </Button>
          </div>
          <Divider />
          <div style={{ marginTop: "20px" }}>
            <Button
              style={{
                width: "30%",
                // height: "55px",
                borderRadius: "30px",
                border: "1px solid #707070",
                textTransform: "capitalize",
                padding: "10px",
                color: "#565454",
                marginRight: "25px",
              }}
            >
              Others
            </Button>
          </div>
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginLeft: "15px" }}
        />
        <Grid item xs={6} style={{ marginLeft: "20px" }}>
          <VitalsTabRight />
        </Grid>
      </Grid>
    </>
  );
}
