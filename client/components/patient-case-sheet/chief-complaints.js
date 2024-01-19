import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete, { createFilterOptions }  from "@material-ui/lab/Autocomplete";
import { blue } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import config from "../../app.constant";
import axios from "axios";

const filter = createFilterOptions();

function ChiefComplaints({
  complaints,
  handleComplaints,
  removeComplaints,
  addComplaints,
  disableFlag
}) {
  const [period, setPeriod] = useState("day");
  const [options, setOptions] = useState([]);
  const getLanguages = () => {
    let url = config.API_URL + `/api/utility/chiefcomplaints`;
    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setOptions(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <>
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            Chief Complaint
          </Typography>
        </AccordionSummary>
        {complaints.map((x, index) => {
          return (
            <AccordionDetails
              style={{ display: "block", borderTop: "1px solid #e6e6e6" }}
            >              
              <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                <div
                  className="full-div"
                  style={{ display: 'inline-flex'}}
                >
                  <p
                    style={{
                      minWidth: "100px",
                      textAlign: "left",
                      marginRight: "10px",
                      display: 'flex'
                    }}
                  >
                    Symptoms
                  </p>
                  <div className="autocomplete-chief-complaint">
                    <Autocomplete
                      style={{ display: 'flex', width: '539px', position: 'relative', bottom: '10px' }}
                      id="free-solo-demo"
                      freeSolo
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      value={x.symptoms}
                      options={options.map((option) => option.chiefComplaint)}
                      onChange={(e, newValue) => {
                        e.preventDefault();

                        if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          handleComplaints("symptoms", newValue.inputValue, index);
                        } else {
                          handleComplaints("symptoms", newValue, index);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                
                        // Suggest the creation of a new value
                        if (params.inputValue !== '') {
                          filtered.push(`${params.inputValue}`);
                        }
                
                        return filtered;
                      }}
                      renderOption={(option) => option}
                      disabled = {disableFlag}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          disabled = {disableFlag}
                        />
                      )}
                    />
                  </div>

                  <div className="chief-complain-closeicon">
                    {complaints.length > 1 && (
                      <p
                        style={{
                          color: disableFlag ? "#a2a2a2" : "#152a75",
                          fontWeight: 600,
                          cursor: disableFlag ? "not-allowed" : "pointer",
                          float: "right",
                        }}
                        onClick={() => removeComplaints(index)}
                      >
                        {/* - REMOVE */}
                        <CloseIcon />
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="elements"
                  style={{ display: "flex", marginTop: "-20px" }}
                >
                  <p
                    style={{
                      minWidth: "100px",
                      textAlign: "left",
                      marginRight: "14px",
                      marginLeft: "8px",
                    }}
                  >
                    Details
                  </p>
                  <div>
                    <TextField
                      style={{
                        marginTop: "8px",
                        width: '90%'
                      }}
                      margin="normal"
                      value={x.details}
                      onChange={(e) =>
                        handleComplaints("details", e.target.value, index)
                      }
                      disabled = {disableFlag}
                    />
                  </div>
                </div>
                <div
                  className="elements"
                  style={{
                    display: "flex",
                    marginLeft: "50px",
                    marginTop: "-20px",
                  }}
                >
                  <p
                    style={{
                      minWidth: "98px",
                      textAlign: "left",
                    }}
                  >
                    Since duration
                  </p>

                  <TextField
                    style={{
                      width: "15%",
                      marginTop: "8px",
                      textAlign: "center",
                      marginRight: "30px",
                      marginLeft: "18px",
                    }}
                    margin="normal"
                    value={x.since}
                    onChange={(e) =>
                      handleComplaints("since", e.target.value, index)
                    }
                    disabled = {disableFlag}
                  />
                  <TextField
                    select
                    style={{ width: "25%", marginTop: "8px" }}
                    margin="normal"
                    value={x.sinceUnit}
                    onChange={(e) =>
                      handleComplaints("sinceUnit", e.target.value, index)
                    }
                    disabled = {disableFlag}
                  >
                    <MenuItem value="day">day</MenuItem>
                    <MenuItem value="week">week</MenuItem>
                    <MenuItem value="month">month</MenuItem>
                    <MenuItem value="year">year</MenuItem>
                  </TextField>
                </div>                
              </div>

              <div className="chief-complaint-main-div">
                <div className="elements chief-complaint-often">
                  <p>
                    How Often
                  </p>
                  <div>
                    <TextField
                      className="how-often-p"
                      margin="normal"
                      value={x.howOften}
                      onChange={(e) =>
                        handleComplaints("howOften", e.target.value, index)
                      }
                      disabled = {disableFlag}
                    />
                  </div>
                </div>

                <div className="elements chief-complaint-severity">
                  <p>
                    Severity
                  </p>
                    <div>
                      <TextField
                        select
                        className="severity-text-field"
                        margin="normal"
                        value={x.severity}
                        onChange={(e) =>
                          handleComplaints("severity", e.target.value, index)
                        }
                        disabled = {disableFlag}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </TextField>
                    </div>
                  </div>
              </div>

              <div
                style={{
                  float: "left",
                  marginLeft: "-25px",
                  marginTop: "20px",
                  cursor: disableFlag ? "not-allowed" :"pointer",
                }}
              >
                {complaints.length - 1 === index && (
                  <p
                    onClick={addComplaints}
                    style={{
                      width: "200px",
                      color: disableFlag ? "#a2a2a2" :"#152a75",
                      fontWeight: 600,
                      float: "left",
                      paddingBottom: "20px",
                    }}
                  >
                    + ADD SYMPTOMS
                  </p>
                )}
              </div>
            </AccordionDetails>
          );
        })}
      </Accordion>
    </>
  );
}

export default ChiefComplaints;
