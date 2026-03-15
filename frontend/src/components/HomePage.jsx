import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ApiIcon from "@mui/icons-material/Api";
import CodeIcon from "@mui/icons-material/Code";
import TimelineIcon from "@mui/icons-material/Timeline";

const HomePage = () => {
  const features = [
    {
      icon: <SearchIcon fontSize="large" color="primary" />,
      title: "Semantic Search",
      description:
        "Search images using natural language queries with context-aware understanding",
    },
    {
      icon: <ImageIcon fontSize="large" color="primary" />,
      title: "Image-to-Image Search",
      description:
        "Upload an image to find visually similar images in the database",
    },
    {
      icon: <CloudUploadIcon fontSize="large" color="primary" />,
      title: "Auto Captioning",
      description:
        "Automatic caption generation for uploaded images using BLIP model",
    },
    {
      icon: <ApiIcon fontSize="large" color="primary" />,
      title: "REST API",
      description:
        "Comprehensive REST API for integration with other applications",
    },
  ];

  const techStack = [
    {
      category: "Backend",
      items: ["Python", "FastAPI", "TensorFlow", "PyTorch"],
    },
    { category: "Frontend", items: ["React.js", "Material-UI", "Axios"] },
    { category: "AI/ML", items: ["CLIP", "BLIP", "Scene Graphs", "GNN"] },
    { category: "Database", items: ["FAISS", "Vector Embeddings"] },
    { category: "Computer Vision", items: ["OpenCV", "YOLO", "Transformers"] },
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/upload",
      description: "Upload image and generate captions",
    },
    {
      method: "POST",
      endpoint: "/api/search_text",
      description: "Search images by text query",
    },
    {
      method: "POST",
      endpoint: "/api/search_image",
      description: "Search similar images by image upload",
    },
    {
      method: "POST",
      endpoint: "/api/get_captions",
      description: "Generate captions for uploaded image",
    },
    {
      method: "GET",
      endpoint: "/api/list_images",
      description: "List all images with pagination",
    },
    {
      method: "GET",
      endpoint: "/health",
      description: "Health check endpoint",
    },
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Core Infrastructure",
      status: "Completed",
      items: ["FastAPI setup", "Model configuration", "FAISS indexing"],
    },
    {
      phase: "Phase 2",
      title: "Captioning Pipeline",
      status: "Completed",
      items: ["BLIP integration", "CLIP embeddings", "Metadata storage"],
    },
    {
      phase: "Phase 3",
      title: "Search Functionality",
      status: "Completed",
      items: ["Text search", "Image search", "API responses"],
    },
    {
      phase: "Phase 4",
      title: "Frontend Integration",
      status: "Completed",
      items: ["React components", "API integration", "UI/UX"],
    },
    {
      phase: "Phase 5",
      title: "Scene Graph Enhancement",
      status: "Planned",
      items: ["YOLO integration", "Graph generation", "Advanced queries"],
    },
    {
      phase: "Phase 6",
      title: "Production Deployment",
      status: "Future",
      items: ["Docker containerization", "Scalability", "Monitoring"],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h2" gutterBottom fontWeight="bold">
          Content-Based-Visual-Information-Retrieval-System
        </Typography>
        <Typography variant="h5" gutterBottom>
          A Context-Aware Search System using Scene Graph Generation
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
          Experience the future of image search with AI-powered semantic
          understanding. Upload images, generate captions, and search using
          natural language queries.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Chip
            label="AI & DS Minor Project"
            sx={{
              mr: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
            }}
          />
          <Chip
            label="VIII Semester 2025-26"
            sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        </Box>
      </Box>

      {/* Features Grid */}
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Key Features
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", textAlign: "center" }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Project Details */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              <CodeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Technology Stack
            </Typography>
            {techStack.map((tech, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                  {tech.category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tech.items.map((item, idx) => (
                    <Chip
                      key={idx}
                      label={item}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              <ApiIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              API Endpoints
            </Typography>
            <List dense>
              {apiEndpoints.map((api, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Chip
                      label={api.method}
                      size="small"
                      color={api.method === "GET" ? "success" : "primary"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={api.endpoint}
                    secondary={api.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Roadmap */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          <TimelineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Project Roadmap
        </Typography>
        {roadmap.map((phase, index) => (
          <Accordion
            key={index}
            defaultExpanded={phase.status === "In Progress"}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6">
                  {phase.phase}: {phase.title}
                </Typography>
                <Chip
                  label={phase.status}
                  color={
                    phase.status === "Completed"
                      ? "success"
                      : phase.status === "In Progress"
                      ? "warning"
                      : "default"
                  }
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {phase.items.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={`• ${item}`} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default HomePage;
