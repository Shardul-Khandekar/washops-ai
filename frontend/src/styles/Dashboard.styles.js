import { styled } from '@mui/material/styles';
import { Box, Button, ListItemButton, Paper, Typography, TextField } from '@mui/material';

export const SidebarContainer = styled(Box)({
  width: '240px',
  height: '100vh',
  backgroundColor: '#fbfbfa',
  borderRight: '1px solid #ededed',
  display: 'flex',            // Enable Flexbox for vertical alignment
  flexDirection: 'column',   // Stack children vertically
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 100,
});

// Spacer to push the logout button to the bottom
export const SidebarSpacer = styled(Box)({
  flexGrow: 1, 
});

export const SidebarHeader = styled(Box)({
  padding: '24px 16px 12px 16px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  color: '#37352f',
});

export const CreateButton = styled(Button)({
  margin: '12px 16px',
  textTransform: 'none',
  justifyContent: 'flex-start',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#37352f',
  border: '1px solid #ededed',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: '#f1f1f1',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
});

export const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== '$active',
})(({ $active }) => ({
  borderRadius: '6px',
  margin: '2px 8px',
  padding: '6px 12px',
  color: $active ? '#37352f' : '#73726e',
  backgroundColor: $active ? '#efefef' : 'transparent',
  '&:hover': { backgroundColor: '#efefef' },
  '& .MuiTypography-root': {
    fontSize: '14px',
    fontWeight: $active ? 600 : 500,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '32px',
    color: $active ? '#37352f' : '#73726e',
  },
}));

export const DashboardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  gap: '24px',
  flexGrow: 1,
  width: '100%',
});

export const QuadrantBox = styled(Paper)({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #ededed',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'none',
  overflow: 'hidden',
  height: '100%',
});

export const LocationRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': { backgroundColor: '#f7f7f5' },
  borderBottom: '1px solid #f1f1f1',
});

export const StatusDot = styled('div', {
  shouldForwardProp: (prop) => prop !== '$active',
})(({ $active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: $active ? '#0fba5f' : '#f5d663',
  marginRight: '12px',
}));

export const TimeInputWrapper = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: '#fbfbfa',
  border: '1px solid #ededed',
  borderRadius: '6px',
  padding: '2px 6px',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    borderColor: '#2383e2',
    boxShadow: '0 0 0 2px rgba(35, 131, 226, 0.1)',
  },
});

export const ToggleButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$active',
})(({ $active }) => ({
  fontSize: '11px',
  fontWeight: 700,
  padding: '4px 6px',
  borderRadius: '4px',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: $active ? '#2383e2' : 'transparent',
  color: $active ? '#ffffff' : '#acaba9',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: $active ? '#2383e2' : '#f1f1f1',
  },
}));

export const ScheduleHeaderRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px 12px 8px',
  borderBottom: '2px solid #f1f1f1',
  marginBottom: '8px',
});

export const DrawerContent = styled(Box)({
  width: '400px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  height: '100%',
});

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fbfbfa',
    '& fieldset': { border: '1px solid #ededed' },
  },
});

export const ActionButton = styled(Button)(({ variant }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: 600,
  boxShadow: 'none',
  backgroundColor: variant === 'contained' ? '#2383e2' : 'transparent',
  color: variant === 'contained' ? '#ffffff' : '#37352f',
  border: variant === 'outlined' ? '1px solid #ededed' : 'none',
  '&:hover': {
    backgroundColor: variant === 'contained' ? '#1a6dc3' : '#f1f1f1',
  },
}));

export const LogoutButton = styled(ListItemButton)({
  marginBottom: '24px', // Space from bottom
  borderRadius: '6px',
  margin: '2px 8px',
  padding: '6px 12px',
  color: '#ff4d4d',
  '&:hover': {
    backgroundColor: 'rgba(255, 77, 77, 0.05)',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
    fontWeight: 500,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '32px',
    color: '#ff4d4d',
  },
});