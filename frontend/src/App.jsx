import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';

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
        {/* Default to Home if someone just hits the base URL */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </Box>
    </Router>
  );
}

export default App;