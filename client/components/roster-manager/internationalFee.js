import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  Button,
  InputBase,
  Badge,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import config from "../../app.constant";
import axios from "axios";

export default function InternationalFee() {
  const [country, setCountry] = useState("India");
  const [stateList, setStateList] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState("");
  const [payor, setPayor] = useState("");
  const [fees, setFees] = useState("");

  const getStates = () => {
    if ("") {
      setState("");
      setCity("");
    }
    let url = config.API_URL + "/api/utility/cities?countryName=" + country;
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          console.log("states", response.data);
          setStateList(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStates();
  }, [country]);

  const getCities = () => {
    // if (empId === "") {
    //     setCity("");
    // }
    let url =
      config.API_URL +
      "/api/utility/cities?countryName=" +
      country +
      "&stateName=" +
      state;
    axios
      .get(url)
      .then((response) => {
        const showcity = [];
        if (response.data) {
          console.log("cities", response.data);
          response.data.map((city) => {
            showcity.push(city.name);
          });
          console.log("mycity", showcity);
          setCityList(showcity);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (state !== "") {
      getCities();
    }
  }, [state]);

  return (
    <div>
      <Typography variant="h5">International</Typography>
      <Grid container>
        <TextField
          select
          label="Country"
          id="standard-size-small"
          size="small"
          value={country}
          variant="filled"
          onChange={(e) => setCountry(e.target.value)}
          style={{
            width: "120px",
            margin: "10px",
          }}
        >
          <MenuItem value="" disabled></MenuItem>
          {["India"].map((country, id) => (
            <MenuItem key={"country-" + id} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="State"
          id="standard-size-small"
          defaultValue="ANY"
          size="small"
          value={state}
          variant="filled"
          onChange={(e) => setState(e.target.value)}
          style={{
            width: "120px",
            margin: "10px",
          }}
        >
          <MenuItem value="State" disabled>
            Select State
          </MenuItem>

          {stateList.length > 0 &&
            stateList.map((state, id) => (
              <MenuItem key={"state-" + id} value={state}>
                {state}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          select
          label="City"
          id="standard-size-small"
          size="small"
          variant="filled"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            width: "120px",
            margin: "10px",
          }}
        >
          <MenuItem value="" disabled></MenuItem>
          {cityList.length > 0 &&
            cityList.map((city, id) => (
              <MenuItem key={"city-" + id} value={city}>
                {city}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          select
          size="small"
          variant="filled"
          label="Payor"
          value={payor}
          style={{
            width: "120px",
            margin: "10px",
          }}
          onChange={(e) => setPayor(e.target.value)}
        >
          <MenuItem value="" disabled></MenuItem>
          {["HDFC Life Ins.", "LIC", "Patient"].map((payor, id) => (
            <MenuItem key={"payor-" + id} value={payor}>
              {payor}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="number"
          size="small"
          variant="filled"
          label="Fee"
          value={fees}
          style={{
            width: "120px",
            margin: "10px",
          }}
          onChange={(e) => setFees(e.target.value)}
        >
          <MenuItem value="" disabled></MenuItem>
          {["HDFC Life Ins.", "LIC", "Patient"].map((fees, id) => (
            <MenuItem key={"fees" + id} value={fees}>
              {fees}
            </MenuItem>
          ))}
        </TextField>
        <Button
          onClick={() => handleRemoveSlot(index, item)}
          variant="contained"
          color="default"
          style={{ marginTop: "15px" }}
        >
          <RemoveIcon />
        </Button>
        <Button
          onClick={() => handleAddSlot(index, item)}
          variant="contained"
          color="default"
          style={{ marginTop: "15px" }}
        >
          <AddIcon />
        </Button>
      </Grid>
    </div>
  );
}
