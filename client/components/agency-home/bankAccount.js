import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAlert, types } from "react-alert";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Header from "../header/header";
import { StepUpdateContext } from "../../context/registerStep";
import { UserUpdateContext } from "../../context/basiciSignup";
import {
  Button,
  MenuItem,
  Grid,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Icon from "@material-ui/core/Icon";

function BankAccount({
  userData,
  type,
  setMsgData,
  partnerId,
  addNewUnitPerm,
}) {
  const router = useRouter();
  const alert = useAlert();
  const { step, newStep } = useContext(StepUpdateContext);
  const { user, newUser } = useContext(UserUpdateContext);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [ifscError, setifscError] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loader, setLoader] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [cookies] = useCookies(["name"]);
  const [uid, setUid] = useState(Math.floor(Math.random() * 99));
  const [cancelChequevalue, setCancelChequevalue] = useState("");
  const [cancelChequeURL, setCancelChequeURL] = useState("");
  const [cancelChequeFileName, setCancelChequeFileName] = useState("");
  const [bankChequeURL, setBankChequeURL] = useState("");
  const [cancelledCheaqueImgErr, setCancelledCheaqueImgErr] = useState("");

  useEffect(() => {
    if (partnerId !== "") {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(`${config.API_URL}/api/partner/bankdetails/${partnerId}`, {
          headers,
        })
        .then((res) => {
          const {
            bankAccountName,
            bankAccountNumber,
            bankIFSCCode,
            bankName,
            bankChequeURL,
            bankAccountType,
          } = res.data.data;

          setName(bankAccountName);
          setNumber(bankAccountNumber);
          setIfsc(bankIFSCCode);
          setBankName(bankName);
          setAccountType(bankAccountType);

          let newVal = bankChequeURL.replace(/^.*[\\\/]/, "");
          setCancelChequevalue(newVal);
          setCancelChequeFileName(bankChequeURL);
          setCancelChequeURL(
            `${config.API_URL}/api/utility/download/${bankChequeURL}`
          );
        })
        .catch((err) => console.log("bank err resp", err.response));
    }
  }, [partnerId]);

  const goBackVerifyPage = (e) => {
    e.preventDefault();
    if (partnerId !== "") {
      router.push(`/companydetails?authoritySign&partnerId=${partnerId}`);
    } else {
      router.push("/companydetails?authoritySign");
    }
  };

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

  const cancelChequeChange = (e) => {
    e.preventDefault();
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const file = e.target.files[0];
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateCancelledCheqImg = imageValidation(file);
    if (validateCancelledCheqImg !== "") {
      setCancelledCheaqueImgErr(validateCancelledCheqImg);
      return;
    }

    setCancelledCheaqueImgErr("");
    setCancelChequevalue(newVal);
    setCancelChequeURL(URL.createObjectURL(e.target.files[0]));
    setCancelChequeFileName(filename);
  };

  const deleteCancelChequevalue = (e) => {
    e.preventDefault();
    setCancelChequevalue("");
    setCancelChequeFileName("");
    setCancelChequeURL("");
  };

  const fetchBankDetails = async () => {
    try {
      setLoader(true);
      let cookie = "";
      for (const [key, value] of Object.entries(cookies)) {
        if (key === "express:sess") {
          cookie = value;
        }
      }
      let headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };
      const url = config.API_URL + "/api/partner/bankdetails";
      const response = await axios.get(url, { headers });

      console.log(response.data);
      if (response.data) {
        const {
          bankAccountName,
          bankAccountNumber,
          bankIFSCCode,
          bankName,
          bankChequeURL,
        } = response.data.data;

        setName(bankAccountName);
        setNumber(bankAccountNumber);
        setIfsc(bankIFSCCode);
        setBankName(bankName);

        let newVal = bankChequeURL.replace(/^.*[\\\/]/, "");
        setCancelChequevalue(newVal);
        setCancelChequeFileName(bankChequeURL);
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  // useEffect(() => {
  //   fetchBankDetails();
  // }, []);

  let documentarr = [];

  const submitAuthoritySign = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (cancelChequevalue === "") {
      setErrMsg(true);
      setMsgData({
        message: "All fields are required",
        type: "error",
      });
      return false;
    }

    documentarr = [];

    if (cancelChequevalue !== "" && cancelChequeFileName.includes("agency")) {
      documentarr.push({
        name: "Authority Tax ID",
        id: "cancelChequeId",
        key: cancelChequevalue,
        filename: cancelChequeFileName,
      });
    }
    setLoader(true);
    if (
      documentarr.length > 0 &&
      localStorage.hasOwnProperty("bankDetails") === false
    ) {
      uploadImages(0);
    } else if (localStorage.hasOwnProperty("bankDetails")) {
      const getBankDetails = JSON.parse(localStorage.getItem("bankDetails"));

      // Final Submit with Saved Data
      finalsave(getBankDetails.bankChequeURL);
    } else {
      finalsave(cancelChequeFileName);
    }
  };

  const uploadImages = (a) => {
    let setBankChequeURLOfStoredLocation = null;
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
        setBankChequeURLOfStoredLocation = response.data.data.fileName;
        setBankChequeURL(setBankChequeURLOfStoredLocation);
        finalsave(setBankChequeURLOfStoredLocation);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const finalsave = (setBankChequeURLOfStoredLocation) => {
    setLoader(false);

    let obj = {
      bankAccountName: name,
      bankAccountNumber: number,
      bankIFSCCode: ifsc,
      bankName: bankName,
      bankChequeURL: setBankChequeURLOfStoredLocation,
      bankAccountType: accountType,
      // Take partnerId value from variable partnerId during edit mode
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
    const url = config.API_URL + "/api/partner/bankdetails";

    if (partnerId !== "") {
      axios
        .put(url, obj, { headers })
        .then((response) => {
          setLoader(false);

          // Call pop-up to show final message when user is logged in
          setMsgData({ message: "Updated Bank Details Successfully" });
          newStep(parseInt(step) + 1);
          // setTimeout(() => router.push('/hospitalUnit'), 500);
          setTimeout(
            () =>
              router.push(
                `/companydetails?logoprescription&partnerId=${partnerId}`
              ),
            500
          );
        })
        .catch((error) => {
          setLoader(false);
          setMsgData({
            message: "Error occurred during updating Bank Details",
            type: "error",
          });
        });
    } else {
      axios
        .post(url, obj, { headers })
        .then((response) => {
          setLoader(false);

          // Redirect to Logo & Prescription Page
          router.push("/companydetails?logoprescription");
          newStep(parseInt(step) + 1);
        })
        .catch((error) => {
          setLoader(false);
          setMsgData({
            message: "API Error",
            type: "error",
          });
          console.log(error);
        });
    }
  };

  const signout = async () => {
    await axios
      .post(config.API_URL + "/api/users/signout")
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        setMsgData({
          message: "API Error",
          type: "error",
        });
      });
  };
  const validateIfsc = (code) => {
    setIfsc(code.target.value);
    // const {
    //   target: { value },
    // } = event;
    // setifscError({ ifsc: "" });
    // setIfsc(value);
    // let reg = new RegExp(/^[A-Za-z]{4}\d{7}$/).test(value);
    // if (!reg) {
    //   setifscError({ ifsc: "Please enter valid IFSC Code" });
    // }
  };
  const validateBankNumber = (code) => {
    setNumber(code.target.value);
    const {
      target: { value },
    } = event;
    setNumberError({ number: "" });
    setNumber(value);
    let reg = new RegExp(/^\d*$/).test(value);
    if (!reg) {
      setNumberError({ number: "Please enter only numbers" });
    }
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text">Uploading Bank Account</div>
        </div>
      )}
      <Header name="Bank Details" />
      <div className="form-input bankAcc">
        <form noValidate autoComplete="off" onSubmit={submitAuthoritySign}>
          <div className="half-div">
            <TextField
              required
              id="title"
              label="Account Name"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              error={errMsg && name === ""}
              helperText={
                errMsg && name === "" ? "Please enter your Account Name" : ""
              }
              className={"form-auto " + (errMsg && name === "" ? "err" : "")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="half-div">
            <TextField
              required
              id="title"
              label="Account Number"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              error={errMsg && number === ""}
              helperText={
                errMsg && number === ""
                  ? "Please enter your Account Number"
                  : ""
              }
              className={"form-auto" + (errMsg && number === "" ? "err" : "")}
              value={number}
              onChange={validateBankNumber}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="half-div">
            <TextField
              required
              id="title"
              label="IFSC Code"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              error={errMsg && ifsc === ""}
              helperText={
                errMsg && ifsc === "" ? "Please enter the IFSC Code" : ""
              }
              className={"form-auto " + (errMsg && ifsc === "" ? "err" : "")}
              value={ifsc}
              onChange={validateIfsc}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="half-div">
            <TextField
              required
              id="title"
              label="Bank Name"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              error={errMsg && bankName === ""}
              helperText={
                errMsg && bankName === "" ? "Please enter your Bank Name" : ""
              }
              className={
                "form-auto " + (errMsg && bankName === "" ? "err" : "")
              }
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              // disabled={!addNewUnitPerm.editChecked}
            />
          </div>
          <div className="half-div">
            <TextField
              select
              value={accountType}
              error={errMsg && accountType === ""}
              required
              id="title"
              label="Account Type"
              style={{ margin: 4 }}
              margin="normal"
              variant="filled"
              className={`form-auto accType ${
                errMsg && accountType === "" ? "err" : ""
              }`}
              onChange={(e) => setAccountType(e.target.value)}
              helperText={
                errMsg && accountType === "" ? "Please select Account Type" : ""
              }
              // disabled={!addNewUnitPerm.editChecked}
            >
              <MenuItem disabled value="current">
                {" "}
                Select Account Type{" "}
              </MenuItem>
              <MenuItem value="CURRENT"> Current </MenuItem>
              <MenuItem value="SAVINGS"> Savings </MenuItem>
            </TextField>
          </div>
          <br />
          <div style={{ marginLeft: "-17px" }}>
            <div className="two-div">
              <div className="upload-option">
                <input
                  type="file"
                  className="choose"
                  id="cancelChequeId"
                  onChange={cancelChequeChange}
                  // disabled={!addNewUnitPerm.editChecked}
                />
                <label
                  htmlFor="cancelChequeId"
                  className={`
                    dragContent
                    ${errMsg && cancelChequevalue === "" ? "err" : ""}
                    ${cancelChequeURL !== "" ? "label-image-cover" : ""}
                  `}
                  // disabled={!addNewUnitPerm.editChecked}
                >
                  {!!(cancelChequevalue === "") && (
                    <>
                      <img src="upload.svg" />
                      <span className="dragContentText">
                        Upload Scanned copy of cancelled cheque
                      </span>
                    </>
                  )}
                </label>
                {!!(cancelChequevalue !== "") && (
                  <div className="img-preview-div">
                    <img
                      id="ImgPreview"
                      src={cancelChequeURL}
                      className="preview1 img-spec"
                    />
                    <div
                      id="removeImage1"
                      className="rmv"
                      onClick={deleteCancelChequevalue}
                    >
                      <Grid item xs={8}>
                        <DeleteOutlinedIcon className="del-icon" />
                      </Grid>
                    </div>
                  </div>
                )}
              </div>
              {!!cancelledCheaqueImgErr && (
                <p className="validation-message">{cancelledCheaqueImgErr}</p>
              )}
            </div>
          </div>
          <div className="two-div"></div>

          <div className="action">
            <Button
              size="small"
              variant="contained"
              onClick={goBackVerifyPage}
              className="back"
              style={{ fontSize: "14px", fontWeight: "bold", borderRadius: 30 }}
              // disabled={!addNewUnitPerm.editChecked}
            >
              Back
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
              Next
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BankAccount;
