import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
} from "@mui/material";
import axios from "axios";
import FileUploadArea from "./common/FileUploadArea";
import ImagePreviewCard from "./common/ImagePreviewCard";
import ProgressIndicator from "./common/ProgressIndicator";
import ActionButtons from "./common/ActionButtons";
import SnakeGame from "./common/SnakeGame";

const UploadSection = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [showGame, setShowGame] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setError(null);

      // Create previews for all files
      const newPreviews = [];
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews[index] = e.target.result;
          if (newPreviews.filter((p) => p).length === files.length) {
            setPreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/upload_with_caption",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadResult(response.data);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setUploadResult(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Upload Images
        </Typography>

        {selectedFiles.length === 0 ? (
          <FileUploadArea onFileSelect={handleFileSelect} />
        ) : (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Selected Images ({selectedFiles.length})
              </Typography>
              <Grid container spacing={2}>
                {selectedFiles.map((file, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <ImagePreviewCard
                      file={file}
                      preview={previews[index]}
                      onRemove={() => removeFile(index)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {uploading && (
              <ProgressIndicator
                progress={uploadProgress}
                label="Processing images..."
                showGameButton={true}
                onShowGame={() => setShowGame(true)}
              />
            )}

            <ActionButtons
              searchType={-1}
              searching={uploading}
              disabled={uploading}
              onSearch={handleUpload}
              onReset={resetUpload}
              searchButtonText={`Upload ${selectedFiles.length} Image${
                selectedFiles.length > 1 ? "s" : ""
              }`}
              resetButtonText="Clear All"
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {uploadResult && uploadResult.length > 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Successful! {uploadResult.length} image(s) processed.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {uploadResult.map((result, index) => (
                <Chip
                  key={index}
                  label={`Image ${index + 1}: ${
                    result.captions?.length || 0
                  } captions`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Alert>
        )}

        <Dialog
          open={showGame}
          onClose={() => setShowGame(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Snake Game</DialogTitle>
          <DialogContent>
            <SnakeGame onClose={() => setShowGame(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowGame(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UploadSection;
