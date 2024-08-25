import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ShowComment from './SpecialButton/ShowComment'; 
import ShowPlaceReservation from './SpecialButton/ShowPlaceReservation'; 
import UpdatePlace from './SpecialButton/updatePlaces';

const CardsInv = ({ data, onDelete, onEdit, isUserAdsPage, isInvestorInfo, isInvestorFeedBack }) => {
    const [showMore, setShowMore] = React.useState(false);
    const [openDialog1, setOpenDialog1] = React.useState(false);
    const [newDescription, setNewDescription] = React.useState(data.description || '');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [newPassword, setNewPassword] = React.useState('');

    const handleLearnMore = () => {
        setShowMore(!showMore);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleEditAdsClick = () => {
        setOpenDialog1(true);
    };

    const handleDialogAdsClose = () => {
        setOpenDialog1(false);
    };

    const handleSaveAdsChanges = () => {
        const updatedData = {
            description: newDescription,
        };
        onEdit(data.id, updatedData);
        setOpenDialog1(false);
        setSnackbarMessage('Ad updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleEditPasswordClick = () => {
        setOpenDialog1(true);
    };

    const handleDialogInfoClose = () => {
        setOpenDialog1(false);
    };

    const handleSavePasswordChanges = () => {
        onEdit(newPassword);
        setOpenDialog1(false);
        setSnackbarMessage('Password updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const isInvestorAds = data?.description && data?.image;
    const isInvestorPlaces = data?.name && data?.address && data?.images;
    const images = data?.images ? [...data.images] : [];

    if (data?.license_image) {
        images.push({ id: 'license', image: data.license_image });
    }

    return (
        <Card sx={{ minWidth: 900, backgroundColor: '#EEF0FF', borderRadius: 5, boxShadow: 6 }}>
            <CardContent>
            {isInvestorPlaces ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {data.name || 'Unknown Place'}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {'Address: ' + (data.address.goverment + ', ' + data.address.city + ', ' + data.address.area + ', ' + data.address.street)}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {'Capacity: ' + (data.maximum_capacity || 'N/A')}
                        </Typography>
                        {images.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {images.map((img, index) => (
                                    <CardMedia
                                        key={index}
                                        component="img"
                                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                        image={img.image}
                                        alt={`image-${index}`}
                                    />
                                ))}
                            </Box>
                        )}
                        {showMore && (
                            <Typography variant="body2">
                                {'Owner: ' + (data.owner_id[0]?.name || 'N/A')}
                                <br />
                                {'Price per hour: ' + (data.price_per_hour || 'N/A')}
                                <br />
                                {'Space: ' + (data.space || 'N/A')}
                                <br />
                                {'Available times: '}
                                {data.available_times.map((time, index) => (
                                    <div key={index}>
                                        {time.day}: {time.from_time} - {time.to_time}
                                    </div>
                                ))}
                                <br />
                                {'Rate: ' + (data.rate || 'N/A')}
                                <br />
                                {'License: '}
                                    {data.license ? (
                                        <CardMedia
                                        component="img"
                                        sx={{ width: 100, height: 100, objectFit: 'cover', mt: 1 }}
                                        image={data.license}
                                        alt="license"
                                        />
                                    ) : 'N/A'}
                                    <br />
                                {'Category: ' + (data.category_id.map(cat => cat.name).join(', ') || 'N/A')}
                                <br />
                                {'Extensions: '}
                                {data.extensions.length > 0 ? (
                                    <ul>
                                        {data.extensions.map((ext, index) => (
                                            <li key={index}>
                                                {ext.name} - {ext.description} - {ext.price} SYP
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'N/A'
                                )}
                                <br />
                                {`Created at: ${new Date(data.created_at).toLocaleString()}`}
                            </Typography>
                        )}
                    </Box>
                ) : isInvestorAds ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Ad ID: {data.id}
                        </Typography>
                        <CardMedia
                            component="img"
                            sx={{ width: 100, height: 100, objectFit: 'cover' }}
                            image={data.image}
                            alt="Ad Image"
                        />
                        <Typography variant="h5" component="div">
                            {data.description}
                        </Typography>
                        {showMore && (
                            <Typography variant="body2">
                                {'User Name: ' + data.user_id.name}
                                <br />
                                {'Created at: ' + new Date(data.created_at).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                ) : isInvestorInfo ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" component="div">
                            Name: {data.name || 'N/A'}
                        </Typography>
                        <Typography variant="h6" component="div">
                            Email: {data.email || 'N/A'}
                        </Typography>
                        <Typography variant="h6" component="div">
                            Username: {data.user_name || 'N/A'}
                        </Typography>
                        <Typography variant="h6" component="div">
                            Balance: {data.balance !== undefined ? data.balance : 'N/A'}
                        </Typography>
                        {showMore && (
                            <Typography variant="body2">
                                No other Info, be Happy!
                            </Typography>
                        )}
                    </Box>
                ) : isInvestorFeedBack ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Feedback from: {data.user_id[0]?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {data.text}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {'Place: ' + (data.place_id[0]?.name || 'Unknown Place')}
                        </Typography>
                        {showMore && (
                            <Typography variant="body2">
                                {'Created at: ' + new Date(data.created_at).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Typography>Unknown data format</Typography>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleLearnMore}>
                    {showMore ? 'Show Less' : 'Show More'}
                </Button>

                {isInvestorInfo && (
                    <Button size="small" onClick={handleEditPasswordClick}>
                        Edit Password
                    </Button>
                )}

                {isInvestorPlaces && (
                    <>
                        <Button size="small" color="error" onClick={() => onDelete(data.id)}>
                            Delete
                        </Button>
                        <ShowComment placeId={data.id} /> 
                        <UpdatePlace place={data} /> 
                        <ShowPlaceReservation placeId={data.id} /> 
                    </>
                )}

                {isInvestorAds && (
                    <>
                        <Button size="small" onClick={handleEditAdsClick}>
                            Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => onDelete(data.id)}>
                            Delete
                        </Button>
                    </>
                )}
            </CardActions>

            {isInvestorInfo && (
                <Dialog open={openDialog1} onClose={handleDialogInfoClose}>
                    <DialogTitle>Edit Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogInfoClose}>Cancel</Button>
                        <Button onClick={handleSavePasswordChanges}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}

            {isInvestorAds && (
                <Dialog open={openDialog1} onClose={handleDialogAdsClose}>
                    <DialogTitle>Edit Ad</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogAdsClose}>Cancel</Button>
                        <Button onClick={handleSaveAdsChanges}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}

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
        </Card>
    );
};

export default CardsInv;
