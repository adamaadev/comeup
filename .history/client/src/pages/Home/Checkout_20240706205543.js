import { useState , useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const [email , setemail] = useState();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      if (res.data.success) {
        setemail(res.data.email)
      }
    });
  }, []);

  if (!location.state || !location.state.price || !location.state.plan) {
    return <Navigate to="/" />; 
  }
  
  const { price, plan } = location.state;

  return (
    <div>
      <h1>Souscription</h1>
      <p>Vous avez sélectionné le plan {plan} avec un prix de {price}</p>
      <input type="text" value={email} readOnly/>
    </div>
  );
}
