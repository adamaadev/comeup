import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import WatchList from './pages/Home/Watchlist';
import Details from './pages/Home/Details';
import Setting from './pages/Home/Setting';
import Forget from './pages/Auth/Forget';
import ResetPassword from './pages/Auth/ResetPassword';
import Signup from './pages/Auth/Signup';
import { BrowserRouter , Routes , Route , Navigate} from 'react-router-dom';
import Bareme from './pages/Home/Bareme';
import BourseImpact from './pages/Home/BourseImpact';
import Abonnement from './pages/Stripe/Abonnement';

export default function App() {
  const [auth, setauth] = useState(false);
  const type = "user";
  const [subs, setsubs] = useState(false);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/',{ type }).then(res => {
      if (res.data.success) {
        setauth(true);
      }
      if (res.data.status === 'active') {
        setsubs(true);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <Home/> }>
          <Route path='/' element = {<BourseImpact/> }/>
          <Route path='/watchlist' element = {<WatchList/>}/>
          <Route path='/details/:symbol' element = {<Details/>}/>
          <Route path='/compte' element = {<Setting/>}/>
          <Route path='/bareme' element={<Bareme/>}/>
        </Route>
        <Route path='/abonnement' element = {auth ? <Navigate to="/" /> : <Abonnement/>}/>
        <Route path='/forget' element = {auth ? <Navigate to="/" /> : <Forget/>}/>
        <Route path='/reset-password/:token' element = {auth ? <Navigate to="/" /> : <ResetPassword/>}/>
        <Route path='/login' element = {auth ? <Navigate to="/" /> :<Login />}/>
        <Route path='*' element = { auth ? <Navigate to="/" /> : <Login />}/>
        <Route path='/signup' element = { auth ? <Navigate to="/" /> : <Signup />}/>
      </Routes>
    </BrowserRouter>
  )
}
