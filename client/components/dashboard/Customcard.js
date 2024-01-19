import React from 'react'
import { Paper, Card, Typography, makeStyles, Grid, Select, MenuItem, InputBase, Button, CardContent } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  Card: {
    width: '238px',
    height: '228px',
    borderRadius: '5px',
}
});
export default function Customcard() {
  return (
    <Grid container style={{ padding: '10px' }}>
    <Grid item >
        <Card className={classes.Card}>
            <CardContent>
                <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
</Grid>
  )
}