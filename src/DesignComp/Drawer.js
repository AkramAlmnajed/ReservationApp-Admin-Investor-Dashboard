import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { removeToken } from '../LoginForm/auth'; 
import { getToken } from '../LoginForm/auth';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GroupIcon from '@mui/icons-material/Group';
import FeedIcon from '@mui/icons-material/Feed';

const drawerWidth = 240;

export default function ClippedDrawer() {
  const navigate = useNavigate();



  const handleLogout = () => {
    const token2 = getToken();
    console.log('before remove token');
    console.log(token2);

    removeToken();
    const token1 = getToken();
    console.log('after remove token');
    console.log(token1);

    navigate('/login'); 
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#093B80' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor:'#D1D6DC',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', backgroundColor:'#D1D6DC' }}>
          <List>
            {[
              { text: 'Browse Request', icon: <PersonAddIcon />, path: '/browse-request' },
              { text: 'Investors Accounts', icon: <GroupIcon />, path: '/investors-accounts' },
              { text: 'Users Accounts', icon: <GroupIcon />, path: '/users-accounts' }, 
              { text: 'Browse Ads', icon: <FeedIcon />, path: '/browse-ads' },
              { text: 'Users Feedback', icon: <FeedbackIcon />, path: '/users-feedback' },
            ].map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
