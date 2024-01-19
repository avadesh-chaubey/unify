import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import config from '../../app.constant';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider
} from '@material-ui/core';
import { calculateAge, makeInitialCapital} from '../../utils/helpers';
import { getInitials } from '../../utils/nameDP';

let languages = [];
  
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value, headers) {

    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
    let list = [];

    if (value.length > 1) {
      axios
      .get(
        `${config.API_URL}/api/patient/consultant/appointments?name=${value}`,
        { headers }
      )
      .then(res => {
        list = res.data;
        if (list.length) {
          const getLatestAppointment = list[list.length - 1];

          // Get the latest appointment of the patient
          languages = [getLatestAppointment];
        } else {
          languages = [];
        }        
      })
      .catch(err => {
        console.log('Err with search api', err);
        languages = [];
      });
  
      return languages.filter(language => regex.test(language?.customerName));
    }

    return languages;
  }
  
  function getSuggestionValue(suggestion, props) {
    const {
      setList,
      addAgeOfPatient,
      setAppointmentObj,
      setUpcomingDate,
      setCountRecords,
      setSearchMode,
      setPatientName,
      setAppointId,
      setListFilterStatus
    } = props;

    setSearchMode(true);
    setCountRecords([suggestion].length);
    setUpcomingDate(suggestion.appointmentDate);
    setList(addAgeOfPatient([suggestion]));
    setAppointmentObj(suggestion);
    setPatientName(suggestion.customerName);
    setAppointId(suggestion.id);
    setListFilterStatus('');

    return suggestion.customerName;
  }
  
  function renderSuggestion(suggestion) {
    return (
      <List>
        <ListItem button className="suggestion-list-details">
        <ListItemText
          primary={(
            <div>
              <span className="suggestion-list">
                <strong>{ makeInitialCapital(suggestion.customerName) }</strong>
              </span>
              <span className="suggestion-list">{calculateAge(suggestion.customerDateOfBirth)}</span>
              <span className="suggestion-list">{getInitials(suggestion.customerGender)}</span>
            </div>
          )}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                { suggestion.parentPhoneNumber }
              </Typography>
            </React.Fragment>
          }
        />
        </ListItem>
        <Divider />
      </List>
    );
  }
  
  export default class DocAutosuggest extends React.Component {
    constructor() {
      super();
  
      this.state = {
        suggestions: []
      };    
    }
  
    onChange = (_, { newValue }) => {
      const { id, onChange } = this.props;
      
      this.setState({
        value: newValue
      });
      
      onChange(id, newValue);
    };
    
    onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: getSuggestions(value, this.props.headers)
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };
  
    render() {
      const { id, placeholder, headers, value } = this.props;
      const { suggestions } = this.state;
      const inputProps = {
        placeholder,
        value,
        onChange: this.onChange,
        headers
      };
      
      return (
        <Autosuggest 
          id={id}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={value => getSuggestionValue(value, this.props)}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} 
        />
      );
    }
  }
  