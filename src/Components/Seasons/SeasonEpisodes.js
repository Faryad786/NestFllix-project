import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, Box, Button} from '@mui/material';
import LoadingComponent from '../Loader/LoadingComponent';

const SeasonEpisodes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/seasons/${id}/episodes`);
                const sortedEpisodes = response.data.sort((a, b) => a.episodeNumber - b.episodeNumber);
                setEpisodes(sortedEpisodes);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch episodes.');
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [id]);

    if (loading) {
        return (
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <LoadingComponent />
            </Container>
        );
    }

    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container >
            <Button variant='contained' sx={{backgroundColor:'#950101'}} onClick={()=>navigate('/all/Seasons')}>back</Button>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    margin: '20px 0',
                    fontWeight: 'bold',
                    color: '#950101',
                    fontFamily: 'Bebas Neue',
                    fontSize: '30px',
                }}
            >
                Episodes
            </Typography>

            <Grid container spacing={3}>
                {episodes.map((episode) => (
                    <Grid item xs={12} sm={6} md={4} key={episode._id}>
                        <Box
                            style={{
                                border: '1px solid #950101',
                                borderRadius: '10px',
                                padding: '20px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',                                
                            }}
                        >
                            <img
                                src={episode.poster}
                                alt={episode.title}
                                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                            />
                            <Typography
                                variant="h6"
                                style={{ color: '#950101', margin: '10px 0' }}
                            >
                                {episode.title}
                            </Typography>
                            <Typography>
                                Episode: {episode.episodeNumber}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#950101', '&:hover': {
                                        backgroundColor: '#800101',
                                    },
                                }}
                                style={{ marginTop: '10px' }}
                                onClick={() =>
                                    navigate('/videoPlay', {
                                        state: {
                                            movie: {
                                                title: episode.title,
                                                description: episode.description,
                                                links: episode.links,
                                            },
                                        },
                                    })
                                }
                            >
                                Watch
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SeasonEpisodes;
