import React from 'react'
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor:"#f6f7fa",
    padding:" 15px 60px"
  },
  title: {
    color:"#4B2994",
    fontSize:"16px",
    fontWeight:"bold"
  },
  breadCrum: {
    color:"#4B2994",
    
  }
}));

function Heading() {
  const classes = useStyles();

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <div className={classes.head}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrum}>
        <Link href="/" onClick={handleClick} className={classes.breadCrum}>
          <Typography>Home</Typography>
        </Link>
        <Link href="/getting-started/installation/" onClick={handleClick} className={classes.breadCrum}>
          <Typography>Book Appointment</Typography>
        </Link>
        <Typography>Doctor Profile</Typography>
      </Breadcrumbs>
      <div className={classes.title}>
        Doctor Profile
      </div>
    </div>
  )
}

export default Heading
