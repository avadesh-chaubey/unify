import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function testkris () {
  
  useEffect(() => {
    console.log('About to hit UAT API');
    
    axios.get(`https://appointmentuat.rainbowhospitals.in/PATIENTPORTALSERVER/PortalService.svc/json/GetSpecialityList?`)
      .then(res => {
        console.log('Successfully received data from UAT api');
        console.log('HOS', res.data);
      })
      .catch(err => {
        console.log("Error occurred with while getting response from UAT")
        console.log('Test Kris', err);
      });
    
    console.log("API Operation Finished !!");
  }, []);

  return (
    <div>Hi Kris</div>
  );
}
