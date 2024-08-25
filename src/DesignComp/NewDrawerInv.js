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

import AdUnitsIcon from '@mui/icons-material/AdUnits'; 
import FeedbackIcon from '@mui/icons-material/Feedback'; 
import PlaceIcon from '@mui/icons-material/Place'; 
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 240;

export default function NewDrawerInv() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login'); 
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor:'#093B80' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        Investor Dashboard
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
                        { text: 'Browse My Ads', icon: <AdUnitsIcon />, path: '/investor/browse-my-ads' },
                        { text: 'My Feedbacks', icon: <FeedbackIcon />, path: '/investor/my-feedbacks' },
                        { text: 'My Places', icon: <PlaceIcon />, path: '/investor/my-places' },
                        { text: 'My Account', icon: <PersonIcon />, path: '/investor/my-account' },
                        
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
