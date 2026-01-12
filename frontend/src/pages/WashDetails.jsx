import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Paper, Button, 
  Divider, Alert, CircularProgress, Grid, TextField, Switch, FormControlLabel 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  
  // Initialize hours state
  const [hours, setHours] = useState(
    DAYS_OF_WEEK.map(day => ({ day_of_week: day, open_time: '08:00', close_time: '18:00', is_closed: false }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Wash Details and Business Hours in parallel
        const [washRes, hoursRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/washes/${id}`),
          axios.get(`http://localhost:5001/api/washes/${id}/hours`)
        ]);

        setWash(washRes.data);
        
        // If hours exist in DB, override defaults
        if (hoursRes.data && hoursRes.data.length > 0) {
          setHours(hoursRes.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleHoursChange = (index, field, value) => {
    const updatedHours = [...hours];
    updatedHours[index][field] = value;
    setHours(updatedHours);
  };

  const saveBusinessHours = async () => {
    setSavingHours(true);
    try {
      await axios.post(`http://localhost:5001/api/washes/${id}/hours`, { hours });
      alert("Business hours updated successfully!");
    } catch (error) {
      alert("Failed to save business hours.");
    } finally {
      setSavingHours(false);
    }
  };

  const handleGenerateNumber = async () => {
    setProvisioning(true);
    try {
      const response = await axios.post('http://localhost:5001/api/twilio/provision', {
        wash_id: id,
        email: JSON.parse(localStorage.getItem('user')).email
      });
      setWash({ ...wash, twilioNumber: response.data.twilioNumber });
    } catch (error) {
      alert("Failed to provision number.");
    } finally {
      setProvisioning(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/homepage')}>
          Back to Locations
        </Button>
      </Box>

      {/* Location Header */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>{wash.name}</Typography>
        <Typography color="textSecondary">{wash.address}, {wash.zipCode}</Typography>
      </Paper>

      {/* Business Hours Section */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccessTimeIcon sx={{ mr: 1, color: '#1a73e8' }} />
          <Typography variant="h6">Business Hours</Typography>
        </Box>
        
        <Grid container spacing={2}>
          {hours.map((item, index) => (
            <Grid item xs={12} key={item.day_of_week} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 100, fontWeight: 500 }}>{item.day_of_week}</Typography>
              
              <TextField
                type="time"
                size="small"
                value={item.open_time}
                disabled={item.is_closed}
                onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Typography>to</Typography>
              <TextField
                type="time"
                size="small"
                value={item.close_time}
                disabled={item.is_closed}
                onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={!item.is_closed} 
                    onChange={(e) => handleHoursChange(index, 'is_closed', !e.target.checked)} 
                  />
                }
                label={item.is_closed ? "Closed" : "Open"}
                sx={{ ml: 2 }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton 
            loading={savingHours} 
            variant="contained" 
            onClick={saveBusinessHours}
          >
            Save Business Hours
          </LoadingButton>
        </Box>
      </Paper>

      {/* Twilio Section */}
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Communication Settings</Typography>
        <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#f8f9fa', textAlign: 'center' }}>
          <PhoneIphoneIcon sx={{ fontSize: 40, color: '#1a73e8', mb: 1 }} />
          {wash.twilioNumber ? (
            <Alert severity="success" sx={{ mt: 2, justifyContent: 'center' }}>
              Dedicated Number: <strong>{wash.twilioNumber}</strong>
            </Alert>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>No business number assigned.</Typography>
              <LoadingButton loading={provisioning} variant="contained" onClick={handleGenerateNumber}>
                Provision Number
              </LoadingButton>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default WashDetails;