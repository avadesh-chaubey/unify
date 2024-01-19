import React, {useState, useEffect} from 'react'
import Header from "../../components/consultationServices/Header";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
const useStyles = makeStyles((theme) => ({
  ques:{
    fontSize:"15px",
    fontWeight:"bold",
    color: "#424242",
    margin: "15px 0",
  },
  feedbackBtn: {
    margin: "5px 7px",
    height: "40px",
    minWidth: "40px",
    borderRadius: "26px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    '&.selected': {
      border:"2px solid #9d441094",
      height: "44px",
      minWidth: "44px",
      fontSize:"15px"
    }
  },
  redBtn:{
    backgroundColor: "#ef423d",
    "&:hover":{
    backgroundColor: "#ef423d80",
    }
  },
  yellowBtn: {
    backgroundColor: "#fc9c2f",
    "&:hover":{
      backgroundColor: "#fc9c2f80",
      }
  },
  greenBtn: {
    backgroundColor: "#5dc000",
    "&:hover":{
      backgroundColor: "#5dc00080",
      }
  },
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 20,
    height: 20,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#5a158d',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 20,
      height: 20,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#5a158d',
    },
  },
}));

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

function feedbackForm() {
  const classes = useStyles();
  const [value, setValue] = useState("");
  
  return (
    <div className='feedbackForm mainDiv'>
      <Header />
      <HeadBreadcrumbs title1={"Consult"} title2 = {"Past Appointment"} title3 = {"Feedback Form"} mainTitle = {"Feedback Form"} />
      <Grid
        container
        // spacing={0}
        // spacing={3}
        direction="column"
        alignItems="center"
        // justify="center"
      >
        <Grid item xs={6} >
          <div>
            <div className={classes.ques}>
              1. How likely is it that you would recommend our service to a friend and colleagues ?
            </div>
            <div>
              <Button className={clsx(classes.feedbackBtn,value =="0" ? "selected" : "", classes.redBtn)} onClick ={(e)=>setValue("0")}>0</Button>
              <Button className={clsx(classes.feedbackBtn,value =="1" ? "selected" : "", classes.redBtn)} onClick ={(e)=>setValue("1")}>1</Button>
              <Button className={clsx(classes.feedbackBtn,value =="2" ? "selected" : "", classes.redBtn)} onClick ={(e)=>setValue("2")}>2</Button>
              <Button className={clsx(classes.feedbackBtn,value =="3" ? "selected" : "", classes.redBtn)}  onClick ={(e)=>setValue("3")}>3</Button>
              <Button className={clsx(classes.feedbackBtn,value =="4" ? "selected" : "", classes.redBtn)}  onClick ={(e)=>setValue("4")}>4</Button>
              <Button className={clsx(classes.feedbackBtn,value =="5" ? "selected" : "", classes.yellowBtn)} onClick ={(e)=>setValue("5")}>5</Button>
              <Button className={clsx(classes.feedbackBtn,value =="6" ? "selected" : "", classes.yellowBtn)} onClick ={(e)=>setValue("6")}>6</Button>
              <Button className={clsx(classes.feedbackBtn,value =="7" ? "selected" : "", classes.yellowBtn)} onClick ={(e)=>setValue("7")}>7</Button>
              <Button className={clsx(classes.feedbackBtn,value =="8" ? "selected" : "", classes.greenBtn)} onClick ={(e)=>setValue("8")}>8</Button>
              <Button className={clsx(classes.feedbackBtn,value =="9" ? "selected" : "", classes.greenBtn)} onClick ={(e)=>setValue("9")}>9</Button>
              <Button className={clsx(classes.feedbackBtn,value =="10" ? "selected" : "", classes.greenBtn)} onClick ={(e)=>setValue("10")}>10</Button>
            </div>
            <div style={{fontSize:"12px", color:"#555555", display:"block", height:"30px"}}>
              <div style={{float:"left", margin:"10px"}}>0 = Not likely at all</div>
              <div style={{float:"right", margin:"10px"}}>10 = Extremely likely</div>
            </div>
          </div>


          <div className='questions'>
            <div className={classes.ques}>
              2. Have you completed your appointment with doctor on schedule date?
            </div>
            <div>
              <FormControl component="fieldset">
                <RadioGroup row  defaultValue="Yes" aria-label="ques2" name="Ques2">
                  <FormControlLabel value="Yes" control={<StyledRadio />} label="Yes" />
                  <FormControlLabel value="No" control={<StyledRadio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>

          <div className='questions'>
            <div className={classes.ques}>
              3. Would you like to visit rainbow again?
            </div>
            <div>
              <FormControl component="fieldset">
                <RadioGroup row  defaultValue="Yes" aria-label="ques3" name="Ques3">
                  <FormControlLabel value="Yes" control={<StyledRadio />} label="Yes" />
                  <FormControlLabel value="No" control={<StyledRadio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div style={{textAlign:"right", marginBottom:"100px"}}>
            <Button
                id="OTP Submit Btn"
                size="small"
                variant="contained"
                className="mainBtn"
                // onClick={otpSubmitBtn}
                style={{width:"200px", marginTop:"10px"}}
              >
                Submit
              </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default feedbackForm
