
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Abonnement() {
  const type = "user";
  const navigate = useNavigate();
  const [id , setid] = useState(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/',{ type }).then(res => {
      if (res.data.success) {
        setid(res.data.id);
      }else{}
    });
  }, []);
 
  useEffect(()=>{
      if (id) {
        axios.post('http://localhost:4000/checkauth',{ id }).then(res => {
          console.log(res.data);
          
          if (res.data.status === 'inactive') {
            navigate('/')
          }
        }); 
      }
  },[id])

  const handleLogout = () => {
    axios.defaults.withCredentials : true
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
