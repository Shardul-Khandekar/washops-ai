import React, { useState, useEffect } from 'react';
import { Box, List, ListItemIcon, ListItemText, Typography, Stack, CssBaseline, CircularProgress, Drawer, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import * as S from '../styles/Dashboard.styles';
import axios from 'axios';
import LocationDetail from '../components/LocationDetail';
import { useParams, useNavigate } from 'react-router-dom';

function HomePage() {
  const { washId } = useParams(); // URL Param: /homepage/wash/:washId
  const navigate = useNavigate();

  const [washes, setWashes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  // Find the selected wash based on the URL parameter
  const selectedWash = washes.find(w => w.id.toString() === washId);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    zipCode: ''
  });

  const fetchWashes = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/washes?email=${user.email}`);
      setWashes(response.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { if (user?.email) fetchWashes(); }, [user]);

  const handleAddLocation = async () => {
    try {
      const payload = { ...formData, owner_email: user.email };
      const response = await axios.post('http://localhost:5001/api/washes', payload);
      
      if (response.data.success) {
        setDrawerOpen(false);
        setFormData({ name: '', address: '', zipCode: '' });
        fetchWashes();
      }
    } catch (err) {
      console.error("Error adding location:", err);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* 1. SIDEBAR */}
      <S.SidebarContainer>
        <S.SidebarHeader>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>Workspace</Typography>
        </S.SidebarHeader>

        <S.CreateButton 
          startIcon={<AddIcon style={{ color: '#2383e2' }} />}
          onClick={() => setDrawerOpen(true)}
        >
          Add Location
        </S.CreateButton>

        <List sx={{ px: 0 }}>
          {/* Dashboard Link: Resets URL to /homepage */}
          <S.NavItem 
            $active={!washId} 
            onClick={() => navigate('/homepage')}
          >
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
          backgroundColor: '#ffffff',
          overflowY: 'auto'
        }}
      >
        {washId && selectedWash ? (
          /* SHOW DETAIL VIEW */
          <LocationDetail 
            wash={selectedWash} 
            onBack={() => navigate('/homepage')} 
          />
        ) : (
          /* SHOW DASHBOARD GRID */
          <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#37352f' }}>
              Workspace
            </Typography>

            <S.DashboardGrid>
              <S.QuadrantBox>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
                    Locations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2383e2', cursor: 'pointer', fontWeight: 600 }}>
                    View All
                  </Typography>
                </Box>

                <Stack spacing={0.5}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress size={24} sx={{ color: '#ededed' }} />
                    </Box>
                  ) : washes.length > 0 ? (
                    washes.map((wash) => (                  
                      <S.LocationRow 
                        key={wash.id}
                        onClick={() => navigate(`/homepage/wash/${wash.id}`)} // Navigate to Detail URL
                      >
                        <S.StatusDot $active={!!wash.twilioNumber} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#37352f' }}>
                            {wash.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#acaba9' }}>
                            {wash.twilioNumber || 'No number assigned'}
                          </Typography>
                        </Box>
                      </S.LocationRow>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ color: '#acaba9', fontStyle: 'italic', p: 2 }}>
                      No locations found.
                    </Typography>
                  )}
                </Stack>
              </S.QuadrantBox>

              <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
                 <Typography sx={{ color: '#acaba9' }}>Analytics Pipeline</Typography>
              </S.QuadrantBox>

              <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
                 <Typography sx={{ color: '#acaba9' }}>AI Activity Feed</Typography>
              </S.QuadrantBox>

              <S.QuadrantBox sx={{ bgcolor: '#fafafa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
                 <Typography sx={{ color: '#acaba9' }}>Lead & Booking Pipeline</Typography>
              </S.QuadrantBox>
            </S.DashboardGrid>
          </>
        )}
      </Box>

      {/* DRAWER REMAINS THE SAME */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* ... (Drawer Content) ... */}
      </Drawer>
    </Box>
  );
}

export default HomePage;