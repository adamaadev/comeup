import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';

export default function Abonnement() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setName(res.data.username);
        if (res.data.success) {
          if (res.data.status === 'active') {
            navigate('/')
          }else{
            navigate('/abonnement')
          }
        }else{
          navigate('/login');
        }
      });
  }, [navigate]);
  return (
    <div>Abonnement</div>
  )
}
