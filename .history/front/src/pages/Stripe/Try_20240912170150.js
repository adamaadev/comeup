import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const type = "user";
  const navigate = useNavigate();
  const [name, setName] = useState('');

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
