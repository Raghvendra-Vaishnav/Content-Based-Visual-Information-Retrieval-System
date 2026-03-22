import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUploadArea = ({
  onFileSelect,
  multiple = true,
  accept = "image/*",
  buttonText = "Choose Images",
  icon = <CloudUploadIcon />,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      {icon &&
        React.cloneElement(icon, {
          sx: { fontSize: 64, color: "grey.400", mb: 2 },
        })}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Drag & drop images or click to select
      </Typography>
      <input
        accept={accept}
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        multiple={multiple}
        onChange={onFileSelect}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={icon}
          size="large"
          sx={{ mt: 2 }}
        >
          {buttonText}
        </Button>
      </label>
    </Box>
  );
};

export default FileUploadArea;
