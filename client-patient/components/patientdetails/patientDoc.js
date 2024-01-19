import React, {useEffect, useState} from 'react';
import config from "../../app.constant";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
// import workerSrc from "../pdf-worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function PatientDoc(props) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("PatientDoc props: ",props);
  const [docList, setDocList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState("");
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  useEffect(() => {
    setDocList(props.patientDoc)
  }, [props.patientDoc]);
  
  const onDocumentClick = (item) =>{
    console.log("onDocumentClick: ",item);
    if(item.fileType === "photo"){
      setImageUrl(`${config.API_URL}/api/utility/download/` +
      item.url);
      setIsOpen(true)
    }
    if(item.fileType === "image"){
      setImageUrl(item.url);
      setIsOpen(true)
    }
    if(item.fileType === "file"){
      setOpenPdf(true)
      setFile(`${config.API_URL}/api/utility/download/` +
      item.url)
    }
  }
  const [openPdf, setOpenPdf] = React.useState(false);
  const handleClose = () => {
    setOpenPdf(false);
  };
  return (
    <div style={{flexGrow:"1", margin:"15px"}} style={{display:"flex", flexDirection:"row"}}>
      {docList.length>0 && docList.map((item)=>(
        <div key={item.id} className="docImage" onClick={(e)=>{onDocumentClick(item)}}>
          {item.fileType === "file"  && <img
              src="./pdf_icon.svg"
          />}
         {item.fileType === "photo"  && <img
              src={
                `${config.API_URL}/api/utility/download/` +
                item.url
              }
          />}
          {item.fileType === "image" && <img
              src={
                item.url
              }
              
          />}
        </div>
      ))}

      {isOpen && (
        <Lightbox
          mainSrc={imageUrl}
          // nextSrc={images[(photoIndex + 1) % images.length]}
          // prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          // onMovePrevRequest={() =>
          //   this.setState({
          //     photoIndex: (photoIndex + images.length - 1) % images.length,
          //   })
          // }
          // onMoveNextRequest={() =>
          //   this.setState({
          //     photoIndex: (photoIndex + 1) % images.length,
          //   })
          // }
        />
      )}

    <Dialog
      open={openPdf}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen
      className="addNewFamMember"
      >
      <DialogTitle id="alert-dialog-title">
        <KeyboardBackspaceIcon style={{fontSize:"40px", position:"absolute"}} onClick={handleClose}/>
        <div style={{marginLeft:"50px", fontSize:"20px", fontWeight:"bold"}}>&nbsp;&nbsp;&nbsp;&nbsp;</div>
        
      </DialogTitle>
      <DialogContent className="showPdf">
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
      </DialogContent>
    </Dialog>

    </div>
  )
}

export default PatientDoc
