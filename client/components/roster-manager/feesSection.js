import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import {
  TextField,
  CircularProgress,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import InternationalFee from "../roster-manager/internationalFee";

export default function FeesSection(props) {
  const { doctorSelected, setMsgData, tempDocList, setTempDocList } = props;
  const [loader, setLoader] = useState(false);
  const [cookies] = useCookies(["name"]);
  const [selectedState, setSelectedState] = useState("");
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState([]);
  const [baseFee, setBaseFee] = useState(0);
  const [followup, setFollowupFee] = useState(0);
  const [payor, setPayor] = useState("");
  const [docName, setDocName] = useState("");
  const [testTime, setTestTime] = useState([
    {
      slot: [
        {
          id: 0,
          country: country,
          state: "ANY",
          city: "ANY",
          cities: [],
          flatFees: "",
          followupFees: "",
          feeInPercentage: "",
          appointmentType: "Physical",
          locationConfig: `${country}#`,
        },
      ],
    },
  ]);

  const allPayors = ["Physical", "Video", "Both"];

  useEffect(() => {
    if (stateList.length === 0) {
      const stateApi =
        config.API_URL + "/api/utility/state?countryName=" + country;
      axios(stateApi)
        .then((res) => {
          setStateList(res.data.data);
        })
        .catch((err) => console.log(" City Api error", err));
    }

    if (selectedState !== "") {
      const cityApi =
        `${config.API_URL}/api/utility/city` +
        `?countryName=${country}&stateName=${selectedState}`;
      axios
        .get(cityApi)
        .then((res) => {
          const cities = res.data.data;

          let feesSlot = testTime;
          let getLastIndex = feesSlot[0].slot.length;
          feesSlot[0].slot[getLastIndex - 1].cities = cities;
          setLoader(0);
        })
        .catch((err) => console.log("api error", err));
    }

    if (doctorSelected !== "" && docName !== doctorSelected.userFirstName) {
      setLoader(1);
      const getConsultationCharge = doctorSelected.consultationChargesInINR;
      const { locationBasedFeeConfig } = doctorSelected;

      setBaseFee(
        locationBasedFeeConfig.length ? locationBasedFeeConfig[0].flatFees : 0
      );
      setFollowupFee(
        locationBasedFeeConfig.length
          ? locationBasedFeeConfig[0].followupFees
          : 0
      );

      if (locationBasedFeeConfig.length > 1) {
        const formatFeeRows = testTime;

        const updateFormattedFeeRow = locationBasedFeeConfig.map((i) => {
          if (i.fee !== undefined) {
            i.flatFees = i.fee;
            delete i.fee;
          }
          if (i.follow !== undefined) {
            i.followupFees = i.follow;
            delete i.follow;
          }
          return i;
        });

        formatFeeRows[0].slot = updateFormattedFeeRow;

        setTestTime(formatFeeRows);
      } else {
        const defaultSlot = [
          {
            id: 0,
            country: country,
            state: "ANY",
            city: "ANY",
            cities: [],
            flatFees: getConsultationCharge,
            followupFees: getConsultationCharge,
            feeInPercentage: "",
            locationConfig: `${country}#`,
            appointmentType: "Physical",
          },
        ];
        const defaultVal = testTime;
        defaultVal[0].slot = defaultSlot;
        setTestTime(defaultVal);
      }

      setTimeout(() => setLoader(0), 1000);
    }
  }, [stateList, selectedState, doctorSelected]);

  const handleAddSlot = (i, item) => {
    const values = [...testTime];

    values[i].slot.push({
      id: item.slot.length,
      country: "India",
      state: "ANY",
      city: "ANY",
      cities: [],

      flatFees: item.slot[item.slot.length - 1].flatFees,
      followupFees: item.slot[item.slot.length - 1].followupFees,
      feeInPercentage: "",
      locationConfig: `${item.slot[item.slot.length - 1].country}#`,
      appointmentType: "Physical",
    });

    setTestTime(values);
  };

  const handleRemoveSlot = (index) => {
    const values = [...testTime];
    values[0].slot.splice(index, 1);

    setTestTime((prevState) => [
      {
        slot: values[0].slot,
      },
    ]);
  };

  const handleStateChange = (e, index) => {
    e.preventDefault();
    const getAllSlots = testTime;
    const newState = e.target.value;

    const updatedSlots = getAllSlots[0].slot.map((i, arrIndex) => {
      if (arrIndex === index) {
        i.state = newState;
        i.locationConfig = `${i.country}#${newState}#`;
      }

      return i;
    });

    fetchCitiesAsPerState(newState, updatedSlots, index);
  };

  const fetchCitiesAsPerState = (newState, updatedSlots, index) => {
    setLoader(true);
    const cityApi =
      `${config.API_URL}/api/utility/city` +
      `?countryName=${country}&stateName=${newState}`;
    axios
      .get(cityApi)
      .then((res) => {
        const cities = res.data.data;

        const addCityList = updatedSlots.map((j, indexArr) => {
          if (indexArr === index) {
            j.cities = cities;
          }
          return j;
        });
        console.log(addCityList);
        setTestTime((prevState) => [
          {
            slot: addCityList,
          },
        ]);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const handleCityChange = (e, index) => {
    e.preventDefault();
    setLoader(true);
    const getAllFeeSlots = testTime;
    console.log(e.target.value);
    const newCity = e.target.value;

    const updatedSlots = getAllFeeSlots[0].slot.map((i, slotIndex) => {
      if (slotIndex === index) {
        i.city = newCity;
        i.locationConfig = `${i.country}#${i.state}#${newCity}`;
      }

      return i;
    });

    getAllFeeSlots[0].slot = updatedSlots;
    const updatedCityWithFee = getAllFeeSlots;

    setTestTime(updatedCityWithFee);
    setTimeout(() => setLoader(false), 1000);
  };

  console.log(baseFee);

  const changeBaseFee = (e, index) => {
    e.preventDefault();
    const newBaseFee = e.target.value;
    const getSlots = testTime;
    setBaseFee(newBaseFee);

    const updateFeeInSlots = getSlots[0].slot.map((i, slotIndex) => {
      if (slotIndex === index) {
        i.flatFees = newBaseFee;
      }

      return i;
    });

    getSlots[0].slot = updateFeeInSlots;

    setTestTime(getSlots);
  };

  const changeFollowupFee = (e, index) => {
    e.preventDefault();
    const newBaseFee = e.target.value;
    const getSlots = testTime;
    setFollowupFee(newBaseFee);

    const updateFeeInSlots = getSlots[0].slot.map((i, slotIndex) => {
      if (slotIndex === index) {
        i.followupFees = newBaseFee;
      }

      return i;
    });

    getSlots[0].slot = updateFeeInSlots;

    setTestTime(getSlots);
  };

  const changeFee = (e, index) => {
    e.preventDefault();
    const newBaseFee = e.target.value;
    const getSlots = testTime;
    const baseFee = getSlots[0].slot[0].flatFees;

    const updateFeeInSlots = getSlots[0].slot.map((i, slotIndex) => {
      if (slotIndex === index) {
        i.flatFees = newBaseFee;
        i.feeInPercentage = Math.abs(((baseFee - newBaseFee) / baseFee) * 100);
      }

      return i;
    });

    // Update the fee slots
    getSlots[0].slot = updateFeeInSlots;

    setTestTime((prevState) => [
      {
        slot: updateFeeInSlots,
      },
    ]);
  };

  const handlePayor = (e, index) => {
    e.preventDefault();
    const getAllFeeSlots = testTime;
    const newPayor = e.target.value;
    setPayor(newPayor);

    const updatedSlots = getAllFeeSlots[0].slot.map((i, slotIndex) => {
      if (slotIndex === index) {
        i.appointmentType = newPayor;
      }
      return i;
    });

    getAllFeeSlots[0].slot = updatedSlots;
    const updatedCityWithFee = getAllFeeSlots;

    setTestTime(updatedCityWithFee);
  };

  // Function to save the doctor's fees for different cities
  const saveSchedule = (e) => {
    e.preventDefault();

    const updateDocList = tempDocList.map((i) => {
      if (doctorSelected.id === i.id) {
        i.locationBasedFeeConfig = testTime[0].slot;
      }
      return i;
    });

    // Add new fee slots in tempDocList
    setTempDocList(updateDocList);

    let headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    const params = {
      consultantId: doctorSelected.id,
      consultationCharge: baseFee,
      locationBasedFeeConfig: testTime[0].slot,
    };
    console.log(params);
    const updateConsultationChanges = `${config.API_URL}/api/partner/consultationcharge`;
    if (baseFee) {
      axios
        .put(updateConsultationChanges, params, {
          headers,
        })
        .then((res) =>
          setMsgData({
            message: "Updated Consultation Charges successfully",
            type: "success",
          })
        )
        .catch((err) => {
          console.log(err.response);
          setMsgData({
            message:
              err.response.data[0].message !== undefined
                ? err.response.data[0].message
                : "Error occurred while saving Consultation Charges",
            type: "error",
          });
        });
    } else {
      setMsgData({
        message: "All Fields are required",
        type: "error",
      });
    }
  };

  return (
    <>
      {doctorSelected.userFirstName ? (
        <div className="centerItemMain roaster-section">
          <div className="centerItem roaster-center-item">
            <div className="slotPreferenceTime">
              {testTime.map((item, index) => {
                return (
                  <div key={index}>
                    <div style={{ overflow: "auto" }}>
                      {item.slot.map((i, index) => {
                        return (
                          <div key={index} style={{ display: "inline-flex" }}>
                            <TextField
                              disabled={index === 0}
                              select
                              size="small"
                              variant="filled"
                              label="Country"
                              value={0}
                              style={{
                                width: "150px",
                                margin: "10px",
                              }}
                            >
                              <MenuItem id="select-time-from" value={0}>
                                India
                              </MenuItem>
                            </TextField>

                            <TextField
                              disabled={index === 0}
                              select
                              size="small"
                              variant="filled"
                              label="State"
                              defaultValue="ANY"
                              value={i.state}
                              onChange={(e) => handleStateChange(e, index)}
                              style={{
                                width: "150px",
                                margin: "10px",
                              }}
                            >
                              <MenuItem id="select-time-from" value="ANY">
                                Select State
                              </MenuItem>
                              {stateList.length > 0 &&
                                stateList.map((state, index) => (
                                  <MenuItem
                                    id="select-time-from"
                                    key={index}
                                    value={state.stateName}
                                  >
                                    {state.stateName}
                                  </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                              disabled={index === 0}
                              select
                              size="small"
                              variant="filled"
                              label="City"
                              value={i.city}
                              style={{
                                width: "150px",
                                margin: "10px",
                              }}
                              onChange={(e) => handleCityChange(e, index)}
                              onFocus={() =>
                                fetchCitiesAsPerState(
                                  i.state,
                                  testTime[0].slot,
                                  index
                                )
                              }
                            >
                              <MenuItem id="select-time-from" value="ANY">
                                Select City
                              </MenuItem>
                              {i.city !== ""
                                ? i.cities.map((city, index) => (
                                    <MenuItem
                                      id="select-time-from"
                                      key={index}
                                      value={city.cityName}
                                    >
                                      {city.cityName}
                                    </MenuItem>
                                  ))
                                : ""}
                            </TextField>
                            {index === 0 ? (
                              <TextField
                                type="number"
                                size="small"
                                variant="filled"
                                label="Base Fees"
                                style={{
                                  width: "150px",
                                  margin: "10px",
                                }}
                                value={i.flatFees}
                                onChange={(e) => changeBaseFee(e, index)}
                              />
                            ) : (
                              <>
                                <TextField
                                  type="number"
                                  size="small"
                                  variant="filled"
                                  label="Fees"
                                  style={{
                                    width: "150px",
                                    margin: "10px",
                                  }}
                                  value={i.flatFees}
                                  onChange={(e) => changeFee(e, index)}
                                />
                                <TextField
                                  type="number"
                                  size="small"
                                  variant="filled"
                                  label="Followup Fees"
                                  style={{
                                    width: "150px",
                                    margin: "10px",
                                  }}
                                  value={i.followupFees}
                                  onChange={(e) => changeFollowupFee(e, index)}
                                />
                                <TextField
                                  select
                                  size="small"
                                  variant="filled"
                                  label="Appointment Type"
                                  value={i.appointmentType}
                                  style={{
                                    width: "180px",
                                    margin: "10px",
                                  }}
                                  onChange={(e) => handlePayor(e, index)}
                                >
                                  <MenuItem value="" disabled></MenuItem>
                                  {allPayors.map((payor, id) => (
                                    <MenuItem key={"payor-" + id} value={payor}>
                                      {payor}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </>
                            )}
                            {index > 0 ? (
                              <Button
                                onClick={() => handleRemoveSlot(index, item)}
                                variant="contained"
                                color="default"
                                className="minus-fee-btn removeIcon roaster-minus-btn"
                                // style={{ margin: "10px" }}
                              >
                                <RemoveIcon />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleAddSlot(index, item)}
                                variant="contained"
                                color="default"
                                className="plus-fee-btn roaster-plus-btn"
                                // style={{ margin: "10px" }}
                              >
                                <AddIcon />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="action save-fees-row-btn">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              style={{ color: "#000", width: "125px" }}
              onClick={saveSchedule}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
