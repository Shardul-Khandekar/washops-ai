import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Divider, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import * as S from '../styles/Dashboard.styles';

function LocationDetail({ wash, onBack }) {

    const [hours, setHours] = useState([]);
    const [services, setServices] = useState([]);

    return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      {/* 1. Header with Back Button (Google Style) */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ border: '1px solid #ededed' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#37352f' }}>
            {wash.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#73726e' }}>
            {wash.address}, {wash.zipCode}
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
           <S.ActionButton variant="outlined">Sync AI Knowledge</S.ActionButton>
           <S.ActionButton variant="contained">Manage Twilio</S.ActionButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* 2. Operations Content (Two-Column Layout) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {/* Business Hours Section */}
        <S.QuadrantBox>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '16px' }}>
            Business Hours
          </Typography>
          <Typography variant="body2" sx={{ color: '#acaba9', fontStyle: 'italic' }}>
            Configure when your AI agent tells customers you are open.
          </Typography>
        </S.QuadrantBox>

        {/* Services Catalog Section */}
        <S.QuadrantBox>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '16px' }}>
            Service Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: '#acaba9', fontStyle: 'italic' }}>
            List your washes and prices for the AI receptionist.
          </Typography>
        </S.QuadrantBox>
        </Box>
        </Box>
    );
}

export default LocationDetail;
