import React from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function Try() {

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
        Try
        <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className="mb-3">Se deconnecter</Link>
        
    </div>
  )
}
