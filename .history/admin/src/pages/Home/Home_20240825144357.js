import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]); // State to store user emails
  const [showEmails, setShowEmails] = useState(false); // State to toggle email list visibility
  const [message, setMessage] = useState(""); // State to store the message to send
  const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility

  axios.defaults.withCredentials = true;

  // Fetch user emails on component mount
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

  // Function to toggle email list visibility
  const toggleEmailList = () => {
    setShowEmails(prevShowEmails => !prevShowEmails);
  };

  // Function to handle sending the message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (emails.length > 0 && message) {
      axios.post('http://localhost:4000/sendemail', { to: emails, message })
        .then(res => {
          if (res.data.success) {
            alert('Message envoyé avec succès à tous les emails !');
            setMessage(''); // Reset the message after sending
          }
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
    } else {
      alert('Aucun email disponible ou message vide.');
    }
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <button onClick={() => setShowMenu(!showMenu)} className="btn btn-light">
          <FontAwesomeIcon icon={showMenu ? faTimes : faBars} size="lg" />
        </button>
        <NavLink to="/" className="logo">Logo(screener)</NavLink>
        {showMenu && (
          <nav className="menu">
            <NavLink to="/watchlist" className="menu-link">Watchlist</NavLink>
            <NavLink to="/compte" className="menu-link">Mon compte</NavLink>
            <button onClick={handleLogout} className="btn btn-danger">Se déconnecter</button>
          </nav>
        )}
        <button onClick={toggleEmailList} className="btn btn-secondary">
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      </header>

      {showEmails && (
        <div className="email-list">
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label htmlFor="emailList">Liste des emails :</label>
              <input
                type="text"
                className="form-control"
                id="emailList"
                value={emails.join(', ')} // Display all emails in a readonly input
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message à envoyer :</label>
              <textarea
                className="form-control"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Update the message state
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
