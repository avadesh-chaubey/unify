import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '15px',
    '& > * + *' : {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function DoctorRating () {
  const classes = useStyles();

  return(
    <div className={classes.root}>
      <Rating name="half-rating-read" defaultValue={3} precision={0.5} readOnly />
    </div>
  );
}
