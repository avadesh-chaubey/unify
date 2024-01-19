import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DayField from "../../../utils/dayField";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from "@material-ui/core/AppBar";
import Radio from "@material-ui/core/Radio";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function DcotorCalender() {
  const [selectedDays, setSelectedDays] = useState([]);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedValue, setSelectedValue] = useState("physical");
  const [experience, setExperience] = useState("");

  const paymentOption = (event, option) => {
    console.log(event.target.value, option);
    setSelectedValue(event.target.value);
  };

  const handleEmpExperience = (e) => {
    setExperience(e.target.value);
  };

  return (
    <div className="doctor-calender">
      <div className="calender-days">
        {days.map((day, index) => (
          <>
            <FormControlLabel control={<Checkbox />} />
            <div index={index} className="calender-day">
              {day}
            </div>
          </>
        ))}
      </div>
      <div className="calender-details">
        <div className="left-details">
          <div style={{ display: "flex" }}>
            <div className="elements-title full" style={{ width: "50%" }}>
              <TextField
                select
                // required
                // autoFocus
                label="Slot Type"
                margin="normal"
                variant="filled"
                style={{ width: "80%" }}
                //   style={textBoxStyleTitle}
                //   value={title}
                // error={errors.firstName}
                //   onChange={(e) => setTitle(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <i>Select</i>
                </MenuItem>
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Afternoon">Afternoon</MenuItem>
              </TextField>
            </div>
            <div className="elements-title full" style={{ width: "50%" }}>
              <TextField
                select
                // required
                // autoFocus
                label="Visit Type"
                margin="normal"
                variant="filled"
                style={{ width: "80%" }}
                //   style={textBoxStyleTitle}
                //   value={title}
                //   // error={errors.firstName}
                //   onChange={(e) => setTitle(e.target.value)}
              >
                <MenuItem value="" disabled>
                  <i>Select</i>
                </MenuItem>
                <MenuItem value="Mr.">Physical Consultation</MenuItem>
                <MenuItem value="Ms.">Video Consultation</MenuItem>
                <MenuItem value="Mrs.">Both</MenuItem>
              </TextField>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div className="elements-title full" style={{ width: "50%" }}>
              <TextField
                // select
                // required
                // autoFocus
                label="Allowed Booking"
                margin="normal"
                variant="filled"
                style={{ width: "80%" }}
                //   style={textBoxStyleTitle}
                //   value={title}
                // error={errors.firstName}
                //   onChange={(e) => setTitle(e.target.value)}
              ></TextField>
            </div>
            <div className="elements-title full" style={{ width: "50%" }}>
              <TextField
                // select
                // required
                // autoFocus
                label="Duration"
                margin="normal"
                variant="filled"
                style={{ width: "80%" }}
                //   style={textBoxStyleTitle}
                //   value={title}
                //   // error={errors.firstName}
                //   onChange={(e) => setTitle(e.target.value)}
              ></TextField>
            </div>
          </div>
          <div className="elements-title full" style={{ width: "100%" }}>
            <TextField
              // select
              // required
              // autoFocus
              label="Department"
              margin="normal"
              variant="filled"
              style={{ width: "90%" }}
              //   style={textBoxStyleTitle}
              //   value={title}
              //   // error={errors.firstName}
              //   onChange={(e) => setTitle(e.target.value)}
            ></TextField>
          </div>

          <div className="elements-title full" style={{ width: "100%" }}>
            <TextField
              // select
              // required
              // autoFocus
              label="Speciality"
              margin="normal"
              variant="filled"
              style={{ width: "90%" }}
              //   style={textBoxStyleTitle}
              //   value={title}
              //   // error={errors.firstName}
              //   onChange={(e) => setTitle(e.target.value)}
            ></TextField>
          </div>
          <div className="elements-title full" style={{ width: "100%" }}>
            <TextField
              type="date"
              label="Start Date"
              margin="normal"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              style={{ width: "90%" }}
              className="form-auto hospital-unit-label"
              //   value={dob}
              //   onChange={handleDOB}
              //   error={Boolean(dobError)}
              //   helperText={dobError !== "" ? dobError : ""}
              //   disabled={!docAccessPerm.editChecked}
            ></TextField>
          </div>
          <div className="elements-title full" style={{ width: "100%" }}>
            <TextField
              type="date"
              label="End Date"
              margin="normal"
              variant="filled"
              style={{ width: "90%" }}
              InputLabelProps={{ shrink: true }}
              className="form-auto hospital-unit-label"
              //   value={dob}
              //   onChange={handleDOB}
              //   error={Boolean(dobError)}
              //   helperText={dobError !== "" ? dobError : ""}
              //   disabled={!docAccessPerm.editChecked}
            ></TextField>
          </div>
        </div>
        <div style={{ width: "3%" }} />
        <div className="right-details">
          <div className="right-heading">Can display on portal</div>
          <div style={{ marginTop: "15px" }}>
            <div style={{ display: "flex" }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Online Slot days"
              />
              <div className="elements-title full" style={{ width: "50%" }}>
                <TextField
                  // required
                  margin="normal"
                  variant="filled"
                  value={experience}
                  onChange={handleEmpExperience}
                  placeholder="Example: 5 days"
                  InputProps={{
                    inputComponent: DayField,
                  }}
                ></TextField>
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <FormControlLabel
                control={<Checkbox />}
                label="Appointment Type"
              />
            </div>
            <div
              style={{
                marginTop: "15px",
                marginLeft: "-9px",
              }}
            >
              <Radio
                checked={selectedValue === "physical"}
                onChange={paymentOption}
                value="physical"
                inputProps={{ "aria-label": "Physical" }}
              />
              Physical
              <Radio
                checked={selectedValue === "video"}
                onChange={paymentOption}
                value="video"
                inputProps={{ "aria-label": "Video" }}
              />
              Video
              <Radio
                checked={selectedValue === "both"}
                onChange={paymentOption}
                value="both"
                inputProps={{ "aria-label": "Both" }}
              />
              Both
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
