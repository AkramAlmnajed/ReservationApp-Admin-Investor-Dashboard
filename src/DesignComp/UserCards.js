import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const UserCard = ({ user, onChargeClick }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <Card sx={{ minWidth: 900, backgroundColor: '#EEF0FF', borderRadius: 5, boxShadow: 6 }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {user.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {user.user_name || 'Unknown Username'}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {'Role: ' + (user.role || 'Unknown Role')}
                    </Typography>
                    {showMore && (
                        <>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {'Balance: ' + (user.balance !== undefined && user.balance !== null ? user.balance : 'N/A')}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {'Email: ' + (user.email || 'No Email')}
                            </Typography>
                        </>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button onClick={toggleShowMore}>
                            {showMore ? 'Show Less' : 'Show More'}
                        </Button>
                        <Button onClick={onChargeClick} size="small" color="primary">
                            Charge Balance
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;
