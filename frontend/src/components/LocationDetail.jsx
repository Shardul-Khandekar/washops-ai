import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Stack, Switch, 
  Select, MenuItem, Divider 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import * as S from '../styles/Dashboard.styles';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour}:${min}`;
});

function LocationDetail({ wash, onBack }) {
  const [hours, setHours] = useState(
    DAYS_OF_WEEK.map(day => ({ 
      day_of_week: day, open_time: '09:00', close_time: '17:00', is_closed: false 
    }))
  );

  const handleHourChange = (index, field, value) => {
    const newHours = [...hours];
    newHours[index][field] = value;
    setHours(newHours);
  };

  const saveHours = async () => {
    try {
      // POSTING TO: /api/washes/:id/hours
      await axios.post(`http://localhost:5001/api/ops/${wash.id}/hours`, { hours });
      alert("Hours synced with AI agent.");
    } catch (err) {
      console.error("Failed to save hours", err);
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
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
           <S.ActionButton variant="outlined" onClick={saveHours} startIcon={<SaveIcon />}>
             Sync AI Knowledge
           </S.ActionButton>
           <S.ActionButton variant="contained">Manage Twilio</S.ActionButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* 2. OPERATIONS CONTENT */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 4 }}>
        {/* BUSINESS HOURS */}
        <S.QuadrantBox>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
              Business Hours
            </Typography>
            <Typography variant="body2" sx={{ color: '#acaba9', fontStyle: 'italic' }}>
              Define when the AI agent handles bookings.
            </Typography>
          </Box>

          <Stack spacing={1}>
            {hours.map((item, index) => (
              <Box 
                key={item.day_of_week} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1.5, 
                  borderRadius: '8px',
                  borderBottom: '1px solid #f1f1f1',
                  opacity: item.is_closed ? 0.5 : 1
                }}
              >
                <Typography sx={{ width: '100px', fontWeight: 600, fontSize: '14px' }}>
                  {item.day_of_week}
                </Typography>

                <Switch 
                  size="small"
                  checked={!item.is_closed}
                  onChange={(e) => handleHourChange(index, 'is_closed', !e.target.checked)}
                />

                {!item.is_closed ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Select
                      size="small"
                      value={item.open_time}
                      onChange={(e) => handleHourChange(index, 'open_time', e.target.value)}
                      sx={{ fontSize: '13px', minWidth: '90px' }}
                    >
                      {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                    <Typography sx={{ color: '#acaba9' }}>—</Typography>
                    <Select
                      size="small"
                      value={item.close_time}
                      onChange={(e) => handleHourChange(index, 'close_time', e.target.value)}
                      sx={{ fontSize: '13px', minWidth: '90px' }}
                    >
                      {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ ml: 2, color: '#73726e', fontWeight: 700 }}>
                    CLOSED
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>

        {/* SERVICE CATALOG */}
        <S.QuadrantBox sx={{ bgcolor: '#fbfbfa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '16px' }}>Service Catalog</Typography>
          <Typography sx={{ color: '#acaba9' }}>Configure pricing and wash types here.</Typography>
        </S.QuadrantBox>

      </Box>
    </Box>
  );
}

export default LocationDetail;