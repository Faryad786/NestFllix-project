import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from '@mui/material';

const RecommendationsPage = ({ movieId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`/watch-history/${movieId}/track`, {
          watchTime: 10, 
        });
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        setError('Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {recommendations.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={movie.posterimage}
              alt={movie.title}
            />
            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Rating: {movie.rating}/10
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Language: {movie.language}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecommendationsPage;
