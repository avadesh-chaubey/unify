import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import router from 'next/router';

function Bloglist() {
  const [cookies, getCookie] = useCookies(["name"]);
  const [blogList, setBlogList] = useState([]);
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
    axios
      .get(config.API_URL + "/api/cms/blog?page=1&size=5&isPublished=1", {
        headers,
    })
      .then((res) => {
        let data = res.data.cms;
        let temp = [];
        console.log("res in blog: ",res);
        data.map((item)=>{
          if(item.titleImageUrl.slice(0,4) != "http"){
            item.titleImageUrl = config.API_URL + "/api/utility/download/" + item.titleImageUrl;
          }
        })
        setBlogList(data);
      })
      .catch((err) => console.log("err",err));
  }, [])
  const toBlogDetails = (itemId) => {
    console.log("toBlogDetails: ",itemId);
    // router.push("/blogDetails/" + encodeURIComponent(itemId))
    router.push("/blogDetails?blogId=" + itemId);

  }
  return (
    <div style={{padding:"15px", width:"100%", flexGrow: "1", overflow: "scroll"}}>
      <div style={{display: "flex", flexFlow: "row nowrap"}}>
        {blogList.length >0 &&blogList.map((item)=>(
          <div style={{margin:"10px"}}>
            <Card style={{width:"320px", height:"250px"}}>
              <CardActionArea onClick={(e)=>{toBlogDetails(item.blogId)}}>
                <CardMedia
                  style={{height:"170px"}}
                  image={item.titleImageUrl}
                  title="Contemplative Reptile"
                />
                <CardContent style={{position:"relative"}}>
                  <div className="chipDiv">
                    {item.categories.map((data)=>(
                      <div className="blogChip">{data}</div>
                    ))}
                  </div>
                  <Typography gutterBottom variant="h6" component="h6">
                    {item.title}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default Bloglist
