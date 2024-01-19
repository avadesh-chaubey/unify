import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

function SocialMedia(props) {
  const {
    facebookId,
    linkedinId,
    facebookError,
    linkedInError,
    handleFacebook,
    handleLinkedIn,
    setMsgData,
  } = props;
  const [facebookChecked, setFacebookChecked] = useState(false);
  const [linkedinChecked, setLinkedinChecked] = useState(false);
  const [showSocial, setShowSocial] = useState(0);
  const [socialInfo, setSocialInfo] = useState(false);

  useEffect(() => {
    if (facebookId.length > 0) {
      setFacebookChecked(true);
    } else {
      setFacebookChecked(false);
    }
    if (linkedinId.length > 0) {
      setLinkedinChecked(true);
    } else {
      setLinkedinChecked(false);
    }
  }, [facebookId, linkedinId]);

  const linkedinChange = (event) => {
    console.log("event: ", event);
    setLinkedinChecked(!linkedinChecked);
  };

  const facebookChange = (event) => {
    console.log("event: ", event);
    setFacebookChecked(!facebookChecked);
  };

  const handleInfo = () => {
    setSocialInfo(true);
  };

  const closeSocialInfo = () => {
    setSocialInfo(false);
    setShowSocial(0);
  };

  return (
    <div className="accordianDiv">
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <img
              src="../arrowUp.svg"
              style={{ width: "20px", height: "10px" }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#343434", fontWeight: 600 }}>
            Social Media
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={linkedinChecked}
                onChange={linkedinChange}
                name="checkedB"
                color="primary"
              />
            }
            label={
              <div style={{ display: "flex" }}>
                <img
                  src="../linkedin_Icon.svg"
                  style={{ width: "20px", marginRight: "8px" }}
                />
                <p>Linkedin</p>
              </div>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={facebookChecked}
                onChange={facebookChange}
                name="checkedB"
                color="primary"
              />
            }
            label={
              <div style={{ display: "flex" }}>
                <img
                  src="../facebook_Icon.svg"
                  style={{ width: "20px", marginRight: "8px" }}
                />
                <p>Facebook</p>
              </div>
            }
          />
          {linkedinChecked && (
            <div>
              <TextField
                value={linkedinId}
                id="Linkedin Id"
                placeholder="www.linkedin.com"
                variant="outlined"
                style={{ margin: "10px 0", width: "40%" }}
                onChange={handleLinkedIn}
                error={Boolean(linkedInError)}
                helperText={linkedInError !== "" ? linkedInError : ""}
              />
            </div>
          )}
          {facebookChecked && (
            <div>
              <TextField
                value={facebookId}
                id="Facebook Id"
                placeholder="www.facebook.com"
                variant="outlined"
                style={{ margin: "10px 0", width: "40%" }}
                onChange={handleFacebook}
                error={Boolean(facebookError)}
                helperText={facebookError !== "" ? facebookError : ""}
              />
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default SocialMedia;
