import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // Créez ce composant séparément

const stripePromise = loadStripe('votre-clé-publique-stripe');

export default function Subscription() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      if (res.data.success) {
        setEmail(res.data.email);
      }
    });
  }, []);

  if (!location.state || !location.state.priceId || !location.state.plan) {
    return <Navigate to="/" />;
  }

  const { priceId, plan } = location.state;

  const handleSubscribe = async () => {
    const res = await axios.post('http://localhost:4000/create-checkout-session', {
      priceId,
      email,
    });

    if (res.data.id) {
      setClientSecret(res.data.id);
    }
  };

  return (
    <div>
      <h1>Souscription</h1>
      <p>Vous avez sélectionné le plan {plan} avec un prix de {priceId}</p>
      <input type="text" value={email} readOnly />
      <button onClick={handleSubscribe}>Souscrire</button>
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
