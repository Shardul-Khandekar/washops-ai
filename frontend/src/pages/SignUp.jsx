import React, { useState } from 'react';
import { Box, Link, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import * as S from '../styles/Auth.styles.js';

function SignUp({ open, onClose }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!open) return null;

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/signup', { email, password });
            if (response.status === 201) {
                alert("Account created successfully!");
                onClose(); // Close the box on success
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    return (
        <S.Overlay onClick={onClose}>
            {/* Prevent clicks inside the box from closing the overlay */}
            <S.AuthContainer onClick={(e) => e.stopPropagation()}>
                <IconButton 
                    onClick={onClose} 
                    sx={{ position: 'absolute', top: 12, right: 12, color: '#acaba9' }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                <S.Header>Create account</S.Header>
                <S.SubHeader>Start managing your infrastructure with WashOps.</S.SubHeader>

                <Box component="form" onSubmit={handleSignUp}>
                    <S.StyledTextField 
                        fullWidth 
                        placeholder="Email address" 
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
                        Sign Up
                    </S.PrimaryButton>

                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#73726e' }}>
                        Already have an account?{' '}
                        <Link href="#" onClick={(e) => { e.preventDefault(); /* Navigate logic */ }} sx={{ color: '#2383e2', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </Typography>
                </Box>
            </S.AuthContainer>
        </S.Overlay>
    );
}

export default SignUp;