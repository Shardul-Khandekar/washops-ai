import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, Divider, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [twilioNumber, setTwilioNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(savedUser);
      setTwilioNumber(savedUser.twilioNumber || null);
    }
  }, [navigate]);

  const generateTwilioNumber = async () => {
    setLoading(true);
    try {

        const response = await axios.post('http://localhost:5001/api/twilio/provision', {
          email: user.email // Send user email from stored user data
        });

      setTwilioNumber(response.data.twilioNumber);
    } catch (error) {
      console.error("Failed to generate number", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            WashOps Dashboard
          </Typography>
          <Button size="small" color="error" onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}>Logout</Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="body1" sx={{ mb: 4 }}>
          Welcome, <strong>{user.email}</strong>. To start managing your car wash, assign a dedicated business number.
        </Typography>

        {/* Twilio Provisioning Section */}
        <Box sx={{ 
          p: 3, 
          border: '1px solid #e0e0e0', 
          borderRadius: 2, 
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <PhoneIphoneIcon sx={{ fontSize: 48, color: '#1a73e8', mb: 2 }} />
          
          {!twilioNumber ? (
            <>
              <Typography variant="h6" gutterBottom>Provision Business Number</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Generate a Twilio-powered number to automate your customer communication.
              </Typography>
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={generateTwilioNumber}
                sx={{ textTransform: 'none', px: 4 }}
              >
                Generate Number
              </LoadingButton>
            </>
          ) : (
            <Alert severity="success" icon={<PhoneIphoneIcon fontSize="inherit" />} sx={{ width: '100%' }}>
              Your Car Wash Number: <strong>{twilioNumber}</strong>
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default HomePage;