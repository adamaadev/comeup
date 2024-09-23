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
      <header className="d-flex justify-content-between align-items-center py-3">
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <img src={logo}  style={{ maxWidth: '180px', maxHeight: '180px', display: 'block', margin: '0 auto' }} />
        </NavLink>
        <NavLink to={'/watchlist'} style={{ textDecoration: 'none' }}>Watchlist</NavLink>
        <div className="d-flex align-items-center position-relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-link p-0 d-flex align-items-center" style={{ textDecoration: 'none' }}>
            {name}
            {isMenuOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </button>
          {isMenuOpen && (
            <div className="position-absolute top-100 end-0 bg-white shadow rounded mt-2">
              <NavLink to={'/compte'} className="dropdown-item" style={{ textDecoration: 'none' }}>Mon compte</NavLink>
              <button onClick={handleLogout} className="dropdown-item btn btn-link" style={{ textDecoration: 'none' }}>Se déconnecter</button>
            </div>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
