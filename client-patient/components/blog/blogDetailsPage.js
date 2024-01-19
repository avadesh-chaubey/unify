import router from 'next/router';
import React,{useState, useEffect} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import moment from 'moment';
import PersonIcon from '@material-ui/icons/Person';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ShareIcon from '@material-ui/icons/Share';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import TwitterIcon from '@material-ui/icons/Twitter';
import {
  FacebookShareButton,
  // FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  // TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon
} from 'react-share'
import Head from 'next/head'

function BlogDetailsPage() {
  const [cookies, getCookie] = useCookies(["name"]);
  // const { blogId } = router.query;
  const [blogId, setBlogId] = useState("");
  const [blogDetails, setBlogDetails] = useState({});
  const [open, setOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = useState("")
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setShareUrl(window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams: ", urlParams);
    console.log("mbdbvm:", router.query);
    const myParam = urlParams.get("blogId");
    setBlogId(myParam);
    console.log("myParam",myParam)
  }, [])
  
  useEffect(() => {
    if(blogId != ""){
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
        .get(config.API_URL + "/api/cms/blog/"+blogId, {
          headers,
      })
        .then((res) => {
          let data = res.data;
          console.log("res in blog: ",data);
          setBlogDetails(data);
        })
        .catch((err) => console.log("err",err));
      }
  }, [blogId])
  const whatsAppClick = () =>{
    console.log("whatsAppClick")
  }
  const facebookClick = () =>{
    console.log("facebookClick");
    let url = 'https://facebook.com/sharer.php?display=popup&u=' + "http://localhost:3000/blogDetails?blogId=60e000d0dd5dff0018fc6de3"+"&imageurl=https://dev.diahome.com/diahome_home_page.png";
    let options = 'toolbar=0,status=0,resizable=1,width=626,height=436,hashtag=sjfsfh';
    window.open(url,'sharer',options);
    
  }
  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
  }
  const mailClick = () =>{
    console.log("mailClick")
  }
  const twitterClick = () =>{
    console.log("twitterClick")
    const res = loadScript(
        "https://twitter.com/intent/tweet?url=http://localhost:3000/blogDetails?blogId=60e000d0dd5dff0018fc6de3"
    );

    if (!res) {
        console.log("facebook sharer not working");
        return;
    }else{
      console.log("res in facebook share:", res)
    }
  }
  return (
    <>
      <Head>
        <title>My page title</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Your eye-catching title here" />
        <meta property="og:url" content="https://rainbow.unify.care/" />
        <meta property="og:description" content="Your entertaining and descriptive copy here, if your meta description is good, use it." />
        <meta property="og:image" content="https://dev.diahome.com/diahome_home_page.png" />

        <meta name="twitter:card" content="summary" />
        {/* <meta name="twitter:site" content="@nytimesbits" /> */}
        {/* <meta name="twitter:creator" content="@nickbilton" /> */}
        <meta property="og:url" content="https://rainbow.unify.care/" />
        <meta property="og:title" content="A title for header" />
        <meta property="og:description" content="In the early days, Twitter grew so quickly that it was almost impossible to add new features because engineers spent their time trying to keep the rocket ship from stalling." />
        <meta property="og:image" content="https://dev.diahome.com/diahome_home_page.png" />
        
      </Head>
      {blogDetails.id ? 
        <div className="blogDetails">
          <div className="title">
            {blogDetails.title}
          </div>
          <div className="DetailsAutherNdate">
            <span> 
              <PersonIcon className="icon"/>
              {blogDetails.authorName}
            </span>
            <span>
              <CalendarTodayIcon className="icon"/>
              {moment(blogDetails.publishedDate).format('DD-MMM-YYYY')}
            </span>
          </div>
          <div className="blogImage">
            <img src={`${config.API_URL}/api/utility/download/` + blogDetails.titleImageUrl} />
            <div className="blogCategory">
              {blogDetails.categories.map((data)=>(
                <div className="blogChip" style={{marginTop:"30px", marginLeft:"10px"}}>{data}</div>
              ))}
            </div>
          </div>
          <div style={{position:"relative"}}>
            <div className="metaKeywords">
              {blogDetails.metaKeywords.map((data)=>(
                <div className="metaChip" style={{ marginLeft:"10px"}}>{data}</div>
              ))}
            </div>
            <div className="shareIcon">
                <ShareIcon onClick={handleClickOpen} />
              </div>
          </div>
          
          <div className="title">
            {blogDetails.metaDescription}
          </div>
          <div className="content">
            {blogDetails.content}
          </div>
          <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} className="blogShare">
            <DialogTitle id="simple-dialog-title">Share This Blog</DialogTitle>
            <DialogContent>
              <div style={{textAlign:"center"}} className="shareIconDiv">
                {/* <WhatsAppIcon onClick={whatsAppClick} className="whatsapp shareItemIcon"/>
                <FacebookIcon onClick={facebookClick} className="facebook shareItemIcon" />
                <MailOutlineIcon onClick={mailClick} className="mail shareItemIcon" /> */}
                {/* <TwitterIcon onClick={twitterClick} className="twitter shareItemIcon"/> */}
                <FacebookShareButton 
                  // url={shareUrl}
                  url="http://rainbow.daihome.com"
                  image="https://dev.diahome.com/diahome_home_page.png"
                  quote={blogDetails.title}
                  hashtag="#rainbow"
                >
                  <FacebookIcon logoFillColor="white" round={true} >
                  </FacebookIcon>
                </FacebookShareButton>
                <WhatsappShareButton
                  // url={shareUrl}
                  url="http://rainbow.daihome.com"
                  title={blogDetails.title}
                  separator=" "
                >
                  <WhatsappIcon logoFillColor="white" round={true}/>
                </WhatsappShareButton>

                <TwitterShareButton 
                  // url={shareUrl}
                  url="http://rainbow.daihome.com"
                  title={blogDetails.title}
                  hashtags={["rainbow", "blog"]}
                  >
                  <TwitterIcon logoFillColor="white" round={true}/>
                </TwitterShareButton>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        :
        <div>
          No Blog Available
        </div>
      }
    </>
  )
}

export default BlogDetailsPage
