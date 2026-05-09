import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              CBVIRS Project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Content-Based-Visual-Information-Retrieval-System using Scene Graph Generation and
              Graph Neural Networks.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                color="inherit"
                component={Link}
                href="https://github.com/Raghvendra-Vaishnav/"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component={Link}
                href="https://in.linkedin.com/in/raghvendra-vaishnav-41227a260"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component={Link}
                href="mailto:vaishnavraghavendra68@gmail.com"
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 CBVIRS Project.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
