import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, TextField, Snackbar, IconButton, Divider, Paper, Drawer } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@mui/icons-material/Close';

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]); // State to store user emails
  const [showEmails, setShowEmails] = useState(false); // State to toggle email list visibility
  const [message, setMessage] = useState(""); // State to store the message to send
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar open state

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        if (!res.data.success) {
          navigate('/login');
        }
      });

    axios.get('http://localhost:4000/users')
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setEmails(res.data); // Store emails in state
        }
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });

    // Set the background color of the body
    document.body.style.backgroundColor = '#edf2fc';
    
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      })
      .catch(error => {
        console.error("Error during logout:", error);
      });
  };

  const toggleEmailList = () => {
    setShowEmails(prevShowEmails => !prevShowEmails);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (emails.length > 0 && message) {
      axios.post('http://localhost:4000/sendemail', { to: emails, message })
        .then(res => {
          if (res.data.success) {
            setSnackbarMessage('Message envoyé avec succès à tous les emails !');
            setSnackbarOpen(true);
            setMessage(''); // Reset the message after sending
          }
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
    } else {
      setSnackbarMessage('Aucun email disponible ou message vide.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1200,
          width: '100%',
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid rgba(0, 0, 0, 0.1)', // Shadow effect
        }}
      >
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6">Logo(screener)</Typography>
        </NavLink>
        <Box>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Se déconnecter
          </Button>
          <Button variant="outlined" onClick={handleSidebarToggle} sx={{ ml: 2 }}>
            <FontAwesomeIcon icon={faComment} size="lg" />
          </Button>
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Box
          sx={{
            width: 240,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <NavLink to="/watchlist" style={{ textDecoration: 'none', marginBottom: 8 }}>
            <Button variant="text">Watchlist</Button>
          </NavLink>
          <NavLink to="/compte" style={{ textDecoration: 'none', marginBottom: 8 }}>
            <Button variant="text">Mon compte</Button>
          </NavLink>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        {showEmails && (
          <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Liste des emails
            </Typography>
            <form onSubmit={handleSendMessage}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Liste des emails"
                  value={emails.join(', ')}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Message à envoyer"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Box>
              <Button variant="contained" color="primary" type="submit">
                Envoyer à tous
              </Button>
            </form>
          </Paper>
        )}

        <Outlet />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
