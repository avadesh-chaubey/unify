import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useEffect, useState } from "react";

function FilterArea() {
  const [feeFilter, setFeeFilter] = useState("any");
  const [specialityFilter, setSpecialityFilter] = useState("any");
  const [sort, setSort] = useState("recent");
  return (
    <>
      <div className="filter-area">
        <div className="searchBar">
          <div className="search">
            <div className="searchIcon">
              <SearchIcon />
            </div>
            <InputBase
              className="inputStyle"
              placeholder="Search By Doctor Name"
              inputProps={{ "aria-label": "search" }}
              // onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="midPart">
          <div className="feeSec">
            <span>Fee &nbsp;&nbsp;</span>
            <span>
              <FormControl className="selectBox">
                <Select
                  // native
                  value={feeFilter}
                  // onChange={handleStatusChange}
                  inputProps={{
                    name: "fee",
                    // id: 'age-native-simple',
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                </Select>
              </FormControl>
            </span>
          </div>
          <div className="feeSec">
            <span>Speciality &nbsp;&nbsp;</span>
            <span>
              <FormControl>
                <Select
                  // native
                  value={specialityFilter}
                  // onChange={handleDeptChange}
                  inputProps={{
                    name: "Speciality",
                    // id: 'age-native-simple',
                  }}
                >
                  <MenuItem value={"any"}>Any</MenuItem>
                </Select>
              </FormControl>
            </span>
          </div>
        </div>

        <div className="sortRight">
          <span>Sort By &nbsp;&nbsp;</span>
          <span>
            <FormControl>
              <Select
                // native
                value={sort}
                // onChange={handleSortChange}
                inputProps={{
                  name: "Sort",
                  // id: 'age-native-simple',
                }}
              >
                <MenuItem value="recent">Recent Activity</MenuItem>
              </Select>
            </FormControl>
          </span>
        </div>
      </div>
    </>
  );
}
export default FilterArea;
