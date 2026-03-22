import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";

const ActionButtons = ({
  searchType,
  searching,
  disabled,
  onSearch,
  onReset,
  searchButtonText = "Search",
  resetButtonText = "Reset",
}) => {
  const getSearchIcon = () => {
    if (searching) return <CircularProgress size={20} />;
    return searchType === 2 ? <DescriptionIcon /> : <SearchIcon />;
  };

  const getSearchText = () => {
    if (searching) {
      return searchType === 2 ? "Generating..." : "Searching...";
    }
    return searchType === 2 ? "Generate Captions" : searchButtonText;
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={disabled || searching}
        startIcon={getSearchIcon()}
      >
        {getSearchText()}
      </Button>
      <Button variant="outlined" onClick={onReset}>
        {resetButtonText}
      </Button>
    </Box>
  );
};

export default ActionButtons;
