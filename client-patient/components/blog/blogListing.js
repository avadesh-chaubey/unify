import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import PersonIcon from '@material-ui/icons/Person';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import moment from 'moment';
import router from 'next/router';

function BlogListing() {
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
      .get(config.API_URL + "/api/cms/blog?page=1&size=10&isPublished=1", {
        headers,
    })
      .then((res) => {
        let data = res.data.cms;
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
    <div style={{padding:"15px"}}>
      {blogList.length > 0 && blogList.map((item,index)=>(
        index%3 === 0 ?
          <div className="multiplyThree" onClick={(e)=>{toBlogDetails(item.blogId)}}>
            <img src={item.titleImageUrl} />
            <div className="blogThreeDetails">
              <div className="title">{item.title}</div>
              <div className="autherNdate">
                <span> 
                  <PersonIcon className="icon"/>
                  {item.authorName}
                </span>
                <span>
                  <CalendarTodayIcon className="icon"/>
                  {moment(item.publishedDate).format('DD-MMM-YYYY')}
                </span>
              </div>
              <div>
                {item.categories.map((data)=>(
                    <div className="blogChip">{data}</div>
                  ))}
              </div>
            </div>
          </div>
        :
        <div className="notMulThree" onClick={(e)=>{toBlogDetails(item.blogId)}}>
           <img src={item.titleImageUrl} />
           <div className="blognotThreeDetails">
             <div className="title">{item.title}</div>
             <div className="meta">{item.metaDescription}</div>
             <div className="autherNdate">
               <span> 
                 <PersonIcon className="icon"/>
                 {item.authorName}
               </span>
               <span>
                 <CalendarTodayIcon className="icon"/>
                 {moment(item.publishedDate).format('DD-MMM-YYYY')}
               </span>
             </div>
             <div className="chipDivNotThree">
               {item.categories.map((data)=>(
                   <div className="blogChip">{data}</div>
                 ))}
             </div>
           </div>
        </div>
      ))}
    </div>
  )
}

export default BlogListing
