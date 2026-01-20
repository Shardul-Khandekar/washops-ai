import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, IconButton, Stack, Switch, 
  Divider, CircularProgress, InputBase 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import * as S from '../styles/Dashboard.styles';

// --- TIME CONVERSION HELPERS ---
const to12h = (time24) => {
  if (!time24) return { h: '09', m: '00', period: 'AM' };
  let [h, m] = time24.split(':');
  const period = parseInt(h) >= 12 ? 'PM' : 'AM';
  h = (parseInt(h) % 12) || 12;
  return { h: h.toString().padStart(2, '0'), m, period };
};

const to24h = (h, m, period) => {
  let hour = parseInt(h || '0');
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${m || '00'}`;
};

const TimeField = ({ value, onChange }) => {
  const { h, m, period } = to12h(value);
  
  // Local state to allow empty strings while typing
  const [localH, setLocalH] = useState(h);
  const [localM, setLocalM] = useState(m);

  // Keep local state in sync with external value
  useEffect(() => {
    setLocalH(h);
    setLocalM(m);
  }, [h, m]);

  const handleInputChange = (type, val) => {
    const cleanVal = val.replace(/\D/g, '').slice(0, 2);
    
    if (type === 'h') {
      setLocalH(cleanVal);
      if (cleanVal !== '' && parseInt(cleanVal) <= 12) {
        onChange(to24h(cleanVal, localM, period));
      }
    } else {
      setLocalM(cleanVal);
      if (cleanVal !== '' && parseInt(cleanVal) <= 59) {
        onChange(to24h(localH, cleanVal, period));
      }
    }
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    onChange(to24h(localH, localM, newPeriod));
  };

  return (
    <S.TimeInputWrapper>
      <InputBase 
        value={localH} 
        onChange={(e) => handleInputChange('h', e.target.value)}
        onBlur={() => !localH && setLocalH('12')} // Fallback only on blur
        inputProps={{ 
          style: { padding: 0, textAlign: 'center', width: '22px' },
          maxLength: 2 
        }}
        sx={{ fontSize: '14px', fontWeight: 600 }} 
      />
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#acaba9', mx: 0.1 }}>:</Typography>
      <InputBase 
        value={localM} 
        onChange={(e) => handleInputChange('m', e.target.value)}
        onBlur={() => !localM && setLocalM('00')} // Fallback only on blur
        inputProps={{ 
          style: { padding: 0, textAlign: 'center', width: '22px' },
          maxLength: 2 
        }}
        sx={{ fontSize: '14px', fontWeight: 600 }} 
      />
      <Stack direction="row" spacing={0.2} sx={{ ml: 1, borderLeft: '1px solid #ededed', pl: 1 }}>
        <S.ToggleButton $active={period === 'AM'} onClick={togglePeriod}>AM</S.ToggleButton>
        <S.ToggleButton $active={period === 'PM'} onClick={togglePeriod}>PM</S.ToggleButton>
      </Stack>
    </S.TimeInputWrapper>
  );
};

function LocationDetail({ wash, onBack }) {
  const { washId } = useParams();
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/ops/${washId}/hours`);
        if (res.data) setHours(res.data);
      } catch (err) { console.error("Fetch Error:", err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [washId]);

  const handleHourChange = (index, field, value) => {
    const updated = [...hours];
    updated[index][field] = value;
    setHours(updated);
  };

  const saveToDb = async () => {
    try {
      await axios.post(`http://localhost:5001/api/ops/${washId}/hours`, { hours });
      alert("Changes Saved Successfully!");
    } catch (err) { console.error("Save Error:", err); }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress size={40} sx={{ color: '#ededed' }} />
    </Box>
  );

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ border: '1px solid #ededed' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#37352f' }}>{wash?.name}</Typography>
          <Typography variant="body2" sx={{ color: '#73726e' }}>Operations & Schedule Management</Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
           <S.ActionButton variant="outlined" startIcon={<SaveIcon />} onClick={saveToDb}>Save Changes</S.ActionButton>
           <S.ActionButton variant="contained">Manage Twilio</S.ActionButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 4 }}>
        <S.QuadrantBox>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '16px' }}>Business Hours</Typography>
          
          <S.ScheduleHeaderRow>
            <Typography sx={{ width: '100px', fontSize: '11px', fontWeight: 800, color: '#acaba9' }}>DAY</Typography>
            <Typography sx={{ width: '60px', fontSize: '11px', fontWeight: 800, color: '#acaba9' }}>STATUS</Typography>
            <Typography sx={{ ml: 4, fontSize: '11px', fontWeight: 800, color: '#acaba9' }}>OPERATING HOURS</Typography>
          </S.ScheduleHeaderRow>

          <Stack spacing={0}>
            {hours.map((item, index) => (
              <Box key={item.day_of_week} sx={{ 
                display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f1f1f1',
                opacity: item.is_closed ? 0.4 : 1 
              }}>
                <Typography sx={{ width: '100px', fontWeight: 600, fontSize: '14px' }}>{item.day_of_week}</Typography>
                <Box sx={{ width: '60px' }}>
                  <Switch 
                    size="small" 
                    checked={!item.is_closed} 
                    onChange={(e) => handleHourChange(index, 'is_closed', !e.target.checked)} 
                  />
                </Box>
                <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  {!item.is_closed ? (
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TimeField value={item.open_time} onChange={(val) => handleHourChange(index, 'open_time', val)} />
                      <Typography sx={{ color: '#acaba9', fontWeight: 700, fontSize: '11px' }}>TO</Typography>
                      <TimeField value={item.close_time} onChange={(val) => handleHourChange(index, 'close_time', val)} />
                    </Stack>
                  ) : (
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#73726e' }}>CLOSED</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>

        <S.QuadrantBox sx={{ bgcolor: '#fbfbfa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
          <Typography sx={{ color: '#acaba9' }}>Service Catalog Configuration</Typography>
        </S.QuadrantBox>
      </Box>
    </Box>
  );
}

export default LocationDetail;