import React from 'react';
import { Paper } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';

const HomePage = () => {
    return (
        <MainLayout>
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'center',
                    mt: 4,
                    width: '80%',
                    maxWidth: 1000,
                    borderRadius: 8,
                    boxShadow: 6
                }}
            >   
                <h1>Welcome Back Admin!</h1>
            </Paper>
        </MainLayout>
    );
};

export default HomePage;
