import React, { useReducer, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import { Button, TextField } from "@material-ui/core";

export default function AuthorizedSignatory(props) {
  const { getSelectedUnitDetails } = props;
  const [authSignDetails, setAuthSignDetails] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      signingAuthName: "",
      signingAuthWorkEmail: "",
      signingAuthTaxId: "",
      signingAuthTaxIdUrl: "",
      signingAuthTitle: "",
      signingAuthLetterUrl: "",
    }
  );

  useEffect(() => {
    if (getSelectedUnitDetails?.partnerId !== undefined) {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(
          `${config.API_URL}/api/partner/signingauth/${getSelectedUnitDetails.partnerId}`,
          { headers }
        )
        .then((res) => {
          const data = res.data.data;
          if (data) {
            setAuthSignDetails({
              signingAuthName: data.signingAuthName,
              signingAuthWorkEmail: data.signingAuthWorkEmail,
              signingAuthTaxId: data.signingAuthTaxId,
              signingAuthTaxIdUrl: data.signingAuthTaxIdUrl,
              signingAuthTitle: data.signingAuthTitle,
              signingAuthLetterUrl: data.signingAuthLetterUrl,
            });
          }
        })
        .catch((err) => console.log("Auth err resp", err.response));
    } else {
      setAuthSignDetails({
        signingAuthName: "",
        signingAuthWorkEmail: "",
        signingAuthTaxId: "",
        signingAuthTaxIdUrl: "",
        signingAuthTitle: "",
        signingAuthLetterUrl: "",
      });
    }
  }, [getSelectedUnitDetails?.partnerId]);

  return (
    <div className="es-page">
      <div className="form-input authSign as-form-details">
        <form noValidate autoComplete="off">
          <div className="es-unit-field">
            <div className="half-div">
              <TextField
                required
                disabled
                label="Signing Authority Name"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                className="form-auto hospital-unit-label"
                value={
                  authSignDetails?.signingAuthName !== undefined
                    ? authSignDetails?.signingAuthName
                    : ""
                }
              />
            </div>
            <div className="half-div">
              <TextField
                disabled
                required
                className="form-auto hospital-unit-label"
                label="Signing Authority Work Email"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                value={
                  authSignDetails?.signingAuthWorkEmail !== undefined
                    ? authSignDetails?.signingAuthWorkEmail
                    : ""
                }
              />
            </div>
          </div>

          <div style={{ marginLeft: "-17px" }}>
            <div className="two-div">
              <TextField
                disabled
                required
                label="Signing Authority Tax ID"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                className="more hospital-unit-label"
                InputLabelProps={{ shrink: true }}
                value={
                  authSignDetails?.signingAuthTaxId !== undefined
                    ? authSignDetails?.signingAuthTaxId
                    : ""
                }
              />
              <div className="upload-option">
                <input
                  disabled
                  type="file"
                  className="choose"
                  id="authorityTaxId"
                />
                <label
                  htmlFor="authorityTaxId"
                  className={`dragContent ${
                    authSignDetails?.signingAuthTaxIdUrl !== ""
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
                {!!(authSignDetails?.signingAuthTaxIdUrl !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      className="preview1 img-spec display-img-div"
                      src={`${config.API_URL}/api/utility/download/${authSignDetails?.signingAuthTaxIdUrl}`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="two-div">
              <TextField
                disabled
                required
                label="Signing Authority Title"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                InputLabelProps={{ shrink: true }}
                className="more hospital-unit-label"
                value={
                  authSignDetails?.signingAuthTitle !== undefined
                    ? authSignDetails?.signingAuthTitle
                    : ""
                }
              />
              <div className="upload-option">
                <input
                  disabled
                  type="file"
                  className="choose"
                  id="authoritySTaxId"
                />
                <label
                  htmlFor="authoritySTaxId"
                  className={`dragContent ${
                    authSignDetails?.signingAuthLetterUrl !== ""
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
                {!!(authSignDetails?.signingAuthLetterUrl !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      className="preview1 img-spec display-img-div"
                      src={`${config.API_URL}/api/utility/download/${authSignDetails?.signingAuthLetterUrl}`}
                      alt={authSignDetails?.signingAuthLetterUrl}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
