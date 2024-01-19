import React, { useState, useEffect } from "react";
import SearchHeader from "./searchHeader";
import { Typography, CircularProgress } from "@material-ui/core";
import axios from "axios";
import config from "../../app.constant";
import RoleList from "./roleList";
import ManageRolesFile from "../../data/manageRole&Permissions.json";

export default function ManageRolesPerm(props) {
  const { setLoader, setMsgData } = props;
  const [searchResult, setSearchResult] = useState("");
  const [roleList, setRoleList] = useState("");
  const [selectedRole, setSelectedRole] = useState(0);
  const [roleName, setRoleName] = useState("");
  const [roleActive, setRoleActive] = useState(false);
  const [editIds, setEditIds] = useState([]);
  const [viewIds, setViewIds] = useState([]);
  const [ManageRoles, setManageRoles] = useState([]);
  const [moduleLoad, setModuleLoad] = useState(false);
  const [term, setTerm] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const [callingSave, setCallingSave] = useState(false);
  const [manageRolesFile, setManageRolesFile] = useState(ManageRolesFile);

  const allRoles = [
    {
      id: 1,
      isRoleEnabled: true,
      role: "OP Manager",
    },
    {
      id: 2,
      isRoleEnabled: true,
      role: "Roster Manager",
    },
    {
      id: 3,
      isRoleEnabled: true,
      role: "Hospital Unit Manager - I",
    },
    {
      id: 4,
      isRoleEnabled: true,
      role: "Hospital Unit Manager - II",
    },
    {
      id: 5,
      isRoleEnabled: true,
      role: "Admin Pharmacy Manager",
    },
    {
      id: 6,
      isRoleEnabled: true,
      role: "Content Writer",
    },
    {
      id: 7,
      isRoleEnabled: true,
      role: "Content Writer - I",
    },
    {
      id: 8,
      isRoleEnabled: true,
      role: "Content Writer - II",
    },
  ];

  const getAllUsers = () => {
    setModuleLoad(true);
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    setRoleList(allRoles);
    setRoleName(allRoles[0].role);
    setRoleActive(allRoles[0].isRoleEnabled);
    handleRoleData(allRoles[0].role);
    // axios
    //   .get(`${config.API_URL}/api/users/getuserroles`, { headers })
    //   .then((res) => {
    //     const userRoleList = res.data.data;
    setModuleLoad(false);
    //     setRoleList(userRoleList);
    //     setRoleName(userRoleList[0].role);
    //     setRoleActive(userRoleList[0].isRoleEnabled);
    //     handleRoleData(userRoleList[0].role);
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       setMsgData({
    //         message: err.response.data.errors[0].message,
    //         type: "error",
    //       });
    //     } else {
    //       setMsgData({
    //         message: "Unable to fetch all roles",
    //         type: "error",
    //       });
    //     }
    //   });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleRoleData = (roleName) => {
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    // axios.get(
    //   `${config.API_URL}/api/users/getassignrolepermissions?role=${roleName}`,
    //   { headers }
    // );
    // .then((res) => {
    //   const assignedPermRes = res.data.data;
    //   setModuleLoad(false);
    // if (res.data.message !== "Success") {
    setMsgData({
      message: "Please assign a Responsibility to New Role",
      type: "success",
    });
    setManageRoles(manageRolesFile);
    setViewIds([]);
    setEditIds([]);
    setCallingSave(true);
    setLoader(false);
    // } else {
    //   setManageRoles(assignedPermRes.permissions);
    //   setViewIds(assignedPermRes.roleViewIds);
    //   setEditIds(assignedPermRes.roleViewIds);
    //   setCallingSave(false);
    // }
    // })
    // .catch((err) => {
    //   if (err.response) {
    //     setMsgData({
    //       message: err.response.data.errors[0].message,
    //       type: "error",
    //     });
    //   } else {
    //     setMsgData({
    //       message: "Unable to fetch all roles",
    //       type: "error",
    //     });
    //   }
    // });
  };

  const handleCancel = () => {
    getAllUsers();
  };

  const handleCardClick = (e, i, roleName, roleEnable) => {
    setModuleLoad(true);
    setSelectedRole(i);
    setRoleName(roleName);
    setRoleActive(roleEnable);
    setViewIds([]);
    setEditIds([]);
    setModuleLoad(false);
    handleRoleData(roleName);
  };

  const handleRoleAccess = (e, roleIndex, roleValue) => {
    // Function to activate / deactivate role
    e.preventDefault();
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    roleList[roleIndex].isRoleEnabled = !roleList[roleIndex].isRoleEnabled;
    setRoleList((prevState) => [...roleList]);

    const roleData = {
      role: roleName.trim(),
      isRoleEnabled: roleValue,
      updatedBy: `${userDetails.userFirstName} ${userDetails.userLastName}`,
    };

    axios
      // .put(`${config.API_URL}/api/users/updaterole`, roleData, { headers })
      // .then((res) => {
        setLoader(false);
        setMsgData({
          message: "Role updated Successfully",
          type: "success",
        });
      // })
      // .catch((err) => {
      //   setLoader(false);
      //   setMsgData({
      //     message: !!err.response
      //       ? error.response.data[0].data.message
      //       : "Error occurred while creating New Role",
      //     type: "error",
      //   });
      // });
  };

  const handleAllInner = (innnerData, status) => {
    if (innnerData.sections) {
      innnerData.sections.forEach((element, index) => {
        // if (element.id === moduleId) {
        innnerData.sections[index].viewChecked = status;
        // } else
        if (element.accessTypes) {
          innnerData.sections[index].accessTypes.forEach(
            (accessElement, accessIndex) => {
              // if (accessElement.id === moduleId) {
              innnerData.sections[index].accessTypes[accessIndex].viewChecked =
                status;
              // }
            }
          );
        }
      });
    }
  };

  const handleAllInner2 = (innnerData, status) => {
    if (innnerData.accessTypes) {
      innnerData.accessTypes.forEach((accessElement, accessIndex) => {
        // if (accessElement.id === moduleId) {
        innnerData.accessTypes[accessIndex].viewChecked = status;
        // }
      });
    }
  };
  const handleAllInnerEdit = (innnerData, status) => {
    if (innnerData.sections) {
      innnerData.sections.forEach((element, index) => {
        // if (element.id === moduleId) {
        innnerData.sections[index].editChecked = status;
        // } else
        if (element.accessTypes) {
          innnerData.sections[index].accessTypes.forEach(
            (accessElement, accessIndex) => {
              // if (accessElement.id === moduleId) {
              innnerData.sections[index].accessTypes[accessIndex].editChecked =
                status;
              // }
            }
          );
        }
      });
    }
  };

  const handleAllInnerEdit2 = (innnerData, status) => {
    if (innnerData.accessTypes) {
      innnerData.accessTypes.forEach((accessElement, accessIndex) => {
        // if (accessElement.id === moduleId) {
        innnerData.accessTypes[accessIndex].editChecked = status;
        // }
      });
    }
  };

  const onChangePermModule = (
    e,
    moduleName,
    innerModule,
    innerAccessType,
    permissions,
    moduleId,
    checked
  ) => {
    let responsible = [...ManageRoles];
    let arrayNum;
    const breakValue = [1, 51, 101, 151, 201, 251, 301, 351];
    for (var i = 0; i < breakValue.length; i++) {
      if (moduleId >= breakValue[i] && moduleId < breakValue[i + 1]) {
        arrayNum = i;
      }
    }

    if (permissions == "view") {
      if (checked === false) {
        const index = viewIds.indexOf(moduleId);
        if (index > -1) {
          viewIds.splice(index, 1);
        }
      } else if (checked) {
        setViewIds([...viewIds, moduleId]);
      }
      if (responsible[arrayNum].id === moduleId) {
        const temp = !responsible[arrayNum].viewChecked;
        responsible[arrayNum].viewChecked = temp;

        if (
          responsible[arrayNum].sections === undefined &&
          responsible[arrayNum].accessTypes
        ) {
          handleAllInner2(responsible[arrayNum], temp);
        } else {
          handleAllInner(responsible[arrayNum], temp);
        }
      } else if (responsible[arrayNum].sections) {
        responsible[arrayNum].sections.forEach((element, index) => {
          if (element.id === moduleId) {
            const temp = !responsible[arrayNum].sections[index].viewChecked;
            responsible[arrayNum].sections[index].viewChecked = temp;

            handleAllInner2(responsible[arrayNum].sections[index], temp);
          } else if (element.accessTypes) {
            responsible[arrayNum].sections[index].accessTypes.forEach(
              (accessElement, accessIndex) => {
                if (accessElement.id === moduleId) {
                  responsible[arrayNum].sections[index].accessTypes[
                    accessIndex
                  ].viewChecked =
                    !responsible[arrayNum].sections[index].accessTypes[
                      accessIndex
                    ].viewChecked;
                }
              }
            );
          }
        });
      } else if (
        responsible[arrayNum].sections === undefined &&
        responsible[arrayNum].accessTypes
      ) {
        responsible[arrayNum].accessTypes.forEach(
          (outerElement, outerIndex) => {
            if (outerElement.id === moduleId) {
              responsible[arrayNum].accessTypes[outerIndex].viewChecked =
                !responsible[arrayNum].accessTypes[outerIndex].viewChecked;
            }
          }
        );
      }
      // } else if (permissions == "edit") {
      //   if (checked === false) {
      //     const index = editIds.indexOf(moduleId);
      //     if (index > -1) {
      //       editIds.splice(index, 1);
      //     }
      //   } else if (checked) {
      //     setEditIds([...editIds, moduleId]);
      //   }
      //   if (responsible[arrayNum].id === moduleId) {
      //     responsible[arrayNum].editChecked = !responsible[arrayNum].editChecked;
      //   } else if (responsible[arrayNum].sections) {
      //     responsible[arrayNum].sections.forEach((element, index) => {
      //       if (element.id === moduleId) {
      //         responsible[arrayNum].sections[index].editChecked =
      //           !responsible[arrayNum].sections[index].editChecked;
      //       } else if (element.accessTypes) {
      //         responsible[arrayNum].sections[index].accessTypes.forEach(
      //           (accessElement, accessIndex) => {
      //             if (accessElement.id === moduleId) {
      //               responsible[arrayNum].sections[index].accessTypes[
      //                 accessIndex
      //               ].editChecked =
      //                 !responsible[arrayNum].sections[index].accessTypes[
      //                   accessIndex
      //                 ].editChecked;
      //             }
      //           }
      //         );
      //       }
      //     });
      // } else if (
      //   responsible[arrayNum].sections === undefined &&
      //   responsible[arrayNum].accessTypes
      // ) {
      //   responsible[arrayNum].accessTypes.forEach(
      //     (outerElement, outerIndex) => {
      //       if (outerElement.id === moduleId) {
      //         responsible[arrayNum].accessTypes[outerIndex].editChecked =
      //           !responsible[arrayNum].accessTypes[outerIndex].editChecked;
      //       }
      //     }
      //   );
      // }
    }
    if (permissions == "edit") {
      if (checked === false) {
        const index = editIds.indexOf(moduleId);
        if (index > -1) {
          editIds.splice(index, 1);
        }
      } else if (checked) {
        setEditIds([...editIds, moduleId]);
      }
      if (responsible[arrayNum].id === moduleId) {
        const temp = !responsible[arrayNum].editChecked;
        responsible[arrayNum].editChecked = temp;

        if (
          responsible[arrayNum].sections === undefined &&
          responsible[arrayNum].accessTypes
        ) {
          handleAllInnerEdit2(responsible[arrayNum], temp);
        } else {
          handleAllInnerEdit(responsible[arrayNum], temp);
        }
      } else if (responsible[arrayNum].sections) {
        responsible[arrayNum].sections.forEach((element, index) => {
          if (element.id === moduleId) {
            const temp = !responsible[arrayNum].sections[index].editChecked;
            responsible[arrayNum].sections[index].editChecked = temp;

            handleAllInner2(responsible[arrayNum].sections[index], temp);
          } else if (element.accessTypes) {
            responsible[arrayNum].sections[index].accessTypes.forEach(
              (accessElement, accessIndex) => {
                if (accessElement.id === moduleId) {
                  responsible[arrayNum].sections[index].accessTypes[
                    accessIndex
                  ].editChecked =
                    !responsible[arrayNum].sections[index].accessTypes[
                      accessIndex
                    ].editChecked;
                }
              }
            );
          }
        });
      }
      // else if (
      //   responsible[arrayNum].sections === undefined &&
      //   responsible[arrayNum].accessTypes
      // ) {
      //   responsible[arrayNum].accessTypes.forEach(
      //     (outerElement, outerIndex) => {
      //       if (outerElement.id === moduleId) {
      //         responsible[arrayNum].accessTypes[outerIndex].editChecked =
      //           !responsible[arrayNum].accessTypes[outerIndex].editChecked;
      //       }
      //     }
      //   );
      // }
    }
    setManageRoles(responsible);
  };

  const submitData = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"));

    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    setLoader(true);
    if (editIds.length > 0 || viewIds.length > 0) {
      const submitData = {
        role: roleName,
        roleEditIds: editIds,
        roleViewIds: viewIds,
        createdBy: user.userFirstName + " " + user.userLastName,
      };
      const updateData = {
        role: roleName,
        roleEditIds: editIds,
        roleViewIds: viewIds,
        updatedBy: user.userFirstName + " " + user.userLastName,
      };

      // callingSave;
      // ? axios
      //     .post(
      //       `${config.API_URL}/api/users/assignrolepermissions`,
      //       submitData,
      //       {
      //         headers,
      //       }
      //     )
      // .then((res) => {
      setLoader(false);
      setMsgData({
        message: `Successfully Assigned Permission to ${roleName}`,
        type: "success",
      });
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
      getAllUsers();
      // })
      // : axios
      //     .put(
      //       `${config.API_URL}/api/users/updateassignrolepermissions`,
      //       updateData,
      //       {
      //         headers,
      //       }
      //     )
      //     .then((res) => {
      // setLoader(false);
      // setMsgData({
      //   message: `Successfully Updated Permission to ${roleName}`,
      //   type: "success",
      // });
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
      //   getAllUsers();
      // });
      // } else {
      setLoader(false);
      setMsgData({
        message: "Please Assign a Responsibility to a Role",
        type: "error",
      });
    }
  };

  const handleTermChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    setTerm(searchTerm);

    // Reset the search term and table data with original record
    if (searchTerm.length === 0) {
      handleReset(e);
    } else {
      handleSearchEnter(searchTerm);
    }
  };

  const handleSearchEnter = (searchTerm) => {
    // Perform search when search term length is over 2 digit
    if (searchTerm.length < 0) {
      return;
    }
    // setLoader(true);
    const loggedInUserDetails = JSON.parse(
      localStorage.getItem("userDetails")
    );
    const headers = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("token")),
        "Content-type": "application/json",
      },
    };
    const updateUserList = allRoles.filter(
      (emp) => emp.role !== loggedInUserDetails.role
    );

    setRoleList(updateUserList);
    setSelectedRole(0);
    setRoleName(updateUserList[0].role);
    setRoleActive(updateUserList[0].isRoleEnabled);
    handleRoleData(updateUserList[0].role);
    setLoader(false);
    // axios
    //   .get(
    //     `${config.API_URL}/api/users/getuserroles?title=${searchTerm}`,
    //     headers
    //   )
    //   .then((res) => {
    // const searchRes = res.data.data;
    // setRoleList(searchRes);
    // setSelectedRole(0);
    // setRoleName(searchRes[0].role);
    // setRoleActive(searchRes[0].isRoleEnabled);
    // handleRoleData(searchRes[0].role);
    // setLoader(false);
    // })
    // .catch((err) => {
    //   if (err.response !== undefined) {
    //     setMsgData({
    //       message: err.response.data.errors[0].message,
    //       type: "error",
    //     });
    //     setStartSearch(true);
    //   } else {
    //     setMsgData({
    //       message: "Error occured during Searching for requested for Roles",
    //       type: "error",
    //     });
    //   }
    //   setLoader(false);
    // });
  };

  const handleReset = () => {
    setTerm("");
    getAllUsers();
    setStartSearch(false);
  };

  return (
    <>
      <SearchHeader
        term={term}
        handleTermChange={handleTermChange}
        handleReset={handleReset}
      />
      {startSearch === false && roleList.length > 0 ? (
        <div className="role-perm-header">
          <div style={{ display: "flex" }}>
            <Typography
              className="role-typography"
              variant="body1"
              component="body1"
              style={{ width: "31%" }}
            >
              Access Control Roles
            </Typography>
            {selectedRole >= 0 && (
              <Typography
                className="role-typography"
                variant="body1"
                component="body1"
              >
                Access Control Responsibilities
              </Typography>
            )}
          </div>
          {moduleLoad === false ? (
            <RoleList
              roleActive={roleActive}
              roleList={roleList}
              selectedRole={selectedRole}
              handleRoleAccess={handleRoleAccess}
              handleCardClick={handleCardClick}
              ManageRoles={ManageRoles}
              onChangePermModule={onChangePermModule}
              submitData={submitData}
              handleCancel={handleCancel}
              callingSave={callingSave}
            />
          ) : (
            <div className="loader">
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      ) : (
        <div className="noDataRole">No Data to Show</div>
      )}
    </>
  );
}
