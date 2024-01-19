import React, { useState, useEffect } from "react";
import { InputBase, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DoctorList247 from "./DoctorList247";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: "#f6f7fa",
    padding: " 15px 60px",
  },
  title: {
    color: "#4B2994",
    fontSize: "16px",
    fontWeight: "bold",
  },
  breadCrum: {
    color: "#4B2994",
  },
  searchInput: {
    marginTop: "20px",
    borderRadius: "5px",
    marginLeft: "15px",
    opacity: 1,
    fontSize: "0.7rem",
    width: "100%",
    height: "45px",
    backgroundColor: "#F6F7FA",
    color: " #9A9898",
    fontSize: "15px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f2f2f2",
    },
  },
}));

export default function Consults247(props) {
  const classes = useStyles();

  return (
    <>
      <HeadBreadcrumbs
        titleArr={["Home"]}
        lastTitle={"24/7 Consultations"}
        mainTitle={"24/7 Consultations"}
      />
      <Grid container>
        <Grid
          item
          xs={11}
          justifyContent="space-between"
          style={{ marginLeft: "20px" }}
        >
          <InputBase
            //onChange={(e) => searchHeandler(e.target.value)}
            placeholder="Search Doctor"
            className={classes.searchInput}
            //startAdornment={<SearchIcon fontSize="small" style={{marginRight:'4px'}} />}
            startAdornment={
              <img
                src="/Icon feather-search.svg"
                height="20"
                width="20"
                style={{
                  marginLeft: "20px",
                  marginRight: "20px",
                  color: "#F6F7FA",
                }}
              />
            }
          />
          <Grid container>
            <Grid
              item
              xs={12}
              justifyContent="space-between"
              style={{ marginLeft: "20px" }}
            >
              <DoctorList247 />
            </Grid>
          </Grid>
          <br />
          <br />
        </Grid>
      </Grid>
    </>
  );
}
