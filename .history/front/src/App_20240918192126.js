import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import WatchList from './pages/Home/Watchlist';
import Details from './pages/Home/Details';
import Setting from './pages/Home/Setting';
import Forget from './pages/Auth/Forget';
import ResetPassword from './pages/Auth/ResetPassword';
import Signup from './pages/Auth/Signup';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Bareme from './pages/Home/Bareme';
import BourseImpact from './pages/Home/BourseImpact';
import Screener from './pages/Home/Screener';
import Abonnement from './pages/Stripe/Abonnement';

export default function App() {
  const [auth, setauth] = useState(false);
  const type = "user";
  const [id, setid] = useState(false);

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:4000/', { type }).then(res => {
      if (res.data.success) {
        setauth(true);
        setid(res.data.id);
      }
    });

    if (id) {
      axios.post('http://localhost:4000/checksubs', { id }).then(res => {
        if (!res.data.status) {
          navigate('/abonnement'); // Use navigate to redirect after checking subscription
        }
      });
    }
  }, [id, navigate]);

  return (
    <Routes>
      <Route path='/' element={auth ? <Home /> : <Login />}>
        <Route path='/' element={<BourseImpact />} />
        <Route path='/watchlist' element={<WatchList />} />
        <Route path='/details/:symbol' element={<Details />} />
        <Route path='/compte' element={<Setting />} />
        <Route path='/bareme' element={<Bareme />} />
        <Route path='/screener' element={<Screener />} />
      </Route>
      <Route path='/abonnement' element={<Abonnement />} />
      <Route path='/forget' element={auth ? <Navigate to="/" /> : <Forget />} />
      <Route path='/reset-password/:token' element={auth ? <Navigate to="/" /> : <ResetPassword />} />
      <Route path='/login' element={auth ? <Navigate to="/" /> : <Login />} />
      <Route path='/signup' element={auth ? <Navigate to="/" /> : <Signup />} />
    </Routes>
  );
}

// Wrap App in BrowserRouter in index.js
