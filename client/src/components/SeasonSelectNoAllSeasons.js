import React from "react";
import {
  Box,
  Typography,
  Slider
} from "@mui/material";

function valueText(value) {
  return `${value}`;
}

export function SeasonSelectNoAllSeasons({ onSeasonsChange, value, setValue, max = 2022 }) {

  const handleChange = (event, newValue) => {

      setValue(newValue);
      onSeasonsChange(newValue);
    
  };




  return (
    <Box padding={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <Typography variant="h6">Select a Season</Typography>
        <Typography variant="h6">Current value: {value}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 1,
        }}
      >
      </Box>

      <Box sx={{ width: "100%" }}>
        <Slider
          getAriaLabel={() => "Year"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={1997}
          max={max}
          step={1}

        />
      </Box>
    </Box>
  );
}
