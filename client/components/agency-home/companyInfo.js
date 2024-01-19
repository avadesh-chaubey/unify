import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
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

function CompanyInfo({ userData, type, partnerId, setMsgData }) {
  const router = useRouter();
  const alert = useAlert();

  const { step, newStep } = useContext(StepUpdateContext);
  const { user, newUser } = useContext(UserUpdateContext);
  const [country, setCountry] = useState("India");
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [state, setState] = useState("");
  const [corporateName, setCorporateName] = useState("");
  const [corporateId, setCorporateId] = useState("");
  const [corporateTaxId, setCorporateTaxId] = useState("");
  const [corporateSTaxId, setCorporateSTaxId] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [loader, setLoader] = useState(false);
  const [corporateIdUrl, setCorporateIdUrl] = useState("");
  const [corporateTaxIdUrl, setCorporateTaxIdUrl] = useState("");
  const [goodsAndServicesTaxIdUrl, setGoodsAndServicesTaxIdUrl] = useState("");
  const [cookies, getCookie] = useCookies(["name"]);
  const [uid, setUid] = useState(Math.floor(Math.random() * 99));
  const [phoneNumber, setPhoneNum] = useState("");
  const [tollFreeNum, setTollFreeNum] = useState("");
  const [corporatevalue, setCorporatevalue] = useState("");
  const [corporateValURL, setCorporateValURL] = useState("");
  const [corporateTaxvalue, setCorporateTaxvalue] = useState("");
  const [corporateTaxURL, setCorporateTaxURL] = useState("");
  const [corporateSTaxvalue, setCorporateSTaxvalue] = useState("");
  const [corporateSTaxvalURL, setCorporateSTaxvalURL] = useState("");
  const [corporateFileName, setCorporateFileName] = useState("");
  const [corporateTaxFileName, setCorporateTaxFileName] = useState("");
  const [corporateSTaxFileName, setCorporateSTaxFileName] = useState("");

  const [corporateImgErr, setCorporateImgErr] = useState("");
  const [taxIdErr, setTaxIdErr] = useState("");
  const [gstIdImgErr, setGstIdImgErr] = useState("");

  useEffect(() => {
    if (partnerId !== "") {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };
      axios
        .get(`${config.API_URL}/api/partner/information/${partnerId}`, {
          headers,
        })
        .then((res) => {
          const {
            legalName,
            website,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            pincode,
            phoneNumber,
            tollFreeNumber,
            corporateId,
            corporateIdUrl,
            corporateTaxId,
            corporateTaxIdUrl,
            goodsAndServicesTaxId,
            goodsAndServicesTaxIdUrl,
          } = res.data.data;

          setCorporateName(legalName);
          setWebsiteLink(website);
          setCorporateId(corporateId);
          setCorporateTaxId(corporateTaxId);
          setCorporateSTaxId(goodsAndServicesTaxId);
          let newVal = corporateIdUrl.replace(/^.*[\\\/]/, "");
          setCorporatevalue(newVal);
          setCorporateFileName(corporateIdUrl);
          setCorporateValURL(
            `${config.API_URL}/api/utility/download/${corporateIdUrl}`
          );
          newVal = corporateTaxIdUrl.replace(/^.*[\\\/]/, "");
          setCorporateTaxvalue(newVal);
          setCorporateTaxFileName(corporateTaxIdUrl);
          setCorporateTaxURL(
            `${config.API_URL}/api/utility/download/${corporateTaxIdUrl}`
          );
          newVal = goodsAndServicesTaxIdUrl.replace(/^.*[\\\/]/, "");
          setCorporateSTaxvalue(newVal);
          setCorporateSTaxFileName(goodsAndServicesTaxIdUrl);
          setCorporateSTaxvalURL(
            `${config.API_URL}/api/utility/download/${goodsAndServicesTaxIdUrl}`
          );
          setAddressLine1(addressLine1);
          setAddressLine2(addressLine2);
          setPin(pincode);
          setPhoneNum(phoneNumber);
          setTollFreeNum(tollFreeNumber);
          setTimeout(function () {
            setCountry(country);
          }, 1000);
          setTimeout(function () {
            setState(state);
          }, 2000);
          setTimeout(function () {
            setCity(city);
          }, 3000);
        })
        .catch((err) => console.log("Company Info Err", err.res));
    }
  }, [partnerId]);

  const getCountryList = () => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/flag/images")
      .then((res) => setCountryList(res.data.data))
      .catch((err) => console.log("Country Error Log", err));
  };

  useEffect(() => {
    if (!countryList.length) {
      getCountryList();
    }
    // Fetch all the state of the selected country
    if (stateList.length === 0) {
      axios
        .get(`${config.API_URL}/api/utility/state?countryName=${country}`)
        .then((res) => setStateList(res.data.data))
        .catch((err) =>
          setMsgData({
            message: "Error occurred while fetching state url",
            type: "error",
          })
        );
    }

    if (state !== "") {
      setLoader(true);
      axios
        .get(
          `${config.API_URL}/api/utility/city?countryName=${country}&stateName=${state}`
        )
        .then((res) => {
          setCityList(res.data.data);
          setLoader(false);
        })
        .catch((err) => {
          setMsgData({
            message: `Error occurred while getting city list of state ${state}`,
            type: "error",
          });
          setLoader(false);
        });
    }
  }, [countryList, stateList, state]);

  const goBackVerifyPage = (e) => {
    e.preventDefault();

    // Redirect to hospital-unit page if user is logged in
    router.push("/admin/hospitalUnit");
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

  const corporateChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateImg = imageValidation(file);
    if (validateImg !== "") {
      setCorporateImgErr(validateImg);
      return;
    }

    setCorporatevalue(newVal);
    setCorporateValURL(URL.createObjectURL(e.target.files[0]));
    setCorporateImgErr("");
    setCorporateFileName(filename);
  };
  const corporateTaxChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateTaxIdImg = imageValidation(file);
    if (validateTaxIdImg !== "") {
      setTaxIdErr(validateTaxIdImg);
      return;
    }

    setCorporateTaxvalue(newVal);
    setCorporateTaxURL(URL.createObjectURL(e.target.files[0]));
    setCorporateTaxFileName(filename);
    setTaxIdErr("");
  };
  const corporateSTaxChange = (e) => {
    e.preventDefault();
    const newVal = e.target.value.replace(/^.*[\\\/]/, "");
    const file = e.target.files[0];
    const timestamp = new Date().getTime();
    const fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    const filename = "agency/" + uid + "/" + timestamp + "_" + fileRe;

    // Validate image wrt file extension
    const validateGstIdImg = imageValidation(file);
    if (validateGstIdImg !== "") {
      setGstIdImgErr(validateGstIdImg);
      return;
    }

    setGstIdImgErr("");
    setCorporateSTaxvalue(newVal);
    setCorporateSTaxvalURL(URL.createObjectURL(e.target.files[0]));
    setCorporateSTaxFileName(filename);
  };

  const deleteCorporatevalue = (e) => {
    e.preventDefault();
    setCorporatevalue("");
    setCorporateFileName("");
    setCorporateValURL("");
  };

  const deleteCorporateTaxvalue = (e) => {
    e.preventDefault();
    setCorporateTaxvalue("");
    setCorporateTaxFileName("");
    setCorporateTaxURL("");
  };

  const deleteCorporateSTaxvalue = (e) => {
    e.preventDefault();
    setCorporateSTaxvalue("");
    setCorporateSTaxFileName("");
    setCorporateSTaxvalURL("");
  };

  const fetchCompanyDetails = async () => {
    try {
      const getCompanyInfo = JSON.parse(localStorage.getItem("companyInfo"));

      if (getCompanyInfo) {
        const {
          legalName,
          website,
          addressLine1,
          addressLine2,
          city,
          state,
          country,
          pincode,
          corporateId,
          corporateIdUrl,
          corporateTaxId,
          corporateTaxIdUrl,
          goodsAndServicesTaxId,
          goodsAndServicesTaxIdUrl,
        } = getCompanyInfo;

        setCorporateName(legalName);
        setWebsiteLink(website);
        setCorporateId(corporateId);
        setCorporateTaxId(corporateTaxId);
        setCorporateSTaxId(goodsAndServicesTaxId);
        let newVal = corporateIdUrl.replace(/^.*[\\\/]/, "");
        setCorporatevalue(newVal);
        setCorporateFileName(corporateIdUrl);
        setCorporateValURL(
          `${config.API_URL}/api/utility/download/${corporateIdUrl}`
        );
        newVal = corporateTaxIdUrl.replace(/^.*[\\\/]/, "");
        setCorporateTaxvalue(newVal);
        setCorporateTaxFileName(corporateTaxIdUrl);
        setCorporateTaxURL(
          `${config.API_URL}/api/utility/download/${corporateTaxIdUrl}`
        );
        newVal = goodsAndServicesTaxIdUrl.replace(/^.*[\\\/]/, "");
        setCorporateSTaxvalue(newVal);
        setCorporateSTaxFileName(goodsAndServicesTaxIdUrl);
        setCorporateSTaxvalURL(
          `${config.API_URL}/api/utility/download/${goodsAndServicesTaxIdUrl}`
        );
        setAddressLine1(addressLine1);
        setAddressLine2(addressLine2);
        setPin(pincode);
        setTimeout(function () {
          setCountry(country);
        }, 1000);
        setTimeout(function () {
          setState(state);
        }, 2000);
        setTimeout(function () {
          setCity(city);
        }, 3000);
      }
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (localStorage.hasOwnProperty("companyInfo")) {
      fetchCompanyDetails();
    }
  }, []);

  const [errMsg, setErrMsg] = useState(false);
  let documentarr = [];

  const submitCompanyInfo = (e) => {
    e.preventDefault();
    setErrMsg(false);
    if (
      corporatevalue === "" ||
      corporateTaxvalue === "" ||
      corporateSTaxvalue === "" ||
      country === "" ||
      state === "" ||
      city === ""
    ) {
      setErrMsg(true);
      setMsgData({
        message: "All fields are required",
        type: "error",
      });
      return false;
    }

    documentarr = [];

    if (corporatevalue !== "" && corporateFileName.includes("agency")) {
      documentarr.push({
        name: "Corporate ID",
        id: "corporateId",
        key: corporatevalue,
        filename: corporateFileName,
      });
    }
    if (corporateTaxvalue !== "" && corporateTaxFileName.includes("agency")) {
      documentarr.push({
        name: "Corporate Tax ID",
        id: "corporateTaxId",
        key: corporateTaxvalue,
        filename: corporateTaxFileName,
      });
    }
    if (corporateSTaxvalue !== "" && corporateSTaxFileName.includes("agency")) {
      documentarr.push({
        name: "Corporate Service Tax ID",
        id: "corporateSTaxId",
        key: corporateSTaxvalue,
        filename: corporateSTaxFileName,
      });
    }

    setLoader(true);
    if (
      documentarr.length > 0 &&
      localStorage.hasOwnProperty("companyInfo") === false
    ) {
      uploadImages();
    } else if (localStorage.hasOwnProperty("companyInfo")) {
      // Redirect to authority page
      newStep(parseInt(step) + 1);

      if (partnerId !== "") {
        router.push(`/companydetails?authoritySign&partnerId=${partnerId}`);
      } else {
        router.push("/companydetails?authoritySign");
      }
    } else {
      finalsave(corporateFileName, corporateTaxFileName, corporateSTaxFileName);
    }
  };

  function pinValidate(inputtxt) {
    setPin(inputtxt.target.value);
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    setPin(value);
    let reg = new RegExp(/^\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only number" });
    }
  }
  const uploadImages = () => {
    let corporateIdUrlOfStoredLocation = null;
    let corporateTaxIdUrlOfStoredLocation = null;
    let goodsAndServicesTaxIdUrlOfStoredLocation = null;
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
        transformRequest: function (object) {
          var formData = new FormData();
          for (var prop in object) {
            formData.append(prop, object[prop]);
          }
          return formData;
        },
      };

      axios
        .post(config.API_URL + "/api/utility/upload", model, configs)
        .then((response) => {
          console.log("show me response for company info pics", response.data);
          if (a == 0) {
            corporateIdUrlOfStoredLocation = response.data.data.fileName;
            setCorporateIdUrl(response.data.data.fileName);
          }
          if (a == 1) {
            corporateTaxIdUrlOfStoredLocation = response.data.data.fileName;
            setCorporateTaxIdUrl(response.data.data.fileName);
          }
          if (a == 2) {
            goodsAndServicesTaxIdUrlOfStoredLocation =
              response.data.data.fileName;
            setGoodsAndServicesTaxIdUrl(response.data.data.fileName);
          }
          if (a < documentarr.length - 1) {
            saveImage(a + 1);
          } else if (a === documentarr.length - 1) {
            console.log("after saving images, finalcall");
            finalsave(
              corporateIdUrlOfStoredLocation,
              corporateTaxIdUrlOfStoredLocation,
              goodsAndServicesTaxIdUrlOfStoredLocation
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setMsgData({
            message: "API error, Please try after some time",
            type: "error",
          });
          setLoader(false);
        });
    };
    saveImage(0);
  };

  const finalsave = (
    corporateIdUrlOfStoredLocation,
    corporateTaxIdUrlOfStoredLocation,
    goodsAndServicesTaxIdUrlOfStoredLocation
  ) => {
    setLoader(false);
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "express:sess") {
        cookie = value;
      }
    }
    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    let obj = {
      partnerId: partnerId,
      legalName: corporateName,
      website: websiteLink,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      pincode: pin,
      phoneNumber: phoneNumber,
      tollFreeNumber: tollFreeNum,
      ownerOrganisationUID: "NA",
      corporateId: corporateId,
      corporateIdUrl: corporateIdUrlOfStoredLocation,
      corporateTaxId: corporateTaxId,
      corporateTaxIdUrl: corporateTaxIdUrlOfStoredLocation,
      goodsAndServicesTaxId: corporateSTaxId,
      goodsAndServicesTaxIdUrl: goodsAndServicesTaxIdUrlOfStoredLocation,
      companyLegalName: corporateName,
      companyWebsite: websiteLink,
      companySize: 1,
      companyServices: "NA",
      status: true,
    };

    const getAgencyData = JSON.parse(localStorage.getItem("userDetails"));
    obj.userType = getAgencyData.userType;

    setLoader(true);
    const url = config.API_URL + `/api/partner/information`;

    if (partnerId !== "") {
      obj.partnerId = partnerId;
      axios
        .put(url, obj, { headers })
        .then((response) => {
          setLoader(false);
          newStep(parseInt(step) + 1);
          router.push(`/companydetails?authoritySign&partnerId=${partnerId}`);
        })
        .catch((error) => {
          setLoader(false);
          setMsgData({
            message: "API Error",
            type: "error",
          });
          console.log(error);
        });
    } else {
      // Store the company info in local storage
      localStorage.setItem("companyInfo", JSON.stringify(obj));

      axios
        .post(url, obj, { headers })
        .then((response) => {
          // Save the response in local storage
          localStorage.setItem(
            "unitOnboarding",
            JSON.stringify(response.data.data)
          );
          setLoader(false);
          newStep(parseInt(step) + 1);

          router.push("/companydetails?authoritySign");
        })
        .catch((error) => {
          setLoader(false);
          setMsgData({
            message: "API Error",
            type: "error",
          });
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

  const updatePhoneNumber = (e) => {
    const validatePhoneNumInput = e.target.value.replace(/[^0-9]/g, "");

    if (validatePhoneNumInput.length > 11) {
      return;
    }
    setPhoneNum(validatePhoneNumInput);
  };

  const updateTollFreeNumber = (e) => {
    const validateInput = e.target.value.replace(/[^0-9]/g, "");
    setTollFreeNum(validateInput);
  };

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text">Uploading Establishment Details</div>
        </div>
      )}

      <Header name="Establishment Details" />

      <div className="form-input companyInfo">
        <form noValidate autoComplete="off" onSubmit={submitCompanyInfo}>
          <div className="mainForm" style={{ width: "100%" }}>
            <div className="half-div">
              <TextField
                required
                id="title"
                error={errMsg && corporateName === ""}
                label="Legal Name"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                // InputLabelProps={{ shrink: true }}
                className={
                  (errMsg && corporateName === "" ? "err " : "") + "form-auto"
                }
                helperText={
                  errMsg && corporateName === ""
                    ? "Please enter the Legal Name "
                    : ""
                }
                value={corporateName}
                onChange={(e) => setCorporateName(e.target.value)}
              />
            </div>
            <div className="half-div">
              <TextField
                required
                id="title"
                error={errMsg && websiteLink === ""}
                label="Website"
                style={{ margin: 4 }}
                margin="normal"
                variant="filled"
                helperText={
                  errMsg && websiteLink === ""
                    ? "Please enter the Website URL"
                    : ""
                }
                className={
                  "form-auto " + (errMsg && websiteLink === "" ? "err" : "")
                }
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
              />
            </div>
            <div className="half-div">
              <TextField
                required
                id="title"
                error={errMsg && addressLine1 === ""}
                label="Address Line 1"
                style={{ margin: 4, width: "90%" }}
                margin="normal"
                variant="filled"
                helperText={
                  errMsg && addressLine1 === ""
                    ? "Please enter your Address Line 1"
                    : ""
                }
                className={
                  "form-auto " + (errMsg && addressLine1 === "" ? "err" : "")
                }
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>
            <div className="half-div">
              <TextField
                required
                id="title"
                error={errMsg && addressLine2 === ""}
                label="Address Line 2"
                style={{ margin: 4, width: "90%" }}
                margin="normal"
                variant="filled"
                helperText={
                  errMsg && addressLine2 === ""
                    ? "Please enter your Address Line 2"
                    : ""
                }
                className={
                  "form-auto " + (errMsg && addressLine2 === "" ? "err" : "")
                }
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div className="half-div">
              <TextField
                required
                length={10}
                id="title"
                error={errMsg && phoneNumber === ""}
                label="Phone Number"
                style={{ margin: 4, width: "90%" }}
                margin="normal"
                variant="filled"
                helperText={
                  errMsg && addressLine2 === ""
                    ? "Please enter your Phone Number"
                    : ""
                }
                className={
                  "form-auto " + (errMsg && phoneNumber === "" ? "err" : "")
                }
                value={phoneNumber}
                onChange={updatePhoneNumber}
              />
            </div>
            <div className="half-div">
              <TextField
                id="title"
                label="Toll Free Number"
                style={{ margin: 4, width: "90%" }}
                margin="normal"
                variant="filled"
                className="form-auto "
                value={tollFreeNum}
                onChange={updateTollFreeNumber}
              />
            </div>
            <div className="break"></div>
            <div style={{ marginLeft: "-17px" }}>
              <div className="info-div" style={{ marginRight: 0 }}>
                <div
                  className={
                    "selection-div " + (errMsg && country === "" ? "err" : "")
                  }
                >
                  {/* <InputLabel shrink htmlFor="service-label">Country*</InputLabel> */}
                  <TextField
                    select
                    // labelId="country-label"
                    label="Country"
                    id="country"
                    disabled
                    value={country}
                    required
                    margin="normal"
                    variant="filled"
                    onChange={(e) => setCountry(e.target.value)}
                    // displayEmpty
                    className={
                      "half-div  mar-left-10 newblock " +
                      (country === "" ? "err1" : "")
                    }
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    {countryList.length > 0 &&
                      countryList.map((data, index) => (
                        <MenuItem key={index} value={data.name}>
                          {data.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
                <div
                  className={
                    "selection-div some-align " +
                    (errMsg && state === "" ? "err" : "")
                  }
                >
                  {/* <InputLabel shrink htmlFor="service-label">State*</InputLabel> */}
                  <TextField
                    // labelId="state-label"
                    error={errMsg && state === ""}
                    select
                    label="State/Province"
                    id="state"
                    value={state}
                    required
                    margin="normal"
                    variant="filled"
                    onChange={(e) => setState(e.target.value)}
                    helperText={
                      errMsg && state === "" ? "Please enter your State" : ""
                    }
                    className={
                      "half-div  mar-left-10 newblock " +
                      (state === "" ? "err1" : "")
                    }
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {stateList.length > 0 &&
                      stateList.map((data, index) => (
                        <MenuItem key={index} value={data.stateName}>
                          {data.stateName}
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
              </div>
              <div className="info-div">
                <div
                  className={
                    "selection-div " + (errMsg && city === "" ? "err" : "")
                  }
                >
                  {/* <InputLabel shrink htmlFor="service-label">City*</InputLabel> */}
                  <TextField
                    // labelId="city-label"
                    select
                    error={errMsg && city === ""}
                    label="City"
                    id="city"
                    value={city}
                    required
                    margin="normal"
                    variant="filled"
                    onChange={(e) => setCity(e.target.value)}
                    helperText={
                      errMsg && city === "" ? "Please enter your City" : ""
                    }
                    className={
                      "half-div  mar-left-10 newblock " +
                      (city === "" ? "err1" : "")
                    }
                  >
                    <MenuItem value="" disabled></MenuItem>
                    {cityList.length > 0 &&
                      cityList.map((data, index) => (
                        <MenuItem key={index} value={data.cityName}>
                          {data.cityName}
                        </MenuItem>
                      ))}
                  </TextField>
                </div>
                <TextField
                  required
                  id="title"
                  error={errMsg && pin === ""}
                  label="PIN"
                  style={{ margin: "6px 8px" }}
                  margin="normal"
                  variant="filled"
                  helperText={
                    errMsg && pin === "" ? "Please enter your PIN" : ""
                  }
                  className={`more ${errMsg && pin === "" ? "err " : ""}`}
                  value={pin}
                  onChange={pinValidate}
                />
              </div>

              <div className="break"></div>

              <div className="three-div">
                <TextField
                  required
                  id="title"
                  error={errMsg && corporateId === ""}
                  label="Corporate ID"
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  helperText={
                    errMsg && corporateId === ""
                      ? "Please enter your Corporate ID"
                      : ""
                  }
                  className={
                    "more " + (errMsg && corporateId === "" ? "err" : "")
                  }
                  value={corporateId}
                  onChange={(e) => setCorporateId(e.target.value)}
                />
                <div className="upload-option">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateId"
                    onChange={corporateChange}
                  />
                  <label
                    htmlFor="corporateId"
                    className={` dragContent ${
                      corporateValURL !== "" ? "label-image-cover" : ""
                    } ${errMsg && corporatevalue === "" ? "err" : ""} `}
                  >
                    {!!(corporatevalue === "") && (
                      <>
                        <img src="upload.svg" />
                        <p>
                          Drag and drop to upload Scanned copy of Corporate ID.
                        </p>
                      </>
                    )}
                  </label>
                  {!!(corporatevalue !== "") && (
                    <>
                      <div className="img-preview-div">
                        <img
                          id="ImgPreview"
                          src={corporateValURL}
                          className="preview1 img-spec"
                        />
                        <div
                          id="removeImage1"
                          className="rmv"
                          onClick={deleteCorporatevalue}
                        >
                          <Grid item xs={8}>
                            <DeleteOutlinedIcon className="del-icon" />
                          </Grid>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!!corporateImgErr && (
                  <p className="validation-message">{corporateImgErr}</p>
                )}
              </div>

              <div className="three-div">
                <TextField
                  required
                  id="title"
                  error={errMsg && corporateTaxId === ""}
                  label="Corporate Tax ID"
                  style={{ margin: 8 }}
                  variant="filled"
                  margin="normal"
                  helperText={
                    errMsg && corporateTaxId === ""
                      ? "Please enter your Corporate Tax ID"
                      : ""
                  }
                  className={
                    "more " + (errMsg && corporateTaxId === "" ? "err" : "")
                  }
                  value={corporateTaxId}
                  onChange={(e) => setCorporateTaxId(e.target.value)}
                />
                <div className="upload-option">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateTaxId"
                    onChange={corporateTaxChange}
                  />
                  <label
                    htmlFor="corporateTaxId"
                    className={`
                      dragContent
                      ${corporateTaxURL !== "" ? "label-image-cover" : ""}
                      ${errMsg && corporateTaxvalue === "" ? "err" : ""}
                    `}
                  >
                    {!!(corporateTaxvalue === "") && (
                      <>
                        <img src="upload.svg" />
                        <p>
                          Drag and drop to upload Scanned copy of Corporate Tax
                          ID
                        </p>
                      </>
                    )}
                  </label>
                  {!!(corporateTaxvalue !== "") && (
                    <>
                      <div className="img-preview-div">
                        <img
                          id="ImgPreview"
                          src={corporateTaxURL}
                          className="preview1 img-spec"
                        />
                        <div
                          id="removeImage1"
                          className="rmv"
                          onClick={deleteCorporateTaxvalue}
                        >
                          <Grid item xs={8}>
                            <DeleteOutlinedIcon className="del-icon" />
                          </Grid>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!!taxIdErr && <p className="validation-message">{taxIdErr}</p>}
              </div>

              <div className="three-div">
                <TextField
                  required
                  id="title"
                  error={errMsg && corporateSTaxId === ""}
                  label="Good & Services Tax ID"
                  style={{ margin: 8 }}
                  margin="normal"
                  variant="filled"
                  helperText={
                    errMsg && corporateSTaxId === ""
                      ? "Please enter your GST ID"
                      : ""
                  }
                  className={
                    "more " + (errMsg && corporateSTaxId === "" ? "err" : "")
                  }
                  value={corporateSTaxId}
                  onChange={(e) => setCorporateSTaxId(e.target.value)}
                />
                <div className="upload-option">
                  <input
                    required
                    type="file"
                    className="choose"
                    id="corporateSTaxId"
                    onChange={corporateSTaxChange}
                  />
                  <label
                    htmlFor="corporateSTaxId"
                    className={`dragContent ${
                      corporateSTaxvalURL !== "" ? "label-image-cover" : ""
                    } ${errMsg && corporateSTaxvalue === "" ? "err" : ""}`}
                  >
                    {!!(corporateSTaxvalue === "") && (
                      <>
                        <img src="upload.svg" />
                        <p>
                          Drag and drop to upload Scanned copy of Goods &
                          Service Tax ID
                        </p>
                      </>
                    )}
                  </label>
                  {!!(corporateSTaxvalue !== "") && (
                    <div className="img-preview-div">
                      <img
                        id="ImgPreview"
                        src={corporateSTaxvalURL}
                        className="preview1 img-spec"
                      />
                      <div
                        id="removeImage1"
                        className="rmv"
                        onClick={deleteCorporateSTaxvalue}
                      >
                        <Grid item xs={8}>
                          <DeleteOutlinedIcon className="del-icon" />
                        </Grid>
                      </div>
                    </div>
                  )}
                </div>
                {!!gstIdImgErr && (
                  <p className="validation-message">{gstIdImgErr}</p>
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
              style={{ fontSize: "14px", fontWeight: "bold", borderRadius: 30 }}
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
            >
              NEXT
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CompanyInfo;
