import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";
import ImageResultCard from "./ImageResultCard";
import SearchControls from "./common/SearchControls";
import ActionButtons from "./common/ActionButtons";

const SearchSection = () => {
  const [searchType, setSearchType] = useState(0); // 0: text, 1: image, 2: caption
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [numImages, setNumImages] = useState(5);
  const [showAllImages, setShowAllImages] = useState(false);
  const [captionResults, setCaptionResults] = useState([]);

  const handleTabChange = (event, newValue) => {
    setSearchType(newValue);
    setQuery("");
    setSelectedImage(null);
    setImagePreview(null);
    setResults([]);
    setCaptionResults([]);
    setError(null);
  };

  const handleImageSelect = (event) => {
    if (event && event.target && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleTextSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/search_text",
        {
          query: query.trim(),
          top_k: showAllImages ? 50 : numImages,
        }
      );

      let processedResults = response.data.results || [];

      // For text search, we need to group by image and show all captions
      const groupedResults = {};
      for (const result of processedResults) {
        if (!groupedResults[result.image_path]) {
          groupedResults[result.image_path] = {
            image_path: result.image_path,
            captions: [],
          };
        }
        groupedResults[result.image_path].captions.push({
          caption: result.caption,
          distance: result.distance,
        });
      }

      setResults(Object.values(groupedResults));
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleImageSearch = async () => {
    if (!selectedImage) return;

    setSearching(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("top_k", showAllImages ? 50 : numImages);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/search_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let processedResults = response.data.results || [];

      // For image search, results are already unique images with single caption
      setResults(processedResults);
    } catch (err) {
      setError(err.response?.data?.detail || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleCaptionGeneration = async () => {
    if (!selectedImage) return;

    setSearching(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/get_captions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCaptionResults(response.data.captions || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Caption generation failed");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    if (searchType === 0) {
      handleTextSearch();
    } else if (searchType === 1) {
      handleImageSearch();
    } else if (searchType === 2) {
      handleCaptionGeneration();
    }
  };

  const resetSearch = () => {
    setQuery("");
    setSelectedImage(null);
    setImagePreview(null);
    setResults([]);
    setCaptionResults([]);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Search Images
        </Typography>

        <SearchControls
          searchType={searchType}
          query={query}
          setQuery={setQuery}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          numImages={numImages}
          setNumImages={setNumImages}
          showAllImages={showAllImages}
          setShowAllImages={setShowAllImages}
          onImageSelect={handleImageSelect}
          onSearch={handleSearch}
        />

        <Tabs value={searchType} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab icon={<SearchIcon />} label="Text Search" />
          <Tab icon={<ImageSearchIcon />} label="Image Search" />
          <Tab icon={<DescriptionIcon />} label="Get Captions" />
        </Tabs>

        <ActionButtons
          searchType={searchType}
          searching={searching}
          disabled={
            searching || (searchType === 0 ? !query.trim() : !selectedImage)
          }
          onSearch={handleSearch}
          onReset={resetSearch}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Search Results ({results.length} found)
            </Typography>
            <Grid container spacing={2}>
              {results.map((result, index) => (
                <Grid item xs={12} key={index}>
                  <ImageResultCard result={result} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {captionResults.length > 0 && searchType === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Generated Captions
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {captionResults.map((caption, index) => (
                <Chip
                  key={index}
                  label={caption}
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {results.length === 0 &&
          captionResults.length === 0 &&
          !searching &&
          !error && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              {searchType === 2
                ? "Upload an image to generate captions."
                : "No results found. Try a different query or upload more images first."}
            </Typography>
          )}
      </Paper>
    </Container>
  );
};

export default SearchSection;
