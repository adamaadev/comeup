import axios from 'axios';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('sk_test_51JqmbXFTPbYwB9q1gf1NtF6zIluUkZhpm20xl2ANeyg1oJiq5KFaJfKBo1h0IyUrJRPSiBOyilY3phemyW67Wmro00kh7r9yoX');

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
