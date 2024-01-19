import React, { useReducer, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import { TextField, Button } from "@material-ui/core";
import { makeInitialCapital } from "../../utils/helpers";

export default function BankDetailsForm(props) {
  const { getSelectedUnitDetails } = props;
  const [bankDetailsInfo, setBankDetailsInfo] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      bankAccountName: "",
      bankAccountNumber: "",
      bankIFSCCode: "",
      bankName: "",
      bankAccountType: "",
      bankChequeURL: "",
    }
  );

  useEffect(() => {
    if (getSelectedUnitDetails?.partnerId !== undefined) {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };
      axios
        .get(
          `${config.API_URL}/api/partner/bankdetails/${getSelectedUnitDetails.partnerId}`,
          { headers }
        )
        .then((res) => {
          const bankData = res.data.data;
          if (bankData) {
            setBankDetailsInfo({
              bankAccountName: bankData.bankAccountName,
              bankAccountNumber: bankData.bankAccountNumber,
              bankIFSCCode: bankData.bankIFSCCode,
              bankName: bankData.bankName,
              bankAccountType: bankData.bankAccountType,
              bankChequeURL: bankData.bankChequeURL
                ? bankData.bankChequeURL
                : null,
            });
          }
        })
        .catch((err) => console.log("bank err resp", err.response));
    } else {
      setBankDetailsInfo({
        bankAccountName: "",
        bankAccountNumber: "",
        bankIFSCCode: "",
        bankName: "",
        bankAccountType: "",
        bankChequeURL: "",
      });
    }
  }, [getSelectedUnitDetails?.partnerId]);

  return (
    <div className="es-page">
      <div className="form-input bankAcc as-form-details">
        <form noValidate autoComplete="off">
          <div className="es-unit-field">
            <div className="half-div">
              <TextField
                disabled
                required
                label="Account Name"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                className="form-auto hospital-unit-label"
                value={
                  bankDetailsInfo?.bankAccountName !== undefined
                    ? bankDetailsInfo?.bankAccountName
                    : ""
                }
              />
            </div>
            <div className="half-div">
              <TextField
                disabled
                required
                label="Account Number"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                className="form-auto hospital-unit-label"
                value={
                  bankDetailsInfo?.bankAccountNumber !== undefined
                    ? bankDetailsInfo?.bankAccountNumber
                    : ""
                }
              />
            </div>
          </div>

          <div className="es-unit-field">
            <div className="half-div">
              <TextField
                disabled
                required
                label="IFSC Code"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                className="form-auto hospital-unit-label"
                InputLabelProps={{ shrink: true }}
                value={
                  bankDetailsInfo?.bankIFSCCode !== undefined
                    ? bankDetailsInfo?.bankIFSCCode
                    : ""
                }
              />
            </div>
            <div className="half-div">
              <TextField
                disabled
                required
                label="Bank Name"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                className="form-auto hospital-unit-label"
                value={
                  bankDetailsInfo?.bankName !== undefined
                    ? bankDetailsInfo?.bankName
                    : ""
                }
              />
            </div>
          </div>
          <div className="es-unit-field">
            <div className="half-div">
              <TextField
                disabled
                required
                label="Account Type"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                className="form-auto hospital-unit-label"
                InputLabelProps={{ shrink: true }}
                value={
                  bankDetailsInfo?.bankAccountType !== undefined
                    ? makeInitialCapital(bankDetailsInfo?.bankAccountType) +
                      ` Account`
                    : ""
                }
              />
            </div>
          </div>

          <div style={{ marginLeft: "-17px" }}>
            <div className="two-div">
              <div className="upload-option">
                <input
                  disabled
                  type="file"
                  className="choose"
                  id="cancelChequeId"
                />
                <label
                  htmlFor="cancelChequeId"
                  className={`dragContent ${
                    bankDetailsInfo?.bankChequeURL !== ""
                      ? "label-image-cover"
                      : ""
                  }`}
                >
                  <div style={{ display: "grid", flexDirection: "row" }}>
                    {/* <div className="upload-icon-position">
                      <img src="/logo/upload_icon.svg" />
                    </div> */}
                    <div className="upload-instruction">
                      <p> No Data Found </p>
                    </div>
                    {/* <div className="upload-instruction">
                      <Button
                        disabled
                        variant="contained"
                        className="upload-doc-1"
                      >
                        Or select files to upload
                      </Button>
                    </div> */}
                  </div>
                </label>
                {!!(bankDetailsInfo?.bankChequeURL !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      className="preview1 img-spec display-img-div"
                      alt={bankDetailsInfo?.bankChequeURL}
                      src={`${config.API_URL}/api/utility/download/${bankDetailsInfo?.bankChequeURL}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="two-div"></div>
        </form>
      </div>
    </div>
  );
}
