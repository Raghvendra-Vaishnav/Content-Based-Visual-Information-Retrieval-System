import React from "react";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ProgressIndicator = ({
  progress,
  label,
  showGameButton = false,
  onShowGame,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" gutterBottom>
        {label} {progress}%
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
      {showGameButton && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onShowGame}
            startIcon={<PlayArrowIcon />}
          >
            Play Snake Game While Waiting
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProgressIndicator;
