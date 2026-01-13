import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Paper, Button, 
  Divider, CircularProgress, Grid, TextField, Switch, 
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, InputAdornment, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [hours, setHours] = useState([]);
  const [services, setServices] = useState([]);

  // Modals state
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [viewService, setViewService] = useState(null); // For viewing description
  const [newService, setNewService] = useState({ name: '', price: '', duration_minutes: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [washRes, hoursRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/washes/${id}`),
          axios.get(`http://localhost:5001/api/washes/${id}/hours`),
          axios.get(`http://localhost:5001/api/washes/${id}/services`)
        ]);
        setWash(washRes.data);
        setServices(servicesRes.data || []);
        if (hoursRes.data?.length > 0) setHours(hoursRes.data);
        else setHours(DAYS_OF_WEEK.map(day => ({ day_of_week: day, open_time: '08:00', close_time: '18:00', is_closed: false })));
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleHoursChange = (index, field, value) => {
    const updatedHours = [...hours];
    updatedHours[index][field] = value;
    setHours(updatedHours);
  };

  const handleAddService = async () => {
    try {
      const response = await axios.post(`http://localhost:5001/api/washes/${id}/services`, newService);
      if (response.status === 201) {
        setOpenServiceModal(false);
        setNewService({ name: '', price: '', duration_minutes: '', description: '' });
        const servicesRes = await axios.get(`http://localhost:5001/api/washes/${id}/services`);
        setServices(servicesRes.data);
      }
    } catch (error) { alert("Failed to add service"); }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:5001/api/services/${serviceId}`);
        setServices(services.filter(s => s.id !== serviceId));
      } catch (error) { alert("Delete failed"); }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/homepage')} sx={{ mb: 3, color: '#5f6368', textTransform: 'none' }}>
          Back to Dashboard
        </Button>

        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>{wash?.name}</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>{wash?.address}, {wash?.zipCode}</Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Business Hours</Typography>
                {hours.map((item, index) => (
                  <Box key={item.day_of_week} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'space-between' }}>
                    <Typography sx={{ width: 85, fontSize: '0.9rem' }}>{item.day_of_week}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField type="time" size="small" value={item.open_time} disabled={item.is_closed} onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)} sx={{ width: 105 }} />
                      <Typography variant="caption">—</Typography>
                      <TextField type="time" size="small" value={item.close_time} disabled={item.is_closed} onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)} sx={{ width: 105 }} />
                    </Box>
                    <Switch checked={!item.is_closed} size="small" onChange={(e) => handleHoursChange(index, 'is_closed', !e.target.checked)} />
                  </Box>
                ))}
                <Button fullWidth variant="contained" sx={{ mt: 2, textTransform: 'none' }}>Update Hours</Button>
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Phone Number</Typography>
                <Typography variant="h6" sx={{ color: '#188038' }}>{wash?.twilioNumber || 'No number provisioned'}</Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0', minHeight: '400px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Services & Pricing</Typography>
                  <Button size="small" variant="outlined" onClick={() => setOpenServiceModal(true)} sx={{ textTransform: 'none' }}>+ Add Service</Button>
                </Box>
                <Divider />
                
                <List disablePadding>
                  {services.map((service) => (
                    <ListItem key={service.id} divider sx={{ py: 2, px: 0 }}>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 500 }}>{service.name}</Typography>}
                        secondary={`Duration: ${service.duration_minutes || '--'} min | Price: $${service.price}`}
                      />
                      <Box>
                        <IconButton onClick={() => setViewService(service)} size="small" sx={{ mr: 1, color: '#1a73e8' }}>
                          <VisibilityOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteService(service.id)} size="small" sx={{ color: '#d93025' }}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Add Service Dialog */}
      <Dialog open={openServiceModal} onClose={() => setOpenServiceModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Service Name" fullWidth value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                label="Price" type="number" fullWidth value={newService.price} 
                onChange={(e) => setNewService({...newService, price: e.target.value})} 
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              />
              <TextField 
                label="Duration" type="number" fullWidth value={newService.duration_minutes} 
                onChange={(e) => setNewService({...newService, duration_minutes: e.target.value})} 
                InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
              />
            </Box>
            <TextField label="AI Service Context (Detailed Description)" multiline rows={4} fullWidth placeholder="Details for the LLM..." value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenServiceModal(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAddService}>Save Service</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={Boolean(viewService)} onClose={() => setViewService(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600 }}>{viewService?.name} - Details</DialogTitle>
        <DialogContent divider>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
            {viewService?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewService(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WashDetails;