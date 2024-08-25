import React from 'react';
import MainLayoutInv from '../../DesignComp/MainLayoutInv';
import { Paper } from '@mui/material';

const InvestorHomePage = () => {
    return (
        <MainLayoutInv>
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
                <h1>Welcome Back Investor!</h1>
            </Paper>        </MainLayoutInv>
    );
};

export default InvestorHomePage;
