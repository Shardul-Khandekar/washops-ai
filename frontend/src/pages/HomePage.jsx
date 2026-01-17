import React, { useState, useEffect } from 'react';
import { Box, List, ListItemIcon, ListItemText, Typography, Stack, CssBaseline, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import * as S from '../styles/Dashboard.styles';
import axios from 'axios';

const mockLocations = [
  { id: 1, name: "Seattle North Express", status: "Active", calls: 14 },
  { id: 2, name: "Downtown Eco Wash", status: "Action Required", calls: 0 },
  { id: 3, name: "Bellevue Luxury Detail", status: "Active", calls: 28 },
];

function HomePage() {

  const [washes, setWashes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchWashes = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/washes?email=${user.email}`);
        setWashes(response.data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchWashes();
    }
  }, [user]);

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
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#ededed' }} />
                </Box>
              ) : washes.length > 0 ? (
                washes.map((wash) => (
                  <S.LocationRow key={wash.id}>
                    {/* If a twilioNumber exists, we show it as Active (Green) */}
                    <S.StatusDot $active={!!wash.twilioNumber} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#37352f' }}>
                        {wash.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#acaba9' }}>
                        {wash.twilioNumber || 'No number assigned'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#73726e', bgcolor: '#f1f1f1', px: 1, py: 0.5, borderRadius: '4px' }}>
                      {wash.zipCode}
                    </Typography>
                  </S.LocationRow>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#acaba9', fontStyle: 'italic', p: 2 }}>
                  No locations found.
                </Typography>
              )}
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