import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import CmsPdfList from "./CmsPdfList";
import CloseIcon from "@material-ui/icons/Close";

export default function PreviewCmsPdf(props) {
  const {
    name,
    open,
    handlePreviewModal,
    handleCloseOption,
    allblogs,
    handleGeneratePdf,
  } = props;

  const handleCloseModal = (e) => {
    e.preventDefault();
    handlePreviewModal();
    handleCloseOption(e);
  };

  return (
    <Dialog
      className="preview-cms-pdf"
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="preview-cms-modal"
    >
      <DialogTitle id="preview-cms-modal-title">
        <Typography variant="h6">CMS {name} PDF</Typography>
        <IconButton
          aria-label="close"
          style={{
            position: "absolute",
            right: 1,
            top: 1,
            color: "grey",
          }}
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="preview-content-blog">
        <div className="pdf-viewer-div">
          <PDFViewer
            className="pdf-viewer-main"
            zoom="80"
            children={<CmsPdfList allblog={allblogs} />}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <div className="dialog-button-group">
          <Button
            className="dialog-cancel-btn"
            variant="contained"
            onClick={handleCloseModal}
          >
            Close
          </Button>

          <Button
            className="primary-button dialog-download-btn"
            variant="contained"
            color="primary"
            onClick={handleGeneratePdf}
            color="primary"
          >
            Download
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
