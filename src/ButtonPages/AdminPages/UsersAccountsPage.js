import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';
import axios from 'axios';
import UserCard from '../../DesignComp/UserCards';
import { getToken } from '../../LoginForm/auth';

const UserAccountPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [chargeAmount, setChargeAmount] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data && response.data.model) {
                    setUsers(response.data.model);
                } else {
                    console.error('Data format is not as expected:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchUsersData();
    }, []);

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setChargeAmount('');
    };

    const handleChargeBalance = async () => {
        if (!selectedUser) return;

        try {
            const token = getToken();
            const response = await axios.put(
                `http://127.0.0.1:8000/api/users/chargeBalance/${selectedUser.id}?amount=${chargeAmount}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data && response.data.status === 'Success') {
                setUsers(users.map(user => 
                    user.id === selectedUser.id ? { ...user, balance: response.data.new_balance } : user
                ));
                setNotification({ open: true, message: 'Balance updated successfully', severity: 'success' });
            } else {
                setNotification({ open: true, message: 'Failed to update balance', severity: 'error' });
            }
        } catch (error) {
            console.error('Error updating balance:', error);
            setNotification({ open: true, message: 'Failed to update balance', severity: 'error' });
        }

        handleCloseDialog();
    };

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
                <Typography variant="h4" component="h1" gutterBottom>
                    User Accounts
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    users.length > 0 ? (
                        users.map(user => (
                            <UserCard key={user.id} user={user} onChargeClick={() => handleOpenDialog(user)} />
                        ))
                    ) : (
                        <Typography variant="h6" color="textSecondary">
                            No users found.
                        </Typography>
                    )
                )}
                <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Charge Balance for {selectedUser?.name}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Enter amount"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={chargeAmount}
                            onChange={(e) => setChargeAmount(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleChargeBalance}>Charge</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={() => setNotification({ ...notification, open: false })}
                >
                    <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </MainLayout>
    );
};

export default UserAccountPage;
