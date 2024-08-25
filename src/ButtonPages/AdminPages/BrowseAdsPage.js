import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Box } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';
import BasicCard from '../../DesignComp/Cards';
import Typography from '@mui/material/Typography';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';

const BrowseAdsPage = () => {
    const [cardsData, setCardsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/ads/getAdsRequest', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 'Success' && response.data.model) {
                    const filteredAds = response.data.model.filter(ad => ad.status === 0);
                    setCardsData(filteredAds);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCardsData();
    }, []);

    const handleAdAction = async (adId, action) => {
        try {
            const token = getToken();
            const url = `http://127.0.0.1:8000/api/ads/${action}?id=${adId}`;
    
            console.log(`Requesting URL: ${url}`);
            
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.data.status === 'Success') {
                setCardsData(prevCards => prevCards.filter(card => card.id !== adId));
            } else {
                console.error('Operation failed:', response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error(`Error ${action} ad:`, error.response ? error.response.data : error.message);
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
                <h1>Browse Ads Page</h1>
                {isLoading ? (
                <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                ) : (
                cardsData.length > 0 ? (
                    cardsData.map((card, index) => (
                    <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <BasicCard 
                        data={{
                            id: card.id,
                            user_id: card.user_id,
                            image: card.image,
                            description: card.description,
                            status: card.status,
                            created_at: card.created_at
                        }}
                        onApprove={() => handleAdAction(card.id, 'approve')} 
                        onReject={() => handleAdAction(card.id, 'reject')}
                        />
                    </Box>
                    ))
                ) : (
                    <Typography>No data available</Typography>
                )
                )}
            </Paper>
            </MainLayout>
        );
};

export default BrowseAdsPage;
