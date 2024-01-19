import React, {useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import { useCookies } from "react-cookie";
import AddIcon from '@material-ui/icons/Add';
import { createImageFromInitials } from "../../utils/nameDP";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import router from 'next/router';
import AddFamilyMember from "./addFamilyMember"
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Popover from '@material-ui/core/Popover';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 650,
    // float: "left",
    width: "100%",
    // margin: "0 14px",
    // textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  label: {
    margin: 6,
  },
}));

function FamilyMember(props) {
  const [cookies, getCookie] = useCookies(["name"]);
  const [famList, setFamList] = useState([]);
  const [resetList, setResetList] = useState({});
  const [loader, setLoader] = useState(false);
  const [selectedMember, setSelectedMember] = useState({});

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log("handleClick:")
    setAnchorEl(event.currentTarget);
  };

  const handleClosePop = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? 'simple-popover' : undefined;
  useEffect(() => {

    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    setLoader(true);
    axios
      .get(config.API_URL + "/api/patient/familymembers", {
        headers,
    })
      .then((res) => {
        setFamList(res.data);
        res.data.map((item)=>{
          if(item.relationship === "self"){
            setSelectedMember(item);
          }
        })
        setLoader(false);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
        setLoader(false);
      });
  }, [resetList])
  const onFamMemberClick = (val) =>{
    console.log("onFamMemberClick: ",val);
    router.push("/patientDetails")
    localStorage.setItem("patientData",JSON.stringify(val));
    setLoader(true);
  }
  const addMember = () =>{
    console.log("addMember: ")
    setOpen(true);

  }
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div style={{padding: "15px", width: "100%", marginTop:"-50px", zIndex:'99', background:"#fff", borderRadius:"20px 20px 0px 0px"}}>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <div>
        <div onClick={handleClick} style={{float:"left"}}>
          <div className="famImage" style={{float:"left"}} >
            <img 
              src={
                selectedMember.profileImageName &&
                  selectedMember.profileImageName != "NA"
                  ? `${config.API_URL}/api/utility/download/` +
                  selectedMember.profileImageName
                  : "user.svg"
              }
              style={{borderRadius:"10px"}}
            />
          </div>
          <div className="memberInfo">
            <div className="greeting">Good Morning</div>
            <div className="nameSec"> <span> {selectedMember.userFirstName + " " +selectedMember.userLastName} </span> <ExpandMoreIcon /> </div>
            <div className="relation">{selectedMember.relationship} </div>
          </div>
        </div>
        <div style={{float:"right", marginTop:"30px"}}><NotificationsNoneIcon style={{fontSize:"30px"}} /> </div>    
        {/* {famList.length > 0 && famList.map((item)=>(
          <div style={{display:"inline-block", textAlign:'center', padding:"0 10px"}} onClick={(e)=>{onFamMemberClick(item)}} key ={item.id}>
            <div className="imageSec" style={{marginRight:"10px"}}>
              <img
                  // src={
                  //   `${config.API_URL}/api/utility/download/` +
                  //   item.profileImageName
                  // }
                  src={
                    item.profileImageName &&
                      item.profileImageName != "NA"
                      ? `${config.API_URL}/api/utility/download/` +
                      item.profileImageName
                      : createImageFromInitials(
                        100,
                        `${item.userFirstName + " " + item.userLastName
                        }`,
                        "#7f368c"
                      )
                  }
                  style={{marginLeft: "12%"}}
              />
              
            </div>
            <div style={{color:"#2C2C2C", fontSize: "15px", fontWeight: "600"}}>{item.userFirstName + " " +item.userLastName} </div>
            <div style={{color:"#878787", fontSize: "15px", fontWeight: "600"}}>{item.relationship} </div>
          </div>
        ))} */}
         {/* <div style={{display:"inline-block", textAlign:'center', padding:"0 10px"}} onClick={addMember}>
            <div className="imageSec" style={{border:"1px solid ", borderRadius: "50px",marginLeft: "12%", backgroundColor:"#fff"}}>
              <AddIcon style={{fontSize:"50px", marginTop:"15px"}} />
            </div>
            <div style={{color:"#5489d8", fontSize: "15px", fontWeight: "500", marginTop:"10px"}} >
              ADD NEW
            </div>
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
         </div>
       */}
      </div>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
        className="addNewFamMember"
      >
        <DialogTitle id="alert-dialog-title">
          <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={handleClose}/>
          <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>Add new member</div>
          
        </DialogTitle>
        <DialogContent>
          <AddFamilyMember setMsgData = {props.setMsgData} handleClose={handleClose} setResetList={setResetList} />
        </DialogContent>
      </Dialog>
      <Popover
        id={id}
        open={openPop}
        anchorEl={anchorEl}
        onClose={handleClosePop}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        className="familyMenu"
      >
        {famList.length > 0 && famList.map((item)=>(
          <div style={{borderBottom:"2px solid", margin:"10px"}}>
            <div>{item.userFirstName + " " +item.userLastName}</div>
            <div>{item.relationship} </div> 
          </div>
        ))}
      </Popover>
    </div>
    
  )
}

export default FamilyMember
