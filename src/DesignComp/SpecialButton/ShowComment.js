import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Snackbar, Alert, Box, Card, CardContent } from '@mui/material';
import { getToken } from '../../LoginForm/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ShowComment = ({ placeId }) => {
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleClickOpen = async () => {
        try {
            const token = getToken();
            const response = await axios.get(`http://127.0.0.1:8000/api/rateWithComments/getCommentsByPlaceId?place_id=${placeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'Success') {
                setComments(response.data.model || []);
                setOpen(true);
            } else {
                throw new Error('Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setSnackbarMessage('Failed to load comments. Please try again later.');
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
                Show Comments
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
                <DialogTitle sx={{ backgroundColor: '#3f51b5', color: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>Comments</DialogTitle>
                <DialogContent 
                    dividers 
                    sx={{ 
                        borderBottomLeftRadius: 5, 
                        borderBottomRightRadius: 5 
                    }}
                >
                    {comments.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {comments.map((comment, index) => (
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
                                            <AccountCircleIcon color="primary" />
                                            <Typography variant="subtitle1">
                                                {comment.user_id[0]?.name || 'Unknown'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            {comment.text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography>No comments available</Typography>
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

export default ShowComment;
