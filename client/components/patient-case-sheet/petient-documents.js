import React, { useState, useEffect } from "react";
import config from "../../app.constant";
import axios from "axios";
import { useRouter } from "next/router";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import PdfPopOver from '../doctor/PdfPopOver';

function PatientUpload({ files, showVideoSec, isFullScreen }) {
  const [fileLink, setFileLink] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [fileType, setFileType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [fileArr, setFileArr] = useState([]);

  useEffect(() => {
    if (files.length) {
      const fileArr = files.map(i => {
        const url = i.url;
        let downloadUrl = '';

        // Append base url of file whose absolute url is not present
        if (!(url.indexOf("http://") === 0 || url.indexOf("https://") === 0)) {
          downloadUrl = `${config.API_URL}/api/utility/download/` + url;
          i.url = downloadUrl;
          return i;
        }

        return i;
      });

      setFileArr(fileArr);
    }
  }, [files]);

  const openDoc = (file) => {
    let dounloadUrl = file.url;
    const url = dounloadUrl;
    const title = file.title;

    console.log('dounloadUrl ->', dounloadUrl);
    setFileLink(dounloadUrl);
    setFileTitle(title);
    setFileType(file.fileType);
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const dates = (data) => {
    var utcDate = data; // ISO-8601 formatted date returned from server
    var localDate = new Date(Date.parse(utcDate));
    const dateNow = localDate.toLocaleDateString();

    const [month, day, year] = dateNow.split("/");
    // result = dd-mm-yyyy
    const inputDate = `${day}-${month}-${year}`;
    return inputDate;
  };

  useEffect(() => {
    if (isFullScreen) {
      // Close the dialog when call screen is full screen
      handleCloseDialog();
    }
  }, [isFullScreen]);

  return (
    <>
      <PdfPopOver
        file={fileLink}
        openModal={openDialog}
        modalFunc={handleCloseDialog}
        docName={fileTitle}
        showVideoSec={showVideoSec}
        fileType={fileType}
      />
      <Accordion defaultExpanded={true} style={{ marginTop: "20px" }}>
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon style={{ color: "#00888a", fontWeight: 600 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: "#00888a", fontWeight: 600 }}>
            Patient's Documents
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          {files.length > 0 ? (
            <div className="cs-patientDocs">
              {fileArr.map((file) => (
                <div className="cs-patient-doc-detail">
                  <div key={file.id} className="cs-doc" onClick={() => openDoc(file)}>
                    {/* <a href={file.url} target="new"> */}
                    {(file.fileType === "image" || file.fileType === "photo") ? (
                      <img src={file.url} alt={file.title} height="100" />
                    ) : file.fileType === "file" ? (
                      <img src="pdf_icon.svg" alt="pdf_img" height="100" />
                    ) : (
                          <img src="doc.svg" alt="doc.svg" height="100" />
                        )}
                    {/* </a> */}
                  </div>
                  <div className="cs-doc-details">
                    <p>Title:&nbsp;{file.title}</p>
                    <p>Category:&nbsp;{file.category}</p>
                    <p>Date:&nbsp;{dates(file.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
              <div style={{ color: "grey" }}>No Patient Documents Available</div>
            )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
export default PatientUpload;
