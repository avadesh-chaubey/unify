import React, { useReducer, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import { TextField, Button, Typography } from "@material-ui/core";
import { makeInitialCapital } from "../../utils/helpers";

export default function LogoAndPrescription(props) {
  const { getSelectedUnitDetails, setMsgData } = props;
  const [logoPresDetails, setLogoPresDetails] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      partnerLogo: "",
      partnerPrescription: "",
    }
  );

  useEffect(() => {
    if (getSelectedUnitDetails?.partnerId !== undefined) {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(
          `${config.API_URL}/api/partner/logoInfo/${getSelectedUnitDetails?.partnerId}`,
          { headers }
        )
        .then((res) => {
          if (res.data.data) {
            setLogoPresDetails({
              partnerLogo:
                res.data.data.logoUrl !== undefined
                  ? res.data.data.logoUrl
                  : "",
              partnerPrescription:
                res.data.data.prescriptionUrl !== undefined
                  ? res.data.data.prescriptionUrl
                  : "",
            });
          } else {
            setMsgData({
              message: "No Logo & Prescription Data Found",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setMsgData({
            type: "error",
            message:
              err.response !== undefined
                ? err.response.data[0].message
                : "Error occurred while getting logo n prescription details",
          });
        });
    } else {
      setLogoPresDetails({
        partnerLogo: "",
        partnerPrescription: "",
      });
    }
  }, [getSelectedUnitDetails?.partnerId]);

  return (
    <div className="es-page">
      <div className="form-input bankAcc as-form-details">
        <form noValidate autoComplete="off">
          <div className="logo-pres-fields">
            <div className="two-div">
              <Typography className="logo-label" variant="h6" component="h6">
                Logo*
              </Typography>
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
                    logoPresDetails?.partnerLogo !== ""
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
                {!!(logoPresDetails?.partnerLogo !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      className="preview1 img-spec display-img-div"
                      alt={logoPresDetails?.partnerLogo}
                      src={`${config.API_URL}/api/utility/download/${logoPresDetails?.partnerLogo}`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="two-div prescri">
              <Typography className="logo-label" variant="h6" component="h6">
                Prescription*
              </Typography>
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
                    logoPresDetails?.partnerPrescription !== ""
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
                {!!(logoPresDetails?.partnerPrescription !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      className="preview1 img-spec display-img-div"
                      alt={logoPresDetails?.partnerPrescription}
                      src={`${config.API_URL}/api/utility/download/${logoPresDetails?.partnerPrescription}`}
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
