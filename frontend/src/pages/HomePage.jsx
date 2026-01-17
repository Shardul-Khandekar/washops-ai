import React from 'react';
import { Box, List, ListItemIcon, ListItemText, Typography, Stack, CssBaseline } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import * as S from '../styles/Dashboard.styles';

const mockLocations = [
  { id: 1, name: "Seattle North Express", status: "Active", calls: 14 },
  { id: 2, name: "Downtown Eco Wash", status: "Action Required", calls: 0 },
  { id: 3, name: "Bellevue Luxury Detail", status: "Active", calls: 28 },
];

function HomePage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* 1. SIDEBAR */}
      <S.SidebarContainer>
        <S.SidebarHeader>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            Workspace
          </Typography>
        </S.SidebarHeader>

        <S.CreateButton startIcon={<AddIcon style={{ color: '#2383e2' }} />}>
          Add Location
        </S.CreateButton>

        <List sx={{ px: 0 }}>
          <S.NavItem $active={true}>
            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Business Locations" />
          </S.NavItem>
          <S.NavItem $active={false}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </S.NavItem>
        </List>
      </S.SidebarContainer>

      {/* 2. MAIN CONTENT AREA */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          ml: '240px', 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#ffffff'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#37352f' }}>
          Workspace
        </Typography>

        {/* 3. 4-QUADRANT GRID */}
        <S.DashboardGrid>
          {/* TOP LEFT: LOCATIONS */}
          <S.QuadrantBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
                Locations
              </Typography>
              <Typography variant="body2" sx={{ color: '#2383e2', cursor: 'pointer', fontWeight: 600 }}>
                View All
              </Typography>
            </Box>

            <Stack spacing={0.5} sx={{ overflowY: 'auto' }}>
              {mockLocations.map((loc) => (
                <S.LocationRow key={loc.id}>
                  <S.StatusDot $active={loc.status === "Active"} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#37352f' }}>
                      {loc.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#73726e', bgcolor: '#f1f1f1', px: 1, py: 0.5, borderRadius: '4px' }}>
                    {loc.calls} calls
                  </Typography>
                </S.LocationRow>
              ))}
            </Stack>
          </S.QuadrantBox>

          {/* TOP RIGHT */}
          <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
             <Typography sx={{ color: '#acaba9' }}>Analytics Pipeline</Typography>
          </S.QuadrantBox>

          {/* BOTTOM LEFT */}
          <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
             <Typography sx={{ color: '#acaba9' }}>AI Activity Feed</Typography>
          </S.QuadrantBox>

          {/* BOTTOM RIGHT */}
          <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
             <Typography sx={{ color: '#acaba9' }}>Lead & Booking Pipeline</Typography>
          </S.QuadrantBox>
        </S.DashboardGrid>
      </Box>
    </Box>
  );
}

export default HomePage;