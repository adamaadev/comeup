import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.jpg';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icônes de flèche

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le toggle du menu

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

  return (
    <div className="container">
      <header className="navbar navbar-expand-lg navbar-light py-3">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="logo" style={{ maxWidth: '50%', height: 'auto' }} />
        </NavLink>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to={'/watchlist'} className="nav-link">Watchlist</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/gestion'} className="nav-link">Gestion</NavLink>
            </li>
            <li className="nav-item dropdown">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="btn btn-link nav-link dropdown-toggle p-0 d-flex align-items-center"
                style={{ textDecoration: 'none' }}
                aria-expanded={isMenuOpen ? 'true' : 'false'}
              >
                {name}
              </button>
              <div className={`dropdown-menu dropdown-menu-end ${isMenuOpen ? 'show' : ''}`}>
                <NavLink to={'/compte'} className="dropdown-item">Mon compte</NavLink>
                <button onClick={handleLogout} className="dropdown-item btn btn-link">Se déconnecter</button>
              </div>
            </li>
          </ul>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
