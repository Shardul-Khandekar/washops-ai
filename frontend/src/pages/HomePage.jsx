import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import * as S from '../styles/Dashboard.styles';

function HomePage() {
  const [isAddLocationOpen, setAddLocationOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 1. The Sidebar */}
      <S.SidebarContainer>
        <S.SidebarHeader>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            WashOps Workspace
          </Typography>
        </S.SidebarHeader>

        <S.CreateButton 
          startIcon={<AddIcon style={{ color: '#2383e2' }} />} 
          onClick={() => setAddLocationOpen(true)}
        >
          Add Location
        </S.CreateButton>

        <List sx={{ px: 0 }}>
          <S.NavItem active={true}>
            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Business Locations" />
          </S.NavItem>
          
          <S.NavItem>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </S.NavItem>
        </List>
      </S.SidebarContainer>

      {/* 2. Main Page Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        ml: '240px', // Matches sidebar width
        p: 6, 
        backgroundColor: '#ffffff',
        minHeight: '100vh'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#37352f' }}>
          Locations
        </Typography>
        
        {/* We will move your Grid of Car Washes here next */}
        <Box sx={{ color: '#73726e', fontStyle: 'italic' }}>
          Displaying your business locations...
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;