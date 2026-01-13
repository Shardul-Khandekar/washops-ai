import { styled } from '@mui/material/styles';
import { AppBar, Button, Box } from '@mui/material';

// Notion style border and Google style elevation
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ededed',
    color: '#37352f',
    boxShadow: 'none',
    padding: '0 32px',
    height: '60px',
    justifyContent: 'center',
    zIndex: theme.zIndex.drawer + 1,
}));

export const NavButton = styled(Button)(({ variant }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  borderRadius: '6px',
  padding: '6px 12px',
  color: variant === 'contained' ? '#ffffff' : '#37352f',
  backgroundColor: variant === 'contained' ? '#2383e2' : 'transparent',
  '&:hover': {
    backgroundColor: variant === 'contained' ? '#0070df' : '#f1f1f1',
    boxShadow: 'none',
  },
}));

export const LogoText = styled('div')({
  fontSize: '18px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  color: '#37352f',
  '&:hover': { opacity: 0.8 },
});