import React, { useEffect, useState } from 'react';
import MainLayoutInv from '../../DesignComp/MainLayoutInv';
import { Paper, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import CardsInv from '../../DesignComp/CardsInv';
import axios from 'axios';

const MyAccount = () => {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status === 'Success') {
                    setAccountData(response.data.model);
                } else {
                    setError('Unexpected API response.');
                }
            } catch (error) {
                setError('Failed to load account data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, []);

    const handleEditPassword = async (password) => {
        if (password.length < 6) {
            setSnackbarMessage('Password must be at least 6 characters long.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://127.0.0.1:8000/api/auth/update-profile?password=${password}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'Success') {
                setSnackbarMessage('Password updated successfully.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage('Error updating password.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error updating password. Please try again later.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
                <Typography variant="h4" component="h2">My Account</Typography>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    accountData ? (
                        <CardsInv
                            data={accountData}
                            isInvestorInfo={true}
                            onEdit={handleEditPassword} 
                        />
                    ) : (
                        <Typography>No data available</Typography>
                    )
                )}
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </MainLayoutInv>
    );
};

export default MyAccount;
