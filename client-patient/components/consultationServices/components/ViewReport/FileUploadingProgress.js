import React, { useState, useEffect } from "react";

import { Typography, Box, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 6,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#E9E9E9",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#452D7B",
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      {/* <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box> */}
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function FileUploadingProgress() {
  const classes = useStyles();
  const [progress, setProgress] = useState(20);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 20 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div>
        <LinearProgressWithLabel
          value={progress}
          classes={{
            root: classes.root,
            colorPrimary: classes.colorPrimary,
            bar: classes.bar,
          }}
        />
      </div>
      <div style={{ display: "flex", marginTop: "5px" }}>
        <Typography style={{ fontSize: "13px", color: "#565454" }}>
          37% done
        </Typography>
        <Typography
          style={{ fontSize: "13px", color: "#565454", marginLeft: "110px" }}
        >
          90KB/Sec
        </Typography>
      </div>
    </>
  );
}
