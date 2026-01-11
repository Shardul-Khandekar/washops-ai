import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper elevation={1} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          WashOps
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          The intelligent operating system for your car wash business.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/login')}>
            Go to Portal
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/signup')}>
            Register Business
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Home;