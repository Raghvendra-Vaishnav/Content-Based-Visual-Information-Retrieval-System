import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const ResultsGrid = ({ results, title = "Results" }) => {
  if (!results || results.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No results to display
        </Typography>
      </Box>
    );
  }

  // Filter out image_embedding results for display
  const filteredResults = results.filter(
    (result) => result.caption !== "image_embedding"
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title} ({filteredResults.length} found)
      </Typography>
      <Grid container spacing={2}>
        {filteredResults.map((result, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8000/images/${result.image_path}`}
                alt={result.caption}
                sx={{ objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "/placeholder-image.png"; // Fallback image
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Distance: {result.distance?.toFixed(4) || "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  {result.caption}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResultsGrid;
