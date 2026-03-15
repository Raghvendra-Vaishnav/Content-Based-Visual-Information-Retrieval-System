import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ darkMode, onThemeToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/upload", label: "Upload", icon: <CloudUploadIcon /> },
    { path: "/search", label: "Search", icon: <SearchIcon /> },
    { path: "/gallery", label: "Gallery", icon: <ImageIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <SearchIcon sx={{ mr: 2 }} />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              mr: 2,
              display: isMobile ? "none" : "block",
            }}
          >
            CBVIRS
          </Typography>
          <Typography
            variant="subtitle2"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              display: isMobile ? "block" : "none",
            }}
          >
            CBVIRS
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Brightness4Icon />
                <Switch
                  checked={darkMode}
                  onChange={onThemeToggle}
                  color="default"
                  size="small"
                />
                <Brightness7Icon />
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mr: 2 }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      textTransform: "none",
                      fontWeight:
                        location.pathname === item.path ? "bold" : "normal",
                      borderBottom:
                        location.pathname === item.path
                          ? "2px solid white"
                          : "none",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Brightness4Icon />
                <Switch
                  checked={darkMode}
                  onChange={onThemeToggle}
                  color="default"
                />
                <Brightness7Icon />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
