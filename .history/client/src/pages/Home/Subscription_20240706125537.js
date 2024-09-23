import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export default function Subscription() {
  const location = useLocation();
  const [email , setemail] = useState();
  
  if (!location.state || !location.state.price || !location.state.plan) {
    return <Navigate to="/" />; 
  }
  
  const { price, plan } = location.state;

  return (
    <div>
      <h1>Souscription</h1>
      <p>Vous avez sélectionné le plan {plan} avec un prix de {price}</p>
    </div>
  );
}
