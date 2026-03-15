import React, { useState } from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import UploadSection from './components/UploadSection';
import SearchSection from './components/SearchSection';
import ImageGallery from './components/ImageGallery';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const NavigationWrapper = ({ darkMode, onThemeToggle }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header darkMode={darkMode} onThemeToggle={onThemeToggle} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadSection />} />
          <Route path="/search" element={<SearchSection />} />
          <Route path="/gallery" element={<ImageGallery />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <NavigationWrapper darkMode={darkMode} onThemeToggle={handleThemeToggle} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
