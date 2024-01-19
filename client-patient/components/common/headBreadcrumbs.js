import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: "#f6f7fa",
    padding: " 15px 56px",
    position: "relative",
  },
  title: {
    color: "#502e92",
    fontSize: "22px",
    fontFamily: "'Avenir_black' !important",
  },
  breadCrum: {
    color: "#502e92",
  },
  backBtn: {
    float: "left",
    fontSize:"24px",
    color: "#502e92",
    marginRight: "5px",
    marginTop: "3px",
    cursor:"pointer"
  }
}));

function HeadBreadcrumbs(props) {
  const { title1, title2, title3, title4,title5, title6, titleArr,lastTitle, mainTitle,backBtnVal, setView } = props;
  useEffect(()=>{
    console.log("titleArr: ",titleArr);
    console.log("backBtnVal: ",backBtnVal);
    
  },[])
  const classes = useStyles();
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  const backBtn = () =>{
    console.log("first",backBtnVal);
    setView(backBtnVal)
  }
  return (
    <div className="headBreadcrumb">
      <div className={classes.head}>
        {!titleArr && (
          <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrum}>
            {title1 != "" && (
              <Link onClick={handleClick} className={classes.breadCrum}>
                <Typography>{title1}</Typography>
              </Link>
            )}
            {title2 != "" && (
              <Link onClick={handleClick} className={classes.breadCrum}>
                <Typography>{title2}</Typography>
              </Link>
            )}
            {title3 != "" && (
              <Link onClick={handleClick} className={classes.breadCrum}>
                <Typography>{title3}</Typography>
              </Link>
            )}
            {title4 != "" && (
              <Link onClick={handleClick} className={classes.breadCrum}>
                <Typography>{title4}</Typography>
              </Link>
            )}
            {title5 != "" && (
              <Link onClick={handleClick} className={classes.breadCrum}>
                <Typography>{title5}</Typography>
              </Link>
            )}
            <Typography>{title6}</Typography>
          </Breadcrumbs>
        )}

        {titleArr && titleArr.length >0 &&<Breadcrumbs aria-label="breadcrumb" className={classes.breadCrum}>
          {titleArr.map((item)=>(
            <Link href="/" onClick={handleClick} className={classes.breadCrum}>
            <Typography>{item}</Typography>
          </Link>
          ))}
          <Typography>{lastTitle}</Typography>
        </Breadcrumbs>}
        {backBtnVal && backBtnVal != "" && <ArrowBackIosIcon onClick ={backBtn} className={classes.backBtn}/>}
        <div className={classes.title}>{mainTitle}</div>
      </div>
    </div>
  );
}

export default HeadBreadcrumbs;
