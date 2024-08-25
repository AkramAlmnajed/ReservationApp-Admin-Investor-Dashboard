import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import ClippedDrawer from './Drawer';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EEF0FF' }}>
            <CssBaseline />
            <ClippedDrawer />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
