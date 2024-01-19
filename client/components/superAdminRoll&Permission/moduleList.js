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

export default function ModuleList() {
  const [moduleList, setModuleList] = useState("");
  const [rosterModuleList, setRosterModuleList] = useState("");
  const [permissionLevel, setPermissionLevel] = useState({
    View: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    const list = [
      "Dashboard Overview",
      "Patient List",
      "Doctors List",
      "Appointment List",
    ];
    setModuleList(list);
  }, []);

  useEffect(() => {
    const list2 = ["Roaster Management"];
    setRosterModuleList(list2);
  }, []);

  const onChangePermModule = (e, moduleName, permissions) => {
    console.log("Module Name", moduleName, " permission", permissions);
  };

  const list = ["Calendar", "Roster", "Profile", "Fees", "Statistics"];

  return (
    <>
      <div className="role-perm-header"></div>
      <Accordion
        className="module-name"
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="module-summary"
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="accordion-typography">
            <strong>Admin Access</strong>
          </Typography>
          <FormGroup className="permission-checkbox" row>
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedA"
                  // checked
                  onChange={(e) => onChangePermModule(e, "View")}
                />
              }
              label="View"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedA"
                  // checked
                  onChange={(e) => onChangePermModule(e, "edit")}
                />
              }
              label="Edit"
            />
          </FormGroup>
        </AccordionSummary>
      </Accordion>
      {moduleList.length &&
        moduleList.map((data, index) => (
          <Accordion>
            <AccordionSummary
              key={index}
              expandIcon={<ExpandMoreIcon />}
              className="module-summary"
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="accordion-typography">
                <strong>{data}</strong>
              </Typography>
              <FormGroup className="permission-checkbox" row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "View")}
                    />
                  }
                  label="View"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "edit")}
                    />
                  }
                  label="Edit"
                />
              </FormGroup>
            </AccordionSummary>

            <AccordionDetails className="module-details">
              <Typography>
                <strong> Filter </strong>
              </Typography>

              <FormGroup className="permission-checkbox" row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "View")}
                    />
                  }
                  label="View"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "edit")}
                    />
                  }
                  label="Edit"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
      <Accordion className="module-name">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="module-summary"
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="accordion-typography">
            <strong>Front Desk</strong>
          </Typography>
          <FormGroup className="permission-checkbox" row>
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedA"
                  // checked
                  onChange={(e) => onChangePermModule(e, "View")}
                />
              }
              label="View"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedA"
                  // checked
                  onChange={(e) => onChangePermModule(e, "edit")}
                />
              }
              label="Edit"
            />
          </FormGroup>
        </AccordionSummary>
      </Accordion>
      {rosterModuleList.length &&
        rosterModuleList.map((data, index) => (
          <Accordion>
            <AccordionSummary
              key={index}
              expandIcon={<ExpandMoreIcon />}
              className="module-summary"
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="accordion-typography">
                <strong>{data}</strong>
              </Typography>
              <FormGroup className="permission-checkbox" row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "View")}
                    />
                  }
                  label="View"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "edit")}
                    />
                  }
                  label="Edit"
                />
              </FormGroup>
            </AccordionSummary>
            <AccordionDetails className="module-details">
              <Typography>
                <strong> Calendar </strong>
              </Typography>

              <FormGroup className="permission-checkbox" row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "View")}
                    />
                  }
                  label="View"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedA"
                      // checked
                      onChange={(e) => onChangePermModule(e, "edit")}
                    />
                  }
                  label="Edit"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}

      <div className="admin-panel-buttons">
        <Button variant="contained">Cancel</Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </div>
    </>
  );
}
