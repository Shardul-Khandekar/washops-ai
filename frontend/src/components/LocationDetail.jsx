import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, IconButton, Stack, Switch, 
  Divider, CircularProgress, InputBase, TextField, InputAdornment, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import * as S from '../styles/Dashboard.styles';

// --- TIME HELPERS ---
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
  const [localH, setLocalH] = useState(h);
  const [localM, setLocalM] = useState(m);

  useEffect(() => { setLocalH(h); setLocalM(m); }, [h, m]);

  const handleInputChange = (type, val) => {
    const cleanVal = val.replace(/\D/g, '').slice(0, 2);
    if (type === 'h') {
      setLocalH(cleanVal);
      if (cleanVal !== '' && parseInt(cleanVal) <= 12) onChange(to24h(cleanVal, localM, period));
    } else {
      setLocalM(cleanVal);
      if (cleanVal !== '' && parseInt(cleanVal) <= 59) onChange(to24h(localH, cleanVal, period));
    }
  };

  const togglePeriod = () => onChange(to24h(localH, localM, period === 'AM' ? 'PM' : 'AM'));

  return (
    <S.TimeInputWrapper>
      <InputBase value={localH} onChange={(e) => handleInputChange('h', e.target.value)} onBlur={() => !localH && setLocalH('12')} inputProps={{ style: { padding: 0, textAlign: 'center', width: '20px' }, maxLength: 2 }} sx={{ fontSize: '13px', fontWeight: 600 }} />
      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#acaba9', mx: 0.1 }}>:</Typography>
      <InputBase value={localM} onChange={(e) => handleInputChange('m', e.target.value)} onBlur={() => !localM && setLocalM('00')} inputProps={{ style: { padding: 0, textAlign: 'center', width: '20px' }, maxLength: 2 }} sx={{ fontSize: '13px', fontWeight: 600 }} />
      <Stack direction="row" spacing={0.1} sx={{ ml: 0.5, borderLeft: '1px solid #ededed', pl: 0.5 }}>
        <S.ToggleButton $active={period === 'AM'} onClick={togglePeriod}>AM</S.ToggleButton>
        <S.ToggleButton $active={period === 'PM'} onClick={togglePeriod}>PM</S.ToggleButton>
      </Stack>
    </S.TimeInputWrapper>
  );
};

// --- MAIN COMPONENT ---
function LocationDetail({ wash, onBack }) {
  const { washId } = useParams();
  const [hours, setHours] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hoursRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/ops/${washId}/hours`),
          axios.get(`http://localhost:5001/api/ops/${washId}/services`)
        ]);
        if (hoursRes.data) setHours(hoursRes.data);
        if (servicesRes.data) setServices(servicesRes.data);
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

  const handleServiceUpdate = (id, field, value) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddService = () => {
    const newService = { id: `temp-${Date.now()}`, name: '', price: '0.00', is_active: 1 };
    setServices([...services, newService]);
  };

  const saveAll = async () => {
    try {
      await Promise.all([
        axios.post(`http://localhost:5001/api/ops/${washId}/hours`, { hours }),
        axios.post(`http://localhost:5001/api/ops/${washId}/services`, { services })
      ]);
      alert("All configurations synced successfully!");
    } catch (err) { console.error("Save Error:", err); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ border: '1px solid #ededed' }}><ArrowBackIcon fontSize="small" /></IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#37352f' }}>{wash?.name}</Typography>
          <Typography variant="body2" sx={{ color: '#73726e' }}>Operations & Service Management</Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
           <S.ActionButton variant="contained" startIcon={<SaveIcon />} onClick={saveAll}>Save All Changes</S.ActionButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* LEFT COLUMN: BUSINESS HOURS */}
        <S.QuadrantBox>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '15px' }}>Business Hours</Typography>
          <S.ScheduleHeaderRow>
            <Typography sx={{ width: '80px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>DAY</Typography>
            <Typography sx={{ width: '50px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>STATUS</Typography>
            <Typography sx={{ ml: 2, fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>OPERATING HOURS</Typography>
          </S.ScheduleHeaderRow>
          <Stack spacing={0}>
            {hours.map((item, index) => (
              <Box key={item.day_of_week} sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f1f1f1', opacity: item.is_closed ? 0.4 : 1 }}>
                <Typography sx={{ width: '80px', fontWeight: 600, fontSize: '13px' }}>{item.day_of_week}</Typography>
                <Box sx={{ width: '50px' }}><Switch size="small" checked={!item.is_closed} onChange={(e) => handleHourChange(index, 'is_closed', !e.target.checked ? 1 : 0)} /></Box>
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  {!item.is_closed ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimeField value={item.open_time} onChange={(val) => handleHourChange(index, 'open_time', val)} />
                      <Typography sx={{ color: '#acaba9', fontWeight: 700, fontSize: '10px' }}>TO</Typography>
                      <TimeField value={item.close_time} onChange={(val) => handleHourChange(index, 'close_time', val)} />
                    </Stack>
                  ) : <Typography variant="caption" sx={{ fontWeight: 700, color: '#73726e' }}>CLOSED</Typography>}
                </Box>
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>

        {/* RIGHT COLUMN: SERVICE CATALOG */}
        <S.QuadrantBox>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px' }}>Service Catalog</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddService} sx={{ color: '#2383e2', fontWeight: 700, fontSize: '11px' }}>Add Service</Button>
          </Box>
          <S.ScheduleHeaderRow>
            <Typography sx={{ flex: 1, fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>PACKAGE NAME</Typography>
            <Typography sx={{ width: '70px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>PRICE</Typography>
            <Typography sx={{ width: '40px', fontSize: '10px', fontWeight: 800, color: '#acaba9', textAlign: 'center' }}>ACT.</Typography>
          </S.ScheduleHeaderRow>
          <Stack spacing={0.5}>
            {services.map((service) => (
              <Box key={service.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, borderBottom: '1px solid #f1f1f1' }}>
                <InputBase fullWidth value={service.name} onChange={(e) => handleServiceUpdate(service.id, 'name', e.target.value)} placeholder="Service Name" sx={{ fontSize: '13px', fontWeight: 500 }} />
                <InputBase value={service.price} onChange={(e) => handleServiceUpdate(service.id, 'price', e.target.value)} startAdornment={<Typography sx={{ fontSize: '13px', mr: 0.5 }}>$</Typography>} sx={{ width: '70px', fontSize: '13px', fontWeight: 600 }} />
                <Switch size="small" checked={!!service.is_active} onChange={(e) => handleServiceUpdate(service.id, 'is_active', e.target.checked ? 1 : 0)} />
                <IconButton size="small" onClick={() => setServices(services.filter(s => s.id !== service.id))}><DeleteOutlineIcon sx={{ fontSize: '18px', color: '#ff4d4d' }} /></IconButton>
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>
      </Box>
    </Box>
  );
}

export default LocationDetail;