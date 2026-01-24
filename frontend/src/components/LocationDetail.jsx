import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, IconButton, Stack, Switch, Divider, 
  CircularProgress, InputBase, TextField, Collapse, Button,
  Snackbar, Alert // Fixed: Added imports here
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import * as S from '../styles/Dashboard.styles';

// --- HELPERS ---
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

// --- COMPONENTS ---
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

  return (
    <S.TimeInputWrapper>
      <InputBase value={localH} onChange={(e) => handleInputChange('h', e.target.value)} onBlur={() => !localH && setLocalH('12')} inputProps={{ style: { padding: 0, textAlign: 'center', width: '20px' }, maxLength: 2 }} sx={{ fontSize: '13px', fontWeight: 600 }} />
      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#acaba9', mx: 0.1 }}>:</Typography>
      <InputBase value={localM} onChange={(e) => handleInputChange('m', e.target.value)} onBlur={() => !localM && setLocalM('00')} inputProps={{ style: { padding: 0, textAlign: 'center', width: '20px' }, maxLength: 2 }} sx={{ fontSize: '13px', fontWeight: 600 }} />
      <Stack direction="row" spacing={0.1} sx={{ ml: 0.5, borderLeft: '1px solid #ededed', pl: 0.5 }}>
        <S.ToggleButton $active={period === 'AM'} onClick={() => onChange(to24h(localH, localM, 'AM'))}>AM</S.ToggleButton>
        <S.ToggleButton $active={period === 'PM'} onClick={() => onChange(to24h(localH, localM, 'PM'))}>PM</S.ToggleButton>
      </Stack>
    </S.TimeInputWrapper>
  );
};

function LocationDetail({ wash, onBack }) {
  const { washId } = useParams();
  const [hours, setHours] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const [toast, setToast] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const handleCloseToast = () => setToast({ ...toast, open: false });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/ops/${washId}/hours`),
          axios.get(`http://localhost:5001/api/ops/${washId}/services`)
        ]);
        setHours(hRes.data || []);
        setServices(sRes.data || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [washId]);

  const saveAll = async () => {
    try {
      await Promise.all([
        axios.post(`http://localhost:5001/api/ops/${washId}/hours`, { hours }),
        axios.post(`http://localhost:5001/api/ops/${washId}/services`, { services })
      ]);

      await axios.post(`http://localhost:5001/api/ops/${washId}/sync-ai`, { 
        owner_email: user.email 
      });

      setToast({ 
        open: true, 
        message: 'AI Knowledge Synchronized Successfully!', 
        severity: 'success' 
      });
    } catch (err) { 
      console.error(err);
      setToast({ 
        open: true, 
        message: 'Failed to synchronize AI knowledge.', 
        severity: 'error' 
      });
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress size={40} sx={{ color: '#ededed' }} />
    </Box>
  );

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ border: '1px solid #ededed' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#37352f' }}>
            {wash?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#73726e' }}>
            Operations & Service Management
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <S.ActionButton 
            variant="contained" 
            startIcon={<SaveIcon />} 
            onClick={saveAll}
          >
            Save All Changes
          </S.ActionButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: '8px', fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <S.QuadrantBox>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '15px' }}>
            Business Hours
          </Typography>
          <S.ScheduleHeaderRow>
            <Typography sx={{ width: '80px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>DAY</Typography>
            <Typography sx={{ width: '50px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>STATUS</Typography>
            <Typography sx={{ ml: 2, fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>OPERATING HOURS</Typography>
          </S.ScheduleHeaderRow>
          <Stack spacing={0}>
            {hours.map((item, index) => (
              <Box key={item.day_of_week} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1.5, 
                borderBottom: '1px solid #f1f1f1', 
                opacity: item.is_closed ? 0.4 : 1 
              }}>
                <Typography sx={{ width: '80px', fontWeight: 600, fontSize: '13px' }}>
                  {item.day_of_week}
                </Typography>
                <Box sx={{ width: '50px' }}>
                  <Switch 
                    size="small" 
                    checked={!item.is_closed} 
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[index].is_closed = e.target.checked ? 0 : 1;
                      setHours(updated);
                    }} 
                  />
                </Box>
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  {!item.is_closed ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimeField 
                        value={item.open_time} 
                        onChange={(v) => { const u = [...hours]; u[index].open_time = v; setHours(u); }} 
                      />
                      <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>TO</Typography>
                      <TimeField 
                        value={item.close_time} 
                        onChange={(v) => { const u = [...hours]; u[index].close_time = v; setHours(u); }} 
                      />
                    </Stack>
                  ) : (
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#73726e' }}>
                      CLOSED
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>

        <S.QuadrantBox>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '15px' }}>
              Service Catalog
            </Typography>
            <Button 
              size="small" 
              startIcon={<AddIcon />} 
              onClick={() => setServices([...services, { id: Date.now(), name: '', price: '0.00', description: '', expanded: false }])}
              sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'none' }}
            >
              Add Service
            </Button>
          </Box>
          <S.ScheduleHeaderRow>
            <Typography sx={{ flex: 1, fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>PACKAGE NAME</Typography>
            <Typography sx={{ width: '70px', fontSize: '10px', fontWeight: 800, color: '#acaba9' }}>PRICE</Typography>
            <Typography sx={{ width: '70px', fontSize: '10px', fontWeight: 800, color: '#acaba9', textAlign: 'center' }}>ACTIONS</Typography>
          </S.ScheduleHeaderRow>
          <Stack spacing={0.5}>
            {services.map((s, i) => (
              <Box key={s.id} sx={{ borderBottom: '1px solid #f1f1f1', py: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <InputBase 
                    fullWidth 
                    value={s.name} 
                    onChange={(e) => { const u = [...services]; u[i].name = e.target.value; setServices(u); }} 
                    placeholder="e.g. Deluxe Wash" 
                    sx={{ fontSize: '13px', fontWeight: 600, color: '#37352f' }} 
                  />
                  <InputBase 
                    value={s.price} 
                    onChange={(e) => { const u = [...services]; u[i].price = e.target.value; setServices(u); }} 
                    startAdornment={<Typography sx={{ fontSize: '12px', mr: 0.5, fontWeight: 700 }}>$</Typography>} 
                    sx={{ width: '60px', fontSize: '13px', fontWeight: 600 }} 
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => { const u = [...services]; u[i].expanded = !u[i].expanded; setServices(u); }}
                  >
                    <SmartToyIcon sx={{ fontSize: '18px', color: s.description ? '#2383e2' : '#ccc' }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => setServices(services.filter(item => item.id !== s.id))}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: '18px', color: '#ff4d4d' }} />
                  </IconButton>
                </Stack>
                <Collapse in={s.expanded}>
                  <Box sx={{ mt: 1, p: 1, bgcolor: '#fbfbfa', borderRadius: '6px', border: '1px dashed #ededed' }}>
                    <TextField 
                      fullWidth 
                      multiline 
                      rows={2} 
                      placeholder="Describe this service for the AI receptionist (e.g., 'Includes rim cleaning and hand drying')..." 
                      value={s.description || ''} 
                      onChange={(e) => { const u = [...services]; u[i].description = e.target.value; setServices(u); }} 
                      variant="standard"
                      InputProps={{ 
                        disableUnderline: true, 
                        sx: { fontSize: '12px', color: '#73726e' } 
                      }} 
                    />
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Stack>
        </S.QuadrantBox>
      </Box>
    </Box>
  );
}

export default LocationDetail;