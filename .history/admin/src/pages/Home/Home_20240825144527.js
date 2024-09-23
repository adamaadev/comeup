// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = ({ showSidebar, toggleSidebar }) => {
  return (
    <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link" onClick={toggleSidebar}>Home</NavLink>
        <NavLink to="/watchlist" className="sidebar-link" onClick={toggleSidebar}>Watchlist</NavLink>
        <NavLink to="/compte" className="sidebar-link" onClick={toggleSidebar}>Mon compte</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
