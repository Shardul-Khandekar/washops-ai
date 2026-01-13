import { styled } from '@mui/material/styles';
import { Box, TextField, Typography, Button } from '@mui/material';

// Background dimming overlay
export const Overlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(15, 15, 15, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1300,
});

// Sign Up box
export const AuthContainer = styled(Box)({
  backgroundColor: '#ffffff',
  width: '100%',
  maxWidth: '400px',
  borderRadius: '8px',
  padding: '40px',
  boxShadow: '0 15px 50px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.05)',
  border: '1px solid #ededed',
  position: 'relative',
});

// Minimalist textfields
export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f7f7f5',
    borderRadius: '6px',
    '& fieldset': { borderColor: '#e8e8e7' },
    '&:hover fieldset': { borderColor: '#d3d3d2' },
    '&.Mui-focused fieldset': { borderColor: '#2383e2', borderWidth: '1px' },
  },
  '& input': { padding: '12px 14px', fontSize: '14px' },
  marginBottom: '16px',
});

export const Header = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: '#37352f',
  marginBottom: '8px',
});

export const SubHeader = styled(Typography)({
  fontSize: '14px',
  color: '#73726e',
  marginBottom: '24px',
});

export const PrimaryButton = styled(Button)({
  backgroundColor: '#2383e2',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px',
  borderRadius: '6px',
  boxShadow: 'none',
  '&:hover': { backgroundColor: '#0070df', boxShadow: 'none' },
});