import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CircularProgress from "@material-ui/core/CircularProgress";

function Banner(props) {
  const [cookies, getCookie] = useCookies(["name"]);
  const [imageArr, setImageArr] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/patient/banner", {
        headers,
    })
      .then((res) => {
        console.log("res: ",res);
        setImageArr(res.data);
        setLoader(false);

      })
      .catch((err) =>{ 
        console.log("err",err)
        setLoader(false);
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  }, [])
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
    <div className="banner">
      <Carousel
            showArrows={true}
            showStatus={false}
            showIndicators = {false}
            infiniteLoop = {true}
            showThumbs = {false}
            autoPlay = {true}
            stopOnHover = {true}
            dynamicHeight = {true}
        >
            <div>
                <img src={imageArr[0]} alt="image1"/>
            </div>
            <div>
                <img src={imageArr[1]} alt="image2"/>
            </div>
            <div>
                <img src={imageArr[2]} alt="image3"/>
            </div>
        </Carousel>
    </div>
    </>
  )
}

export default Banner
