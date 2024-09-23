import axios from 'axios';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('your-stripe-public-key');

export default function Abonnement() {

  const handleTrialStart = async () => {
    const stripe = await stripePromise;
    const { data } = await axios.post('http://localhost:4000/essaie', { type: 'user' });

    if (data.sessionId) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result.error) {
        console.error(result.error.message);
      }
    }
  };

  return (
    <div>
      <button onClick={handleTrialStart}>Commencer l'essai gratuit</button>
    </div>
  );
}
