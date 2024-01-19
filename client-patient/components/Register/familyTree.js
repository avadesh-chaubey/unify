import React, {useState, useEffect} from 'react'
import MessagePrompt from "../messagePrompt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useCookies } from "react-cookie";
import config from "../../app.constant";
import axios from "axios";
import Header from "../consultationServices/Header";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import relationArr from "../../data/relation.json";
import TextField from '@material-ui/core/TextField';
import router from 'next/router';

const useStyles = makeStyles((theme) => ({
   root: {
      padding: " 15px 90px",
    },
   member: {
      fontSize: "16px",
      fontWeight: "bold",
      height: "160px",
      width:"300px",
      border:"1px solid",
      margin:"10px",
      display: "inline-block",
      cursor:"pointer",
      textAlign:"center",
   //   '&:hover': {
   //    backgroundColor: "#dbcef6",
   //    },
   //    '&.active': {
   //       backgroundColor: "#4B2994",
   //       color:"#fff"
   //    }
   },
   memberDetails: {
      width:"100px",
      float:"left",
      padding:"5px"
   },
   memberOption: {
      width:"180px",
      float:"left",
      textAlign:"left",
      padding:"40px 25px"
   },
   memberImage: {
      height:"50px",
      borderRadius:"40px",
      margin:"10px"

   },
   radioColor: {

   },
   memberName: {
      fontSize: "14px",
      fontFamily: "Avenir_heavy !important",
      color:"#6d6d6d"
   },
 }));

