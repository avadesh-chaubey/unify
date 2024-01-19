import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { styleobj } from "../HomeScreen/HomeScreenStyle";
import CMS from "../../cms";
import { useCookies } from "react-cookie";
import config from "../../../../app.constant";
import axios from "axios";

const useStyles = makeStyles((theme) => styleobj);
export default function Information() {
  const [bannerImg, setBannerImg] = useState([]);
  const [cookies, setCookie] = useCookies([]);
  const classes = useStyles();
  const {
    homescreen_info_title1,
    homescreen_info_title2,
    homescreen_info_title3,
    homescreen_info_button,
  } = CMS;
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
      const url = config.API_URL + "/api/patient/banner";
      const response = await axios.get(url, { headers });
      setBannerImg(response.data.data);
      console.log("======responseBanner", response.data.data);
      console.log("=====>banner", bannerImg);
    } catch (err) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className={classes.infocontanier}>
        <div className={classes.info}>
          {/* <div className={classes.hello}>{homescreen_info_title1} </div>
          <div className={classes.name}>{homescreen_info_title2}</div>
          <div className={classes.about}>{homescreen_info_title3}</div> */}
          <div>
            {/* <Button className={classes.button}>{homescreen_info_button}</Button> */}
          </div>
        </div>
        <div className={classes.pic}>
          <img src={bannerImg} className={classes.pic} />
        </div>
      </div>
    </>
  );
}
