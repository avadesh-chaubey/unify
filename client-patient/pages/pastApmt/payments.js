import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

function payments() {
  const [data, setData] = useState({});
  async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  const resetData = () => {
    console.log("resetData: ")
    let tempProcId = "TESTUSER" + Math.floor(100000 + Math.random() * 900000);
    console.log("tempProcId: ",tempProcId);
    let temp = "superadmin|f4b093f9746747b17db05b7dc3420cfc5f46180c3e7af755cde20ed5a45514c8|"+tempProcId+"|0Ey267EU|7DFgQAA6XdV0o3MR5aeGuWAUjX82Psdn";
    console.log("temp: ",temp);
    sha256(temp).then((response)=>{
      console.log("response: ",response);
      let temp2 = btoa(response);
      console.log("temp2: ",temp2)
      let sendObj = {
        processing_id: tempProcId,
        check_sum_hash: temp2
      }
      console.log("sendObj: ",sendObj);
      setData(sendObj);
    });
    
  }  
  const confirmPayment = () =>{
    let obj = { 
      token: {
        auth:{
          user:"superadmin",
          key:"f4b093f9746747b17db05b7dc3420cfc5f46180c3e7af755cde20ed5a45514c8"
        },
        username:"Patient",
        accounts:[{
          patient_name:"test",
          account_number:"ACC1",
          amount:"150.25",
          email:"test@salucro.com",
          phone:"9660666466"}],
        processing_id:"TESTAPPID4444",
        paymode:"",
        response_url:"https://rainbowpro.unify.care/api/partner/paymenturl"
      },
      mid: "0Ey267EU",
      check_sum_hash: "ODIwNDkwOTVmOGI4YTU5YTYwMzkzMGMxOTU1Yzg0MGY5NmVhNDhkMDg4YTA1NDY2MGNkMmQ5YTgxZjllMDc1OA=="
    }
    console.log("confirmPayment: ", obj)
    console.log("data: ",data);
    var bodyFormData = new FormData();
    bodyFormData.append("token",obj.token);
    bodyFormData.append("mid",obj.mid);
    bodyFormData.append("check_sum_hash",obj.check_sum_hash);
    let myurl = "https://testing.in.salucro.net/patient/app/payments";
    console.log("bodyFormData: ",bodyFormData);
    
    console.log("myurl: ",myurl, bodyFormData)
    axios({
      method: "post",
      url: myurl,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log("response ",response);
      })
      .catch(function (error) {
        //handle error
        console.log("error: ",error);
      });
  }

  const pay = () =>{
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "salucro_session=eyJpdiI6InV4N294SHJqZ1JKenZZT0hEbDRSNVE9PSIsInZhbHVlIjoiMGhwSjBMWG5SYnA3VW1hN1hFb2x1UjkxMlhIM3Z5OERyaU4yajZcL0tqbEdKeVJKV0VpTGZaUDRxcjFzRVwvazh5OEYwajRmMCtHSEJSSFpkZkxcL0JPNW1LUFZQS2p2QlU3cGlyWkJFejRQYlhaMVJqMnlDVVhyV1doT1p6d1l4aEciLCJtYWMiOiJjNGExZTgzMmMzNTIzODY1YzY0MjQ4OTE1ZTNiYzU1MDkxNzU4MTMwZTRhZDkwM2Q1MTk5YWZmYmE5ODFiMTNmIn0%3D; salucro_session=eyJpdiI6ImtJMThlbklcL1pxV21EVEE1YU13R1wvdz09IiwidmFsdWUiOiJuekZHRzNKRW44TFVNSW5uRVhMbWZUdkRQdnBmSlpzS0k5WlJQd1pESzZaSk5EZEEycVdyRllXbjFNREdXWHV6QUx0MTFcL1VCVEdrVkFxWHZxUHhQcWZZYWMxaEhFQ1Bna0g1d0cxUGxxTlhHZkVSdGlNaHNlSzZSbFFcL2ZNRHByIiwibWFjIjoiOTBhZGRiMTZiYjJmMzE2OTIyNWExYTI2ZTNhM2NlMTgzN2NkN2E3OTUzM2Y4NjMzN2MyM2RjNDhiNTAxNmZlZiJ9");

    var formdata = new FormData();
    formdata.append("token", " {\"auth\":{\"user\":\"superadmin\",\"key\":\"f4b093f9746747b17db05b7dc3420cfc5f46180c3e7af755cde20ed5a45514c8\"},\"username\":\"Patient\",\"accounts\":[{\"patient_name\":\"test\",\"account_number\":\"ACC1\",\"amount\":\"150.25\",\"email\":\"test@salucro.com\",\"phone\":\"9660666466\"}],\"processing_id\":\"TESTUSER569554\",\"paymode\":\"\",\"response_url\":\"https://rainbowpro.unify.care/api/partner/paymenturl\"}");
    formdata.append("mid", " 0Ey267EU");
    formdata.append("check_sum_hash", " YTk2NDViNmNhNmIxZjc4ZmNkOTRiZjZhZDhjYjZmNmRlMzg5OTAxMjRiNmJjZjdmMmQ5NDY2YzI4MWRlYWRjNQ==");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://testing.in.salucro.net/patient/app/payments", requestOptions)
      .then(response => response.text())
      .then(result => console.log("result",result))
      .catch(error => console.log('error', error));
  }
  return (
    <div className='mainDiv'>
      payments
      <div style={{textAlign:"left", margin:"100px"}}>
        <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="mainBtn"
            onClick={resetData}
            style={{width:"200px", marginTop:"10px"}}
          >
            Reset
          </Button>
      </div>

      <div style={{textAlign:"left", margin:"100px"}}>
        <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="mainBtn"
            onClick={confirmPayment}
            style={{width:"200px", marginTop:"10px"}}
          >
            Submit
          </Button>
      </div>

      <div style={{textAlign:"left", margin:"100px"}}>
        <Button
            id="OTP Submit Btn"
            size="small"
            variant="contained"
            className="mainBtn"
            onClick={pay}
            style={{width:"200px", marginTop:"10px"}}
          >
            pay
          </Button>
      </div>
    </div>
  )
}

export default payments
