import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingComponent from '../Loader/LoadingComponent';
import { Container, Grid, Typography, Box, Button } from '@mui/material';

const AllSeasons = () => {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/seasons`);
                setSeasons(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch seasons.');
                setLoading(false);
            }
        };

        fetchSeasons();
    }, []);

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
        <Container>
            <Button variant='contained' sx={{backgroundColor:'#950101'}} onClick={()=>navigate('/')}>back</Button>
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
                Seasons
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                
                    <Grid
                        container
                        spacing={3}
                        style={{ width: '100%' }}
                    >
                        {seasons.map((season) => (
                            <Grid
                                item
                                xs={6} 
                                sm={6}
                                md={4} 
                                lg={4}
                                key={season._id}

                            >
                                <Box
                                    sx={{
                                        border: '1px solid #950101',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',                                        
                                        height: '100%',
                                    }}
                                    onClick={() => navigate(`/season/${season._id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={season.poster}
                                        alt={season.title}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            borderRadius: '10px',
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        style={{
                                            color: '#950101',
                                            margin: '10px 0',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {season.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        style={{
                                            fontSize: '12px',
                                            color: '#fff',
                                        }}
                                    >
                                        <span style={{ fontWeight: 'bold', color: '#950101' }}>
                                            Language
                                        </span>
                                        : {season.language}
                                    </Typography>
                                </Box>
                            </Grid>

                        ))}
                    </Grid>

                
            </Grid>
        </Container>
    );
};

export default AllSeasons;
