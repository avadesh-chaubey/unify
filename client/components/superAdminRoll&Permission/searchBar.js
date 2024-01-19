import React, {useState, useEffect} from 'react';
import { addDays } from 'date-fns';
import moment from 'moment';
import {
  AppBar, Toolbar, TextField, InputAdornment, Grid
  } from "@material-ui/core";

export default function SearchBar (props) {
  const [term, setTerm] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setTerm(e.target.value);
  };

  const handleSearchEnter = (e) => {
    if (e.charCode === 13) {
      // setSearchTerm(term);
    }
  };

  return (
    <AppBar position="relative" color="default" className="appbar-support searchby-role">
      <Toolbar className="support-toolbar">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="search-content-list"
              className="searchbar-content role-searchbar"
              placeholder="Search Here"
              variant="outlined"
              value={term}
              onChange={handleChange}
              onKeyPress={handleSearchEnter}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src="doctor/search_small.svg"
                      alt="close_search"
                      height="18"
                      width="18"
                    />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
