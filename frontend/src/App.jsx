import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      {/* This Box creates the full-screen light grey background */}
      <CssBaseline />
      <Box sx={{ 
        backgroundColor: '#f0f2f3', // Google's subtle grey
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column', // Stack vertically to prevent horizontal stretching
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
      <Routes>
        {/* Base path / shows the Home/Landing page */}
        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* The Portal Dashboard */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Catch-all: Redirect unknown paths back to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
      </Box>
    </Router>
  );
}

export default App;