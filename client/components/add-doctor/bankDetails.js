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

function BankDetails() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [accName, setAccName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [ifscCodeError, setifscCodeError] = useState("");
  const [bankName, setBankName] = useState("");
  const submitBankDetails = () => {
    console.log("submitBankDetails");
  };
  const goBackConsultFeePage = () => {
    console.log("goBackConsultFeePage:");
  };
  function validateIfsc(code) {
    setifscCode(code.target.value);
    const {
      target: { value },
    } = event;
    setifscCodeError({ ifscCode: "" });
    setifscCode(value);
    let reg = new RegExp(/^[A-Za-z]{4}\d{7}$/).test(value);
    if (!reg) {
      setifscCodeError({ ifscCode: "Please enter valid IFSC Code" });
    }
  }
  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <h2 className="newHead">Bank Account</h2>
      <div className="form-input textBottom">
        <form autoComplete="off" onSubmit={submitBankDetails}>
          <div className="mainForm" style={{ width: "100%" }}>
            <div className="elements full">
              <TextField
                required
                style={{ width: "48%", float: "left", marginRight: "30px" }}
                label="Account Name"
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                value={accName}
                // onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                required
                style={{ width: "48%", float: "left" }}
                label="Account Number"
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                value={accNumber}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              <TextField
                required
                style={{ width: "48%", float: "left", marginRight: "30px" }}
                label="IFSC Code"
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                error={Boolean(ifscCodeError?.ifscCode)}
                helperText={ifscCodeError?.ifscCode}
                value={ifscCode}
                onChange={validateIfsc}
              />
              <TextField
                required
                style={{ width: "48%", float: "left" }}
                label="Bank Name"
                margin="normal"
                variant="filled"
                // style={textBoxStyle}
                className="proEducation"
                // InputLabelProps={{ shrink: true }}
                // className={' ' + (errMsg && address === '' ? 'err' : '')}
                value={bankName}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="elements full">
              <span>Cancelled Cheque*</span>
              <div className="upload-option" style={{ width: "45%" }}>
                {/* onChange={authorityTaxChange}  */}
                <input
                  type="file"
                  className="choose"
                  id="authorityTaxId"
                  style={{ width: "50%" }}
                />
                <label htmlFor="authorityTaxId" className="dragContent">
                  <img src="upload.svg" />
                  <span className="dragContentText">
                    Drag and drop to upload Scanned copy of Cancelled Cheque*
                  </span>
                  {/* {authorityTaxvalue === '' ? : <div className="change-file">{authorityTaxvalue}
                            <div className="delete-opt" onClick={deleteAuthorityTaxvalue}><Grid item xs={8}>
                                <DeleteForeverIcon />
                            </Grid></div>
                        </div>} */}
                  {/* {authorityTaxvalue === '' ? <span className='dragContentText'>Upload scanned copy of Permanent Account Number (PAN) Card</span> : <div className="change-file">{authorityTaxvalue}
                            <div className="delete-opt" onClick={deleteAuthorityTaxvalue}><Grid item xs={8}>
                                <DeleteForeverIcon />
                            </Grid></div>
                        </div>} */}
                </label>
              </div>
            </div>
          </div>
          <div className="action">
            <Button
              size="small"
              variant="contained"
              onClick={goBackConsultFeePage}
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
              DONE
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BankDetails;
