import React from 'react';
import { Toolbar, Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as S from '../Layout.styles.js';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      <S.StyledAppBar position="fixed">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <S.LogoText onClick={() => navigate('/')}>
            WashOps
          </S.LogoText>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <S.NavButton onClick={() => navigate('/signup')}>
              Sign Up
            </S.NavButton>
            <S.NavButton 
              variant="contained" 
              onClick={() => navigate('/login')}
            >
              Login
            </S.NavButton>
          </Box>
        </Toolbar>
      </S.StyledAppBar>

      <Box component="main" sx={{ pt: '60px', flexGrow: 1 }}>
        {/* Next component goes here */}
      </Box>
    </Box>
  );
}

export default Home;