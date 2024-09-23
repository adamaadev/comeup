import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.png';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Assurez-vous d'avoir installé react-icons

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
        <NavLink to="/"><img src={logo} width={100} height={90} alt="Logo" /></NavLink>
        <NavLink to={'/watchlist'}>Watchlist</NavLink>
        {name}
        <div className="position-relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-link p-0">
            <FaUserCircle size={30} /> {/* Icône d'utilisateur */}
          </button>
          {isMenuOpen && (
            <div className="position-absolute top-100 end-0 bg-white shadow rounded">
              <NavLink to={'/compte'} className="dropdown-item">Mon compte</NavLink>
              <button onClick={handleLogout} className="dropdown-item btn btn-link">Se déconnecter</button>
            </div>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
