import React from 'react';
import NumberFormat from "react-number-format";

export default function decimalFormatter (props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      thousandsGroupStyle="thousand"
      prefix=""
      decimalSeparator="."
      displayType="input"
      type="text"
      thousandSeparator={true}
      allowNegative={false}
      fixedDecimalScale={true}
      suffix=" years"
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
    />
  )
}
