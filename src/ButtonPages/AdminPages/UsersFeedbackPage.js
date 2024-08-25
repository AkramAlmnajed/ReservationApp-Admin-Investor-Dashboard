import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import MainLayout from '../../DesignComp/MainLayout';
import BasicCard from '../../DesignComp/Cards';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';
import Typography from '@mui/material/Typography';

const UsersFeedbackPage = () => {
    const [cardsData, setCardsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const token = getToken();
                const response = await axios.get('http://127.0.0.1:8000/api/feedBacks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const feedbackData = response.data.model || [];
                setCardsData(feedbackData.map(feedback => ({
                    ...feedback,
                    isUserFeedBack: true 
                })));
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
                <h1>Users Feedback Page</h1>
                {isLoading ? (
                    <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                ) : (
                    cardsData.length > 0 ? (
                        cardsData.map((card, index) => (
                            <BasicCard key={index} data={card} isUserFeedBack={card.isUserFeedBack} />
                        ))
                    ) : (
                        <Typography>No data available</Typography>
                    )
                )}
            </Paper>
        </MainLayout>
    );
};

export default UsersFeedbackPage;
