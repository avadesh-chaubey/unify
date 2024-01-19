import React from "react";
import { useState, useContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { useRouter } from "next/router";

const textBoxStyle = {
  marginTop: "0px",
};
const textBoxStyleAddr = {
  marginTop: "0px",
  width: "96%",
};

function ProfessionalDetails() {
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([{ award: "" }]);

  const router = useRouter();

  const submitProfessionalDetails = () => {
    console.log("submitProfessionalDetails ");
    router.push("addDoctor?availibilitySlots");
  };
  const goBackPersonalDetailsPage = () => {
    console.log("goBackPersonalDetailsPage");
  };
  const handleAddClick = () => {
    setList([...list, { award: "" }]);
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <h2 className="newHead">Professional Details</h2>
      <div className="form-input textBottom">
        <form autoComplete="off" onSubmit={submitProfessionalDetails}>
          <div className="mainForm" style={{ width: "99%" }}>
            <div className="elements full">
              <TextField
                required
                select
                label="Education ( Add multiple educations separated by comma)"
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              <TextField
                // required
                label="Speciality"
                margin="normal"
                variant="filled"
                style={{ width: "33%", marginRight: "20px" }}
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                // required
                select
                label="Experience in Years"
                margin="normal"
                variant="filled"
                style={{ width: "28%", marginRight: "20px" }}
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              >
                <MenuItem value="1">01</MenuItem>
                <MenuItem value="2">02</MenuItem>
                <MenuItem value="3">03</MenuItem>
                <MenuItem value="4">04</MenuItem>
                <MenuItem value="5">05</MenuItem>
              </TextField>
              <TextField
                // required
                label="MCI No."
                margin="normal"
                variant="filled"
                style={{ width: "33%", float: "right" }}
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              {list.map((x, i) => {
                return (
                  <TextField
                    required
                    label="Awards/Certification"
                    margin="normal"
                    variant="filled"
                    style={{ width: "65%" }}
                    className="proEducation"
                    // value={address}
                    // onChange={(e) => setAddress(e.target.value)}
                  />
                );
              })}
              <span className="addAnother" onClick={handleAddClick}>
                + ADD ANOTHER CERTIFICATION
              </span>
            </div>
            <div className="elements full">
              <TextField
                // required
                multiline
                // rows={2}
                label="Short Write-up"
                margin="normal"
                variant="filled"
                style={{ width: "100%" }}
                className="proEducation"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              <div
                className="upload-option"
                style={{ width: "31%", float: "left" }}
              >
                {/* onChange={authorityTaxChange} */}
                <input type="file" className="choose" id="authorityTaxId" />
                <label htmlFor="authorityTaxId" className="dragContent">
                  <img src="upload.svg" />
                  <span
                    className="dragContentText"
                    style={{ marginTop: "3px" }}
                  >
                    Upload medical council of india/state medical council
                    registration certificate
                  </span>
                </label>
              </div>
              <div
                className="upload-option"
                style={{ width: "31%", float: "left" }}
              >
                {/* onChange={authorityTaxChange} */}
                <input type="file" className="choose" id="authorityTaxId" />
                <label htmlFor="authorityTaxId" className="dragContent">
                  <img src="upload.svg" />
                  <span className="dragContentText">
                    Upload degree certificates of graduation
                  </span>
                </label>
              </div>
              <div
                className="upload-option"
                style={{ width: "31%", float: "left" }}
              >
                {/* onChange={authorityTaxChange} */}
                <input type="file" className="choose" id="authorityTaxId" />
                <label htmlFor="authorityTaxId" className="dragContent">
                  <img src="upload.svg" />
                  <span className="dragContentText">
                    Upload degree certificates of post-graduation
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="action">
            <Button
              size="small"
              variant="contained"
              onClick={goBackPersonalDetailsPage}
              className="back"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              Back
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              type="submit"
            >
              NEXT
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfessionalDetails;
