import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import config from "../../app.constant";
import CircularProgress from "@material-ui/core/CircularProgress";
import percentageField from "../../utils/percentageField";
import indianCurrencyField from "../../utils/indianCurrencyField";
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';

export default function Charges(props) {
  const { generalTabPerm } = props;
  const [loader, setLoader] = useState(false);
  const [shipCharge, setShipCharge] = useState("");
  const [freeHomeCollectCharge, setFreeHomeCollectCharge] = useState("");
  const [discountMedicine, setDiscountMedicine] = useState("");
  const [flatHomeCollectCharge, setFlatHomeCollectCharge] = useState("");
  const [addHomeCollectCharge, setAddHomeCollectCharge] = useState("");
  const [minAmtFreeDel, setMinAmtFreeDel] = useState("");
  // const [discountlabTest ,setDiscountlabTest] = useState('');
  const [minAmtFreeDelFlag, setMinAmtFreeDelFlag] = useState(false);
  const [freeHomeCollectChargeFlag, setFreeHomeCollectChargeFlag] =
    useState(false);
  const [discountMedicineFlag, setDiscountMedicineFlag] = useState(false);
  // const [discountlabTestFlag, setDiscountlabTestFlag] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pinError, setPinError] = useState("");

  function validateEmail(mail) {
    setEmail(mail.target.value);
    const {
      target: { value },
    } = event;
    setEmailError({ email: "" });
    setEmail(value);
    let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
    if (!reg) {
      setEmailError({ email: "Please enter valid email" });
    }
  }
  function pinValidate(inputtxt) {
    const {
      target: { value },
    } = event;
    setPinError({ pin: "" });
    // let reg = new RegExp(/^\d*$/).test(value);
    // if (!reg) {
    //   setPinError({ pin: "Please enter only numbers" });
    // }
    let reg = new RegExp(/^-?\d*$/).test(value);
    if (!reg) {
      setPinError({ pin: "Please enter only numbers" });
    } else {
      setPin(value);
    }
    if (value.length > 6) {
      setPinError({ pin: "It must be of six digits" });
    }
  }
  const submitData = () => {
    let obj = {
      shippingChargesInINR: shipCharge,
      homeCollectionChargesInINR: flatHomeCollectCharge,
      additionalHomeCollectionChargesInINR: addHomeCollectCharge,
      minimumOrderAmountForFreeDeliveryInINR: minAmtFreeDel,
      freeDeliveryOnMinimumAmountEnabled: minAmtFreeDelFlag,
      minimumOrderAmountForFreeCollectionInINR: freeHomeCollectCharge,
      freeCollectionOnMinimumAmountEnabled: freeHomeCollectChargeFlag,
      discountOnMedicineInPercentage: discountMedicine,
      discountOnMedicineIsEnabled: discountMedicineFlag,
      discountOnDiagnosticTestIsEnabled: false,
    };
    
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    console.log("obj: ", obj, "header: ", headers);
    // return false
    setLoader(true);
    axios
      .post(config.API_URL + "/api/patient/fixedprices", obj, {
        headers,
      })
      .then((response) => {
        setLoader(false);
        console.log(response.data);
        // alert.show("Roster Updated", { type: "success" });
        props.setMsgData({ message: "Setting Updated", type: "success" });
      })
      .catch((error) => {
        setLoader(false);
        // alert.show(error.response.data.errors[0].message, { type: "error" });
        props.setMsgData({
          message: error.response.data[0].data.message,
          type: "error",
        });
        console.log(error);
      });
  };
  useEffect(() => {
    let headers = {
      authtoken: JSON.parse(localStorage.getItem('token')),
    };
    setLoader(true);
    axios
      .get(config.API_URL + `/api/patient/fixedprices`, {
        headers,
      })
      .then((response) => {
        setLoader(false);
        const fixedPriceRes = response.data.data;

        if (fixedPriceRes) {
          setShipCharge(fixedPriceRes.shippingChargesInINR);
          setFreeHomeCollectCharge(
            fixedPriceRes.minimumOrderAmountForFreeCollectionInINR
          );
          setDiscountMedicine(fixedPriceRes.discountOnMedicineInPercentage);
          setFlatHomeCollectCharge(fixedPriceRes.homeCollectionChargesInINR);
          setAddHomeCollectCharge(
            fixedPriceRes.additionalHomeCollectionChargesInINR
          );
          setMinAmtFreeDel(
            fixedPriceRes.minimumOrderAmountForFreeDeliveryInINR
          );
          setMinAmtFreeDelFlag(
            fixedPriceRes.freeDeliveryOnMinimumAmountEnabled
          );
          setFreeHomeCollectChargeFlag(
            fixedPriceRes.freeCollectionOnMinimumAmountEnabled
          );
          setDiscountMedicineFlag(fixedPriceRes.discountOnMedicineIsEnabled);
          setName(fixedPriceRes.hospitalName);
          setPhone(fixedPriceRes.hospitalPhoneNumber);
          setEmail(fixedPriceRes.hospitalEmail);
          setAddress(fixedPriceRes.hospitalAddress);
          setState(fixedPriceRes.hospitalState);
          setCity(fixedPriceRes.hospitalCity);
          setPin(fixedPriceRes.hospitalPincode);
        }
      })
      .catch((error) => {
        setLoader(false);
        props.setMsgData({
          message: error.response.data[0].data.message,
          type: "error",
        });
      });
  }, []);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <div className="setting general-setting-page">
        <div className="half-div">
          <div className="section-header">Pharmacy Settings</div>
          <div className="maindiv">
            <div className="label">Shipping Charges: </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={shipCharge}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setShipCharge(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
          </div>
          <div className="maindiv">
            <div className="label">Discount % on Medicine: </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              disabled={!discountMedicineFlag}
              InputProps={{
                inputComponent: percentageField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={discountMedicine}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setDiscountMedicine(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
            <FormControlLabel
              disabled={!generalTabPerm.editChecked}
              control={
                <Checkbox
                  icon={
                    <CheckBoxOutlineBlankOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checkedIcon={
                    <CheckBoxOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checked={discountMedicineFlag}
                  onChange={(e) => {
                    setDiscountMedicineFlag(e.target.checked);
                  }}
                />
              }
            />
          </div>

          <div className="maindiv">
            <div className="label">
              Minimum order amount for free shipping:{" "}
            </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              disabled={!minAmtFreeDelFlag}
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={minAmtFreeDel}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setMinAmtFreeDel(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
            <FormControlLabel
              disabled={!generalTabPerm.editChecked}
              control={
                <Checkbox
                  icon={
                    <CheckBoxOutlineBlankOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checkedIcon={
                    <CheckBoxOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checked={minAmtFreeDelFlag}
                  onChange={(e) => setMinAmtFreeDelFlag(e.target.checked)}
                />
              }
            />
          </div>
        </div>

        <div className="half-div">
          <div className="section-header">Lab Settings</div>
          <div className="maindiv">
            <div className="label">Home Collection Charges: </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={flatHomeCollectCharge}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setFlatHomeCollectCharge(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
          </div>

          <div className="maindiv">
            <div className="label">Additional Home Collection Charges: </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={addHomeCollectCharge}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setAddHomeCollectCharge(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
          </div>

          <div className="maindiv">
            <div className="label">
              Minimum order amount for free home collection:{" "}
            </div>
            <TextField
              required
              margin="normal"
              variant="filled"
              disabled={!freeHomeCollectChargeFlag}
              InputProps={{
                inputComponent: indianCurrencyField,
              }}
              className="text-div"
              // error={Boolean(costError?.cost)}
              // helperText={costError?.cost}
              // className={"half-div " + (errMsg && cost === "" ? "err" : "")}
              value={freeHomeCollectCharge}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setFreeHomeCollectCharge(e.target.value);
                }
              }}
              disabled={!generalTabPerm.editChecked}
            />
            <FormControlLabel
              disabled={!generalTabPerm.editChecked}
              control={
                <Checkbox
                  icon={
                    <CheckBoxOutlineBlankOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checkedIcon={
                    <CheckBoxOutlinedIcon className="settings-checkbox-icons" />
                  }
                  checked={freeHomeCollectChargeFlag}
                  onChange={(e) =>
                    setFreeHomeCollectChargeFlag(e.target.checked)
                  }
                />
              }
            />
          </div>
        </div>

        <div className="action">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            className="primary-button forward settingBtn"
            onClick={submitData}
            disabled={!generalTabPerm.editChecked}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </>
  );
}
