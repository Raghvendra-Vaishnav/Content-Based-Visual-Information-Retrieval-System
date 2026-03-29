import React from "react";
import { Box, Button, TextField, Typography, Slider } from "@mui/material";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

const SearchControls = ({
  searchType,
  query,
  setQuery,
  selectedImage,
  imagePreview,
  numImages,
  setNumImages,
  showAllImages,
  setShowAllImages,
  onImageSelect,
  onSearch,
}) => {
  return (
    <>
      {searchType !== 2 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Number of Images to Display: {numImages}
          </Typography>
          <Slider
            value={numImages}
            onChange={(event, newValue) => setNumImages(newValue)}
            aria-labelledby="num-images-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
            disabled={showAllImages}
            sx={{ mb: 2 }}
          />
          <Button
            variant={showAllImages ? "contained" : "outlined"}
            onClick={() => setShowAllImages(!showAllImages)}
            sx={{ mt: 1 }}
          >
            {showAllImages ? "Show Limited Images" : "Show All Images"}
          </Button>
        </Box>
      )}

      {searchType === 0 ? (
        // Text Search
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'a dog running in a park'"
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
          />
        </Box>
      ) : (
        // Image Search
        <Box sx={{ mb: 3 }}>
          {!selectedImage ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="search-image-upload"
                type="file"
                onChange={onImageSelect}
              />
              <label htmlFor="search-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageSearchIcon />}
                  size="large"
                >
                  Choose {searchType === 1 ? 'Search' : 'Caption'} Image
                </Button>
              </label>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Search preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    marginBottom: "16px",
                  }}
                />
              )}
              <Button
                variant="outlined"
                onClick={() => onImageSelect(null)}
              >
                Choose Different Image
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default SearchControls;
