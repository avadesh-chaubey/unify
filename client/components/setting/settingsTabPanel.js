import React from 'react';

export default function SettingsTabPanel (props) {
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
