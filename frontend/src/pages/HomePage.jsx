import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, Paper, 
  Grid, Card, CardActionArea, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField // Added Dialog & TextField
} from '@mui/material';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal and List State
  const [open, setOpen] = useState(false);
  const [newWash, setNewWash] = useState({ name: '', address: '', zipCode: '' });
  const [washes, setWashes] = useState([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  // Trigger fetch whenever the user object is set
  useEffect(() => {
    if (user?.email) {
      fetchWashes();
    }
  }, [user]);

  const fetchWashes = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/washes?email=${user.email}`);
      setWashes(response.data);
    } catch (error) {
      console.error("Error fetching washes:", error);
    }
  };

  const handleSaveWash = async () => {
    try {
      await axios.post('http://localhost:5001/api/washes', { 
        ...newWash, 
        owner_email: user.email 
      });
      setOpen(false);
      setNewWash({ name: '', address: '', zipCode: '' }); // Reset form
      fetchWashes(); 
    } catch (error) {
      console.error("Error saving wash:", error);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202124' }}>
          Business Locations
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ textTransform: 'none' }}>
          + Add Location
        </Button>
      </Box>

      <Grid container spacing={3}>
        {washes.map((wash) => (
          <Grid item xs={12} sm={6} key={wash.id}>
            <Card variant="outlined" sx={{ borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
              <CardActionArea onClick={() => navigate(`/wash/${wash.id}`)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                      {wash.name}
                    </Typography>
                    <Chip 
                      label={wash.twilioNumber ? "Active" : "Action Required"} 
                      color={wash.twilioNumber ? "success" : "warning"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {wash.address}, {wash.zipCode}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- ADD LOCATION MODAL --- */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Car Wash</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Car Wash Name"
              variant="outlined"
              fullWidth
              value={newWash.name}
              onChange={(e) => setNewWash({ ...newWash, name: e.target.value })}
            />
            <TextField
              label="Street Address"
              variant="outlined"
              fullWidth
              value={newWash.address}
              onChange={(e) => setNewWash({ ...newWash, address: e.target.value })}
            />
            <TextField
              label="Zip Code"
              variant="outlined"
              fullWidth
              value={newWash.zipCode}
              onChange={(e) => setNewWash({ ...newWash, zipCode: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveWash}
            disabled={!newWash.name || !newWash.address}
          >
            Save Location
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HomePage;