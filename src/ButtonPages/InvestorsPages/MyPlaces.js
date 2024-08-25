import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';  
import MainLayoutInv from '../../DesignComp/MainLayoutInv';
import CardsInv from '../../DesignComp/CardsInv';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const MyPlaces = () => {
    const [placesData, setPlacesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchPlacesData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/places/myPlaces', {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                console.log('Full API Response:', response.data);
    
                const places = response.data.model || [];
                console.log('Places Data:', places);
    
                places.forEach(place => {
                    console.log(`Available times for place ${place.id}:`, place.available_times);
                });
    
                setPlacesData(places);
            } catch (error) {
                console.error('Error fetching places:', error);
                setError('Failed to load places. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchPlacesData();
    }, []);
    

    const handleDelete = async (id) => {
        try {
            const token = getToken();
            await axios.delete(`http://127.0.0.1:8000/api/places/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlacesData(placesData.filter(place => place.id !== id));
            setSnackbarMessage('Place deleted successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error('Error deleting place:', error);
            setSnackbarMessage('Failed to delete place. Please try again later.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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
                <h1>My Places</h1>
                {isLoading ? (
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    placesData.length > 0 ? (
                        placesData.map((place, index) => (
                            <CardsInv
                                key={index}
                                data={place}
                                onDelete={handleDelete}
                                isUserAdsPage={true} 
                            />
                        ))
                    ) : (
                        <Typography>No places available</Typography>
                    )
                )}
            </Paper>

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
        </MainLayoutInv>
    );
};

export default MyPlaces;
