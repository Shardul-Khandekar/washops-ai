import React, { useState, useEffect } from 'react';
import { Toolbar, Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as S from '../styles/Layout.styles.js';
import SignUp from './SignUp.jsx';
import Login from './Login.jsx';

function Home() {
  const navigate = useNavigate();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => { setIsSignUpOpen(false); setIsLoginOpen(true); };
  const openSignUp = () => { setIsLoginOpen(false); setIsSignUpOpen(true); };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      <S.StyledAppBar position="fixed">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <S.LogoText onClick={() => navigate('/')}>
            WashOps
          </S.LogoText>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <S.NavButton onClick={openSignUp}>
              Sign Up
            </S.NavButton>
            <S.NavButton variant="contained" onClick={openLogin}>
              Login
            </S.NavButton>
          </Box>
        </Toolbar>
      </S.StyledAppBar>

      <Box component="main" sx={{ pt: '60px', flexGrow: 1 }}>
        {/* Next component goes here */}
      </Box>

      <SignUp 
          open={isSignUpOpen} 
          onClose={() => setIsSignUpOpen(false)} 
          onSwitchToLogin={openLogin} 
      />

      <Login 
          open={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onSwitchToSignUp={openSignUp} 
      />
    </Box>
  );
}

export default Home;