import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { getToken } from '../../LoginForm/auth';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const UpdatePlace = ({ place }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(place.name || '');
    const [pricePerHour, setPricePerHour] = useState(place.price_per_hour || '');
    const [maximumCapacity, setMaximumCapacity] = useState(place.maximum_capacity || '');
    const [availableTimes, setAvailableTimes] = useState(place.available_times || []);
    const [extensions, setExtensions] = useState(place.extensions || []);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = async () => {
        try {
            const token = getToken();

            const updatedAvailableTimes = availableTimes.map(time => ({
                day: time.day,
                from_time: time.from_time.substring(0, 5),
                to_time: time.to_time.substring(0, 5),
                is_Active: time.is_Active ? 1 : 0,
            }));

            const updatedExtensions = extensions.map(extension => ({
                name: extension.name,
                description: extension.description,
                price: extension.price,
            }));

            const url = `http://127.0.0.1:8000/api/places/${place.id}`;

            const response = await axios.post(url, {
                name,
                price_per_hour: pricePerHour,
                maximum_capacity: maximumCapacity,
                available_times: updatedAvailableTimes,
                extensions: updatedExtensions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setSnackbarMessage('Place updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setOpen(false);
            } else {
                throw new Error('Failed to update place');
            }
        } catch (error) {
            console.error('Error updating place:', error.response ? error.response.data : error.message);
            setSnackbarMessage('Failed to update place. Please try again later.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleAddTimeSlot = () => {
        setAvailableTimes([...availableTimes, { day: '', from_time: '', to_time: '', is_Active: false }]);
    };

    const handleRemoveTimeSlot = (index) => {
        const newAvailableTimes = [...availableTimes];
        newAvailableTimes.splice(index, 1);
        setAvailableTimes(newAvailableTimes);
    };

    const handleTimeChange = (index, field, value) => {
        const newAvailableTimes = [...availableTimes];
        newAvailableTimes[index][field] = value;
        setAvailableTimes(newAvailableTimes);
    };

    const handleAddExtension = () => {
        setExtensions([...extensions, { name: '', description: '', price: '' }]);
    };

    const handleRemoveExtension = (index) => {
        const newExtensions = [...extensions];
        newExtensions.splice(index, 1);
        setExtensions(newExtensions);
    };

    const handleExtensionChange = (index, field, value) => {
        const newExtensions = [...extensions];
        newExtensions[index][field] = value;
        setExtensions(newExtensions);
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                Edit Place
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
                    Edit Place
                </DialogTitle>
                <DialogContent 
                    dividers 
                    sx={{ 
                        borderBottomLeftRadius: 5, 
                        borderBottomRightRadius: 5 
                    }}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Price per Hour"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Maximum Capacity"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={maximumCapacity}
                        onChange={(e) => setMaximumCapacity(e.target.value)}
                    />
                    {availableTimes.map((time, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="dense"
                                label="Day"
                                type="text"
                                variant="standard"
                                value={time.day}
                                onChange={(e) => handleTimeChange(index, 'day', e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                margin="dense"
                                label="From Time"
                                type="time"
                                variant="standard"
                                value={time.from_time}
                                onChange={(e) => handleTimeChange(index, 'from_time', e.target.value.substring(0, 5))}
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                margin="dense"
                                label="To Time"
                                type="time"
                                variant="standard"
                                value={time.to_time}
                                onChange={(e) => handleTimeChange(index, 'to_time', e.target.value.substring(0, 5))}
                                style={{ marginRight: 8 }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={time.is_Active}
                                        onChange={(e) => handleTimeChange(index, 'is_Active', e.target.checked)}
                                    />
                                }
                                label="Active"
                                style={{ marginRight: 8 }}
                            />
                            <IconButton onClick={() => handleRemoveTimeSlot(index)} aria-label="remove time slot">
                                <RemoveIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button onClick={handleAddTimeSlot} startIcon={<AddIcon />} style={{ marginTop: 8 }}>
                        Add Time Slot
                    </Button>
                    
                    <DialogTitle sx={{ marginTop: 2 }}>Extensions</DialogTitle>
                    {extensions.map((extension, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="dense"
                                label="Extension Name"
                                type="text"
                                variant="standard"
                                value={extension.name}
                                onChange={(e) => handleExtensionChange(index, 'name', e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                variant="standard"
                                value={extension.description}
                                onChange={(e) => handleExtensionChange(index, 'description', e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <TextField
                                margin="dense"
                                label="Price"
                                type="number"
                                variant="standard"
                                value={extension.price}
                                onChange={(e) => handleExtensionChange(index, 'price', e.target.value)}
                                style={{ marginRight: 8 }}
                            />
                            <IconButton onClick={() => handleRemoveExtension(index)} aria-label="remove extension">
                                <RemoveIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button onClick={handleAddExtension} startIcon={<AddIcon />} style={{ marginTop: 8 }}>
                        Add Extension
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Save</Button>
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

export default UpdatePlace;
