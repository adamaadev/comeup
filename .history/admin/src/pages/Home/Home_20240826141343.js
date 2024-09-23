import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.png';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Box } from '@mui/material';

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setName(res.data.username);
        if (!res.data.success) {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} width={100} height={90} alt="Logo" />
          </NavLink>
          <Box sx={{ flexGrow: 1 }} />
          <NavLink to={'/watchlist'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Watchlist</Button>
          </NavLink>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            endIcon={anchorEl ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          >
            {name}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <NavLink to={'/compte'} style={{ textDecoration: 'none', color: 'inherit' }}>
                Mon compte
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Se déconnecter
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Outlet />
    </div>
  );
}
