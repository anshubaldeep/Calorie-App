import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


function Loading(props) {
  // isBlur props centers the loader and blur the background inside parent view, given that parent has relative property set
  return (
    <CircularProgress
      size={90}
      thickness={1}
      color="secondary"
      sx={{
        position: 'fixed',
        top: 'calc(50% - 45px)',
        left: 'calc(50% - 45px)',
        zIndex: 1000
      }}
    />);
}

export default (Loading);
