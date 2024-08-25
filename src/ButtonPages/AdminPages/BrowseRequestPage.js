import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Box } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';
import BasicCard from '../../DesignComp/Cards';
import Typography from '@mui/material/Typography';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';

const BrowseRequestPage = () => {
    const [cardsData, setCardsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/places/getPlacesRequest', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 'Success' && response.data.model) {
                    const filteredRequests = response.data.model.filter(request => request.status === 0);
                    setCardsData(filteredRequests);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCardsData();
    }, []);

    const handleRequestAction = async (requestId, action) => {
        try {
            const token = getToken();
            const url = `http://127.0.0.1:8000/api/places/${action}?id=${requestId}`;

            console.log(`Requesting URL: ${url}`);

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'Success') {
                setCardsData(prevCards => prevCards.filter(card => card.id !== requestId));
            } else {
                console.error('Operation failed:', response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error(`Error ${action} request:`, error.response ? error.response.data : error.message);
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
                <h1>Browse Requests Page</h1>
                {isLoading ? (
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                ) : (
                    cardsData.length > 0 ? (
                        cardsData.map((card, index) => (
                            <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <BasicCard
                                    data={card}
                                    onApprove1={() => handleRequestAction(card.id, 'approve')}
                                    onReject1={() => handleRequestAction(card.id, 'reject')}
                                />
                            </Box>
                        ))
                    ) : (
                        <Typography>No data available or failed to load data.</Typography>
                    )
                )}
            </Paper>
        </MainLayout>
    );
};

export default BrowseRequestPage;
