import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Button } from "@material-ui/core";
import config from "../../app.constant";

export default function EstablishmentDetails(props) {
  const { getSelectedUnitDetails } = props;
  console.log(getSelectedUnitDetails);
  return (
    <div className="es-page">
      <div className="form-input companyInfo">
        <form noValidate autoComplete="off">
          <div className="mainForm hospital-unit-field">
            <div className="es-unit-field">
              <div className="half-div">
                <TextField
                  disabled
                  required
                  label="Legal Name"
                  style={{ margin: 4 }}
                  margin="normal"
                  variant="filled"
                  className="form-auto hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.legalName !== undefined
                      ? getSelectedUnitDetails?.legalName
                      : ""
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="half-div">
                <TextField
                  disabled
                  required
                  label="Website"
                  style={{ margin: 4 }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="form-auto hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.website !== undefined
                      ? getSelectedUnitDetails?.website
                      : ""
                  }
                />
              </div>
            </div>

            <div className="es-unit-field">
              <div className="half-div">
                <TextField
                  disabled
                  multiline
                  maxrows={3}
                  required
                  label="Address Line 1"
                  style={{ margin: 4, width: "90%" }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="form-auto address-field hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.addressLine1 !== undefined
                      ? getSelectedUnitDetails?.addressLine1
                      : ""
                  }
                />
              </div>
              <div className="half-div">
                <TextField
                  disabled
                  required
                  label="Address Line 2"
                  style={{ margin: 4, width: "90%" }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="form-auto hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.addressLine2 !== undefined
                      ? getSelectedUnitDetails?.addressLine2
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
                  label="Phone Number"
                  style={{ margin: 4, width: "90%" }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="form-auto hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.phoneNumber !== undefined
                      ? getSelectedUnitDetails?.phoneNumber
                      : ""
                  }
                />
              </div>
              <div className="half-div">
                <TextField
                  disabled
                  required
                  label="Toll Free Number"
                  style={{ margin: 4, width: "90%" }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="form-auto hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.tollFreeNumber !== undefined
                      ? getSelectedUnitDetails?.tollFreeNumber
                      : ""
                  }
                />
              </div>
            </div>

            <div className="break"></div>
            <div style={{ marginLeft: "-17px" }}>
              <div className="info-div">
                <div className="selection-div">
                  <TextField
                    label="Country"
                    id="country"
                    disabled
                    value={
                      getSelectedUnitDetails?.country
                        ? getSelectedUnitDetails?.country
                        : ""
                    }
                    required
                    margin="normal"
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    className="half-div  mar-left-10 newblock hospital-unit-label"
                  />
                </div>
                <div className="selection-div some-align ">
                  <TextField
                    disabled
                    label="State/Province"
                    id="state"
                    value={
                      getSelectedUnitDetails?.state !== undefined
                        ? getSelectedUnitDetails?.state
                        : ""
                    }
                    required
                    margin="normal"
                    variant="filled"
                    className="half-div  mar-left-10 newblock hospital-unit-label"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
              <div className="info-div">
                <div className="selection-div ">
                  <TextField
                    disabled
                    label="City"
                    id="city"
                    value={
                      getSelectedUnitDetails?.city !== undefined
                        ? getSelectedUnitDetails?.city
                        : ""
                    }
                    required
                    margin="normal"
                    variant="filled"
                    className="half-div  mar-left-10 newblock hospital-unit-label"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <TextField
                  disabled
                  required
                  label="PIN"
                  style={{ margin: "6px 8px" }}
                  margin="normal"
                  variant="filled"
                  className="more hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.pincode !== undefined
                      ? getSelectedUnitDetails?.pincode
                      : ""
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="break"></div>

              <div className="three-div">
                <TextField
                  disabled
                  required
                  label="Corporate ID"
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="more hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.corporateId !== undefined
                      ? getSelectedUnitDetails?.corporateId
                      : ""
                  }
                />
                <div className="upload-option">
                  <input
                    disabled
                    required
                    type="file"
                    className="choose"
                    id="corporateId"
                  />
                  <label
                    htmlFor="corporateId"
                    className={`dragContent drag-content-box ${
                      getSelectedUnitDetails?.corporateIdUrl !== undefined
                        ? "label-image-cover"
                        : ""
                    }`}
                  >
                    <div
                      style={{ display: "inline-grid", flexDirection: "row" }}
                    >
                      {/* <div className="upload-icon-position">
                        <img src="/logo/upload_icon.svg" />
                      </div> */}
                      <div className="upload-instruction">
                        <p> No Data Found </p>
                      </div>
                      {/* <div className="upload-instruction">
                        <Button disabled variant="contained" className="upload-doc-1">
                          Or select files to upload
                        </Button>
                      </div> */}
                    </div>
                  </label>
                  {!!(getSelectedUnitDetails?.corporateIdUrl !== undefined) && (
                    <div className="img-preview-div display-img-div">
                      <img
                        id="ImgPreview"
                        className="preview1 img-spec"
                        src={`${config.API_URL}/api/utility/download/${getSelectedUnitDetails?.corporateIdUrl}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="three-div">
                <TextField
                  disabled
                  required
                  label="Corporate Tax ID"
                  style={{ margin: 8 }}
                  variant="filled"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  className="more hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.corporateTaxId !== undefined
                      ? getSelectedUnitDetails?.corporateTaxId
                      : ""
                  }
                />
                <div className="upload-option">
                  <input
                    disabled
                    required
                    type="file"
                    className="choose"
                    id="corporateTaxId"
                  />
                  <label
                    htmlFor="corporateId"
                    className={`dragContent drag-content-box ${
                      getSelectedUnitDetails?.corporateTaxIdUrl !== undefined
                        ? "label-image-cover"
                        : ""
                    }`}
                  >
                    <div
                      style={{ display: "inline-grid", flexDirection: "row" }}
                    >
                      {/* <div className="upload-icon-position">
                        <img src="/logo/upload_icon.svg" />
                      </div> */}
                      <div className="upload-instruction">
                        <p> No Data Found </p>
                      </div>
                      {/* <div className="upload-instruction">
                        <Button disabled variant="contained" className="upload-doc-1">
                          Or select files to upload
                        </Button>
                      </div> */}
                    </div>
                  </label>
                  {!!(
                    getSelectedUnitDetails?.corporateTaxIdUrl !== undefined
                  ) && (
                    <div className="img-preview-div display-img-div">
                      <img
                        id="ImgPreview"
                        className="preview1 img-spec"
                        src={`${config.API_URL}/api/utility/download/${getSelectedUnitDetails?.corporateTaxIdUrl}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="three-div">
                <TextField
                  disabled
                  required
                  label="Good & Services Tax ID"
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  className="more hospital-unit-label"
                  value={
                    getSelectedUnitDetails?.goodsAndServicesTaxId !== undefined
                      ? getSelectedUnitDetails?.goodsAndServicesTaxId
                      : ""
                  }
                />
                <div className="upload-option">
                  <input
                    disabled
                    required
                    type="file"
                    className="choose"
                    id="corporateSTaxId"
                  />
                  <label
                    htmlFor="corporateId"
                    className={`dragContent drag-content-box ${
                      getSelectedUnitDetails?.goodsAndServicesTaxIdUrl !==
                      undefined
                        ? "label-image-cover"
                        : ""
                    }`}
                  >
                    <div
                      style={{ display: "inline-grid", flexDirection: "row" }}
                    >
                      {/* <div className="upload-icon-position">
                        <img src="/logo/upload_icon.svg" />
                      </div> */}
                      <div className="upload-instruction">
                        <p> No Data Found </p>
                      </div>
                      {/* <div className="upload-instruction">
                        <Button disabled variant="contained" className="upload-doc-1">
                          Or select files to upload
                        </Button>
                      </div> */}
                    </div>
                  </label>
                  {!!(
                    getSelectedUnitDetails?.goodsAndServicesTaxIdUrl !==
                    "undefined"
                  ) && (
                    <div className="img-preview-div display-img-div">
                      <img
                        id="ImgPreview"
                        className="preview1 img-spec"
                        src={`${config.API_URL}/api/utility/download/${getSelectedUnitDetails?.goodsAndServicesTaxIdUrl}`}
                      />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 30 }}></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
