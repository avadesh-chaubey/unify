import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  aboutTypo: {
    fontWeight: "bold",
    fontSize: "18px",
    fontFamily: "Avenir_black !important",
    paddingBottom: "10px",
    paddingTop: "10px",
    color: " #343434",
  },
  abouttex: {
    fontSize: "14px",
    color: "#343434",
  },
}));

export default function About(props) {
  const classes = useStyles();
  const { showProfileData } = props;
  console.log("======>dataAbout", showProfileData);

  return (
    <>
      <div>
        <Typography className={classes.aboutTypo}>About-</Typography>
        <Typography className={classes.abouttex}>
          {/* {showProfileData && showProfileData.about} */}
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </Typography>
      </div>
    </>
  );
}
