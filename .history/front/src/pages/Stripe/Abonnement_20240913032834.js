
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
  return (
    <div>Abonnement</div>
  )
}
