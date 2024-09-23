import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Home() {
  const [id, setId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.status === 'false') {
          navigate('/abonnement')
        } else {
          if (res.data.success) {
            setId(res.data.id);
          } else {
            navigate('/signin');
          }
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:4000/logoutuser')
      .then(res => {
        if (res.data.success) {
          window.location.reload(true);
        }
      });
  };

  return (
    <div className="container mt-4 position-relative">
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <NavLink className="navbar-brand" to="/">Logo</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/watchlist">WatchList</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/screener">Screener</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/setting">Compte</NavLink>
              </li>
            </ul>
          </div>
          <div className="ml-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Se déconnecter</button>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
