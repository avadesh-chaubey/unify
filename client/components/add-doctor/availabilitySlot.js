import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import time from "../../data/time.json";
import days from "../../data/day.json";
import Calendar from "react-calendar";
// import { useAlert, types } from 'react-alert';
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";

function AvailabilitySlot() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [timing, setTiming] = useState([]);

  const submitAvailabeSlot = () => {
    console.log("submitAvailabeSlot ");
    router.push("addDoctor?consultFee");
  };
  const goBackProfDetailsPage = () => {
    console.log("goBackProfDetailsPage");
  };
  const onWorkTimeChange = (index, type, value, id) => {
    console.log("djvj");
  };
  const timeData = time;
  const DEFAULT_FROM_TIME = "";
  const DEFAULT_TO_TIME = "";
  function emptyTimeArr() {
    const WorkingTimeArray = [];
    days.forEach((item) => {
      let obj = {};
      obj.id = item.id;
      obj.day = item.day;
      obj.timeSlot = [{ timeFrom: DEFAULT_FROM_TIME, timeTo: DEFAULT_TO_TIME }];
      //  obj.timeFrom = DEFAULT_FROM_TIME;
      //  obj.timeTo = DEFAULT_TO_TIME;
      obj.checked = false;
      WorkingTimeArray.push(obj);
    });
    return WorkingTimeArray;
  }

  useEffect(() => {
    setTiming(emptyTimeArr());
  }, []);

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <h2 className="newHead">Availibility Slots</h2>
      <div className="form-input textBottom">
        <form autoComplete="off" onSubmit={submitAvailabeSlot}>
          <div className="mainForm" style={{ width: "100%" }}>
            <div className="slotPreferenceTime" style={{ width: "70%" }}>
              {timing.map((item, index) => {
                return (
                  <div
                    key={item.day}
                    style={{
                      display: "flex",
                      // alignItems: 'center',
                      paddingBottom: "3px",
                      verticalAlign: top,
                    }}
                  >
                    <div
                      style={{
                        width: "25%",
                        verticalAlign: "top",
                        marginTop: "15px",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.checked}
                            onChange={(e) => {
                              onWorkTimeChange(
                                index,
                                "DAY",
                                !item.checked,
                                item.id
                              );
                            }}
                          />
                        }
                        label={item.day}
                      />
                    </div>
                    <div
                      style={{
                        width: "12%",
                        color: "#555555",
                        fontSize: "14px",
                        margin: "auto",
                        marginTop: "30px",
                      }}
                    >
                      Time:
                    </div>
                    <div style={{ width: "62%" }}>
                      {item.timeSlot.map((i, index) => {
                        return (
                          <div
                            style={{ width: "100%", marginTop: "10px" }}
                            key={index}
                          >
                            <div
                              style={{
                                width: "38%",
                                margin: "auto auto auto 5px",
                                float: "left",
                                marginRight: "10px",
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                select
                                size="small"
                                label="From"
                                style={{ marginBottom: "10px" }}
                                defaultValue={DEFAULT_FROM_TIME}
                                fullWidth
                                variant="filled"
                                value={i.timeFrom}
                                onChange={(e) => {
                                  onWorkTimeChange(
                                    index,
                                    "FROM_TIME",
                                    e.target.value,
                                    item.id
                                  );
                                }}
                              >
                                {timeData.map((elm) => {
                                  return (
                                    <MenuItem
                                      // disabled={
                                      //     elm.id < monFromVal && item.id ==1 || elm.id < tueFromVal && item.id ==2 ||elm.id < wedFromVal && item.id ==3 ||elm.id < thuFromVal && item.id ==4 ||elm.id < friFromVal && item.id ==5||elm.id < satFromVal && item.id ==6||elm.id <= sunFromVal && item.id ==7
                                      // }
                                      value={elm.label}
                                      key={elm.id}
                                    >
                                      {elm.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </div>
                            <div
                              style={{
                                width: "38%",
                                margin: "auto auto auto 5px",
                                float: "left",
                                marginRight: "10px",
                              }}
                            >
                              <TextField
                                disabled={!item.checked}
                                defaultValue={DEFAULT_TO_TIME}
                                select
                                label="To"
                                style={{ marginBottom: "10px" }}
                                fullWidth
                                size="small"
                                variant="filled"
                                value={i.timeTo}
                                onChange={(e) => {
                                  onWorkTimeChange(
                                    index,
                                    "TO_TIME",
                                    e.target.value,
                                    item.id
                                  );
                                }}
                              >
                                {timeData.map((element) => {
                                  //    console.log("askjdlf:", i.timeFrom)
                                  let temp;
                                  return (
                                    <MenuItem
                                      // disabled={
                                      //     element.id <= monFromVal && item.id ==1 ||element.id <= tueFromVal && item.id ==2 ||element.id <= wedFromVal && item.id ==3 ||element.id <= thuFromVal && item.id ==4 ||element.id <= friFromVal && item.id ==5||element.id <= satFromVal && item.id ==6||element.id <= sunFromVal && item.id ==7
                                      // }
                                      value={element.label}
                                      key={element.id}
                                    >
                                      {element.label}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </div>
                            {index > 0 && (
                              <button
                                className="removeIcon"
                                type="button"
                                onClick={() => handleRemoveSlot(index, item.id)}
                              >
                                <span className="minusLine"></span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className="plusBtn"
                      // onClick={() => handleAddSlot(index, item)}
                      style={{ position: "relative" }}
                    >
                      <span>+</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="action">
            <Button
              size="small"
              variant="contained"
              onClick={goBackProfDetailsPage}
              className="back"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              Back
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              type="submit"
            >
              NEXT
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AvailabilitySlot;
