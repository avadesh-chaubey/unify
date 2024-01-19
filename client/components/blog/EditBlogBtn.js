import React from 'react';
import {Button} from '@material-ui/core';

export default function EditBlogBtn (prop) {
  const { publish, saveChanges, handlePublish, handlePreview, publishCheck } = prop;

  return (
    <>
      <Button
        id="go-login"
        size="small"
        variant="contained"
        color="secondary"
        className={`primary-button ${publish !== 'PUBLISH' ? 'disabled-primary-button' : ''} ${publishCheck === true ? 'disabledDraft' : ''}`}
        style={{
          margin: "20px 20px 20px 0px",
          color: "#fff",
          width: "155px",
          borderRadius: '20px',
          padding: '10px 10px'
        }}
        onClick={(e) => saveChanges(e, 'save')}
      >
        SAVE
      </Button>

      <Button
        id="go-login"
        size="small"
        variant="contained"
        color="secondary"
        className="primary-button"
        style={{
          margin: "20px 20px 20px 0px",
          color: "#fff",
          width: "155px",
          borderRadius: '20px',
          padding: '10px 10px'
        }}
        onClick={(e) => saveChanges(e, 'savePreview')}
      >
        SAVE & PREVIEW
      </Button>

      <Button
        id="go-login"
        size="small"
        variant="contained"
        color="secondary"
        className={`primary-button ${publishCheck === false ? 'disabledDraft' : ''}`}
        style={{
          margin: "20px 20px 20px 0px",
          color: "#fff",
          width: "155px",
          borderRadius: '20px',
          padding: '10px 10px'
        }}
        onClick={handlePublish}
      >
        {publish}
      </Button>
    </>
  );
}
