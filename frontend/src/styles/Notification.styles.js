import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ToastContainer = styled(Box)(({ visible }) => ({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)',
  opacity: visible ? 1 : 0,
  backgroundColor: '#2f3437', // Notion's dark utility color
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth pop-up effect
  zIndex: 2000,
}));

export const SuccessDot = styled('div')({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#0fba5f', // Google/Notion Success Green
});