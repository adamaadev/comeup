import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Import the CSS file for styling

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]);
  const [showEmails, setShowEmails] = useState(false);
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

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
          setEmails(res.data);
        }
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
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
            alert('Message envoyé avec succès à tous les emails !');
            setMessage('');
          }
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
    } else {
      alert('Aucun email disponible ou message vide.');
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(prevShowSidebar => !prevShowSidebar);
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <button onClick={toggleSidebar} className="btn btn-light">
          <FontAwesomeIcon icon={showSidebar ? faTimes : faBars} size="lg" />
        </button>
        <NavLink to="/" className="logo">Logo(screener)</NavLink>
        <button onClick={toggleEmailList} className="btn btn-secondary">
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      </header>

      <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <nav className="sidebar-nav">
          <NavLink to="/watchlist" className="sidebar-link" onClick={toggleSidebar}>Watchlist</NavLink>
          <NavLink to="/compte" className="sidebar-link" onClick={toggleSidebar}>Mon compte</NavLink>
          <button onClick={handleLogout} className="btn btn-danger sidebar-link">Se déconnecter</button>
        </nav>
      </div>

      {showEmails && (
        <div className="email-list">
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label htmlFor="emailList">Liste des emails :</label>
              <input
                type="text"
                className="form-control"
                id="emailList"
                value={emails.join(', ')}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message à envoyer :</label>
              <textarea
                className="form-control"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Envoyer à tous
            </button>
          </form>
        </div>
      )}

      <Outlet />
    </div>
  );
}
