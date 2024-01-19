import React, { useState, useEffect } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import UploadInformationform from "./components/ViewReport/UploadInformationform";

export default function ViewReport() {
  const [file, setFile] = useState([]);

  return (
    <>
      <HeadBreadcrumbs
        titleArr={["Home"]}
        lastTitle={"View Reports"}
        mainTitle={"View Reports"}
      />
      <Grid container justify="center">
        <Grid
          item
          xs={11}
          style={{
            justifyContent: "space-around",
            display: "inline-flex",
            marginLeft: "20px",
          }}
        >
          <Grid container>
            <Grid
              item
              style={{
                width: "140px",
                height: "150px",
                // border: "1px solid #707070",
                marginLeft: "20px",
                borderRadius: "2px",
                // marginTop: "10px",
              }}
            >
              <div style={{ position: "relative" }}>
                <UploadInformationform />
              </div>
            </Grid>
            {file.length > 0 &&
              file.map((item, index) => {
                return (
                  <Grid
                    item
                    style={{
                      width: "140px",
                      height: "150px",
                      border: "1px solid #707070",
                      marginLeft: "20px",
                      borderRadius: "2px",
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={item}
                        alt=""
                        style={{
                          width: "137px",
                          height: "148px",
                          marginLeft: "0px",
                          padding: "2px",
                        }}
                      />
                    </div>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
