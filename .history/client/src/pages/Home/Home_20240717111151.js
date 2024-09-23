import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";

export default function Home() {
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/watchlist">WatchList</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/screener">Screener</NavLink>
              </li>
            </ul>
            <NavLink className="nav-link" to="/setting">Compte</NavLink>
            <button className="btn btn-outline-danger my-2 my-sm-0 ml-2" onClick={handleLogout}>Se déconnecter</button>
          </div>
        </nav>
      </header>
      <ul className="list-group mt-3 position-absolute w-100" style={{ zIndex: 1000 }}>
        {suggestions.map((company) => (
          <li key={company.symbol} className="list-group-item">
            <Link to={`/details/${company.symbol}`} onClick={() => setState('')}>
              {company.name} ({company.symbol})
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
