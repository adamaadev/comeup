
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
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
  const handleLogout = () => {
    axios.post('http://localhost:4000/logout', { type })
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };
  return (
    <div>
            <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se deconnecter</Link>

    </div>
  )
}
