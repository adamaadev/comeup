import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../Assets/logo.jpg';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';

export default function Home() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setName(res.data.username);
        console.log(res.data);
        if (res.data.success) {
          if (!res.data.essaie) {
            navigate('/essaie');
          }else{
            navigate('/')
          }
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
                 <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se deconnecter</Link>

    </div>
  );
}
