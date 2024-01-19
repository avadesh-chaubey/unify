import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import moment from "moment";
import {
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
} from "@material-ui/core";

export default function SearchHeader(props) {
  const { term, handleTermChange, handleReset } = props;

  return (
    <AppBar
      position="relative"
      color="default"
      className="appbar-support searchby-role"
    >
      <Toolbar className="support-toolbar">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="search-content-list"
              className="searchbar-content role-searchbar"
              placeholder="Search Here"
              variant="outlined"
              value={term}
              onChange={handleTermChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src="/doctor/search_small.svg"
                      alt="close_search"
                      height="18"
                      width="18"
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    style={{ visibility: term.length ? "visible" : "hidden" }}
                    onClick={handleReset}
                  >
                    <img
                      src="../doctor/close_search.svg"
                      alt="close_search"
                      height="18"
                      width="18"
                    />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
