import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImagePreviewCard = ({
  file,
  preview,
  onRemove,
  showRemoveButton = true,
}) => {
  return (
    <Card sx={{ position: "relative" }}>
      <CardMedia
        component="img"
        height="120"
        image={preview || ""}
        alt={file.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ p: 1 }}>
        <Typography variant="caption" display="block" noWrap>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </Typography>
      </CardContent>
      {showRemoveButton && (
        <Button
          size="small"
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            minWidth: "auto",
            p: 0.5,
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      )}
    </Card>
  );
};

export default ImagePreviewCard;
