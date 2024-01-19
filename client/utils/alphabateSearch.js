import { useState, useEffect } from "react";

function AlphabateSearch(props) {
  const [alphabates, setAlphabates] = useState([]);
  useEffect(()=>{
    let temp = [];

    for (let i = 65; i <= 90; i++){
      temp.push(String.fromCharCode(i));
    }

    setAlphabates(temp);
  },[])

  const selectChar = (value) =>{
    props.setCharValue(value)
    localStorage.setItem(props.from, value);
  };

  return (
    <>
      <div className="alphabateSearch">
        { alphabates.length > 0 ?
          <>
            {alphabates.map((item,index)=>(
              <span 
                className = {props.charValue == item ?"char selected" :"char"} 
                key = {index} 
                onClick = {(e)=>{selectChar(item)}}
              >{item}</span>
            ))}
          </>
          : ''
        }
      </div>
    </>
  );
}

export default AlphabateSearch
