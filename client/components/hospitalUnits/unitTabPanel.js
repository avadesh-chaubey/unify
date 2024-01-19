import React from 'react';

export default function UnitTabPanel (props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      { children }
    </div>
  );
}