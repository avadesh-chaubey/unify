import React, { useState, useEffect } from 'react'
import {
    Grid, makeStyles, Typography, Button, InputBase, Card, CardContent
} from '@material-ui/core'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Sidenavbar from '../dashboard/Sidenavbar';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#FFFFFF',
        display: 'flex',
        boxShadow: 'none',
    },
    MainContainer: {
        '& h5, & h6': {
            color: '#000000A1',
            fontFamily: 'Bahnschrift SemiBold',
        },
    },
    cityInput: {
        border: '1px ',
        borderColor: '#979797',
        boxShadow: '0 0 0 .5px #979797',
        borderRadius: '20px',
        marginLeft: '15px',
        opacity: '1',
        padding: `0px ${theme.spacing(2)}px`,
        fontSize: '0.8rem',
        width: '470px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Bahnschrift SemiBold',
        color: '#555555',
    },
    '&:hover': {
        backgroundColor: '#E4F4FF'
    },
    uploadInput: {
        border: '1px ',
        borderColor: '#979797',
        boxShadow: '0 0 0 .5px #979797',
        borderRadius: '20px',
        marginLeft: '30px',
        opacity: '1',
        padding: `0px ${theme.spacing(2)}px`,
        fontSize: '0.8rem',
        width: '480px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Bahnschrift SemiBold',
        color: '#555555',
    },
    '&:hover': {
        backgroundColor: '#E4F4FF'
    },
    addInput: {
        border: '1px ',
        borderColor: '#979797',
        boxShadow: '0 0 0 .5px #979797',
        borderRadius: '20px',
        marginLeft: '15px',
        opacity: '1',
        padding: `0px ${theme.spacing(4)}px`,
        fontSize: '0.8rem',
        width: '150px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Bahnschrift SemiBold',
        color: '#555555',
    },
    '&:hover': {
        backgroundColor: '#E4F4FF'
    },
    searchInput: {
        border: '1px ',
        borderColor: '#979797',
        boxShadow: '0 0 0 .5px #979797',
        borderRadius: '20px',
        marginLeft: '15px',
        opacity: '1',
        padding: `0px ${theme.spacing(2)}px`,
        fontSize: '0.8rem',
        width: '470px',
        height: '35px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Bahnschrift SemiBold',
        color: '#555555',
    },
    '&:hover': {
        backgroundColor: '#E4F4FF'
    },
    Card: {
        borderRadius: '5px',
        fontFamily: 'Bahnschrift SemiBold',
        border:'none',
        boxShadow:'none',
    },
    Card2: {
        borderRadius: '5px',
        fontFamily: 'Bahnschrift SemiBold',
        border:'none',
        boxShadow:'none',
        width:'100px',
        marginLeft:'250px',
    },
    typotext1: {
        color: '#20CA00',
        fontFamily: 'Bahnschrift SemiBold',
        fontSize: '15px',
    },
    typotext: {
        color: '#555555',
        fontFamily: 'Bahnschrift SemiBold',
        fontSize: '15px',
    },
    typotext2: {
        paddingTop: '0',
        color: '#EC1D3C',
        fontFamily: 'Bahnschrift SemiBold',
        fontWeight: 'normal',
        fontSize: '10px',
    },
    formsectionpayment: {
        minWidth: '70%',
        '& div': {
            marginTop: '3px',
            marginLeft: '10px',
            // marginRight: '35px',
            '& label': {
                fontFamily: 'Bahnschrift SemiBold',
                marginLeft: '10px',
            },
            '& div': {
                width: '450px',
            },
        },
    },
    Button2:{
        border:'1px solid #979797',
        boxShadow:'none',
        width:'150px',
        borderRadius:'35px',
        '& span':{
            fontFamily:'Bahnschrift SemiBold',
        },
    },
    Button:{
        border:'1px solid #979797',
        backgroundColor:'#152A75',
        boxShadow:'none',
        width:'150px',
        borderRadius:'35px',
        marginLeft:'20px',
        '& span':{
            fontFamily:'Bahnschrift SemiBold',
            color:'#FFFFFF',
        },
    },
}))

