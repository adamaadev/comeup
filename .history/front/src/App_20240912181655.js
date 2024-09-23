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
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Bareme from './pages/Home/Bareme';
import BourseImpact from './pages/Home/BourseImpact';
import Abonnement from './pages/Stripe/Abonnement';

export default function App() {
  const [auth, setAuth] = useState(false); // Utilisez camelCase pour les noms de variables
  const [subs, setSubs] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type: 'user' })
      .then(res => {
        if (res.data.success) {
          setAuth(true);
        }
        if (res.data.status === 'active') {
          setSubs(true);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Route principale */}
        <Route
          path='/'
          element={subs ? <Home /> : <Navigate to="/abonnement" replace />}
        >
          {/* Sous-routes */}
          <Route path='/' element={<BourseImpact />} />
          <Route path='/watchlist' element={<WatchList />} />
          <Route path='/details/:symbol' element={<Details />} />
          <Route path='/compte' element={<Setting />} />
          <Route path='/bareme' element={<Bareme />} />
        </Route>

        {/* Route abonnement */}
        <Route
          path='/abonnement'
          element={subs ? <Navigate to="/"/> : <Abonnement />}
        />

        {/* Routes authentification */}
        <Route
          path='/login'
          element={auth ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path='/signup'
          element={auth ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path='/forget'
          element={auth ? <Navigate to="/" replace /> : <Forget />}
        />
        <Route
          path='/reset-password/:token'
          element={auth ? <Navigate to="/" replace /> : <ResetPassword />}
        />

        {/* Route par défaut en cas de non-correspondance */}
        <Route
          path='*'
          element={auth ? <Navigate to="/" replace /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}
