import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import moment from 'moment';


const useStyles = makeStyles({
  table: {
    width: 1200,
  },
  margin: {
    margin: 5,
  },
  root: {
    width: 1300,
    height: 800,
    margin: 50
  },
});

const AppointmentSlots = ({ currentUser }) => {

  const classes = useStyles();
  const router = useRouter();
  const [appointmentSlots, setAppointmentSlots] = useState([]);

  const { doctorId } = router.query;

  const signout = async () => {
    await axios.post('/api/users/signout')
      .then(() => {
        router.push('/')
      })
      .catch(error => {
        console.log(error);
        alert.show('API error', { type: 'error' })
      });
  }

  const goHome = async () => {
    router.push('/roasterManagement')
  }

  const handleEditAppointment = (date, slotList) => {
    if (slotList) {
      slotList.unshift("0");
    }
    router.push({
      pathname: '/doctor/appointment-slots',
      query: {
        appointmentDate: date,
        consultantId: doctorId,
        availableSlotList: slotList
      },
    })
  }


  const fetchData = async () => {
    try {
      const startDate = moment().format('YYYY-MM-DD');
      await axios.post(`/api/appointment/viewslots`, {
        consultantId: doctorId,
        startDate: startDate,
        stopDate: moment(startDate).add(5, 'days').format('YYYY-MM-DD')
      }).then((response) => {
        setAppointmentSlots(response.data);
      }).catch(error => {
        console.log(error);
        alert.show('API error', { type: 'error' })
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(error => {
        console.warn(JSON.stringify(error, null, 2));
      });
  }, []);

  return <>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "#2b2b2b",
      }}
    >
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className="primary-button"
        onClick={goHome}
        style={{ margin: "20px 20px 20px 1250px" }}>
        Home
      </Button>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        className="primary-button"
        onClick={signout}
        style={{ margin: "20px 20px 20px 1250px" }}>
        Logout
      </Button>
    </div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Appointment Date</TableCell>
            <TableCell align="right">No. Of Slots</TableCell>
            <TableCell align="right">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointmentSlots.map((appointmentSlot) => (
            <TableRow key={appointmentSlot.appointmentDate}>
              <TableCell component="th" scope="row">
                {appointmentSlot.appointmentDate}
              </TableCell>
              <TableCell align="right">{appointmentSlot.availableSlotsList.length}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="edit"
                  className={classes.margin}
                  onClick={() => handleEditAppointment(appointmentSlot.appointmentDate, appointmentSlot.availableSlotsList)}
                >
                  <EditIcon fontSize="small" />
                </IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
};



export default AppointmentSlots;

