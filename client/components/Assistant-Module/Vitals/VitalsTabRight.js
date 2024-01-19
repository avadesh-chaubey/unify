import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Grid,
  Button,
  Divider,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export default function VitalsTabRight() {
  return (
    <>
      <div style={{ display: "flex", marginBottom: "20px", marginTop: "15px" }}>
        <Typography style={{ marginRight: "400px", color: "#565454" }}>
          Input
        </Typography>
        <IconButton style={{ marginLeft: "140px" }}>
          <DeleteIcon />
        </IconButton>
      </div>
      <Divider />
      <div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            Blood Pressure (mm Hg) -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            80/120
          </Button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            Height (cms) -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            94
          </Button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            BMI -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            16.1
          </Button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            Pluse (beats/min) -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            80/120
          </Button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            Weight (kgs) -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            14.2
          </Button>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
        >
          <Typography
            style={{ color: "#565454", fontWeight: "bold", width: "195px" }}
          >
            Temperature (°F) -
          </Typography>
          <Button
            style={{
              width: "25%",
              // height: "59px",
              borderRadius: "30px",
              background: "#452D7B",
              textTransform: "capitalize",
              padding: "15px",
              color: "#FFFFFF",
              marginLeft: "25px",
            }}
          >
            97.52
          </Button>
        </div>
      </div>
    </>
  );
}
