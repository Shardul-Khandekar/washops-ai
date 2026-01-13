import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Paper, Button, 
  Divider, CircularProgress, Grid, TextField, Switch, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for Wash and Hours
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [hours, setHours] = useState([]);

  // State for Services
  const [services, setServices] = useState([]);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [washRes, hoursRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/washes/${id}`),
          axios.get(`http://localhost:5001/api/washes/${id}/hours`)
        ]);
        
        setWash(washRes.data);
        
        if (hoursRes.data?.length > 0) {
          setHours(hoursRes.data);
        } else {
          setHours(DAYS_OF_WEEK.map(day => ({ 
            day_of_week: day, 
            open_time: '08:00', 
            close_time: '18:00', 
            is_closed: false 
          })));
        }
      } catch (error) { 
        console.error("Fetch error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [id]);

  // 2. Business Hours Handlers
  const handleHoursChange = (index, field, value) => {
    const updatedHours = [...hours];
    updatedHours[index][field] = value;
    setHours(updatedHours);
  };

  const saveBusinessHours = async () => {
    try {
      await axios.post(`http://localhost:5001/api/washes/${id}/hours`, { hours });
      alert("Hours updated successfully!");
    } catch (error) {
      alert("Save failed");
    }
  };

  // 3. Twilio Handler
  const handleGenerateNumber = async () => {
    setProvisioning(true);
    try {
      const response = await axios.post('http://localhost:5001/api/twilio/provision', {
        wash_id: id,
        email: JSON.parse(localStorage.getItem('user')).email
      });
      setWash({ ...wash, twilioNumber: response.data.twilioNumber });
    } catch (error) {
      alert("Provisioning failed");
    } finally {
      setProvisioning(false);
    }
  };

  // 4. Service Handlers (Mocks for now)
  const handleAddService = () => {
    console.log("Saving Service for RAG:", newService);
    setOpenServiceModal(false);
    setNewService({ name: '', price: '', description: '' });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/homepage')} 
          sx={{ mb: 3, color: '#5f6368', textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>

        <Grid container spacing={3}>
          {/* LEFT COLUMN: Info and Hours */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Box 1: Name & Address */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#202124' }}>
                  {wash?.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                  {wash?.address}, {wash?.zipCode}
                </Typography>
              </Paper>

              {/* Box 2: Business Hours */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#3c4043' }}>
                  Business Hours
                </Typography>
                {hours.map((item, index) => (
                  <Box key={item.day_of_week} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'space-between' }}>
                    <Typography sx={{ width: 85, fontSize: '0.9rem' }}>{item.day_of_week}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField 
                        type="time" 
                        size="small" 
                        value={item.open_time} 
                        disabled={item.is_closed} 
                        onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)}
                        sx={{ width: 105 }} 
                      />
                      <Typography variant="caption">—</Typography>
                      <TextField 
                        type="time" 
                        size="small" 
                        value={item.close_time} 
                        disabled={item.is_closed} 
                        onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)}
                        sx={{ width: 105 }} 
                      />
                    </Box>

                    <Switch 
                      checked={!item.is_closed} 
                      size="small" 
                      onChange={(e) => handleHoursChange(index, 'is_closed', !e.target.checked)}
                    />
                  </Box>
                ))}
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={saveBusinessHours}
                  sx={{ mt: 2, textTransform: 'none', backgroundColor: '#1a73e8' }}
                >
                  Update Hours
                </Button>
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT COLUMN: Phone and Services */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Box 3: Phone Number */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Phone Number</Typography>
                {wash?.twilioNumber ? (
                  <Typography variant="h6" sx={{ color: '#188038', letterSpacing: 1 }}>
                    {wash.twilioNumber}
                  </Typography>
                ) : (
                  <LoadingButton 
                    loading={provisioning}
                    variant="contained" 
                    onClick={handleGenerateNumber}
                    sx={{ textTransform: 'none', backgroundColor: '#1a73e8' }}
                  >
                    Generate Number
                  </LoadingButton>
                )}
              </Paper>

              {/* Box 4: Services & Pricing */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', borderColor: '#dadce0', minHeight: '300px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Services & Pricing</Typography>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setOpenServiceModal(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    + Add Service
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {services.length === 0 ? (
                  <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <Typography color="textSecondary">No services listed yet.</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Add services to help the AI answer customer questions.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {/* Future: Map services here */}
                  </Box>
                )}
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
            <TextField 
              label="Service Name (e.g. Interior Detail)" 
              fullWidth 
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
            />
            <TextField 
              label="Price ($)" 
              type="number" 
              fullWidth 
              value={newService.price}
              onChange={(e) => setNewService({...newService, price: e.target.value})}
            />
            <TextField 
              label="Service Details for AI Context" 
              multiline 
              rows={4} 
              fullWidth 
              placeholder="Describe exactly what is included, tools used, and any special notes for the LLM..."
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenServiceModal(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAddService} sx={{ backgroundColor: '#1a73e8' }}>
            Save Service
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WashDetails;