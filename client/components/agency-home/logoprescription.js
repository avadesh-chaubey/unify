import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAlert, types } from "react-alert";
import config from "../../app.constant";
import Header from "../header/header";
import { StepUpdateContext } from "../../context/registerStep";
import { Button, Grid, CircularProgress, Typography } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

export default function LogoPrescription(props) {
  const { partnerId, type, userData, setMsgData, addNewUnitPerm } = props;
  const router = useRouter();
  const alert = useAlert();
  const { step, newStep } = useContext(StepUpdateContext);
  const [loader, setLoader] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoImg, setLogoImg] = useState("");
  const [prescriptionUrl, setPrescriptionUrl] = useState("");
  const [prescriptionImg, setPrescriptionImg] = useState("");
  const [imageArr, setImgArr] = useState([]);

  useEffect(() => {
    if (partnerId !== "") {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(`${config.API_URL}/api/partner/logoInfo/${partnerId}`, {
          headers,
        })
        .then((res) => {
          console.log(res);
          let logoPrescriptionData = res.data.data;
          if (logoPrescriptionData) {
            setLogoUrl(
              logoPrescriptionData.logoUrl !== undefined
                ? logoPrescriptionData.logoUrl
                : ""
            );
            setPrescriptionUrl(
              logoPrescriptionData.prescriptionUrl !== undefined
                ? logoPrescriptionData.prescriptionUrl
                : ""
            );
          } else {
            setMsgData({
              message: "No Logo & Prescription Data Found",
              type: "error",
            });
          }
        })
        .catch((err) => console.log("bank err resp", err.response));
    }
  }, [partnerId]);

  const submitLogoPrescription = () => {
    let logoServerFileName = "";
    let prescriptionServerFileName = "";

    if (imageArr.length) {
      const iterateImgUpload = (i) => {
        const model = {
          file: imageArr[i].filename,
        };

        // Prepare to upload images
        const apiConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            type: "formData",
            authtoken: JSON.parse(localStorage.getItem("token")),
          },
          transformRequest: function (object) {
            var formData = new FormData();
            for (var prop in object) {
              formData.append(prop, object[prop]);
            }
            return formData;
          },
        };

        // Upload image to Cloud Storage Server
        axios
          .post(config.API_URL + "/api/utility/upload", model, apiConfig)
          .then((res) => {
            if (i < imageArr.length - 1) {
              logoServerFileName = res.data.data.fileName;
              setLogoImg(logoServerFileName);
              iterateImgUpload(i + 1);
            } else {
              prescriptionServerFileName = res.data.data.fileName;
              setPrescriptionImg(prescriptionServerFileName);

              // Perform update operationr to store file names on DB
              saveDataToServer();
            }
          })
          .catch((err) => console.log("Failed to upload Image"));
      };
      iterateImgUpload(0);
    }

    // Save File Details to Server
    const saveDataToServer = () => {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      const data = {
        partnerId: JSON.parse(localStorage.getItem("unitOnboarding")).partnerId,
        // partnerId: "621f8dea8db335001b0de716",
        logoUrl: logoServerFileName,
        prescriptionUrl: prescriptionServerFileName,
      };

      axios
        .post(`${config.API_URL}/api/partner/logoandprescription`, data, {
          headers,
        })
        .then((res) => {
          // Remove all the data related to hospital onboarding formdata
          localStorage.removeItem("companyInfo");
          localStorage.removeItem("authorizedSign");
          localStorage.removeItem("unitOnboarding");

          setMsgData({
            message: "Hospital Unit Added successfully",
            type: "success",
          });
          newStep(parseInt(step) + 1);
          setTimeout(() => router.push("/companydetails"), 500);
        });
    };
  };

  const goBackVerifyPage = (e) => {
    e.preventDefault();
    if (partnerId !== "") {
      router.push(`/companydetails?bankAccount&partnerId=${partnerId}`);
    } else {
      router.push("/companydetails?bankAccount");
    }
  };

  const handleLogoUpload = (e) => {
    e.preventDefault();
    const logoFile = e.target.files[0];
    // setLogoImg(logoFile);
    setLogoUrl(URL.createObjectURL(logoFile));

    // Insert the Logo Details in Image Array
    imageArr.push({
      name: "Logo",
      id: "logo",
      key: logoFile.name,
      filename: logoFile,
    });
    setImgArr(imageArr);

    // Reset the file value to null after intialization
    e.target.value = null;
  };

  const deleteLogoImg = (e) => {
    e.preventDefault();
    // setLogoImg('');
    setLogoUrl("");
  };

  const handlePrescriptionUpload = (e) => {
    e.preventDefault();
    const prescriptionFile = e.target.files[0];
    setPrescriptionUrl(URL.createObjectURL(prescriptionFile));
    // Insert the Logo Details in Image Array
    imageArr.push({
      name: "Prescription",
      id: "prescription",
      key: prescriptionFile.name,
      filename: prescriptionFile,
    });
    setImgArr(imageArr);

    // Reset the file value to null after intialization
    e.target.value = null;
  };

  const deletePrescriptionImg = (e) => {
    e.preventDefault();
    setPrescriptionUrl("");
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text">Uploading Bank Account</div>
        </div>
      )}
      <Header name="Logo &amp; Prescription" />
      <div className="form-input bankAcc">
        <div className="es-page">
          <div className="form-input bankAcc as-form-details">
            <form
              noValidate
              autoComplete="off"
              // onSubmit={submitLogoPrescription}
            >
              <div className="logo-pres-fields">
                <div className="two-div logo-div">
                  <Typography
                    className="logo-label"
                    variant="h6"
                    component="h6"
                  >
                    Logo*
                  </Typography>
                  <div className="upload-option">
                    <input
                      type="file"
                      className="choose"
                      id="cancelChequeId"
                      onChange={handleLogoUpload}
                      // disabled={!addNewUnitPerm.editChecked}
                    />
                    <label
                      htmlFor="cancelChequeId"
                      className={`dragContent ${
                        logoUrl !== "" ? "label-image-cover" : ""
                      }`}
                      // disabled={!addNewUnitPerm.editChecked}
                    >
                      <div style={{ display: "grid", flexDirection: "row" }}>
                        <div className="upload-icon-position">
                          <img src="/logo/upload_icon.svg" />
                        </div>
                        <div className="upload-instruction">
                          <p> Drag and drop your Logo Here to Upload </p>
                        </div>
                        <div className="upload-instruction">
                          <Button
                            disabled
                            variant="contained"
                            className="upload-doc-1"
                          >
                            Or select files to upload
                          </Button>
                        </div>
                      </div>
                    </label>
                    {!!(logoUrl !== "") && (
                      <div className="img-preview-div">
                        <img
                          id="ImgPreview"
                          src={logoUrl}
                          className="preview1 img-spec"
                        />
                        <div
                          id="removeImage1"
                          className="rmv"
                          onClick={deleteLogoImg}
                        >
                          <Grid item xs={8}>
                            <DeleteOutlinedIcon className="del-icon" />
                          </Grid>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="two-div prescription">
                  <Typography
                    className="logo-label"
                    variant="h6"
                    component="h6"
                  >
                    Prescription*
                  </Typography>
                  <div className="upload-option">
                    <input
                      type="file"
                      className="choose"
                      id="prescriptionId"
                      onChange={handlePrescriptionUpload}
                      // disabled={!addNewUnitPerm.editChecked}
                    />
                    <label
                      htmlFor="prescriptionId"
                      className={`dragContent ${
                        prescriptionUrl !== "" ? "label-image-cover" : ""
                      }`}
                      // disabled={!addNewUnitPerm.editChecked}
                    >
                      <div style={{ display: "grid", flexDirection: "row" }}>
                        <div className="upload-icon-position">
                          <img src="/logo/upload_icon.svg" />
                        </div>
                        <div className="upload-instruction">
                          <p> Drag and drop your Logo Here to Upload </p>
                        </div>
                        <div className="upload-instruction">
                          <Button
                            disabled
                            variant="contained"
                            className="upload-doc-1"
                          >
                            Or select files to upload
                          </Button>
                        </div>
                      </div>
                    </label>
                    {!!(prescriptionUrl !== "") && (
                      <div className="img-preview-div">
                        <img
                          id="ImgPreview"
                          src={prescriptionUrl}
                          className="preview1 img-spec"
                        />
                        <div
                          id="removeImage1"
                          className="rmv"
                          onClick={deletePrescriptionImg}
                        >
                          <Grid item xs={8}>
                            <DeleteOutlinedIcon className="del-icon" />
                          </Grid>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="action">
                <Button
                  size="small"
                  variant="contained"
                  onClick={goBackVerifyPage}
                  className="back"
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: 30,
                  }}
                >
                  Back
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  className="primary-button forward"
                  type="button"
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: 30,
                  }}
                  onClick={submitLogoPrescription}
                >
                  SUBMIT
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
