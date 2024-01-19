import moment from 'moment';
import time from "../data/time.json";

/**
 * Function to capitalise the initial letter of word
 * 
 * @param {string} str
 * @return word 
 */
export const makeInitialCapital = (str) => {
  if (str !== undefined) {
    let word = str.toLowerCase().split(" ");
    for (let i = 0; i < word.length; i++) {
      word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
    }
    return word.join(" ");
  }
};

/**
 * Function to get auto generated unique id
 * 
 * @return uui
 */
export const create_UUID = () => {
  let getTime = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (getTime + Math.random()*16)%16 | 0;
      getTime = Math.floor(getTime/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

/**
 * 
 * @param {string} age
 * @return int 
 */
export const calculateAge = (dob) => {
  const patientBirthYear = moment(new Date(dob), "YYYY");
  const ageDifference = moment().diff(patientBirthYear, "years");

  return ageDifference;
}

export const compareAppointmentDate = (newDate, appDate) => {
  // Increase the new Date by 7 days
  const futureDateUnix = moment(newDate).add(7, 'day').unix();
  const currDateUnix = moment(appDate).unix();
  const compareDateRes = futureDateUnix < currDateUnix;

  return compareDateRes;
}

// Function to get the initial letter of gender
export const getInitialsOfGender = (gender) => {
  let name = gender;
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

  let initials = [...name.matchAll(rgx)] || [];

  initials = (
    (initials.shift()?.[1] || '')
  ).toUpperCase();

  return initials;
};

export const getAppointmentTime = (slotId) => {
  const getTime = time.filter(t => t.value === slotId);

  return getTime[0].label;
}

// Function to break record based on chunk size
export const divideByChunk = (data, chunkSize = 10) => {
  // Array chunk size is defined by chunkSize
  // Divide data into json batch set
  let group = data.map((i, index) => {
    return (index % chunkSize === 0) ? data.slice(index, index + chunkSize) : null; 
  }).filter(e => { return e; });

  return group;
};
