import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Button } from '@mui/material';

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // If no user is found in local storage, kick them back to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Dont render anything while redirecting
  if (!user) return null;

  return (
    <Container>
      <Typography variant="h4">Welcome to WashOps, {user.email}!</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default HomePage;
