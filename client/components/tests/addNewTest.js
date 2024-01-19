import React, { useState, useEffect } from "react";
import test from "../../data/labTest.json";
import indianCurrencyField from "../../utils/indianCurrencyField";
import percentageField from "../../utils/percentageField";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup
} from "@material-ui/core";
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';

export default function AddNewTest(props) {
  const { setMsgData } = props;
  const [selectedVal, setSelectedVal] = useState('');
  const [labArr, setLabArr] = useState(Array(
    {checked: false, value: 'a'},
    {checked: false, value: 'b'},
    {checked: false, value: 'c'},
    {checked: false, value: 'd'},
    {checked: false, value: 'e'},
    {checked: false, value: 'f'}
  ));

  const handleLabSelect = (e, index) => {
    e.preventDefault();

    labArr[index].checked = !labArr[index].checked;
    setSelectedVal(labArr[index].value);
    setLabArr((prevState) => [...labArr]);
  };

  const submitNewTestData = (e) => {
    e.preventDefault();
    setMsgData({
      message: "Saved data successfully",
    });
  };

  return (
    <>
      <hr />
      <div className="doctor-onboarding-main">
        <Typography variant="h6" className="diagnostic-test-header">Add New Diagnostic Test</Typography>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <div className="es-page">
              <div className="form-input companyInfo">
                <form noValidate autoComplete="off">
                  <div>
                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Service Type"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                        />
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Cost"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            inputComponent: indianCurrencyField,
                          }}
                          className="form-auto hospital-unit-label"
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          select
                          required
                          label="Select Lab"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                          InputLabelProps={{ shrink: true }}
                          defaultValue="ARH"
                        >
                          <MenuItem disabled value="select">
                            Select Lab
                          </MenuItem>
                          {test.map((d, index) => (
                            <MenuItem key={index} value={d.test_type}>
                              {d.test_type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Pre-Condition"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding"
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        {
                          labArr.map((data, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Radio
                                  id="additional-charges"
                                  checked={selectedVal === data.value}
                                  value={data.value}
                                  onChange={(e) => handleLabSelect(e, index)}
                                />
                              }
                              style={{ margin: "auto", marginTop: "10px", fontSize: "10px" }}
                              label="Unifycare Labs"
                            />
                          ))
                        }
                      </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Report wait time"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          className="form-auto hospital-unit-label"
                        />
                      </div>
                    </div>

                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="additional-charges"
                            icon={
                              <CheckBoxOutlineBlankOutlinedIcon className="settings-checkbox-icons" />
                            }
                            checkedIcon={
                              <CheckBoxOutlinedIcon className="settings-checkbox-icons" />
                            }
                            // checked={additional}
                            // onChange={handleAdditionalCharge}
                          />
                        }
                        style={{ margin: "auto", marginTop: "10px", fontSize: "10px" }}
                        label={"Additional home collection charges may apply"}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="action onboarding-action-buttons">
          <Button variant="contained" style={{ marginRight: 10 }}>
            Cancel
          </Button>

          <Button
            id="submit"
            style={{ color: "#000" }}
            size="small"
            variant="contained"
            className="primary-button forward"
            type="button"
            onClick={submitNewTestData}
          >
            SAVE
          </Button>
        </div>
      </div>
    </>
  );
}
