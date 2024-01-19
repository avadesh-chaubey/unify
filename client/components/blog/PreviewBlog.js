import React, {useState, useEffect} from 'react';
import parse from 'html-react-parser';
import router from 'next/router';
import config from '../../app.constant';
import axios from 'axios';
import moment from 'moment';
import { makeInitialCapital } from '../../utils/helpers';

export default function PreviewBlog (prop) {
  const { setLoader, setMsgData } = prop;
  const [blogDetails, setBlogDetails] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [baseUrl, setBaseUrl] = useState("")
  useEffect(() => {
    if (router.query.blogId !== undefined) {
      setLoader(true);
      const headers = {
        headers: {
          authtoken: JSON.parse(localStorage.getItem('token')),
          "Content-type": "application/json",
        }
      };
      
      axios.get(`${config.API_URL}/api/cms/blog/${router.query.blogId}`, headers)
      .then(res => {
        // console.log("res: ",res);
        setBlogDetails(res.data.data);
        setContent(atob(res.data.data.content));
        setCategories(res.data.data.categories);
        setTimeout(() => setLoader(false), 1000);
      })
      .catch(err => {
        setMsgData({
          message: "Error occured while fetching details",
          type: 'error'
        });
        setLoader(false);
      });
    }
  }, []);
  useEffect(() => {
    if(document.location.hostname === "localhost"){
      setBaseUrl(document.location.origin);
    }
    
  }, [])
  return parse(`
    <html>
      <head>
        <title>Preview Template</title>
        <style>
          .container {
            padding-left: 30px;
          }
          .preview-header-logo {
            margin-bottom: 50px;
          }
          .left-div {
            width: 100%;
            float: left;
          }
          .right-div {
            display: 'none';
          }
          .content-image {
            height: 400px;
            // width: 98%;
            object-fit: contain;
          }
          .title-blog {
            font-size: 2.5rem;
            margin-bottom: 15px;
          }
          .blog-content {
            width: 100%;
            display: flex;
            padding-bottom: 50px;
          }
          .blog-content-1 {
            width: 60%;
          }
          .blog-content-2 {
            width: 40%;
            position: relative;
            top: 30px;
          }
          .author-date-caption {
            font-weight: 600 !important;
            color: grey !important;
            font-size: 1rem !important;
          }
          .hide-table {
            display: none;
          }
          table {
            border-spacing: 1px;
            border-collapse: collapse;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            max-width: 75%;
            width: 100%;
            margin: 0 auto;
            position: relative;
            box-shadow:
              0 1px 1px rgb(0 0 0 / 15%),
              0 1px 5px rgb(0 0 0 / 30%),
              0 10px 0 -5px #eee;
            padding: 30px;
          }
          table * {
            position: relative;
          }
          table td,
          table th {
            padding-left: 20px;
          }
          table thead tr {
            height: 60px;
            font-size: 2rem;
            border-bottom: 1px solid #e3f1d5;
          }
          table tbody tr {
            height: 48px;
            border-bottom: 1px solid #e3f1d5;
          }
          table tbody tr:last-child {
            border: 0;
          }
          table td,
          table th {
            text-align: left;
          }
          table td.l,
          table th.l {
            text-align: right;
          }
          table td.c,
          table th.c {
            text-align: center;
          }
          table td.r,
          table th.r {
            text-align: center;
          }
          .backBtn{
            position: absolute;
            bottom: 30px;
            right: 30px;
          }
          .backBtn a{
            padding: 10px 45px;
            border: 1px solid;
            font-size: 14px;
            border-radius: 40px;
            font-weight: bold;
          }
          @media screen and (max-width: 35.5em) {
            table {
              display: block;
            }
            table > *,
          table tr,
          table td,
          table th {
              display: block;
            }
            table thead {
              display: none;
            }
            table tbody tr {
              height: auto;
              padding: 8px 0;
            }
            table tbody tr td {
              padding-left: 45%;
              margin-bottom: 12px;
            }
            table tbody tr td:last-child {
              margin-bottom: 0;
            }
            table tbody tr td:before {
              position: absolute;
              font-weight: 700;
              width: 40%;
              left: 10px;
              top: 0;
            }
            table tbody tr td:nth-child(1):before {
              content: "Code";
            }
            table tbody tr td:nth-child(2):before {
              content: "Stock";
            }
            table tbody tr td:nth-child(3):before {
              content: "Cap";
            }
            table tbody tr td:nth-child(4):before {
              content: "Inch";
            }
            table tbody tr td:nth-child(5):before {
              content: "Box Type";
            }
          }
          body {
            padding: 20px;
          }
          .author-date {
            font-weight: 600;
            font-size: 1rem;
            color: grey;
            margin-top:20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="preview-header-logo">
            <img src="logo/unifycare_home_logo.png" height="50">
          </header>
          <div class="left-div">
            <div class="blog-content">
              <div class="blog-content-1">
                <div style="margin-bottom: 50px;">
                  <div>
                    <h3 class="title-blog">${blogDetails.title}</h3>
                  </div>
                  <img
                    class="content-image"
                    src="${config.API_URL}/api/utility/download/${blogDetails.titleImageUrl}"
                  >
                  
                </div>

                ${content}
                <div class="author-date">
                  ${moment(blogDetails.publishedDate).format('DD MMM YYYY')} by ${makeInitialCapital(blogDetails.authorName)}
                </div>
              </div>
              <div class="blog-content-2 ${categories.length ? '' : 'hide-table'}">
                <table>
                  <thead>
                    <tr><th>Categories</th></tr>
                  </thead>
                  <tbody>
                    ${categories.map((data, index) => ('<tr><td>' + data + '</td></tr>'))}
                  </tbody>
                </table>
                <div class="backBtn">
                  <a href="${baseUrl}/cms/contentManagementList"> BACK </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
}
