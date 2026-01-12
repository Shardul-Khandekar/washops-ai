import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Paper, Button, 
  IconButton, Divider, Alert, CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

function WashDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);

  useEffect(() => {
    const fetchWashDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/washes/${id}`);
        setWash(response.data);
      } catch (error) {
        console.error("Error fetching wash details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWashDetails();
  }, [id]);

  const handleGenerateNumber = async () => {
    setProvisioning(true);
    try {
      const response = await axios.post('http://localhost:5001/api/twilio/provision', {
        wash_id: id,
        email: JSON.parse(localStorage.getItem('user')).email
      });
      setWash({ ...wash, twilioNumber: response.data.twilioNumber });
    } catch (error) {
      alert("Failed to provision number. Check backend.");
    } finally {
      setProvisioning(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/homepage')}
          sx={{ textTransform: 'none' }}
        >
          Back to Locations
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, mb: 1 }}>{wash.name}</Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>{wash.address}, {wash.zipCode}</Typography>
        
        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Communication Settings</Typography>
        
        <Box sx={{ 
          p: 3, border: '1px solid #e0e0e0', borderRadius: 2, 
          backgroundColor: '#f8f9fa', textAlign: 'center' 
        }}>
          <PhoneIphoneIcon sx={{ fontSize: 40, color: '#1a73e8', mb: 1 }} />
          
          {wash.twilioNumber ? (
            <Alert severity="success" sx={{ mt: 2, justifyContent: 'center' }}>
              Dedicated Number: <strong>{wash.twilioNumber}</strong>
            </Alert>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This location does not have a business number assigned.
              </Typography>
              <LoadingButton
                loading={provisioning}
                variant="contained"
                onClick={handleGenerateNumber}
                sx={{ textTransform: 'none' }}
              >
                Provision Twilio Number
              </LoadingButton>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default WashDetails;