export default function AddnewAppointments() {
    const [selectedValue, setSelectedValue] = useState('card');
    const classes = useStyles();

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={1}><Sidenavbar /></Grid>
                <Grid item xs={11} className={classes.MainContainer}>
                    <Typography variant="h5" style={{ color: '#000000A1', }}>Add New Lab Order</Typography>
                    <br />
                    
                    <Grid container justify='space-between' >
                        <Grid item>
                            <InputBase
                                placeholder="Banjara Hills, Hyderabad"
                                className={classes.cityInput}
                                startAdornment={<LocationOnIcon fontSize="small" />}
                            />
                        </Grid>
                        <Grid item style={{ marginRight: '40px', }}>
                            <InputBase
                                placeholder="Search By Patient name and mobile"
                                className={classes.cityInput}
                                startAdornment={<PersonIcon fontSize="small" />}
                            />
                        </Grid>
                        {/* <Button variant="outlined">
                        Banjara Hills, Hyderabad
                        </Button> */}
                    </Grid>
                    <br />
                    <Grid container justify='space-between' >
                    <Grid item style={{ marginRight: '40px', }}>
                            <InputBase
                                placeholder="Search By Name or Phone Number"
                                className={classes.searchInput}
                                startAdornment={<SearchIcon fontSize="small" />}
                            />
                        </Grid>
                        <Grid item style={{marginRight:'35px'}}>
                            <InputBase
                                placeholder="Upload Prescription"
                                className={classes.searchInput}
                                startAdornment={<PublishOutlinedIcon fontSize="small" />}
                            />
                        </Grid>
                        {/* <Grid item style={{ marginRight: '40px', }}>
                            <InputBase
                                placeholder="Add New"
                                className={classes.addInput}
                                startAdornment={<AddOutlinedIcon fontSize="small" />}
                            />
                        </Grid> */}
                    </Grid>
                    <br/>
                <Grid container style={{border:'1px solid #979797', width:'95%', marginLeft:'20px', borderRadius:'5px',}}>
                    {/* <Card style={{border:'1px solid black', boxShadow:'none', width:'95%'}}>
                    <CardContent>
                    <Typography>
                    Covid Antibody IgG (Quantitative )
                    </Typography>
                    <Typography style={{color:'red',}}>
                    Prescription Required
                    </Typography>
                    </CardContent>
                    </Card> */}
                    <Grid item sm={4} style={{ textAlign: 'left' }}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Typography className={classes.typotext} >Covid Antibody IgG (Quantitative )</Typography>
                                    <Typography className={classes.typotext2}>Prescription Required</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item >
                            <Card className={classes.Card2}>
                                <CardContent>
                                    <Typography className={classes.typotext1}>70% off</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={2}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Typography className={classes.typotext} >Rs. 29</Typography>
                                    <Typography className={classes.typotext2}>MRP Rs. 30.19</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item >
                            <Button style={{marginTop:'20px', border:'1px solid #979797', borderRadius:'35px', paddingRight:'25px', paddingLeft:'25px', paddingTop:'5px', paddingBottom:'5px',}}
                            
                            >
                            Remove
                            </Button>
                        </Grid>
                </Grid>
                <br/>
                <Grid container style={{border:'1px solid #979797', width:'95%', marginLeft:'20px', borderRadius:'5px',}}>
                    <Grid item sm={4} style={{ textAlign: 'left' }}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Typography className={classes.typotext} >Urine Routine & Microscopy</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item style={{ textAlign: 'center' }}>
                            <Card className={classes.Card2}>
                                <CardContent>
                                    <Typography className={classes.typotext1}>70% off</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={2} style={{ textAlign: 'left' }}>
                            <Card className={classes.Card}>
                                <CardContent>
                                    <Typography className={classes.typotext} >Rs. 29</Typography>
                                    <Typography className={classes.typotext2}>MRP Rs. 30.19</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item sm={1} style={{ textAlign: 'left' }}>
                            <Button style={{marginTop:'20px', border:'1px solid #979797', borderRadius:'35px', paddingRight:'25px', paddingLeft:'25px', paddingTop:'5px', paddingBottom:'5px',}}
                            
                            >
                            Remove
                            </Button>
                        </Grid>
                </Grid>
                <br/>
                <Grid container style={{ border: '1px solid #979797', borderRadius: '5px', padding: '10px', width:'95%', marginLeft:'20px',}}>
                            <Grid item>
                            <Typography style={{ fontFamily: 'Bahnschrift SemiBold', fontSize:'15px',color:'#555555', marginLeft:'15px'}}>Choose Your Payment Details</Typography>
                                <Typography style={{ fontFamily: 'Bahnschrift SemiBold', fontSize:'13px',marginLeft: '15px', color:'#555555', }}>Add the Payment details below.
                                    <div style={{ marginLeft: '0px', marginTop: '10px', fontFamily: 'Bahnschrift SemiBold', fontSize:'15px' }}>
                                        <Radio
                                            checked={selectedValue === 'card'}
                                            onChange={handleChange}
                                            value="card"
                                            inputProps={{ 'aria-label': 'Card' }}
                                        /> Card
                                        <Radio
                                            checked={selectedValue === 'cash'}
                                            onChange={handleChange}
                                            value="cash"
                                            inputProps={{ 'aria-label': 'Cash' }}
                                        /> Cash
                                        <Radio
                                            checked={selectedValue === 'upi'}
                                            onChange={handleChange}
                                            value="upi"
                                            inputProps={{ 'aria-label': 'UPI' }}
                                        /> UPI</div></Typography>
                                <Grid container>
                                    <Grid item className={classes.formsectionpayment}>
                                        <TextField
                                            label="Transaction Number"
                                            id="standard-size-small"
                                            placeholder="999999999999"
                                            size="small"
                                            variant="filled" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item style={{ marginLeft: '700px', marginTop: '10px', }}>
                    <Button className={classes.Button2}
                       >
                        SAVE ORDER
                    </Button>
                    <Button className={classes.Button}
                    variant="contained"
                       >
                        CREATE ORDER
                    </Button>
                </Grid>
                <Grid item style={{ marginTop: '10px', }} >
                </Grid>
                </Grid>
            </Grid>
        </div>
    )
}