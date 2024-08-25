import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Snackbar, Alert, Box, Card, CardContent } from '@mui/material';
import { getToken } from '../../LoginForm/auth';
import EventIcon from '@mui/icons-material/Event';

const ShowPlaceReservation = ({ placeId }) => {
    const [open, setOpen] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickOpen = async () => {
        try {
            const token = getToken();
            const response = await axios.get(`http://127.0.0.1:8000/api/reservations/placeReservation?id=${placeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'Success') {
                setReservations(response.data.model || []);
                setOpen(true);
            } else {
                throw new Error('Failed to fetch reservations');
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setSnackbarMessage('Failed to load reservations. Please try again later.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                Show Reservations
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 5,  
                    },
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#3f51b5', color: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                    Reservations
                </DialogTitle>
                <DialogContent dividers 
                sx={{ 
                    borderBottomLeftRadius: 5, 
                    borderBottomRightRadius: 5 
                }}>
                    {reservations.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 5 }}>
                            {reservations.map((reservation, index) => (
                                <Card 
                                    key={index} 
                                    sx={{ 
                                        backgroundColor: '#f5f5f5', 
                                        borderRadius: 5,  
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)'  
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <EventIcon color="primary" />
                                            <Typography variant="subtitle1">
                                                {reservation.place[0]?.name || 'Unknown Place'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            User: {reservation.user[0]?.name || 'Unknown User'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Type: {reservation.type[0]?.name || 'Unknown Type'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Date: {reservation.date_and_time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Day: {reservation.day}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Start Time: {reservation.start_time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            End Time: {reservation.end_time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Total Price: {reservation.total_price} SYP
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No reservations available</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ShowPlaceReservation;
