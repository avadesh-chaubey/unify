import router from 'next/router';
import React, {useState, useEffect} from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";

function index() {
  const [msgData, setMsgData] = useState({});
  const [loader, setLoader] = useState(false);

   const goBookApmt = () =>{
      setLoader(true);
      router.push("/bookAppointment");
   }
   return <div>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
        </div>
      )}
      <img src='../homeScreen.jpg' style={{width:"100%", height:"99vh", cursor:"pointer"}} onClick = {goBookApmt}/>
   </div>;
}

export default index;
