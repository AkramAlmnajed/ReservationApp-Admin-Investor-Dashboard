import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import NewDrawerInv from './NewDrawerInv'; 

const MainLayoutInv = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EEF0FF' }}>
            <CssBaseline />
            <NewDrawerInv />  
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

export default MainLayoutInv;
