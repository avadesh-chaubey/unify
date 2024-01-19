import React from 'react';
import NumberFormat from 'react-number-format';

export default function percentageField (props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      maxLength={4}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
      suffix="%"
    />
  );
}
