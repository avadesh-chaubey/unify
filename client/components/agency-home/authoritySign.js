import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { StepUpdateContext } from "../../context/registerStep";
import { UserUpdateContext } from "../../context/basiciSignup";
import { useRouter } from "next/router";
import Icon from "@material-ui/core/Icon";
import { useAlert, types } from "react-alert";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Header from "../header/header";

function AuthoritySign({
  userData,
  type,
  partnerId,
  setMsgData,
  addNewUnitPerm,
}) {
  const router = useRouter();
  const alert = useAlert();
  const { step, newStep } = useContext(StepUpdateContext);
  const { user, newUser } = useContext(UserUpdateContext);
  const [authorityName, setAuthorityName] = useState("");
  const [authorityEmail, setAuthorityEmail] = useState("");
  const [authorityEmailError, setAuthorityEmailError] = useState("");
  const [authorityTaxId, setAuthorityTaxId] = useState("");
  const [authoritySTaxId, setAuthoritySTaxId] = useState("");
  const [loader, setLoader] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [cookies, getCookie] = useCookies(["name"]);
  const [uid, setUid] = useState(Math.floor(Math.random() * 99));
  const [authorityTaxvalue, setAuthorityTaxvalue] = useState("");
  const [authorityTaxValURL, setAuthorityTaxValURL] = useState("");
  const [authoritySTaxvalue, setAuthoritySTaxvalue] = useState("");
  const [authoritySTaxValURL, setAuthoritySTaxValURL] = useState("");
  const [authorityTaxFileName, setAuthorityTaxFileName] = useState("");
  const [authoritySTaxFileName, setAuthoritySTaxFileName] = useState("");
  const [signingAuthTaxIdUrl, setSigningAuthTaxIdUrl] = useState("");
  const [signingAuthLetterUrl, setSigningAuthLetterUrl] = useState("");
  const [authTaxIdImgErr, setAuthTaxIdImgErr] = useState("");
  const [authTitleImgErr, setAuthTitleImgErr] = useState("");

  useEffect(() => {
    if (partnerId !== "") {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(`${config.API_URL}/api/partner/signingauth/${partnerId}`, {
          headers,
        })
        .then((res) => {
          const {
            signingAuthName,
            signingAuthWorkEmail,
            signingAuthTaxId,
            signingAuthTaxIdUrl,
            signingAuthTitle,
            signingAuthLetterUrl,
          } = res.data.data;

          setAuthorityName(signingAuthName);
          setAuthorityEmail(signingAuthWorkEmail);
          setAuthorityTaxId(signingAuthTaxId);
          setAuthoritySTaxId(signingAuthTitle);
          let newVal = signingAuthTaxIdUrl.replace(/^.*[\\\/]/, "");
          setAuthorityTaxvalue(newVal);
          setAuthorityTaxFileName(signingAuthTaxIdUrl);
          setAuthorityTaxValURL(
            `${config.API_URL}/api/utility/download/${signingAuthTaxIdUrl}`
          );
          newVal = signingAuthLetterUrl.replace(/^.*[\\\/]/, "");
          setAuthoritySTaxvalue(newVal);
          setAuthoritySTaxFileName(signingAuthLetterUrl);
          setAuthoritySTaxValURL(
            `${config.API_URL}/api/utility/download/${signingAuthLetterUrl}`
          );
        })
        .catch((err) =>
          console.log("Fetch auth-sign details from api", err.response)
        );
    }
  }, [partnerId]);

  const imageValidation = (file) => {
    const allowedFileSize = 2048;
    const allowedFileType = "jpg, jpeg, png, JPG, JPEG, PNG";
    const getFileSize = file.size / 1024;

    // Validate image wrt file extension
    const getImgExt = file.name.split(".")[1];

    if (allowedFileType.indexOf(getImgExt) < 0) {
      return "Only jpeg, jpg and png files are allowed for Banner Image";
    } else if (getFileSize > allowedFileSize) {
      return "Max file size exceeded. File size should be less than 2MB.";
    }

    return "";
  };

  const authorityTaxChange = (e) => {
    e.preventDefault();
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const file = e.target.files[0];
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateAuthIdImg = imageValidation(file);
    if (validateAuthIdImg !== "") {
      setAuthTaxIdImgErr(validateAuthIdImg);
      return;
    }

    setAuthTaxIdImgErr("");
    setAuthorityTaxvalue(newVal);
    setAuthorityTaxValURL(URL.createObjectURL(e.target.files[0]));
    setAuthorityTaxFileName(filename);
  };

  const authoritySTaxChange = (e) => {
    e.preventDefault();
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const file = e.target.files[0];
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateAuthTitleImg = imageValidation(file);
    if (validateAuthTitleImg !== "") {
      setAuthTitleImgErr(validateAuthTitleImg);
      return;
    }

    setAuthTitleImgErr("");
    setAuthoritySTaxvalue(newVal);
    setAuthoritySTaxValURL(URL.createObjectURL(e.target.files[0]));
    setAuthoritySTaxFileName(filename);
  };

  const deleteAuthorityTaxvalue = (e) => {
    e.preventDefault();
    setAuthorityTaxvalue("");
    setAuthorityTaxFileName("");
    setAuthorityTaxValURL("");
  };

  const deleteAuthoritySTaxvalue = (e) => {
    e.preventDefault();
    setAuthoritySTaxvalue("");
    setAuthoritySTaxFileName("");
    setAuthoritySTaxValURL("");
  };

  function ValidateEmail(mail) {
    setAuthorityEmail(mail.target.value);
    const {
      target: { value },
    } = event;
    setAuthorityEmailError({ authorityEmail: "" });
    setAuthorityEmail(value);
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      setAuthorityEmailError({ authorityEmail: "Please enter valid email" });
    }
  }

  const fetchAuthorityDetails = async () => {
    try {
      const getSavedData = JSON.parse(localStorage.getItem("authorizedSign"));

      if (getSavedData) {
        const {
          signingAuthName,
          signingAuthWorkEmail,
          signingAuthTaxId,
          signingAuthTaxIdUrl,
          signingAuthTitle,
          signingAuthLetterUrl,
        } = getSavedData;

        setAuthorityName(signingAuthName);
        setAuthorityEmail(signingAuthWorkEmail);
        setAuthorityTaxId(signingAuthTaxId);
        setAuthoritySTaxId(signingAuthTitle);
        let newVal = signingAuthTaxIdUrl.replace(/^.*[\\\/]/, "");
        setAuthorityTaxvalue(newVal);
        setAuthorityTaxFileName(signingAuthTaxIdUrl);
        setAuthorityTaxValURL(
          `${config.API_URL}/api/utility/download/${signingAuthTaxIdUrl}`
        );
        newVal = signingAuthLetterUrl.replace(/^.*[\\\/]/, "");
        setAuthoritySTaxvalue(newVal);
        setAuthoritySTaxFileName(signingAuthLetterUrl);
        setAuthoritySTaxValURL(
          `${config.API_URL}/api/utility/download/${signingAuthLetterUrl}`
        );
      }
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (localStorage.hasOwnProperty("authorizedSign")) {
      fetchAuthorityDetails();
    }
  }, []);

  let documentarr = [];

  const submitAuthoritySign = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (authorityTaxvalue === "" || authoritySTaxvalue === "") {
      setErrMsg(true);
      setMsgData({
        message: "All fields are required",
        type: "error",
      });
      return false;
    }

    documentarr = [];

    if (authorityTaxvalue !== "" && authorityTaxFileName.includes("agency")) {
      documentarr.push({
        name: "Authority Tax ID",
        id: "authorityTaxId",
        key: authorityTaxvalue,
        filename: authorityTaxFileName,
      });
    }
    if (authoritySTaxvalue !== "" && authoritySTaxFileName.includes("agency")) {
      documentarr.push({
        name: "Authority Service Tax ID",
        id: "authoritySTaxId",
        key: authoritySTaxvalue,
        filename: authoritySTaxFileName,
      });
    }

    setLoader(true);
    if (
      documentarr.length > 0 &&
      localStorage.hasOwnProperty("authorizedSign") === false
    ) {
      uploadImages();
    } else if (localStorage.hasOwnProperty("authorizedSign")) {
      newStep(parseInt(step) + 1);

      if (partnerId !== "") {
        router.push(`/companydetails?bankAccount&partnerId=${partnerId}`);
      } else {
        router.push("/companydetails?bankAccount");
      }
    } else {
      finalsave(authorityTaxFileName, authoritySTaxFileName);
    }
  };

  const uploadImages = () => {
    let signingAuthTaxIdUrlofStoredLocation = null;
    let signingAuthTitleUrlofStoredLocation = null;
    const saveImage = (a) => {
      var model = {
        file: document.getElementById(documentarr[a].id).files[0],
      };
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      var configs = {
        headers: {
          "Content-Type": "multipart/form-data",
          type: "formData",
          authtoken: JSON.parse(localStorage.getItem("token")),
        },
        transformRequest: function (obj) {
          var formData = new FormData();
          for (var prop in obj) {
            formData.append(prop, obj[prop]);
          }
          return formData;
        },
      };

      axios
        .post(config.API_URL + "/api/utility/upload", model, configs)
        .then((response) => {
          console.log(response.data);
          if (a == 0) {
            signingAuthTaxIdUrlofStoredLocation = response.data.data.fileName;
            setSigningAuthTaxIdUrl(response.data.data.fileName);
          }
          if (a == 1) {
            signingAuthTitleUrlofStoredLocation = response.data.data.fileName;
            setSigningAuthLetterUrl(response.data.data.fileName);
          }
          if (a < documentarr.length - 1) {
            saveImage(a + 1);
          } else if (a === documentarr.length - 1) {
            console.log("after saving images, finalcall");
            finalsave(
              signingAuthTaxIdUrlofStoredLocation,
              signingAuthTitleUrlofStoredLocation
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    };
    saveImage(0);
  };

  const finalsave = (
    signingAuthTaxIdUrlofStoredLocation,
    signingAuthTitleUrlofStoredLocation
  ) => {
    setLoader(false);

    let obj = {
      signingAuthName: authorityName,
      signingAuthWorkEmail: authorityEmail,
      signingAuthTaxId: authorityTaxId,
      signingAuthTaxIdUrl: signingAuthTaxIdUrlofStoredLocation,
      signingAuthTitle: authoritySTaxId,
      signingAuthLetterUrl: signingAuthTitleUrlofStoredLocation,
      partnerId:
        partnerId !== ""
          ? partnerId
          : JSON.parse(localStorage.getItem("unitOnboarding")).partnerId,
    };

    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setLoader(true);
    const url = config.API_URL + "/api/partner/signingauth";

    if (partnerId !== "") {
      axios
        .put(url, obj, { headers })
        .then((response) => {
          console.log(response.data);
          setLoader(false);
          newStep(parseInt(step) + 1);

          router.push(`/companydetails?bankAccount&partnerId=${partnerId}`);
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
        });
    } else {
      localStorage.setItem("authorizedSign", JSON.stringify(obj));

      axios
        .post(url, obj, { headers })
        .then((response) => {
          console.log(response.data);
          setLoader(false);
          newStep(parseInt(step) + 1);

          router.push("/companydetails?bankAccount");
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
        });
    }
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text">Uploading Authorized Signatory</div>
        </div>
      )}
      <Header name="Authorized Signatory" />
      <div className="form-input authSign">
        <form noValidate autoComplete="off" onSubmit={submitAuthoritySign}>
          <div className="half-div">
            <TextField
              required
              id="title"
              error={errMsg && authorityName === ""}
              label="Signing Authority Name"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              helperText={
                errMsg && authorityName === ""
                  ? "Please enter the Signing Authority Name"
                  : ""
              }
              className={
                "form-auto " + (errMsg && authorityName === "" ? "err" : "")
              }
              value={authorityName}
              onChange={(e) => setAuthorityName(e.target.value)}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="half-div">
            <TextField
              required
              error={errMsg && authorityEmail === ""}
              label="Signing Authority Work Email"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              // error={errMsg && authorityEmail === ""}
              helperText={
                errMsg && authorityEmail === ""
                  ? "Please enter the Signing Authority Work Email"
                  : ""
              }
              className={
                "form-auto " + (errMsg && authorityEmail === "" ? "err" : "")
              }
              value={authorityEmail}
              onChange={ValidateEmail}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="break"></div>
          <div style={{ marginLeft: "-17px" }}>
            <div className="two-div">
              <TextField
                required
                id="title"
                error={errMsg && authorityTaxId === ""}
                label="Signing Authority Tax ID"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                className={
                  "more " + (errMsg && authorityTaxId === "" ? "err" : "")
                }
                value={authorityTaxId}
                onChange={(e) => setAuthorityTaxId(e.target.value)}
                helperText={
                  errMsg && authorityTaxId === ""
                    ? "Please enter the Signing Authority Tax ID"
                    : ""
                }
                // disabled={!addNewUnitPerm.editChecked}
              />
              <div className="upload-option">
                <input
                  type="file"
                  className="choose"
                  id="authorityTaxId"
                  onChange={authorityTaxChange}
                  // disabled={!addNewUnitPerm.editChecked}
                />
                <label
                  htmlFor="authorityTaxId"
                  className={`
                    dragContent
                    ${authorityTaxValURL !== "" ? "label-image-cover" : ""}
                    ${errMsg && authorityTaxvalue === "" ? "err" : ""}
                  `}
                  // disabled={!addNewUnitPerm.editChecked}
                >
                  {!!(authorityTaxvalue === "") && (
                    <>
                      <img src="upload.svg" />
                      <span className="dragContentText">
                        Upload scanned copy of Permanent Account Number (PAN)
                        Card
                      </span>
                    </>
                  )}
                </label>
                {!!(authorityTaxvalue !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      src={authorityTaxValURL}
                      className="preview1 img-spec"
                    />
                    <div
                      id="removeImage1"
                      className="rmv"
                      onClick={deleteAuthorityTaxvalue}
                    >
                      <Grid item xs={8}>
                        <DeleteOutlinedIcon className="del-icon" />
                      </Grid>
                    </div>
                  </div>
                )}
              </div>
              {!!authTaxIdImgErr && (
                <p className="validation-message">{authTaxIdImgErr}</p>
              )}
            </div>

            <div className="two-div">
              <TextField
                required
                id="title"
                error={errMsg && authoritySTaxId === ""}
                label="Signing Authority Title"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  "more " + (errMsg && authoritySTaxId === "" ? "err" : "")
                }
                value={authoritySTaxId}
                onChange={(e) => setAuthoritySTaxId(e.target.value)}
                helperText={
                  errMsg && authoritySTaxId === ""
                    ? "Please enter the Signing Authority Title"
                    : ""
                }
                // disabled={!addNewUnitPerm.editChecked}
              />
              <div className="upload-option">
                <input
                  type="file"
                  className="choose"
                  id="authoritySTaxId"
                  onChange={authoritySTaxChange}
                  // disabled={!addNewUnitPerm.editChecked}
                />
                <label
                  htmlFor="authoritySTaxId"
                  className={`
                    dragContent
                    ${authoritySTaxValURL !== "" ? "label-image-cover" : ""}
                    ${errMsg && authoritySTaxvalue === "" ? "err" : ""}
                  `}
                  // disabled={!addNewUnitPerm.editChecked}
                >
                  {!!(authoritySTaxvalue === "") && (
                    <>
                      <img src="upload.svg" />
                      <span className="dragContentText">
                        Upload Scanned copy of Signing Authority Title
                      </span>
                    </>
                  )}
                </label>
                {!!(authoritySTaxvalue !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      src={authoritySTaxValURL}
                      className="preview1 img-spec"
                    />
                    <div
                      id="removeImage1"
                      className="rmv"
                      onClick={deleteAuthoritySTaxvalue}
                    >
                      <Grid item xs={8}>
                        <DeleteOutlinedIcon className="del-icon" />
                      </Grid>
                    </div>
                  </div>
                )}
              </div>
              {!!authTitleImgErr && (
                <p className="validation-message">{authTitleImgErr}</p>
              )}
            </div>
          </div>
          <div className="action">
            <Button
              size="small"
              variant="contained"
              className="back"
              style={{ fontSize: "14px", fontWeight: "bold", borderRadius: 30 }}
              // disabled={!addNewUnitPerm.editChecked}
            >
              <Link
                href={
                  partnerId !== ""
                    ? `companydetails?companyInfo&partnerId=${partnerId}`
                    : "companydetails?companyInfo"
                }
                style={{ color: "#000", textDecoration: "none" }}
              >
                Back
              </Link>
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              type="submit"
              style={{
                color: "#000",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: 30,
              }}
              // disabled={!addNewUnitPerm.editChecked}
            >
              NEXT
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AuthoritySign;
