import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardMedia, CardContent, Box } from '@mui/material';
import LoadingComponent from '../Loader/LoadingComponent';
import StarIcon from '@mui/icons-material/Star';

const VideoPlay = () => {
    const { id } = useParams();
    const location = useLocation();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoSrc, setVideoSrc] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                // Fetch movie details
                const movieUrl = `${process.env.REACT_APP_API_URL}/api/tmdb/movie/${id}`;
                const response = await fetch(movieUrl);

                if (!response.ok) {
                    throw new Error('Error fetching movie details');
                }
                const data = await response.json();
                setMovie(data);

                // Fetch movie videos
                const videoUrl = `${process.env.REACT_APP_API_URL}/api/tmdb/movie/${id}/videos`;
                const videoResponse = await fetch(videoUrl);

                if (!videoResponse.ok) {
                    throw new Error('Error fetching movie videos');
                }
                const videoData = await videoResponse.json();
                setVideoSrc(videoData?.movie?.links || videoData?.trailer?.links);

                // Fetch movie recommendations
                const recommendationsUrl = `${process.env.REACT_APP_API_URL}/api/tmdb/${id}/recommendations`;
                const recommendationsResponse = await fetch(recommendationsUrl);

                if (!recommendationsResponse.ok) {
                    throw new Error('Error fetching movie recommendations');
                }
                const recommendationsData = await recommendationsResponse.json();

                const recommendationsWithVideos = await Promise.all(
                    recommendationsData.results.map(async (rec) => {
                        const recVideoUrl = `${process.env.REACT_APP_API_URL}/api/tmdb/movie/${rec.id}/videos`;
                        const recVideoResponse = await fetch(recVideoUrl);

                        if (!recVideoResponse.ok) return { ...rec, video: null };
                        const recVideoData = await recVideoResponse.json();

                        return { ...rec, video: recVideoData?.trailer?.links || null };
                    })
                );

                setRecommendations(recommendationsWithVideos);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <LoadingComponent />
            </Container>
        );
    }

    return (
        <Container>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#950101', marginBottom: '5px' }}
                onClick={() => navigate('/')}
            >
                Back
            </Button>
            <iframe
                width="100%"
                height="500"
                src={videoSrc}
                title="Movie Video"
                frameBorder="0"
                allowFullScreen
            />

            <Typography variant="h6" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#950101' }}>Title</span>: {movie.title || location.state?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#950101' }}>Description</span>: {movie.overview || 'Description not available'}
            </Typography>

            <Typography variant="h5" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#950101' }}>
                Recommendations
            </Typography>
            <Grid container spacing={3}>
                {recommendations.map((rec) => (
                    <Grid item xs={12} sm={6} md={4} key={rec.id}>
                        <Card>
                            {rec.video && (
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={rec.video}
                                    title={rec.title}
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            )}
                            <CardMedia
                                component="img"
                                alt={rec.title}
                                height="300"
                                image={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                                onError={(e) => (e.target.src = '/placeholder-image.png')} // Fallback image
                            />
                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    noWrap
                                    sx={{ fontWeight: 'bold', color: '#950101' }}
                                >
                                    {rec.title}
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <StarIcon sx={{ color: '#950101', fontSize: '18px' }} />
                                    <Typography variant="body2" sx={{ marginLeft: '5px', color: '#950101' }}>
                                        {rec.vote_average || 'N/A'}/100
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default VideoPlay;
