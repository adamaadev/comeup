import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.jpg';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Icônes de flèche

export default function Home() {
  const [name, setName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const type = "admin";
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        if (res.data.success) {
          setName(res.data.username);
        } else {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type: "admin" })
      .then(res => {
        if (res.data.success) {
          navigate('/login');
        }
      });
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <NavLink to="/" className="text-decoration-none">
          <img 
            src={logo} 
            alt="Logo" 
            style={{ maxWidth: '180px', maxHeight: '180px', display: 'block', margin: '0 auto' }} 
          />
        </NavLink>
        <nav className="d-flex align-items-center">
          <NavLink to="/watchlist" className="text-decoration-none me-4">Watchlist</NavLink>
          <NavLink to="/gestion" className="text-decoration-none me-4">Gestion</NavLink>
        </nav>
        <div className="d-flex align-items-center position-relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="btn btn-link p-0 d-flex align-items-center text-decoration-none"
            aria-expanded={isMenuOpen}
            aria-label="Toggle user menu"
          >
            {name}
            {isMenuOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu position-absolute top-100 end-0 bg-white shadow rounded mt-2">
              <NavLink to="/compte" className="dropdown-item text-decoration-none">Mon compte</NavLink>
              <button 
                onClick={handleLogout} 
                className="dropdown-item btn btn-link text-decoration-none"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
