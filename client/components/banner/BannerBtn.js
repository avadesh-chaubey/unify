import React from 'react';
import { Button } from '@material-ui/core';

export default function BannerBtn (prop) {
  const { publish, saveDraft, handlePublish, handlePreview, publishCheck, newArticlePerm } = prop;
  // ${publish !== 'PUBLISH' ? 'disabled-primary-button' : ''} ${publishCheck === true ? 'disabledDraft' : ''}

  return (
    <>
      <Button
        id="go-login"
        size="small"
        variant="contained"
        color="secondary"
        className={`primary-button`}
        style={{
          margin: "20px 20px 20px 0px",
          color: "#fff",
          width: "155px",
          borderRadius: '20px',
          padding: '10px 10px'
        }}
        // onClick={(e) => saveDraft(e)}
        // disabled={!newArticlePerm.editChecked}
      >
        SAVE DRAFT
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
        // onClick={handlePreview}
        // disabled={!newArticlePerm.editChecked}
      >
        PREVIEW
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
        // onClick={handlePublish}
        // disabled={!newArticlePerm.editChecked}
      >
        PUBLISH
      </Button>
    </>
  );
}
