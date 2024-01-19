import React, {useState} from 'react';
import PreviewBlog from '../components/blog/PreviewBlog';
import MessagePrompt from '../components/messagePrompt';
import { CircularProgress } from "@material-ui/core";

export default function previewTemplate () {
  const [loader, setLoader] = useState(false);
  const [msgData, setMsgData] = useState({});

  return (
    <>
      {loader && (
        <div className="loader">
          <CircularProgress color="secondary" />
          <div className="text"></div>
        </div>
      )}
      <MessagePrompt msgData={msgData} />
      <PreviewBlog setLoader={setLoader} setMsgData={setMsgData} />
    </>
  );
}
