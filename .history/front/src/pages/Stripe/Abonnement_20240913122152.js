
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const type = "user";
  const [id , setid] = useState(null);
  const [subs, setsubs] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/',{ type }).then(res => {
      if (res.data.success) {
        setauth(true);
        setid(res.data.id);
      }
    });
  }, []);

  useEffect(()=>{
    axios.post('http://localhost:4000/checkauth',{ id }).then(res => {
      if (res.data.status === 'inactive') {
        axios.post('http://localhost:4000/logout', { type })
        .then(res => {
          if (res.data.success) {
            window.location.reload(true);
          }
        });
      }
    });
  },[id])
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
