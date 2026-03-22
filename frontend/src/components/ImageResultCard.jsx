import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Collapse,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ImageIcon from "@mui/icons-material/Image";

const ImageResultCard = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);

  const captions = result.captions || [result]; // Handle both grouped and single results
  const sortedCaptions = [...captions].sort(
    (a, b) => (a.distance || 0) - (b.distance || 0)
  ); // Sort by distance ascending

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "fit-content",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 250,
          objectFit: "cover",
          bgcolor: "grey.100",
        }}
        image={`http://localhost:8000/images/${result.image_path}`}
        alt={result.image_path}
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4VjE2QzYuOSAxNiA2IDE1LjEgNiAxNFY0QzYgMi45IDYuOSAyIDggMkgxNkMxNy4xIDIgMTggMi45IDE4IDRWMTJDMTggMTMuMSAxNy4xIDE0IDE2IDE0SDE0VjEyQzE0IDEwLjkgMTMuMSAxMCAxMiAxMFoiIGZpbGw9IiM5RTlFQUIiLz4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4VjE2QzYuOSAxNiA2IDE1LjEgNiAxNFY0QzYgMi45IDYuOSAyIDggMkgxNkMxNy4xIDIgMTggMi45IDE4IDRWMTJDMTggMTMuMSAxNy4xIDE0IDE2IDE0SDE0VjEyQzE0IDEwLjkgMTMuMSAxMCAxMiAxMFoiIGZpbGw9IiM5RTlFQUIiLz4KPC9zdmc+"; // Placeholder SVG
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ImageIcon
            sx={{ mr: 1, color: "primary.main", fontSize: "1.2rem" }}
          />
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {result.image_path}
          </Typography>
        </Box>

        <Button
          size="small"
          onClick={() => setShowDetails(!showDetails)}
          startIcon={<InfoIcon />}
          sx={{
            textTransform: "none",
            fontSize: "0.8rem",
            p: 0.5,
            minWidth: "auto",
          }}
          variant="text"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>

        <Collapse in={showDetails} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            {sortedCaptions.map((cap, capIndex) => (
              <Box key={capIndex} sx={{ mb: 1.5 }}>
                <Chip
                  label={`Dist: ${cap.distance?.toFixed(4) || "N/A"}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ mb: 0.5, fontSize: "0.7rem" }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", lineHeight: 1.3 }}
                >
                  {cap.caption}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ImageResultCard;
