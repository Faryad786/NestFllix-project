import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Container, Box, Button, Grid, Card, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import StarIcon from '@mui/icons-material/Star';
const Video = () => {
    const location = useLocation();
    const { movie } = location.state || {};
    const navigate = useNavigate();

    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (movie?.language) {
            const fetchRecommendedMovies = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/watch-history/recommended/${movie.language}`);
                    setRecommendedMovies(response.data.recommendations || []);
                } catch (err) {
                    setError("Failed to fetch recommended movies.");
                } finally {
                    setLoading(false);
                }
            };
            fetchRecommendedMovies();
        } else {
            setLoading(false);
        }
    }, [movie?.language]);

    if (!movie) {
        return (
            <Typography
                variant="h5"
                sx={{
                    textAlign: "center",
                    color: "#950101",
                    mt: 4,
                }}
            >
                Movie data not found.
            </Typography>
        );
    }

    const getStars = (rating) => {
        const filledStars = Math.round(rating / 2);
        return Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} style={{ color: i < filledStars ? '#FFAF00' : '#ccc' }} />
        ));
    };

    const { title, description, links, language } = movie;

    return (
        <Container sx={{ marginTop: "20px" }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#950101", marginBottom: "5px" }}
                onClick={() => navigate("/")}
            >
                Back
            </Button>

            <Grid container spacing={2}>
                {/* Left Column: Video Player */}
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: 0,
                            paddingTop: "56.25%", // Aspect ratio 16:9
                        }}
                    >
                        <iframe
                            src={links}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        ></iframe>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ marginTop: "10px" }}>
                        <span style={{ fontWeight: "bold", color: "#950101" }}>Title</span>: {title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <span style={{ fontWeight: "bold", color: "#950101" }}>Description</span>: {description || "Description not available"}
                    </Typography>
                </Grid>

                {/* Right Column: Recommended Videos */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ color: "#950101", marginBottom: "10px", fontWeight:'bold' }}>
                        Recommended Movies
                    </Typography>

                    {loading && (
                        <Typography variant="body1" sx={{ color: "#950101", marginBottom: "10px" }}>
                            Loading recommended movies...
                        </Typography>
                    )}

                    {!loading && !error && recommendedMovies.length === 0 && (
                        <Typography variant="body1" sx={{ color: "#950101", marginBottom: "10px" }}>
                            No recommended movies available.
                        </Typography>
                    )}

                    <Grid container spacing={2}>
                        {recommendedMovies.map((recMovie, index) => (
                            <Grid item xs={12} key={index}>
                                <Card
                                    sx={{ cursor: "pointer", display: "flex", alignItems: "center", backgroundColor: 'black', border: '1px solid #950101' }}
                                    onClick={() => navigate("/videoPlay", { state: { movie: recMovie } })}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 100 }}
                                        image={recMovie.posterimage || "https://via.placeholder.com/150"}
                                        alt={recMovie.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="subtitle1" component="div" sx={{ color: '#950101' }}>
                                            {recMovie.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {getStars(recMovie.rating)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Video;
