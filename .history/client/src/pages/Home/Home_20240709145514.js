import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import './Header.css'; // Importez votre fichier CSS pour le style

export default function Home() {
  const [id, setid] = useState();
  const navigate = useNavigate();
  const [state, setState] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false); // État pour gérer l'ouverture du menu

  useEffect(() => {
    if (state.length > 1) {
      fetch(`https://financialmodelingprep.com/api/v3/search?query=${state}&limit=10&exchange=NASDAQ&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
        .then(response => response.json())
        .then(data => {
          setSuggestions(data);
        });
    } else {
      setSuggestions([]);
    }
  }, [state]);

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        console.log(res);
        if (res.data.status === 'false') {
          navigate('/abonnement')
        } else {
          if (res.data.success) {
            setid(res.data.id);
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="container mt-4">
      <header>
        <nav className="navbar">
          <div className="navbar-brand">
            <NavLink className="nav-link" to="/">Logo</NavLink>
          </div>
          <div className={`navbar-menu ${isNavOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <NavLink className="nav-link" to="/watchlist" onClick={toggleNav}>WatchList</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="/screener" onClick={toggleNav}>Screener</NavLink>
              </li>
              <li>
                <NavLink className="nav-link" to="/setting" onClick={toggleNav}>Profil</NavLink>
              </li>
              <li>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Se déconnecter</button>
              </li>
            </ul>
          </div>
          <div className="navbar-toggle" onClick={toggleNav}>
            <div className={`bar ${isNavOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isNavOpen ? 'open' : ''}`}></div>
            <div className={`bar ${isNavOpen ? 'open' : ''}`}></div>
          </div>
        </nav>
      </header>
      <ul className="list-group mt-3">
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
