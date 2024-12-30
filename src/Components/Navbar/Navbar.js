import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  CssBaseline,
  Menu,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WidgetsIcon from '@mui/icons-material/Widgets';
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../../nest.png";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



const Navbar = () => {
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Categories");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
      },
      background: {
        default: "#121212",
      },
    },
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tmdb/genres`);
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category, id) => {
    setActiveCategory(category);
    setDrawerOpen(false);
    navigate(`/genre/${id}`);
  };

  const handleSearch = async (event) => {
    if (event.target.value.trim() !== "") {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tmdb/search?title=${event.target.value.trim()}`);
        const data = await response.json();
        setSearchResults(data.movies || []);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleMovieClick = (movie) => {
    navigate(`/videoPlay`, { state: { movie } });
    setSearchResults([]);
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box
      sx={{
        backgroundColor: 'black',
        width: 250,
        padding: 2,
        borderRight: '5px solid #950101',
      }}
      role="presentation"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'black',
          zIndex: 1,
          paddingBottom: 8,
        }}
      >
        <img
          src={Logo}
          alt="logo"
          style={{
            height: "50px",
            width: "auto",
            objectFit: "contain",
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate('/');
            toggleDrawer();
          }}
        />
      </div>
      <List>
        {genres.map((genre) => (
          <ListItem
            key={genre.id}
            onClick={() => handleCategoryClick(genre.name, genre.id)}
          >
            <ListItemText primary={genre.name} sx={{ fontFamily: 'Bebas Neue' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "black" }}
      >
        <Toolbar>
          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
            <img
              src={Logo}
              alt="logo"
              style={{ height: "70px", width: "auto", objectFit: "contain", cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </Typography>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search movies..."
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#950101' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: '5px',
                marginRight: '5px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#950101',
                    borderRadius: '20px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#950101',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#950101',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#950101',
                },
              }}
            />

            {searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: "#333",
                  borderRadius: 1,
                  boxShadow: 3,
                  width: '270px',
                  height: '200px',
                  overflowY: 'auto'
                }}
              >
                <List>
                  {searchResults.map((movie) => (
                    <ListItem key={movie._id} onClick={() => handleMovieClick(movie)}>
                      <ListItemText
                        primary={movie.title}
                        sx={{ color: 'white', cursor: 'pointer' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          {/* Menu Button for Mobile */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={toggleDrawer}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: "#950101",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {drawerOpen ? (
              <CloseIcon sx={{ color: "#950101" }} />
            ) : (
              <>
                <WidgetsIcon sx={{ color: "#950101" }} />
                <span style={{ fontSize: "0.75rem", color: "#950101" }}>Categories</span>
              </>
            )}
          </IconButton>


          {/* Button for Laptop screens */}
          <Button
            variant="outlined"
            onClick={handleMenuClick}
            sx={{
              display: { xs: 'none', md: 'block' },
              color: '#950101',
              borderColor: '#950101',
              fontSize: '14px',
              '&:hover': {
                borderColor: '#950101',
              },
              marginRight: '5px',
              borderRadius: '20px'
            }}
          >
            <ArrowDropDownIcon sx={{ marginRight: '5px' }} />
            <span>{activeCategory}</span>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {genres.map((genre) => (
              <MenuItem
                key={genre.id}
                onClick={() => {
                  handleCategoryClick(genre.name, genre.id);
                  handleMenuClose();
                }}
              >
                {genre.name}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Screens */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}

      >
        {drawerContent}
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;
