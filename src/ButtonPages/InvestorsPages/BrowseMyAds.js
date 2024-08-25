import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import MainLayoutInv from '../../DesignComp/MainLayoutInv';
import CardsInv from '../../DesignComp/CardsInv';
import { getToken } from '../../LoginForm/auth';
import { ClipLoader } from 'react-spinners';

const BrowseMyAds = () => {
  const [adsData, setAdsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAdsData = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://127.0.0.1:8000/api/ads/myAds', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdsData(response.data.model || []);
      } catch (error) {
        console.error('Error fetching ads:', error);
        setError('Failed to load ads. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdsData();
  }, []);

  const handleDelete = async (adId) => {
    try {
      const token = getToken();
      await axios.delete(`http://127.0.0.1:8000/api/ads/${adId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdsData(prevAds => prevAds.filter(ad => ad.id !== adId));
      setSnackbarMessage('Ad deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting ad:', error);
      setSnackbarMessage('Failed to delete the ad. Please try again later.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = async (adId, updatedData) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `http://127.0.0.1:8000/api/ads/${adId}`,
        null,
        { 
          params: { description: updatedData.description },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setAdsData(prevAds =>
          prevAds.map(ad =>
            ad.id === adId ? { ...ad, description: updatedData.description } : ad
          )
        );
        setSnackbarMessage('Ad updated successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to update ad. Please try again.');
        setSnackbarSeverity('error');
      }

      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating ad:', error);
      setSnackbarMessage('Failed to update ad. Please try again later.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleShareAdClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
        const token = getToken();
        const formData = new FormData();
        formData.append('description', newDescription);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        const response = await axios.post(
            'http://127.0.0.1:8000/api/ads',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log(response); 

        if (response.status === 200 || response.status === 201) {
            setSnackbarMessage('Ad submitted successfully! Awaiting admin approval.');
            setSnackbarSeverity('success');
            setOpenDialog(false); 
            setAdsData([...adsData, response.data]);
        } else {
            setSnackbarMessage('Failed to submit ad. Please try again.');
            setSnackbarSeverity('error');
        }

        setOpenSnackbar(true);
    } catch (error) {
        console.error('Error submitting ad:', error);
        setSnackbarMessage('Failed to submit ad. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
    }
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
        <h1>My Ads</h1>
        <Button variant="contained" color="primary" onClick={handleShareAdClick}>
          Share an Ad Now!
        </Button>

        {isLoading ? (
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          adsData.length > 0 ? (
            adsData.map((ad, index) => (
              <CardsInv
                key={index}
                data={ad}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isUserAdsPage={true}  
              />
            ))
          ) : (
            <Typography>No ads available</Typography>
          )
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Share a New Ad</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" sx={{ mt: 2 }}>
              Upload Image
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {selectedFile.name}
              </Typography>
            )}
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainLayoutInv>
  );
};

export default BrowseMyAds;