function FamilyTree(props) {
   const {phoneNo,setPage} = props;
   const [msgData, setMsgData] = useState({});
   const classes = useStyles();
   const [cookies, setCookie] = useCookies(["name"]);
   const [loader, setLoader] = useState(false);
   // const [value, setValue] = React.useState('female');
   const [memberList, setMemberList] = useState([]);
   // const [primaryId, setPrimaryId] = useState("");
   const [email, setEmail] = useState("");
   const [emailError, setEmailError] = useState("");
   const headers = {
      authtoken: cookies["cookieVal"],
    };
   useEffect(() => {
      if(phoneNo.length > 5){
         // ${phoneNo}
         axios
         .get(`${config.API_URL}/api/patient/hispatient/${phoneNo}`)
         .then((res) => {
         console.log("res: ",res)
         let data = res.data.data;
         console.log("data: ",data);
         setMemberList(data.patients)
         setLoader(false);
         })
         .catch((err) =>{ 
         console.log("err",err)
         setMsgData({ message: err.response.data[0].message, type: "error" });
         setLoader(false);
         });
      }

   }, [phoneNo]);
   
   function ValidateEmail(mail) {
      setEmail(mail.target.value);
      const {
        target: { value },
      } = event;
      setEmailError({ email: "" });
      setEmail(value);
      let reg = new RegExp(/\S+@\S+\.\S+/).test(value);
      if (!reg) {
        setEmailError({ email: "Please enter valid email" });
      }
    }
   // const handlePrimary = (event,item,index) => {
   //    setPrimaryId(item.id);
   //    setEmail("")
   //    setEmailError({ email: "" });

   //    let tempArr = [...memberList];
   //    tempArr[index].relationship = "self";
   //    setMemberList(tempArr)
   // };
   const handleRelation = (event, index) =>{
      let tempArr = [...memberList];
      tempArr[index].relationship = event.target.value;
      // if(event.target.value === "self"){
      //    setPrimaryId(tempArr[index].id);
      // }
      setMemberList(tempArr)
   } 
   const saveBtn = ()=>{
      console.log("memberList: ",memberList);
      console.log("email: ",email);
      
      let flag = 0;
      memberList.map((item)=>{
         if(item.relationship ==="self"){
            flag +=1;
         }
      })
      console.log("flag: ",flag);
      
      if(flag == 0){
         setMsgData({ message: "Please select one member as Self", type: "error" });
         return false;
      }
      if(flag > 1){
         setMsgData({ message: "Only one member can be set as Self", type: "error" });
         return false;
      }
      if(email === "") {
         setMsgData({ message: "Please enter email for Self", type: "error" });
         return false;
      }
      memberList.map((item)=>{
         if(item.relationship ==="self"){
            item.emailId = email;
            return item;
         }
      })
      let patients = {patients: memberList};
      console.log("patients: ",patients);
      // return false;
      setLoader(true);
      axios
      .post(`${config.API_URL}/api/patient/hispatient`, patients)
      .then((res) => {
         console.log("HIS data saved", res.data)
         localStorage.setItem("userDetails",JSON.stringify(res.data.data));
         if (res.data.data.token) {
            if (process.browser) {
               setCookie("cookieVal", res.data.data.token, { path: "/" });
               // router.push("/home")
            }
         }
         // router.push("/home");
         setPage(3);
         // setLoader(false);
      })
      .catch((err) => {
         console.log("err",err);
         setLoader(false);
      });

   } 
   return <div className='mainDiv familyTree'>
      <MessagePrompt msgData={msgData} />
         {loader && (
         <div className="loader">
            <CircularProgress color="secondary" />
         </div>
         )}
         {/* <Header /> */}
         <HeadBreadcrumbs
            titleArr={["Login","Register"]}
            lastTitle = {"Primary User & Relationship"}
            mainTitle={"Primary User & Relationship"}
         />
         <div className={classes.root}>
            {memberList.length >0 && <div style={{width:"60%",display:"block", padding:"5px 10px"}}>
               <TextField 
                  required
                  id="Email" 
                  label="Email Id" 
                  value={email}
                  className="fullDiv"
                  error={Boolean(emailError?.email)}
                  helperText={emailError?.email}
                  onChange={ValidateEmail}
                  style={{background:"#F6F7FA"}}
               />
            </div>}
            
            {memberList.length >0 && memberList.map((item,index)=>(
               <div className={classes.member}>
                  <div className={classes.memberDetails} >
                     <img src="../user.svg" className={classes.memberImage}/>
                     <div className={classes.memberName}>G{`${item.userFirstName} ${item.userLastName != null ? item.userLastName :""}`}</div>
                  </div>
                  <div className={classes.memberOption}>
                     <Typography>Relationship</Typography>
                     <FormControl className={classes.formControl} style={{background:"#F6F7FA"}}>
                        <Select
                           // select
                           value={item.relationship}
                           onChange={(e)=>{handleRelation(e, index)}}
                           displayEmpty
                           className={classes.countryCode}
                           // IconComponent={CustomSvgIcon}
                           // renderValue={(value) => `${value}`}

                           style={{width: "160px ", height:"40px", fontSize:"15px", color:"#6B6974",}}
                        >
                           {/* <MenuItem value = "self"> Self</MenuItem>
                           <MenuItem value = "relation1">  Relation 1</MenuItem>
                           <MenuItem value = "relation2">  Relation 2</MenuItem>
                           <MenuItem value ="other" >  Other</MenuItem> */}
                           {item.gender === "female" ?
                           relationArr.relaton_female.map((ele, i) => (
                              <MenuItem key={"code-" + i} value={ele.value}>
                                 {`${ele.relation}`}
                              </MenuItem>
                           ))
                           :
                           relationArr.relaton_male.map((ele, i) => (
                              <MenuItem key={"code-" + i} value={ele.value}>
                                 {`${ele.relation}`}
                              </MenuItem>
                           ))
                           }
                        </Select>
                     </FormControl>
                     {/* <RadioGroup aria-label="gender" name="gender1" value={primaryId === item.id? "primary":""} onChange={(e)=>handlePrimary(e,item,index)}>
                        <FormControlLabel value="primary" control={<Radio />} label="Primary User" className={classes.radioColor}/>
                     </RadioGroup>
                     {primaryId == item.id && } */}
                  </div>
               </div>
            )) }
            
            <div style={{textAlign:"right"}}>
               <Button
                  id="OTP Submit Btn"
                  size="small"
                  variant="contained"
                  className="mainBtn"
                  onClick={saveBtn}
                  style={{width:"200px", marginTop:"10px"}}
               >
                  Save
               </Button>
            </div>
         </div>
   </div>;
}

export default FamilyTree;
