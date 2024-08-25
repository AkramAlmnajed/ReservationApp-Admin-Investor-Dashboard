import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Typography } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';
import BasicCard from '../../DesignComp/Cards';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';

const InvestorsAccountsPage = () => {
    const [cardsData, setCardsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        user_name: ''
    });
    const [editUser, setEditUser] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [chargeAmount, setChargeAmount] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleOpenDialog = (id) => {
        setSelectedUserId(id);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setChargeAmount('');
    };

    const handleConfirmCharge = () => {
        handleChargeBalance(selectedUserId, chargeAmount);
        handleCloseDialog();
    };

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/users/investor', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data && response.data.model) {
                    setCardsData(response.data.model);
                } else {
                    console.error('Data format is not as expected:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        fetchCardsData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = getToken();
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCardsData(cardsData.filter(card => card.id !== id));
            setNotification({ open: true, message: 'User deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Error deleting user:', error);
            setNotification({ open: true, message: 'Failed to delete user', severity: 'error' });
        }
    };

    const handleEdit = (id) => {
        const userToEdit = cardsData.find(card => card.id === id);
        setEditUser(userToEdit);
        setCurrentUserId(id);
        setOpenEdit(true);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenEdit(false);
    };

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async () => {
        try {
            const token = getToken();
            const response = await axios.post('http://127.0.0.1:8000/api/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && response.data.status === 'Success') {
                setCardsData([...cardsData, response.data.model]);
                setNewUser({ name: '', email: '', password: '', user_name: '' });
                handleClose();
                setNotification({ open: true, message: 'User created successfully', severity: 'success' });
            } else {
                console.error('Error creating user:', response.data);
                setNotification({ open: true, message: 'Failed to create user', severity: 'error' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setNotification({ open: true, message: 'Failed to create user', severity: 'error' });
        }
    };

    const handleUpdateUser = async () => {
        try {
            const token = getToken();
            const updatedFields = Object.keys(editUser).reduce((result, key) => {
                if (editUser[key] !== cardsData.find(user => user.id === currentUserId)[key]) {
                    result[key] = editUser[key];
                }
                return result;
            }, {});
            
            if (Object.keys(updatedFields).length === 0) {
                setNotification({ open: true, message: 'No changes made', severity: 'info' });
                handleClose();
                return;
            }

            const response = await axios.put(`http://127.0.0.1:8000/api/users/${currentUserId}`, updatedFields, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.status === 'Success') {
                setCardsData(cardsData.map(card => card.id === currentUserId ? response.data.model : card));
                handleClose();
                setNotification({ open: true, message: 'User updated successfully', severity: 'success' });
            } else {
                console.error('Error updating user:', response.data);
                setNotification({ open: true, message: 'Failed to update user', severity: 'error' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setNotification({ open: true, message: 'Failed to update user', severity: 'error' });
        }
    };

    const handleChargeBalance = async (id, amount) => {
        try {
            const token = getToken();
            const response = await axios.put(`http://127.0.0.1:8000/api/users/chargeBalance/${id}?amount=${amount}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('API Response:', response.data);


            if (response.data && response.data.status === 'Success') {
                setCardsData(cardsData.map(card => card.id === id ? { ...card, balance: response.data.new_balance } : card));
                setNotification({ open: true, message: 'Balance updated successfully', severity: 'success' });
            } else {
                console.error('Error updating balance:', response.data);
                setNotification({ open: true, message: 'Failed to update balance', severity: 'error' });
            }
        } catch (error) {
            console.error('Error updating balance:', error);
            setNotification({ open: true, message: 'Failed to update balance', severity: 'error' });
        }
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
                <h1>Investors Accounts Page</h1>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Create New Account
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={newUser.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={newUser.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={newUser.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="user_name"
                            label="Username"
                            type="text"
                            fullWidth
                            value={newUser.user_name}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateUser} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openEdit} onClose={handleClose}>
                    <DialogTitle>Edit Account</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={editUser.name || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={editUser.email || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={editUser.password || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            name="user_name"
                            label="Username"
                            type="text"
                            fullWidth
                            value={editUser.user_name || ''}
                            onChange={handleEditChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
                {isLoading ? (
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                ) : (
                    cardsData.length > 0 ? (
                        cardsData.map((card, index) => (
                            <BasicCard
                                key={index}
                                data={card}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                onChargeBalance={handleOpenDialog} />
                        ))
                    ) : (
                        <Typography>No data available</Typography>
                    )
                )}
                <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Charge Balance for Investor</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
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
                    <Button onClick={handleConfirmCharge}>Charge</Button>
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

export default InvestorsAccountsPage;
