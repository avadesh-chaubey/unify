import React,{useEffect, useState} from 'react';
import axios from "axios";
import config from "../../app.constant";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from "@material-ui/core/MenuItem";
import { useCookies } from "react-cookie";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
// import workerSrc from "../pdf-worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const categoryList = [{name: "Test reports", value:"testReport"},{name: "Prescription", value: "prescription"},{name:"Patient photo", value:"patientPhoto"},{name:"Travel advisory", value:"travelAdvisory"},{name:"Diet Plan", value:"dietPlan"},{name:"Education", value:"education"},]

function UploadDoc(props) {
  const [cookies, getCookie] = useCookies(["name"]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFileName, setProfileImageFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState("")
  const [file, setFile] = useState("");
  const [numPages, setNumPages] = useState(null);

 

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  console.log("props: ",props);

  
  const uploadProfile = (e) => {
    setFile(event.target.files[0]);

    let imageUrl;
    e.preventDefault();
    setUploading(true);
    let newVal = e.target.value.replace(/^.*[\\\/]/, "");
    console.log("newVal: ", newVal);
    setProfileImage(
      URL.createObjectURL(document.getElementById("patientDoc").files[0])
    );
    let file = document.getElementById("patientDoc").files[0];
    let timestamp = new Date().getTime();
    let fileRe = file.name.replace(/[^a-zA-Z.]/g, "");
    let filename = "";
    filename = "patientDoc/" + timestamp + "_" + fileRe;
    console.log(
      "sdjhf: ",
      URL.createObjectURL(document.getElementById("patientDoc").files[0])
    );
    setProfileImageFileName(filename);
    console.log("fileName", filename);
    let ftype = "";
    ftype = filename.slice(-3);
    console.log("ftype: ",ftype) 
    if(ftype === "pdf"){
      setFileType("file")
    }else{
      setFileType("photo")
    }
  };
  const uploadProfileImages = () => {
    let imageUrl = null;
    var model = {
      file: document.getElementById("patientDoc").files[0],
    };
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
      if (key === "cookieVal") {
        cookie = value;
      }
    }
    var configs = {
      headers: { authtoken: cookie },
      transformRequest: function (obj) {
        var formData = new FormData();
        for (var prop in obj) {
          formData.append(prop, obj[prop]);
        }
        return formData;
      },
    };
    // setLoader(true);
    axios
      .post(config.API_URL + "/api/utility/upload", model, configs)
      .then((response) => {
        console.log(response.data);
        imageUrl = response.data.fileName;
        submitUpload(imageUrl);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  };
  const submitUpload = (imageUrl) =>{
    let cookie = "";
    for (const [key, value] of Object.entries(cookies)) {
    if (key === "cookieVal") {
        cookie = value;
    }
    }
    let headers = {
    authtoken: cookie,
    };
    let obj = {
      title: title,
      category: category,
      date: date,
      patientId: props.patientData.id,
      fileType: fileType,
      url: imageUrl
    }
    console.log("obj: ",obj);
    // return false;
    axios
      .post(config.API_URL + "/api/patient/addpatientdocument", obj,  {
        headers,
    })
      .then((res) => {
        console.log("res: ",res);
        props.closeDocUpload();
        props.setUpdate(res.data);
      })
      .catch((err) =>{ 
        console.log("err",err)
        props.setMsgData({ message: err.response.data.errors[0].message, type: "error" });
      });
  }
  return (
    <div>
      <div className="uploadImgSec">
        <label htmlFor="patientDoc" style={{ cursor: "pointer" }}>
         
          {profileImage === "" || profileImage === "NA" ? (
                  <>
                    <img src="/uploadDoc.svg" className="uploadImg" />
                    <div className="text">
                      Tap here to browse/scan the document.
                    </div>
                  </>
                ) : (
                    // <img src={profileImage} />
                    fileType === "file" ? 
                    // <iframe
                    //   src={profileImage}
                    //   height={200}
                    //   width={550}
                    // />
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                      {Array.from({ length: numPages }, (_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      ))}
                    </Document>
                    :
                    <img
                      src={
                        uploading !== true
                          ? `${config.API_URL}/api/utility/download/` +
                          profileImage
                          : profileImage
                      }
                      style={{width:"100%", height:"100%", objectFit:"contain"}}
                    />
                  )}
        </label>
        <input
          // required
          type="file"
          id="patientDoc"
          name="patientDoc"
          onChange={uploadProfile}
          style={{ display: "none" }}
          accept="application/pdf, image/jpeg, image/png"
        />
      </div>
      <div className ="uploadDocDetails">
        <div className="details">
          <div className="titleName">
            Title
          </div>
          <div className="detailsField">
            <TextField
              id="DocTitle"
              style={{ margin: 8 }}
              placeholder="Placeholder"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>

        <div className="details">
          <div className="titleName">
          Category
          </div>
          <div className="detailsField">
            <TextField
              select
              id="doccategory"
              style={{ margin: 8 }}
              placeholder="Select Category"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}

            >
              <MenuItem value="" disabled>Select Category</MenuItem> 
              {categoryList.map((item, i) => (
                  <MenuItem key={"state-" + i} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>
          </div>
        </div>

        <div className="details">
          <div className="titleName">
          Date
          </div>
          <div className="detailsField">
            <TextField
              id="docDate"
              style={{ margin: 8 }}
              placeholder="Select Date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}

            />
          </div>
        </div>
        <Button 
          onClick={uploadProfileImages} 
          color="primary" 
          style={{width: "90%", background: "#34106f",height: "60px", color: "white", marginLeft: "5%", fontSize:"18px", borderRadius:"30px", marginTop:"35px"
          }}>
           UPLOAD DOCUMENT
        </Button>
      </div>
    </div>
  )
}

export default UploadDoc
