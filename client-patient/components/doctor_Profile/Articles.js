import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@material-ui/core";
import config from "../../app.constant";

const useStyles = makeStyles((theme) => ({
  videoTextHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "Avenir_black !important",
    paddingBottom: "15px",
    paddingTop: "15px",
  },
  videoCardTestimonial: {
    width: "275px",
    boxShadow: "none",
    border: "1px solid #DCDCDC",
    color: "#FFFFFF",
    height: "300px",
  },
}));

export default function Articles(props) {
  const classes = useStyles();
  const { showProfileData } = props;
  // console.log("======>data5", showProfileData.newArticleList);
  const url = config.API_URL + "/api/utility/download/";
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className={classes.videoTextHeading}>Articles</Typography>
        </Grid>

        {showProfileData &&
          showProfileData.newArticleList &&
          showProfileData.newArticleList.map((item) => {
            return (
              <Grid
                item
                xs={3}
                style={{
                  display: "inline-flex",
                  marginRight: "10px",
                }}
              >
                <Card className={classes.videoCardTestimonial}>
                  <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="225"
                    image={`${url}${item.url}`}
                    title="Contemplative Reptile"
                    style={{ padding: "10px", marginBottom: "-10px" }}
                  />
                  <CardContent>
                    <Typography
                      style={{
                        color: "#818080",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Cooling Therapy breathes lif...
                    </Typography>
                    <Typography
                      style={{
                        color: "#ABABAB",
                        fontSize: "13px",
                        marginTop: "10px",
                      }}
                    >
                      5 Dec 2019
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
