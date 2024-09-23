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
import Screener from './pages/Home/Screener';
import Abonnement from './pages/Stripe/Abonnement';

export default function App() {
  const [auth, setauth] = useState(false);
  const type = "user";
  const [id, setid] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          setauth(true);  // Mettez à jour l'authentification
          const userId = res.data.id;  // Utilisez une variable locale pour stocker l'ID
  
          setid(userId);  // Mettez à jour l'état ID
  
          // Vérifiez l'abonnement après avoir mis à jour l'ID
          axios.post('http://localhost:4000/checksubs', { id: userId })
            .then(res => {
              if (!res.data.status) {
                axios.post('http://localhost:4000/logout', { type: 'user' })
                  .then(res => {
                    if (res.data.success) {
                      window.location.reload(true);  // Recharge la page si succès
                    }
                  })
                  .catch(err => console.error('Error during logout:', err));  // Gérer les erreurs du logout
              }
            })
            .catch(err => console.error('Error checking subscription:', err));  // Gérer les erreurs de checksubs
        }
      })
      .catch(err => console.error('Error during initial post:', err));  // Gérer les erreurs de la requête initiale
  }, [type]);  // Ajoutez `type` comme dépendance pour éviter des effets secondaires non voulus
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = { <Home/> }>
          <Route path='/' element = {<BourseImpact/> }/>
          <Route path='/watchlist' element = {<WatchList/>}/>
          <Route path='/details/:symbol' element = {<Details/>}/>
          <Route path='/compte' element = {<Setting/>}/>
          <Route path='/bareme' element={<Bareme/>}/>
          <Route path='/screener' element={<Screener/>}/>
        </Route>
        <Route path='/abonnement' element = {<Abonnement/>}/>
        <Route path='/forget' element = {auth ? <Navigate to="/" /> : <Forget/>}/>
        <Route path='/reset-password/:token' element = {auth ? <Navigate to="/" /> : <ResetPassword/>}/>
        <Route path='/login' element = {auth ? <Navigate to="/" /> :<Login />}/>
        <Route path='/signup' element = { auth ? <Navigate to="/" /> : <Signup />}/>
      </Routes>
    </BrowserRouter>
  )
}
