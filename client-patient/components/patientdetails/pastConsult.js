import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TodayIcon from '@material-ui/icons/Today';
import moment from 'moment';
import time from "../../data/timeRoster.json";
import router from 'next/router';
import config from "../../app.constant";

function PastConsult(props) {
  console.log("pastConsultData props: ",props)
  const [apmtList, setApmtList] = useState([]);
  useEffect(() => {
    setApmtList(props.pastConsultData)
  }, [props.pastConsultData])
  const onAppointmentClick = (item) => {
    console.log("item: ",item)
    router.push("/appoinmentDetails")
    localStorage.setItem("appointmentData",JSON.stringify(item));
  }
  return (
    <div style={{flexGrow:"1", margin:"15px",}} >
      {apmtList.length>0 &&
        <Grid container spacing={2}>
          {apmtList.map((item)=>(
            <Grid item xs={12} sm={4} key={item.id}>
              <Paper className="apmtcardStyle" onClick={(e)=>{onAppointmentClick(item)}}>
                <div>
                  <div className="cardTopSec">
                      <div className="imageSec">
                        <img
                            src={
                              `${config.API_URL}/api/utility/download/` +
                              item.consultantProfileImageName
                            }
                            // src={
                            //   doct.profileImageName &&
                            //     doct.profileImageName != "NA"
                            //     ? `${config.API_URL}/api/utility/download/` +
                            //     doct.profileImageName
                            //     : createImageFromInitials(
                            //       100,
                            //       `${doct.userFirstName + " " + doct.userLastName
                            //       }`,
                            //       "#00888a"
                            //     )
                            // }
                        />
                      </div>
                    <div className="detailSec">
                      <div>{item.consultantName}</div>
                      <div style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} >{item.consultantQualification}</div>
                      <div>Experience: {item.consultantExperince}</div>
                      <div>Patient: {item.customerFirstName + " " + item.customerLastName + "( "+ item.customerRelationship + ")"}</div>
                    </div>
                  </div>
                  <div className="cardBottomSec">
                    <TodayIcon className="todayIcon" style={{marginLeft: "25%", transform:"translateX(-25%)"}}/>
                    <div style={{width:"50%"}} className="apmtTime">
                      {item.slotLabel} {moment(item.appointmentDate).format('DD-MMM-YYYY')}
                    </div>
                    {/* <div style={{color:"red", fontSize:"14px", fontWeight:"bold", width:"20%"}}>
                      CANCEL
                    </div>
                    <div style={{color:"blue", fontSize:"14px", fontWeight:"bold", width:"30%" }}>
                      RESCHEDULE
                    </div> */}
                  </div>
                </div>
                
              </Paper>
            </Grid>
          ))}
          </Grid>
    }
    </div>
  )
}

export default PastConsult
