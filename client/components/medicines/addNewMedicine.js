import React, { useState, useEffect } from 'react';
import DrugTypeCollection from '../../types/drug-type';
import indianCurrencyField from '../../utils/indianCurrencyField';
import percentageField from '../../utils/percentageField';
import { Grid, Typography, TextField, MenuItem, Button } from '@material-ui/core';

export default function AddNewMedicine (props) {
  const { setMsgData } = props;

  const submitNewMedicineData = (e) => {
    e.preventDefault();
    setMsgData({
      message: 'Saved data successfully'
    });
  };

  return (
    <>
      <hr />
      <div className="doctor-onboarding-main">
        <Typography variant="h6">Add New Medicine</Typography>
        <Grid container spacing={3}>
          <Grid item xs={10}>
          <div className="es-page">
            <div className="form-input companyInfo">
              <form noValidate autoComplete="off">
                <div>
                  <div className="es-unit-field">
                    <div className="half-div onboarding-half-div">
                      <TextField
                        select
                        required
                        label="Drug Type"
                        style={{ margin: 4 }}
                        margin="normal"
                        variant="filled"
                        className="form-auto hospital-unit-label gender-field-padding select-drug-type"
                        InputLabelProps={{ shrink: true }}
                      >
                        <MenuItem disabled value="select">
                          Select Drug Type
                        </MenuItem>
                        {DrugTypeCollection.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>

                      <div className="half-div onboarding-half-div">
                        <TextField
                          // disabled
                          required
                          label="Medicine Name"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          // value={getSelectedUnitDetails?.website !== undefined
                          //   ? getSelectedUnitDetails?.website
                          //   : ''
                          // }
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="Pack Of"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label"
                          // value={
                          //   getSelectedUnitDetails?.addressLine2 !== undefined
                          //     ? getSelectedUnitDetails?.addressLine2
                          //     : ''
                          // }
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="HSN/SAC Code"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label gender-field-padding"
                          defaultValue="0"
                          // value={
                          //   getSelectedUnitDetails?.addressLine2 !== undefined
                          //     ? getSelectedUnitDetails?.addressLine2
                          //     : ''
                          // }
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div onboarding-half-div">
                        <TextField
                          required
                          label="MRP"
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputComponent: indianCurrencyField,
                          }}
                          className="form-auto hospital-unit-label"
                          // value={
                          //   getSelectedUnitDetails?.addressLine2 !== undefined
                          //     ? getSelectedUnitDetails?.addressLine2
                          //     : ''
                          // }
                        />
                      </div>
                      <div className="half-div onboarding-half-div">
                        <TextField
                          // disabled
                          required
                          label="STAX (GST) "
                          style={{ margin: 4 }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            inputComponent: percentageField,
                          }}
                          className="form-auto hospital-unit-label gender-field-padding"
                          defaultValue="0"
                          // value={
                          //   getSelectedUnitDetails?.addressLine2 !== undefined
                          //     ? getSelectedUnitDetails?.addressLine2
                          //     : ''
                          // }
                        />
                      </div>
                    </div>

                    <div className="es-unit-field">
                      <div className="half-div ptax-div onboarding-half-div">
                        <TextField
                          required
                          label="PTAX (GST)"
                          InputProps={{
                            inputComponent: percentageField,
                          }}
                          margin="normal"
                          variant="filled"
                          InputLabelProps={{ shrink: true }}
                          className="form-auto hospital-unit-label ptax-field"
                          // value={
                          //   getSelectedUnitDetails?.addressLine2 !== undefined
                          //     ? getSelectedUnitDetails?.addressLine2
                          //     : ''
                          // }
                        />
                      </div>
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
            onClick={submitNewMedicineData}
          >
            SAVE
          </Button>
        </div>
      </div>
    </>
  );
}
