import React, {useState, useEffect} from 'react';
import moment from 'moment';
import config from '../../app.constant';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import {Avatar} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  appointmentTime: {
    width: '100%',
    fontWeight: '600',
    color: '#3e3eb7'
  },
  tabs: {
    width: '500px'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    overflowY: 'hidden',
    marginTop: '2px',
    backgroundColor: '#EDEDED',
  },
  chatList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '1px',
  },
  chat: {
    display: 'flex',
    flex: 3,
    flexDirection: 'column',
    borderWidth: '1px',
    borderColor: '#a0a0a0',
    borderRightStyle: 'solid',
    borderLeftStyle: 'solid',
    // backgroundColor: '#bdbbbb',
  },
  appointmentList: {
    minHeight: 'calc(100vh - 100px)',
    height: '100vh',
    overflowY: 'auto',
    marginTop: '10px',
    backgroundColor: '#e8e8e8',
  },
  active: {
    border: '2px solid rgba(65, 154, 249, 0.99)',
    backgroundColor: 'rgba(65, 154, 249, 0.3) !important',
  },
  activeCard: {
    borderRadius: '4px',
    border: 'solid 2px #2188cb',
    backgroundColor: '#e1efff',
  },
  chatListHover: {
    '&:hover' : {
      cursor: 'pointer',
      backgroundColor: '#e1efff',
    }
  },
  timeSlotLessSlot: {
    marginLeft: '39.7px',
  },
  timeSlotMoreSlot: {
    marginLeft: '21.7px',
  }
}));

const sampleList = [
    {id: 1, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 2, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 3, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 4, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 5, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 6, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 7, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
    {id: 8, name: 'Kris Bhatt', age: '24', image: '../doctor.jpg', status: 'Active', gender: 'M' },
];

const SampleAppointmentList = () => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOnClickList = (event, index) => {
    setSelectedIndex(index);
  };

  const getInitials = (str) => {
    let name = str;
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

    let initials = [...name.matchAll(rgx)] || [];

    initials = (
      (initials.shift()?.[1] || '')
    ).toUpperCase();

    return initials;
  };

  return <>
  {sampleList.map((d, index) => (
      <Card
        style={{ margin: '5px' }}
        className={
          `doctorcard
          ${ classes.chatListHover }
          ${ (index === selectedIndex) ? classes.activeCard : '' }
          `
        }
        key={index}
      >
        <CardActionArea
          style={{height:'100%'}}
          onClick={(event) => handleOnClickList(event, index)}
        >
          <CardContent>
          <div className='docImage'>
            <Avatar style={{ height: '70px', width: '70px' }}> { getInitials(d.name) } </Avatar>
            {/* <img
              src={`../user.svg`}
              alt={d.name}
            /> */}
          </div>
          <div className='docDetails'>
            <span style={{fontWeight:'bold'}}>{ d.name }</span>

            <span style={{ width: '100%', display: 'inline-flex' }}>
              <span>
                <span> { `${d.age} ${d.gender}` } </span>
                <span> Status: {d.status} </span>
              </span>
              <span className={ sampleList.length > 4 ? classes.timeSlotMoreSlot : classes.timeSlotLessSlot }>
                <strong style={{ right: 0, color:'#054fd8' }}>
                  { moment(new Date()).format('hh:mm A') }
                </strong>
              </span>
              <span
                style={{ position: 'relative', marginTop: '-3px' }}
              >
                <NavigateNextIcon fontSizeSmall /></span>
              </span>
          </div>
          </CardContent>
        </CardActionArea>
      </Card>
    ))}
  </>
};

export default SampleAppointmentList;