import React, { useState } from 'react';
import { Box, Link, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as S from '../styles/Auth.styles.js';

function Login({ open, onClose, onSwitchToSignUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    if (!open) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onClose();
                navigate('/homepage');
            }
        } catch (error) {
            alert(error.response?.data?.error || "Login failed");
        }
    };

    return (
        <S.Overlay> {/* Removed onClick={onClose} so it stays open */}
            <S.AuthContainer>
                <IconButton 
                    onClick={onClose} 
                    sx={{ position: 'absolute', top: 12, right: 12, color: '#acaba9' }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                <S.Header>Sign in</S.Header>
                <S.SubHeader>Use your WashOps Account</S.SubHeader>

                <Box component="form" onSubmit={handleLogin}>
                    <S.StyledTextField 
                        fullWidth 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <S.StyledTextField 
                        fullWidth 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <S.PrimaryButton type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                        Login
                    </S.PrimaryButton>

                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#73726e' }}>
                        New to WashOps?{' '}
                        <Link 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }} 
                            sx={{ color: '#2383e2', textDecoration: 'none', fontWeight: 600 }}
                        >
                            Create account
                        </Link>
                    </Typography>
                </Box>
            </S.AuthContainer>
        </S.Overlay>
    );
}

export default Login;