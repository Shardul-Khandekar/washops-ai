import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        variant="outlined" // Google uses a thin border instead of a shadow
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: '#fff' 
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: '#1a73e8', fontWeight: 500, mb: 1 }}>
          WashOps
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Sign in
        </Typography>
        
        <Box component="form" sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email or phone"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Enter your password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center' }}>
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/signup')}
              sx={{ textDecoration: 'none', fontWeight: 500 }}
            >
              Create account
            </Link>
            <Button
              variant="contained"
              sx={{ px: 3, py: 1, textTransform: 'none', borderRadius: 1.5 }}
              onClick={() => console.log("Login clicked")}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;