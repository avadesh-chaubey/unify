import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Link,
} from "@material-ui/core";
import SimpleBar from "simplebar-react";
import ModuleList from "./moduleList";

export default function RoleList(props) {
  return (
    <div className="mainView role-module">
      {props.roleList.length ? (
        <SimpleBar className="rolesList role-list-scroll permission-unit-list role-card">
          {props.roleList.map((data, i) => (
            <Card
              id={`doc-list-${i}`}
              className={`doctorcard centre-unit-card ${
                i === props.selectedRole ? "activeCard" : ""
              }`}
              key={i}
            >
              <CardActionArea
                onClick={(e) =>
                  props.handleCardClick(e, i, data.role, data.isRoleEnabled)
                }
              >
                <CardContent>
                  <div className="docDetails" style={{ width: "100%" }}>
                    <Grid container className="grid-role" spacing={2}>
                      <Grid item xs={9}>
                        <span className="docName hospital-unit-width role-name">
                          {data.role}
                        </span>
                      </Grid>
                      <Grid item xs={3}>
                        <Link
                          href="#"
                          onClick={(e) =>
                            props.handleRoleAccess(e, i, !data.isRoleEnabled)
                          }
                        >
                          <img
                            src="/disable_icon.svg"
                            className={`disble-icon ${
                              data.isRoleEnabled ? "deactivate-role" : ""
                            }`}
                          />
                        </Link>
                      </Grid>
                    </Grid>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </SimpleBar>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%", width: "50%" }}>
          <h4>Roles not added yet.</h4>
        </div>
      )}
      {props.roleList.length > 0 && props.selectedRole >= 0 ? (
        <ModuleList
          isRoleEnabled={props.roleActive}
          ManageRoles={props.ManageRoles}
          onChangePermModule={props.onChangePermModule}
          submitData={props.submitData}
          handleCancel={props.handleCancel}
          callingSave={props.callingSave}
        />
      ) : props.roleList.length > 0 ? (
        <div style={{ textAlign: "center", marginTop: "10%", width: "100%" }}>
          <h4>Please select a Role in Access Control Roles </h4>
          <h4 style={{ marginTop: "-14px" }}>to assign a permission</h4>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%", width: "100%" }}>
          <h4>Roles not added yet.</h4>
        </div>
      )}
    </div>
  );
}
