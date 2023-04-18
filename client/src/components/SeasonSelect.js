import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

function valueText(value) {
  return `${value}`;
}

export function SeasonSelect ({ onSeasonsChange, value, setValue }) {

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onSeasonsChange(newValue);
  };

  return (
    <Box padding={2}>
      <Typography gutterBottom>Years Range</Typography>
      <Box sx={{ width: '100%' }}>
        <Slider
          getAriaLabel={() => 'Year'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={1997}
          max={2022}
          step={1}
        />
      </Box>
    </Box>
  );
};

