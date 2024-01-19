import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Card,
  Button,
  CardActions,
  CardContent,
  Typography,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
// import VideoThumbnail from "react-thumbnail-player";
import ReactPlayer from "react-player";
import VideoThumbnail from "react-video-thumbnail";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import axios from "axios";
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
    height: "270px",
  },
}));

export default function DoctorVideos(props) {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies([""]);
  const [videourl, setVideoUrl] = useState([]);
  const { showProfileData } = props;
  console.log("======doctList13");

  const url = config.API_URL + "/api/utility/download/";
  const headers = {
    authtoken: cookies["cookieVal"],
  };
  const getVideoData = (id) => {
    axios
      .get(config.API_URL + `/api/partner/tagvideo/` + id, {
        headers,
      })
      .then((response) => {
        // const temp = [...videourl];
        // temp.push(response.data.data);
        setVideoUrl((prevState) => {
          return [...prevState, response.data.data];
        });
        console.log("======>responseVideo", response.data.data);
      });
  };
  useEffect(() => {
    showProfileData &&
      showProfileData.videoUrlList &&
      showProfileData.videoUrlList.map((item) => {
        getVideoData(item);
      });
  }, [showProfileData]);

  console.log("======>videoUrl", videourl);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className={classes.videoTextHeading}>Videos</Typography>
        </Grid>
        <div style={{ width: "100%" }}>
          <div className="scrollOuter">
            <div className="scrollInner">
              {videourl.map((item) => {
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
                      {/* <CardMedia
                          component="img"
                          alt="Contemplative Reptile"
                          //height="180"
                          image={item.url} //{`${url}${showProfileData.videoUrlList}`}
                          title="Contemplative Reptile"
                          style={{
                            padding: "8px",
                            marginBottom: "-10px",
                            cursor: "pointer",
                          }}
                        /> */}
                      <ReactPlayer
                        url={`${url}${item.url}`}
                        width="100%"
                        height="220px"
                        controls={true}
                        style={{
                          padding: "5px",
                          marginTop: "-52px",
                        }}
                      />
                      <CardContent>
                        <Typography
                          style={{
                            color: "#424242",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          style={{
                            border: "1px solid #CECECE",
                            background: "none",
                            boxShadow: "none",
                            width: "120px",
                            height: "30px",
                            color: "#9F9F9F",
                            fontSize: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          Childcare
                        </Button>
                        <Button
                          variant="contained"
                          style={{
                            border: "1px solid #CECECE",
                            background: "none",
                            boxShadow: "none",
                            width: "150px",
                            height: "30px",
                            color: "#9F9F9F",
                            fontSize: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          {showProfileData.doctorFullName}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </div>
          </div>
        </div>
      </Grid>
    </>
  );
}
