import React, {useState, useEffect} from 'react';
import Header from "../../components/consultationServices/Header";
import HeadBreadcrumbs from "../../components/common/headBreadcrumbs";
import { useCookies } from "react-cookie";
import config from "../../app.constant";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import router from 'next/router';

const useStyles = makeStyles((theme) => ({
   root: {
     padding: " 15px 90px",
   },
   title: {
      fontFamily: "Avenir_heavy !important",
      padding:"20px 0",
      fontSize:"28px",
      color:"#424242",

   },
   member: {
      fontSize: "16px",
      fontWeight: "bold",
      height: "180px",
      width:"150px",
      border:"1px solid",
      margin:"10px",
      display: "inline-block",
      cursor:"pointer",
      textAlign:"center",
      color:"#4c4c4c",
      background: "#e0e0e0",
     '&:hover': {
      backgroundColor: "#dbcef6",
      },
      '&.active': {
         backgroundColor: "#4B2994",
         color:"#fff"
      }
   },
   memberImage: {
      height:"80px",
      borderRadius:"40px",
      margin:"10px"

   },
   memberName: {
      fontSize: "18px",
      fontFamily: "Avenir_black !important",
      // color:"#6d6d6d"
   },
   memberRelation: {
      fontSize: "14px",
      fontFamily: "Avenir_heavy !important",
      // color:"#6d6d6d"
   },
 }));
function FamilyMember(props) {
   const {setPage, setSelectedMember,setMsgData} = props;
   const [cookies, setCookie] = useCookies(["name"]);
   const [patientList, setPatientList] = useState([]);
   const [selectedId, setSelectedId] = useState("");
   const classes = useStyles();
   const headers = {
      authtoken: cookies["cookieVal"],
   };
   useEffect(() => {
      let temp = JSON.parse(localStorage.getItem('userDetails'));
      console.log("temp: ",temp.data);
      axios
      .get(`${config.API_URL}/api/patient/familymembers?parentId=${temp.id}`, { headers })
      .then((res) => {
        console.log("res: ", res.data.data);
        setPatientList(res.data.data)
        
      })
      .catch((err) => {
        console.log("err", err);
      });
    }, []);
    const famSelected =(item) =>{
      console.log("famSelected",item);
      setSelectedId(item.id);
      setSelectedMember(item)
      
    }
   const nextBtn = () =>{
      console.log("nextBtn",selectedId);
      if(selectedId === ""){
         setMsgData({ message: "Please select a family member", type: "error" });
         return false;
      }
      if (router.asPath == "/familyList") {
         router.push("/bookAppointment")
         localStorage.setItem("showFamList",false)
         return false;
      }
      setPage(4)
   }
  return <>
   <div className="mainDiv">
      {/* <Header /> */}
      <HeadBreadcrumbs
         titleArr={["Home","Book Appointment"]}
         lastTitle = {"Family member"}
         mainTitle={"Consultation Services"}
      />
      <div className={classes.root}>
         <div className={classes.title}>Add family member</div>
         {/* <div className={`${classes.member} active`} onClick={famSelected}>
            <img src="../user.svg" className={classes.memberImage}/>
            <div>Name</div>
            <div>(Relation)</div>
         </div> */}
         
         {patientList&& patientList.length>0 && patientList.map((item)=>(
            <div className={`${classes.member} ${item.id === selectedId ? "active":""}`} onClick={()=>famSelected(item)}>
               <img src="../user.svg" className={classes.memberImage}/>
               <div className={classes.memberName}>{item.userFirstName}</div>
               <div className={classes.memberRelation}>{`(${item.relationship})`}</div>
            </div>
         ))}
         <div className={classes.member} >
               <img src="../addMember.svg" className={classes.memberImage}/>
               <div className={classes.memberName}>Add Member</div>
               <div className={classes.memberRelation}>&nbsp;</div>

            </div>
         <div style={{textAlign:"right"}}>
            <Button
               id="OTP Submit Btn"
               size="small"
               variant="contained"
               className="mainBtn"
               onClick={nextBtn}
               style={{width:"200px", marginTop:"10px"}}
            >
               Next
            </Button>
         </div>
      </div>
   </div>
</>;
}

export default FamilyMember;
