import React, { useEffect, useState } from 'react';
import MainLayoutInv from '../../DesignComp/MainLayoutInv';
import { Paper, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import CardsInv from '../../DesignComp/CardsInv';  
import { getToken } from '../../LoginForm/auth';  

const MyFeedBacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = getToken(); 
                const response = await axios.get('http://127.0.0.1:8000/api/feedBacks/investorFeedBacks', {
                    headers: { Authorization: `Bearer ${token}` } 
                });
                if (response.data.status === "Success") {
                    setFeedbacks(response.data.model.map(feedback => ({
                        ...feedback,
                        isInvestorFeedBack: true 
                    })));
                } else {
                    setError("Failed to fetch feedbacks");
                }
            } catch (error) {
                setError("An error occurred while fetching feedbacks");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

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
                <h2>My Feedbacks</h2>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <CardsInv
                            key={feedback.id}
                            data={feedback}
                            isInvestorFeedBack={feedback.isInvestorFeedBack} 
                        />
                    ))
                ) : (
                    <Typography>No feedbacks found.</Typography>
                )}
            </Paper> 
        </MainLayoutInv>
    );
};

export default MyFeedBacks;
