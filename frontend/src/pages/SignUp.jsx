import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:5000/api/signup', {
                email,
                password
            });

            if (response.status === 201) {
                alert("Account created successfully!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Failed to sign up. Is the backend running?");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                WashOps
            </Typography>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Create account</Typography>
            <Box component="form" onSubmit={handleSignUp}>
                <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                <Link href="#" onClick={() => navigate('/login')} variant="body2">
                {"Already have an account? Sign In"}
                </Link>
            </Box>
            </Paper>
        </Box>
        </Container>
    );
}

export default SignUp;