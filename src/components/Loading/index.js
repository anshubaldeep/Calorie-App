import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


function Loading(props) {
  const { isDisableBackdropClick=false, isBlur=false } = props;
  // isBlur props centers the loader and blur the background inside parent view, given that parent has relative property set
  if (isBlur) {
    return (
      <div>
        <CircularProgress
          size={90}
          thickness={1}
        />
      </div>
    );
  }
  if (isDisableBackdropClick) {
    return (
      <div>
        <CircularProgress
          size={90}
          thickness={1}
          style={{ color: '#fff' }}
        />
      </div>
    );
  }
  return (
    <CircularProgress
      size={90}
      thickness={1}
      color="secondary"
    />);
}

export default (Loading);
