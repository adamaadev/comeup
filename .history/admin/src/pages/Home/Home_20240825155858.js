import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.png';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();
  const [name , setname] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setname(res.data.username)
        if (!res.data.success) {
          navigate('/login');
        }
      })
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

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <NavLink to="/"><img src={logo} width={100} height={90} alt="Logo" /></NavLink>
        <NavLink to={'/watchlist'}>Watchlist</NavLink>
        <NavLink to={'/compte'}>Mon compte</NavLink>
        <button onClick={handleLogout} className="btn btn-danger">Se déconnecter</button>
      </header>

      <Outlet />
    </div>
  );
}
