import { styled } from '@mui/material/styles';
import { Box, Button, List, ListItemButton } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '240px',
  height: '100vh',
  backgroundColor: '#fbfbfa', // Notion's sidebar background
  borderRight: '1px solid #ededed',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 100,
}));

export const SidebarHeader = styled(Box)({
  padding: '24px 16px 12px 16px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  color: '#37352f',
});

// Google-style Floating Action Button for key dashboard actions
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

export const NavItem = styled(ListItemButton)(({ active }) => ({
  borderRadius: '6px',
  margin: '2px 8px',
  padding: '6px 12px',
  color: active ? '#37352f' : '#73726e',
  backgroundColor: active ? '#efefef' : 'transparent',
  '&:hover': {
    backgroundColor: '#efefef',
  },
  '& .MuiTypography-root': {
    fontSize: '14px',
    fontWeight: active ? 600 : 500,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '32px',
    color: active ? '#37352f' : '#73726e',
  },
}));