import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.jpg';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function Home() {
  const type = "admin";
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setName(res.data.username);
        if (!res.data.success) {
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-3">
        <header className={`d-flex justify-content-between align-items-center py-3 fixed-top w-100 ${hasScrolled ? 'shadow-sm' : ''} bg-white`}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <img src={logo} className="img-fluid" style={{ maxWidth: '180px', height: 'auto' }} alt="Logo" />
          </NavLink>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-link d-flex align-items-center">
            <FaBars color='#2a2a2a' size={30} />
          </button>
        </header>
        <div className="mt-5 pt-5"> {/* Adjusted margin to avoid overlap */}
          <Outlet />
        </div>
      </div>
      <aside className={`bg-light border-start p-3 position-fixed top-0 end-0 vh-100 ${isSidebarOpen ? 'd-block' : 'd-none'} sidebar`}>
        <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link position-absolute top-0 end-0 m-3">
          <FaTimes size={30} />
        </button>
        <nav className="d-flex flex-column mt-5">
          <NavLink to={'/watchlist'} className="mb-3 text-dark" style={{ textDecoration: 'none' }}>Watchlist</NavLink>
          <NavLink to={'/bareme'} className="mb-3 text-dark" style={{ textDecoration: 'none' }}>Bareme</NavLink>
          <NavLink to={'/gestion'} className="mb-3 text-dark" style={{ textDecoration: 'none' }}>Emails Clients</NavLink>
          <NavLink to={'/compte'} className="mb-3 text-dark" style={{ textDecoration: 'none' }}>Compte</NavLink>
          <Link onClick={handleLogout} className="mb-3 text-dark" style={{ textDecoration: 'none' }}>Déconnexion</Link>
        </nav>
      </aside>
    </div>
  );
}
