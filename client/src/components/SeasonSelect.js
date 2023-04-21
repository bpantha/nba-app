import React from "react";
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";

function valueText(value) {
  return `${value}`;
}

export function SeasonSelect({ onSeasonsChange, value, setValue }) {
  const allSeasonsSelected = value === "All Seasons";

  const handleChange = (event, newValue) => {
    if (!allSeasonsSelected) {
      setValue(newValue);
      onSeasonsChange(newValue);
    }
  };

  const handleToggleAllSeasons = (event) => {
    const newValue = event.target.checked ? "All Seasons" : previousValue;
    setValue(newValue);
    onSeasonsChange(newValue);
  };

  const [previousValue, setPreviousValue] = React.useState(value);

  React.useEffect(() => {
    if (value !== "All Seasons") {
      setPreviousValue(value);
    }
  }, [value]);

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
        <FormControlLabel
          control={
            <Switch
              checked={allSeasonsSelected}
              onChange={handleToggleAllSeasons}
              color="primary"
            />
          }
          label="All Seasons"
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <Slider
          getAriaLabel={() => "Year"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={1997}
          max={2022}
          step={1}
          disabled={allSeasonsSelected}
          sx={allSeasonsSelected ? { color: "grey.500" } : {}}
        />
      </Box>
    </Box>
  );
}
