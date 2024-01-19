import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function ModuleList(props) {
  return (
    <>
      {props.isRoleEnabled ? (
        <div className="accordion-main">
          {props.ManageRoles.length &&
            props.ManageRoles.map((data, index) => (
              <Accordion className="module-name" key={data.id}>
                <AccordionSummary
                  key={index}
                  expandIcon={<ExpandMoreIcon />}
                  className="module-summary"
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className="accordion-typography">
                    <strong>{data.name}</strong>
                  </Typography>
                  <FormGroup className="summary-permission-checkbox" row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedA"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          checked={data.viewChecked}
                          onChange={(e) =>
                            props.onChangePermModule(
                              e,
                              data.name,
                              "",
                              "",
                              "view",
                              data.id,
                              !data.viewChecked
                            )
                          }
                        />
                      }
                      label="View"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="checkedA"
                          checked={data.editChecked}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          onChange={(e) =>
                            props.onChangePermModule(
                              e,
                              data.name,
                              "",
                              "",
                              "edit",
                              data.id,
                              !data.editChecked
                            )
                          }
                        />
                      }
                      label="Edit"
                    />
                  </FormGroup>
                </AccordionSummary>
                <AccordionDetails className="inner-module-details">
                  {data.sections
                    ? data.sections.map((innerData, innerIndex) => (
                        <Accordion
                          className="inner-module-name"
                          key={innerIndex}
                        >
                          <AccordionSummary
                            key={innerIndex}
                            expandIcon={<ExpandMoreIcon />}
                            className="module-summary"
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className="accordion-typography">
                              <div style={{ display: "flex" }}>
                                <strong>{innerData.name}</strong>
                                <FormGroup
                                  className="summary-permission-checkbox"
                                  row
                                  // style={{marginLeft:"130px"}}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="checkedA"
                                        checked={innerData.viewChecked}
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        onChange={(e) =>
                                          props.onChangePermModule(
                                            e,
                                            data.name,
                                            innerData.name,
                                            "",
                                            "view",
                                            innerData.id,
                                            !innerData.viewChecked
                                          )
                                        }
                                      />
                                    }
                                    label="View"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="checkedA"
                                        checked={innerData.editChecked}
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        onChange={(e) =>
                                          props.onChangePermModule(
                                            e,
                                            data.name,
                                            innerData.name,
                                            "",
                                            "edit",
                                            innerData.id,
                                            !innerData.editChecked
                                          )
                                        }
                                      />
                                    }
                                    label="Edit"
                                  />
                                </FormGroup>
                              </div>
                            </Typography>
                          </AccordionSummary>
                          {innerData.accessTypes.map(
                            (accessType, accessIndex) => (
                              <AccordionDetails
                                key={accessIndex}
                                className="module-details"
                              >
                                <Typography style={{ marginTop: "8px" }}>
                                  <strong>{accessType.name}</strong>
                                </Typography>
                                <FormGroup className="permission-checkbox" row>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="checkedA"
                                        checked={accessType.viewChecked}
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        onChange={(e) =>
                                          props.onChangePermModule(
                                            e,
                                            data.name,
                                            innerData.name,
                                            accessType.name,
                                            "view",
                                            accessType.id,
                                            !accessType.viewChecked
                                          )
                                        }
                                      />
                                    }
                                    label="View"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name="checkedA"
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        checked={accessType.editChecked}
                                        onChange={(e) =>
                                          props.onChangePermModule(
                                            e,
                                            data.name,
                                            innerData.name,
                                            accessType.name,
                                            "edit",
                                            accessType.id,
                                            !accessType.viewChecked
                                          )
                                        }
                                      />
                                    }
                                    label="Edit"
                                  />
                                </FormGroup>
                              </AccordionDetails>
                            )
                          )}
                        </Accordion>
                      ))
                    : data.accessTypes.map((eachAccessType, innerData) => (
                        <AccordionDetails
                          className="module-details"
                          key={innerData}
                        >
                          <Typography style={{ marginTop: "8px" }}>
                            <strong>{eachAccessType.name}</strong>
                          </Typography>
                          <FormGroup className="permission-checkbox" row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="checkedA"
                                  checked={eachAccessType.viewChecked}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  onChange={(e) =>
                                    props.onChangePermModule(
                                      e,
                                      data.name,
                                      eachAccessType.name,
                                      "",
                                      "view",
                                      eachAccessType.id,
                                      !eachAccessType.viewChecked
                                    )
                                  }
                                />
                              }
                              label="View"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="checkedA"
                                  checked={eachAccessType.editChecked}
                                  onClick={(event) => event.stopPropagation()}
                                  onFocus={(event) => event.stopPropagation()}
                                  onChange={(e) =>
                                    props.onChangePermModule(
                                      e,
                                      data.name,
                                      eachAccessType.name,
                                      "",
                                      "edit",
                                      eachAccessType.id,
                                      !eachAccessType.editChecked
                                    )
                                  }
                                />
                              }
                              label="Edit"
                            />
                          </FormGroup>
                        </AccordionDetails>
                      ))}
                </AccordionDetails>
              </Accordion>
            ))}

          <div className="admin-panel-buttons">
            <Button
              size="small"
              variant="outlined"
              className="cancel"
              onClick={props.handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className="primary-button forward"
              onClick={props.submitData}
            >
              {props.callingSave ? "Save" : "Update"}
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%", width: "100%" }}>
          <h4>Role is Disabled</h4>
        </div>
      )}
    </>
  );
}
