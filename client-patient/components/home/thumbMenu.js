import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';

import BookAppointment from "./bookAppointment"
import OrderMedicine from "./orderMedicine"
import OrderTest from "./orderTest"
function ThumbMenu(props) {
  const [openAppointment, setOpenAppointment] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState(false);
  const [opentest, setOpenTest] = React.useState(false);

  const handleClickOpenAppointment = () => {
    setOpenAppointment(true);
  };

  const handleCloseAppointment = () => {
    setOpenAppointment(false);
  };

  const handleClickOpenOrder = () => {
    setOpenOrder(true);
  };

  const handleCloseOrder = () => {
    setOpenOrder(false);
  };
  const handleClickOpenTest = () => {
    setOpenTest(true);
  };

  const handleCloseTest = () => {
    setOpenTest(false);
  };
  const onCardClick = (val) =>{
    console.log("val : ",val)
    if(val === "book_appointment"){
      handleClickOpenAppointment();
    }
    if(val === "medicine"){
      handleClickOpenOrder();
    }
    if(val === "test"){
      handleClickOpenTest();
    }
    if(val === "247_consult"){
      props.set24X7Consult(true);
    }
  }
  
  return (
    <div style={{flexGrow:"1", margin:"15px"}} >
         <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("book_appointment")}}>
                <img src="book_appointment.svg"/>
                <div> Book Appointment</div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("medicine")}}>
                <img src="medicine.svg"/>
                <div> order medicine</div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("test")}}>
                <img src="test.svg"/>
                <div> order test</div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("past_consults")}}>
                <img src="past_consults.svg"/>
                <div>Past Consultation</div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("247_consult")}}>
                <img src="247 consult.svg"/>
                <div>24x7 Consultation</div>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Paper className="cardStyle" onClick = {(e)=>{onCardClick("emergency")}}>
                <img src="emergency.svg"/>
                <div>Emergency</div>
              </Paper>
            </Grid>
          </Grid>
          <Modal
            open={openAppointment}
            onClose={handleCloseAppointment}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
            className="bookAppointmentDiag"
            BackdropComponent={Backdrop}
            BackdropProps={{
              width: "100%",
            }}
          >
            {/* <DialogContent> */}
              <BookAppointment handleClose={handleCloseAppointment} setRefreshList={props.setRefreshList}/>
            {/* </DialogContent> */}
          </Modal>
          <Modal
            open={openOrder}
            onClose={handleCloseOrder}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
            className="bookAppointmentDiag"
            BackdropComponent={Backdrop}
            BackdropProps={{
              width: "100%",
            }}
          >
            {/* <DialogContent> */}
              <OrderMedicine handleClose={handleCloseOrder}/>
            {/* </DialogContent> */}
          </Modal>
          <Modal
            open={opentest}
            onClose={handleCloseTest}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
            className="bookAppointmentDiag"
            BackdropComponent={Backdrop}
            BackdropProps={{
              width: "100%",
            }}
          >
            {/* <DialogContent> */}
              <OrderTest handleClose={handleCloseTest}/>
            {/* </DialogContent> */}
          </Modal>
    </div >
  )
}

export default ThumbMenu
