import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../app.constant";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Link,
  Grid,
  TextField,
  IconButton,
  MenuItem,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";
import BackspaceOutlinedIcon from "@material-ui/icons/BackspaceOutlined";
import WarningDialog from "./warningDialog";
import CloseIcon from "@material-ui/icons/Close";

export default function AddNewUnitBar(props) {
  const {
    router,
    unitList,
    originalUnitList,
    setUnitList,
    setSelectedCard,
    setLoader,
    setMsgData,
    setSelectedUnitDetails,
    getSelectedUnitDetails,
    setOriginalUnitList,
    unitCities,
  } = props;

  const [term, setTerm] = useState("default");
  const [actionType, setActionType] = useState("");
  const [open, setOpen] = useState(false);
  const [actionUrl, setActionUrl] = useState("");
  const [startFilter, setStartFilter] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoader(true);
    const searchCityTerm = e.target.value;
    setStartFilter(true);

    // Filter the hospital unit based on selected item
    if (searchCityTerm !== "default") {
      const headers = {
        authtoken: JSON.parse(localStorage.getItem("token")),
      };

      axios
        .get(
          `${config.API_URL}/api/partner/searchpartnerbycity/${searchCityTerm}`,
          { headers }
        )
        .then((res) => {
          const searchResult = res.data.data;
          setSelectedCard(0);
          setSelectedUnitDetails(searchResult[0]);
          setUnitList(searchResult);
        })
        .catch((err) => {
          if (!window.navigator.onLine) {
            setMsgData({
              message: "Connectivity Lost...Please check your network",
              type: "error",
            });
          } else if (err.response !== undefined) {
            setMsgData({
              message: err.response.data[0].message,
              type: "error",
            });
          } else {
            setMsgData({
              message:
                "Error occurred while finding Hospital Units for selected city",
              type: "error",
            });
          }
        });
    } else {
      // Reset hospital unit with default data
      setSelectedCard(0);
      setUnitList(originalUnitList);
      setSelectedUnitDetails(originalUnitList[0]);
    }

    setTerm(searchCityTerm);
    setTimeout(() => setLoader(false), 500);
  };

  const closeFilter = (e) => {
    setStartFilter(false);
    setTerm("default");
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };
    axios
      .get(`${config.API_URL}/api/partner/allpartner`, { headers })
      .then((res) => {
        const city = [];
        const listOfUnit = res.data.data;
        setUnitList(listOfUnit);
        setOriginalUnitList(listOfUnit);
        setSelectedUnitDetails(listOfUnit[0]);
      })
      .catch((err) => {
        if (
          err.response !== undefined &&
          err.response.data.errors[0].message === "No Partner found"
        ) {
          setMsgData({
            message: "No Added Hospital Units",
            type: "error",
          });
        } else {
          setMsgData({
            message: "Error occured while fetching hospital units",
            type: "error",
          });
        }
      });
  };

  // Function to Activate / Deactivate Hospital
  const handleAction = (e, data, status) => {
    e.preventDefault();
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    let objData = {
      partnerId: data.partnerId,
      legalName: data.legalName,
      website: data.website,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      phoneNumber: data.phoneNumber,
      tollFreeNumber: data.tollFreeNumber,
      ownerOrganisationUID: data.ownerOrganisationUID,
      corporateId: data.corporateId,
      corporateIdUrl: data.corporateIdUrl,
      corporateTaxId: data.corporateTaxId,
      corporateTaxIdUrl: data.corporateTaxIdUrl,
      goodsAndServicesTaxId: data.goodsAndServicesTaxId,
      goodsAndServicesTaxIdUrl: data.goodsAndServicesTaxIdUrl,
      companyLegalName: data.legalName,
      companyWebsite: data.website,
      companySize: data.companySize ? data.companySize : 1,
      companyServices: "NA",
      status: status,
    };

    axios
      .put(`${config.API_URL}/api/partner/information`, objData, {
        headers,
      })
      .then((res) => {
        // console.log(res);
        // Update Hospital Status after successful api update
        getSelectedUnitDetails.status = status;
        setMsgData({
          message: "Hospital Status Updated Successfully",
          type: "success",
        });
        setOpenActivate(false);
      })
      .catch((err) => {
        setOpenActivate(false);
        setMsgData({
          message: !!err.response
            ? err.response.data[0].message
            : "Error occurred while updating status",
          type: "error",
        });
      });
  };

  const handleStatusClick = (e, user) => {
    e.preventDefault();
    setOpenActivate((prevState) => !prevState);
  };

  const handleDeleteHospUnit = (e) => {
    e.preventDefault();
    setLoader(true);
    const headers = {
      authtoken: JSON.parse(localStorage.getItem("token")),
    };

    const deleteAPI = `${config.API_URL}/api/partner/deletepartnerbyid/${getSelectedUnitDetails.id}`;
    axios
      .delete(deleteAPI, { headers })
      .then((res) => {
        setMsgData({
          message: `Deleted unit: ${getSelectedUnitDetails.legalName} successfully`,
        });

        // Remove the hospital unit from existing lists
        const existingUnitList = unitList.filter(
          (data) => data.id !== getSelectedUnitDetails.id
        );
        const existingOriginalList = originalUnitList.filter(
          (data) => data.id !== getSelectedUnitDetails.id
        );
        setUnitList(existingUnitList);
        setOriginalUnitList(existingOriginalList);
        setSelectedUnitDetails(
          existingUnitList.length ? existingUnitList[0] : ""
        );
        setTimeout(() => setLoader(false), 500);
      })
      .catch((err) => {
        setTimeout(() => setLoader(false), 500);
        setMsgData({
          message: `Unable to Remove Unit. Please try again later`,
          type: "error",
        });
      });
    setOpen(false);
  };

  const clickEditAction = (e) => {
    const editActionUrl = `/companydetails?companyInfo&partnerId=${getSelectedUnitDetails?.partnerId}`;
    setActionType("edit");
    setOpen(true);
    setActionUrl(editActionUrl);
  };

  const handleActivateClose = () => {
    setOpenActivate(false);
  };

  const clickDeleteAction = (e) => {
    setActionType("delete");
    setOpen(true);
  };

  return (
    <AppBar position="sticky" color="default" className="appbar-support">
      <WarningDialog
        open={open}
        type={actionType}
        setOpen={setOpen}
        unitDetails={getSelectedUnitDetails}
        actionUrl={actionUrl}
        handleDeleteHospUnit={handleDeleteHospUnit}
      />
      <Dialog
        open={openActivate}
        onClose={handleActivateClose}
        aria-labelledby="warning-dialog"
        aria-describedby="warning-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Warning</DialogTitle>
        <DialogContent>
          <DialogContentText id="warning-dialog-description">
            Are you sure you want to{" "}
            {getSelectedUnitDetails?.status === false
              ? "Activate"
              : "Deactivate"}{" "}
            {getSelectedUnitDetails?.title} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="action-btn-no"
            variant="contained"
            color="secondary"
            onClick={handleActivateClose}
          >
            NO
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) =>
              handleAction(
                e,
                getSelectedUnitDetails,
                !getSelectedUnitDetails?.status
              )
            }
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
      <Toolbar className="support-toolbar">
        <Grid container spacing={3}>
          {startFilter && (
            <Grid item xs={1}>
              <IconButton
                aria-label="close"
                style={{
                  color: "#000",
                  marginTop: "-8px",
                }}
                onClick={closeFilter}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          )}
          <Grid item xs={startFilter ? 8 : 8}>
            <TextField
              select
              id="search-content-list"
              className="searchbar-content city-dropdown"
              placeholder="Search by City"
              variant="outlined"
              value={term}
              onChange={handleFilter}
              style={{ marginLeft: startFilter ? "-44px" : "10px" }}
            >
              <MenuItem value="default">Filter by City</MenuItem>
              {unitCities.length &&
                unitCities.map((data, index) => (
                  <MenuItem key={index} value={data}>
                    {data}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={startFilter ? 3 : 4}>
            <Link
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: "none", float: "right" }}
            >
              <Button
                className="add-new-support-btn hospitalunit-btns"
                color="default"
                variant="contained"
                onClick={clickEditAction}
              >
                <div style={{ display: "inline-flex" }}>
                  <Typography variant="body1">Edit</Typography>
                  <img
                    src="/edit_icon.png"
                    height="17"
                    style={{ marginTop: 3, paddingLeft: 5 }}
                  />
                </div>
              </Button>
              <Switch
                onClick={(e) => handleStatusClick(e, getSelectedUnitDetails)}
                checked={getSelectedUnitDetails?.status === true}
                color="primary"
                name="Active"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
