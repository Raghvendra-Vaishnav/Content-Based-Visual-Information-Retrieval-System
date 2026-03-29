import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";

const SnakeGame = ({ onClose }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const gridSize = 20;
  const gameSpeed = 150;

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check wall collision
        if (
          head.x < 0 ||
          head.x >= gridSize ||
          head.y < 0 ||
          head.y >= gridSize
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Check self collision
        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 10);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [direction, food, isPlaying, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Snake Game - Score: {score}
      </Typography>
      <Box
        sx={{
          display: "inline-block",
          border: "2px solid #333",
          backgroundColor: "#f0f0f0",
        }}
      >
        {Array.from({ length: gridSize }, (_, row) => (
          <Box key={row} sx={{ display: "flex" }}>
            {Array.from({ length: gridSize }, (_, col) => {
              const isSnakeHead = snake[0].x === col && snake[0].y === row;
              const isSnakeBody = snake
                .slice(1)
                .some((segment) => segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;

              return (
                <Box
                  key={col}
                  sx={{
                    width: 15,
                    height: 15,
                    border: "1px solid #ddd",
                    backgroundColor: isSnakeHead
                      ? "#4caf50"
                      : isSnakeBody
                      ? "#81c784"
                      : isFood
                      ? "#f44336"
                      : "#fff",
                  }}
                />
              );
            })}
          </Box>
        ))}
      </Box>
      {gameOver && (
        <Typography variant="h6" color="error" sx={{ mt: 2 }}>
          Game Over! Final Score: {score}
        </Typography>
      )}
      <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={gameOver}
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={resetGame}
          startIcon={<ReplayIcon />}
        >
          Reset
        </Button>
        <Button variant="text" size="small" onClick={onClose}>
          Close Game
        </Button>
      </Box>
    </Box>
  );
};

export default SnakeGame;
