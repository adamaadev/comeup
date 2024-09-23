import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export default function Subscription() {
  const location = useLocation();
  
  // Vérifie si location.state existe et contient price et plan
  if (!location.state || !location.state.price || !location.state.plan) {
    return <Navigate to="/" />; // Redirige vers la page d'accueil si les données ne sont pas disponibles
  }
  
  const { price, plan } = location.state;

  return (
    <div>
      <h1>Souscription</h1>
      <p>Vous avez sélectionné le plan {plan} avec un prix de {price}</p>
    </div>
  );
}
