import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.jpg';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';

export default function Home() {
  const type = "user";
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        if (res.data.status === 'active') {
            navigate('/')
        }else if (condition) {
          
        }else{
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
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
        <header className={`d-flex justify-content-between align-items-center py-3 ${hasScrolled ? 'header-shadow' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: "10%", backgroundColor: '#fff', zIndex: 1000 }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <img src={logo} style={{ maxWidth: '180px', maxHeight: '180px', display: 'block', margin: '0 auto' }} alt="Logo" />
          </NavLink>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-link p-0 d-flex align-items-center">
            <FaBars color='#2a2a2a' size={30} />
          </button>
        </header>
        <div style={{ marginTop: '100px' }}>
          <Outlet />
        </div>
      </div>
      {isSidebarOpen && (
        <aside className={`bg-light border-start p-3 position-fixed top-0 end-0 vh-100 sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ minWidth: '250px', zIndex: '1000' }}>
          <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link p-0 position-absolute top-0 end-0 m-3">
            <FaTimes size={30} />
          </button>
          <nav className="d-flex flex-column mt-5">
            <NavLink to={'/watchlist'} style={{ textDecoration: 'none' }} className="mb-3">Watchlist</NavLink>
            <NavLink to={'/bareme'} style={{ textDecoration: 'none' }} className="mb-3">Bareme</NavLink>
            <NavLink to={'/screener'} style={{ textDecoration: 'none' }} className="mb-3">Screener</NavLink>
            <NavLink to={'/compte'} style={{ textDecoration: 'none' }} className="mb-3">Compte</NavLink>
            <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se deconnecter</Link>
          </nav>
        </aside>
      )}
    </div>
  );
}
