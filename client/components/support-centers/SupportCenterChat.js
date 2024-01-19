import React, { useState, useEffect } from 'react';

export default function SupportCenterChat (props) {
  const { firebase } = props;
  const [ conversation, setConversation ] = useState('');

  return (
    <div className="support-center-chat">
      <div>Chat making in progress</div>
    </div>
  );
}
