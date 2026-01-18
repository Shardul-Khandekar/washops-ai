import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Auth routes - These should handle their own centering/backgrounds internally */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* The Workspace Portal 
            We use the same HomePage component for both routes.
            The presence of 'washId' in the URL tells the component which view to show.
        */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/homepage/wash/:washId" element={<HomePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;