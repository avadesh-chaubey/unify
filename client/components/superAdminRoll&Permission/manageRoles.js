import React, {useState, useEffect} from 'react';
import SearchBar from './searchBar';
import { Typography, Card, CardActionArea, CardContent, Tooltip, Grid} from '@material-ui/core';
import RoleList from './roleList';
import ModuleList from './moduleList';

export default function ManageRoles () {
  
  return (
    <>
      <SearchBar />
      <div className="role-perm-header">
        <Typography className="role-typography" variant="body1" component="body1">
          Access Control Roles
        </Typography>
        <Grid container >
            <Grid item xs={5}>
        <RoleList />
        </Grid>
        <Grid item xs={7}>
        <Typography className="role-typography" variant="body1" component="body1">
        Access Control Responsibilities
        </Typography>
        <ModuleList />
            </Grid>
        </Grid>
      </div>
    </>
  );
}
