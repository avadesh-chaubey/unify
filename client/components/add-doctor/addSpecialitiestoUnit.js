import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Chip, InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

export default function AddSpeciality(props) {
  const { setLoader, setMsgData } = props;
  const [employeeArr, setEmployeeArr] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [specialityList, setSpeciality] = useState([]);
  const [role, setRole] = useState([]);
  const [displayValidationErr, setDisplayValidationErr] = useState(false);

  useEffect(() => {
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    if (!unitList.length) {
      // Fetch the all employees
      axios
        .get(`${config.API_URL}/api/partner/allpartner`, { headers })
        .then((res) => {
          const empRes = res.data.data;
          // Update the JSON Array with new property 'name'
          const addNameProps = empRes.map((data) => {
            data.name = `${data.userFirstName} ${data.userLastName}`;
            return data;
          });
          setUnitList(addNameProps);
        })
        .catch((err) => {
          if (err.response) {
            setMsgData({
              message: err.response.data.errors[0].message,
              type: "error",
            });
          } else {
            setMsgData({
              message: "Unable to fetch all Hospital Units",
              type: "error",
            });
          }
        });
    }

    if (!specialityList.length) {
      axios
        .get(`${config.API_URL}/api/utility/specialityType`, { headers })
        .then((res) => setSpeciality(res.data.data))
        .catch((err) => {
          if (err.response) {
            setMsgData({
              message: err.response.data.errors[0].message,
              type: "error",
            });
          } else {
            setMsgData({
              message: "Unable to fetch all Specialities",
              type: "error",
            });
          }
        });
    }
  }, []);

  const updateEmployee = (e, arr) => {
    e.preventDefault();
    if (arr.length) {
      setEmployeeArr([arr[arr.length - 1]]);
    } else {
      setEmployeeArr(arr);
    }
  };

  const updateRole = (e, arr) => {
    e.preventDefault();
    if (arr.length) {
      setRole([arr[arr.length - 1]]);
    } else {
      setRole(arr);
    }
  };

  const resetForm = (e) => {
    e.preventDefault();
    setEmployeeArr([]);
    setRole([]);
  };

  const successMsgRole = () => {
    setTimeout(() => setLoader(false), 1000);
    setRole([]);
    setEmployeeArr([]);
    setMsgData({
      message: "Assigned Speciality to Hospital Unit Successfully",
    });
  };

  const submitData = () => {
    if (!role.length && !employeeArr.length) {
      setDisplayValidationErr(true);
      return;
    }
    setDisplayValidationErr(false);

    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    setLoader(true);
    if (employeeArr.length > 0 && role.length > 0) {
      const submitData = {
        specialityName: role[0].specialityType,
        specialityDescription: employeeArr[0].legalName,
        organisationUID: employeeArr[0].id,
      };
      axios
        .post(`${config.API_URL}/api/partner/speciality`, submitData, {
          headers,
        })
        .then((res) => {
          setLoader(false);
          successMsgRole();
        })
        .catch((err) => {
          if (err.response) {
            setMsgData({
              message: err.response.data.errors[0].message,
              type: "error",
            });
          } else {
            setMsgData({
              message:
                "Error occurred while Assigning Speciality to Hospital Unit",
              type: "error",
            });
          }
          setLoader(false);
        });
    } else {
      setLoader(false);
      setMsgData({
        message: "All Fields are Required",
        type: "error",
      });
    }
  };

  return (
    <div className="accessPermission">
      <Autocomplete
        multiple
        id="tags-standard"
        options={unitList}
        getOptionLabel={(option) => option.legalName || ""}
        onChange={updateEmployee}
        value={employeeArr}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.legalName}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            id="title"
            error={displayValidationErr && !employeeArr.length}
            variant="outlined"
            placeholder={employeeArr.length ? "" : "Search By Hospital Unit"}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment>
                    <SearchIcon
                      style={{ display: employeeArr.length ? "none" : "" }}
                    />
                    {params.InputProps.startAdornment}
                  </InputAdornment>
                </>
              ),
            }}
            helperText={
              displayValidationErr && !employeeArr.length
                ? "Please select Hospital Unit from given option"
                : ""
            }
          />
        )}
      />

      <Autocomplete
        multiple
        id="tags-standard"
        // limitTags={1}
        options={specialityList}
        getOptionLabel={(option) => option.specialityType || ""}
        onChange={updateRole}
        value={role}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.specialityType}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            id="title"
            error={displayValidationErr && !role.length}
            variant="outlined"
            placeholder={role.length ? "" : "Search By Speciality"}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment>
                    <SearchIcon
                      style={{ display: role.length ? "none" : "" }}
                    />
                    {params.InputProps.startAdornment}
                  </InputAdornment>
                </>
              ),
            }}
            helperText={
              displayValidationErr && !role.length
                ? "Please select a Specilaity from given option"
                : ""
            }
          />
        )}
      />
      <div className="action">
        <Button
          size="small"
          variant="outlined"
          className="cancel"
          onClick={resetForm}
        >
          CANCEL
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          className="primary-button forward"
          onClick={submitData}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}
