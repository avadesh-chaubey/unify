import { Button, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  dragFileTitle: {
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "Avenir_heavy !important",
  },
}));

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#707070";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #f1efef;
  color: #000000;
  outline: none;
  transition: border 0.24s ease-in-out;
  width: 200px;
  height: 200px;
  justify-content: center;
`;

export default function Uploadfile(props) {
  const classes = useStyles();
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    open,
  } = useDropzone({ accept: "image/*" });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <div className="container">
        <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          <img
            src="uploadicon.svg"
            style={{
              width: "40px",
              height: "40px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          />
          <Typography className={classes.dragFileTitle}>
            Drag files to upload
          </Typography>
        </Container>
      </div>
      {/* <aside>
        <ul>{files}</ul>
      </aside> */}

      <Button
        onClick={open}
        style={{
          backgroundColor: "#452D7B",
          color: "#FFFFFF",
          width: "120px",
          marginLeft: "40px",
          marginTop: "20px",
          display: "flex",
          textTransform: "capitalize",
          marginBottom: "15px",
        }}
      >
        Choose File
      </Button>
    </>
  );
}
