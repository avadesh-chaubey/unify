import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import TextField from "@material-ui/core/TextField";
import config from "../../app.constant";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

function ConsultFee() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const submitConsultFee = () => {
    console.log("submitConsultFee: ");
  };
  const goBackSlotPage = () => {
    console.log("goBackSlotPage");
  };
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <h2 className="newHead">Consultation Fees</h2>
      <div className="form-input textBottom">
        <form autoComplete="off" onSubmit={submitConsultFee}>
          <div className="mainForm" style={{ width: "100%" }}>
            <div className="elements full">
              <div
                style={{
                  width: "25%",
                  verticalAlign: "top",
                  marginTop: "15px",
                  float: "left",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                    // checked={
                    //     item.checked
                    // }
                    // onChange={(e) =>{
                    //         onWorkTimeChange(
                    //         index,
                    //         'DAY',
                    //         !item.checked,
                    //         item.id
                    //     )}
                    // }
                    />
                  }
                  label="Video consultation"
                />
              </div>
              <TextField
                // required
                style={{ width: "25%" }}
                label=""
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                defaultValue="₹ 1000"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="elements full">
              <div
                style={{
                  width: "25%",
                  verticalAlign: "top",
                  marginTop: "15px",
                  float: "left",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                    // checked={
                    //     item.checked
                    // }
                    // onChange={(e) =>{
                    //         onWorkTimeChange(
                    //         index,
                    //         'DAY',
                    //         !item.checked,
                    //         item.id
                    //     )}
                    // }
                    />
                  }
                  label="Audio consultation"
                />
              </div>
              <TextField
                // required
                style={{ width: "25%" }}
                label=""
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                defaultValue="₹ 1000"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              <div
                style={{
                  width: "25%",
                  verticalAlign: "top",
                  marginTop: "15px",
                  float: "left",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                    // checked={
                    //     item.checked
                    // }
                    // onChange={(e) =>{
                    //         onWorkTimeChange(
                    //         index,
                    //         'DAY',
                    //         !item.checked,
                    //         item.id
                    //     )}
                    // }
                    />
                  }
                  label="Text consultation"
                />
              </div>
              <TextField
                // required
                style={{ width: "25%" }}
                label=""
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                defaultValue="₹ 1000"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="action">
            <Button
              size="small"
              variant="contained"
              onClick={goBackSlotPage}
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

export default ConsultFee;
