import { useState, useEffect } from "react";

function MessagePrompt(props) {
    // console.log("props in prompt: ",props)
    const [addcss, setAddcss] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('')
    useEffect(()=>{
        if(props.msgData && props.msgData.message){
            setMessage(props.msgData.message)
            setAddcss('show');
            setMessageType(props.msgData.type)
        }
        setTimeout(() => {
            setAddcss('');
        }, 3000);
    },[props.msgData])

return<>
<div className={'msgDiag ' + addcss}>
    <div className="messagePrompt" style={{background:(messageType === 'error' ? '#EC1D3C':'#152a75')}}>
        <span style={{display:'block',padding:'10px 20px'}} >
            {message}
        </span>
    </div>
</div>
</>
}

export default MessagePrompt
