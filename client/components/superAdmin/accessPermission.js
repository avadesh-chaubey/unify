import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Container,
  TextField,
  FormControl,
  Link,
  Chip,
  Grid,
  InputAdornment,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export default function AccessPermission(props) {
  const { setLoader, setMsgData } = props;
  const [employeeArr, setEmployeeArr] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState([]);
  const [displayValidationErr, setDisplayValidationErr] = useState(false);

  const allUsers = [
    {
      id: 1,
      name: "Admin",
      emailId: "admin@diahome.com",
    },
    {
      id: 2,
      name: "Assistant 1",
      emailId: "assistant1@diahome.com",
    },
    {
      id: 3,
      name: "Manish",
      emailId: "manish.manan@yopmail.com",
    },
    {
      id: 4,
      name: "Saurabh",
      emailId: "saurabh.suman@yopmail.com",
    },
    {
      id: 5,
      name: "Staff",
      emailId: "staff-test@xyz.com",
    },
    {
      id: 6,
      name: "Temp",
      emailId: "temp-emp@xyz.com",
    },
    {
      id: 7,
      name: "Elinor",
      emailId: "elinor@xyz.com",
    },
    {
      id: 8,
      name: "Veyance",
      emailId: "veyace4627@nahetech.com",
    },
  ];

  const allRoles = [
    {
      id: 1,
      role: "OP Manager",
    },
    {
      id: 2,
      role: "Roster Managerr",
    },
    {
      id: 3,
      role: "Hospital Unit Manager - I",
    },
    {
      id: 4,
      role: "Hospital Unit Manager - II",
    },
    {
      id: 5,
      role: "Admin Pharmacy Manager",
    },
    {
      id: 6,
      role: "Content Writer",
    },
    {
      id: 7,
      role: "Content Writer - I",
    },
    {
      id: 8,
      role: "Content Writer - II",
    },
  ];

  useEffect(() => {
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    setEmployeeList(allUsers);
    // if (!employeeList.length) {
    //   // Fetch the all employees
    //   axios
    //     .get(`${config.API_URL}/api/users/getallusers`, { headers })
    //     .then((res) => {
    //       const empRes = res.data.data;
    //       // Update the JSON Array with new property 'name'
    //       const addNameProps = empRes.map((data) => {
    //         data.name = `${data.userFirstName} ${data.userLastName}`;
    //         return data;
    //       });
    //       setEmployeeList(addNameProps);
    //     })
    //     .catch((err) => {
    //       if (err.response) {
    //         setMsgData({
    //           message: err.response.data.errors[0].message,
    //           type: "error",
    //         });
    //       } else {
    //         setMsgData({
    //           message: "Unable to fetch all employees",
    //           type: "error",
    //         });
    //       }
    //     });
    // }

    setRoleList(allRoles);
    // if (!roleList.length) {
    //   axios
    //     .get(`${config.API_URL}/api/users/getuserroles`, { headers })
    //     .then((res) => setRoleList(res.data.data))
    //     .catch((err) => {
    //       if (err.response) {
    //         setMsgData({
    //           message: err.response.data.errors[0].message,
    //           type: "error",
    //         });
    //       } else {
    //         setMsgData({
    //           message: "Unable to fetch all roles",
    //           type: "error",
    //         });
    //       }
    //     });
    // }
  }, []);

  const updateEmployee = (e, arr) => {
    e.preventDefault();
    // console.log(arr, "emp");
    // var emp = [];
    // for (var mail in arr) {
    // console.log(arr[mail].emailId);
    // emp.push(arr[mail].emailId);
    // }
    // const mail=arr.map(mail=>mail.emailId)
    // if (arr.length) {
    //   setEmployeeArr([arr[arr.length - 1]]);
    // } else {
    setEmployeeArr(arr);
    // }
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
    // console.log("in success msg role function");
    setTimeout(() => setLoader(false), 1000);
    setRole([]);
    setEmployeeArr([]);
    setMsgData({ message: "Assigned Role to User Successfully" });
  };

  const submitData = () => {
    // Role Arr and EmployeeArr's length should not be 0
    if (!role.length && !employeeArr.length) {
      setDisplayValidationErr(true);
      return;
    }
    setDisplayValidationErr(false);
    var mailIds = [];
    for (var mails in employeeArr) {
      // console.log(employeeArr[mails]);
      mailIds.push(employeeArr[mails].emailId);
    }
    const user = JSON.parse(localStorage.getItem("userDetails"));

    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    setLoader(true);
    if (mailIds.length > 0 && role.length > 0) {
      const submitData = {
        role: role[0].role,
        emailId: mailIds,
        roleAssignedBy: user.userFirstName + " " + user.userLastName,
      };
      console.log("api-data", submitData);
      // axios
      //   .post(`${config.API_URL}/api/users/attachrole`, submitData, { headers })
      //   .then((res) => {
      // console.log("Assigned role successfully", res.data);
      successMsgRole();
      setLoader(false);
      // })
      // .catch((err) => {
      //   if (err.response) {
      //     setMsgData({
      //       message: err.response.data.errors[0].message,
      //       type: "error",
      //     });
      //   } else {
      //     setMsgData({
      //       message: "Error occurred while Assigning Role",
      //       type: "error",
      //     });
      //   }
      //   setLoader(false);
      // });
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
        options={employeeList}
        getOptionLabel={(option) => option.name || ""}
        onChange={updateEmployee}
        value={employeeArr}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
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
            placeholder={employeeArr.length ? "" : "Search By Employee Name"}
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
                ? "Please select Employee from given option"
                : ""
            }
          />
        )}
      />

      <Autocomplete
        multiple
        id="tags-standard"
        // limitTags={1}
        options={roleList}
        getOptionLabel={(option) => option.role || ""}
        onChange={updateRole}
        value={role}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.role}
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
            placeholder={role.length ? "" : "Search By Role"}
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
                ? "Please select Role from given option"
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
