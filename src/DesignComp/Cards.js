import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function BasicCard({ data, onDelete, onEdit, onApprove, onReject ,onChargeBalance,onApprove1,onReject1  }) {
  const [showMore, setShowMore] = React.useState(false);

  const handleLearnMore = () => {
    setShowMore(!showMore);
  };

  const isPlaceData = data?.address?.goverment;
  const isUserData = data?.email && data?.user_name;
  const isModelData = data?.user_id && data?.place_id && data?.text;
  const isAdsData = data?.user_id && data?.image && data?.description && (data?.status !== undefined);
  const isUserPlaceRequest = data?.request_type && data?.place_name && data?.user_name;

  const images = data?.images ? [...data.images] : [];

  if (data?.license_image) {
    images.push({ id: 'license', image: data.license_image });
  }

  return (
    <Card sx={{ minWidth: 900, backgroundColor: '#EEF0FF', borderRadius: 5, boxShadow: 6 }}>
      <CardContent>
      {isPlaceData ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {data.name || 'Unknown Place'}
                </Typography>
                <Typography variant="h5" component="div">
                  {'Address: ' + (data.address.goverment + ', ' + data.address.city + ', ' + data.address.area + ', ' + data.address.street)}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {'Capacity: ' + (data.maximum_capacity || 'N/A')}
                </Typography>
              </Box>
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
                  {'Extensions: ' + (data.extensions.map(ext => ext.name).join(', ') || 'N/A')}
                  <br />
                  {`Created at: ${new Date(data.created_at).toLocaleString()}`}
                </Typography>
              )}
            </Box>
          </>
        ) : isUserData ? (
          <>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {data.name || 'Unknown User'}
            </Typography>
            <Typography variant="h5" component="div">
              {data.user_name || 'Unknown Username'}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {'Role: ' + (data.role || 'Unknown Role')}
            </Typography>
            {showMore && (
              <Typography variant="body2">
                {'User ID: ' + (data.id || 'N/A')}
                <br />
                {'Email: ' + (data.email || 'No Email')}
                <br />
                {'Balance: ' + (data.balance !== undefined && data.balance !== null ? data.balance : 'N/A')}
                <br />
                {`Created at: ${new Date(data.created_at).toLocaleString()}`}
              </Typography>
            )}
          </>
        ) : isModelData ? (
          <>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Feedback ID: {data.id}
            </Typography>
            <Typography variant="h5" component="div">
              User: {data.user_id[0]?.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Place: {data.place_id[0]?.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Text: {data.text}
            </Typography>
            {showMore && (
              <Typography variant="body2">
                Created at: {new Date(data.created_at).toLocaleString()}
              </Typography>
            )}
          </>
        ) : isAdsData ? (
          <>
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
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Status: {data.status === 1 ? 'Active' : 'Inactive'}
              </Typography>
              {showMore && (
                <Typography variant="body2">
                  {'User ID: ' + data.user_id}
                  <br />
                  {'Created at: ' + new Date(data.created_at).toLocaleString()}
                </Typography>
              )}
            </Box>
          </>
        ) :isUserPlaceRequest ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Request ID: {data.id}
            </Typography>
            <Typography variant="h5" component="div">
              {'Place: ' + (data.place_name || 'Unknown Place')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {'User: ' + (data.user_name || 'Unknown User')}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {'Request Type: ' + (data.request_type || 'N/A')}
            </Typography>
            {showMore && (
              <Typography variant="body2">
                {'Place ID: ' + (data.place_id || 'N/A')}
                <br />
                {'User ID: ' + (data.user_id || 'N/A')}
                <br />
                {`Created at: ${new Date(data.created_at).toLocaleString()}`}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>Unknown data format</Typography>
        )}
      </CardContent>
      <CardActions>
  <Button size="small" onClick={handleLearnMore}>
    {showMore ? 'Show Less' : 'Learn More'}
  </Button>

    {isAdsData && onApprove && onReject && (
    <>
      <Button size="small" color="success" onClick={() => { console.log("Approve clicked"); onApprove(); }}>
        Approve Ad
      </Button>
      <Button size="small" color="error" onClick={() => { console.log("Reject clicked"); onReject(); }}>
        Reject Ad
      </Button>
    </>
  )}

  {isPlaceData  && onApprove1 && onReject1 && (
    <>
      <Button size="small" color="success" onClick={onApprove1}>
        Approve Request
      </Button>
      <Button size="small" color="error" onClick={onReject1}>
        Reject Request
      </Button>
    </>
  )}

  {(isUserData && onEdit) && (
    <>
      <Button size="small" onClick={() => onEdit(data.id)}>
        Edit
      </Button>
      <Button size="small" onClick={() => onChargeBalance(data.id)}>
        Charge Balance
      </Button>
    </>
  )}

  {(isPlaceData || isUserData) && onDelete && (
    <Button size="small" onClick={() => onDelete(data.id)}>
      Delete
    </Button>
  )}
</CardActions>

    </Card>
  );
}
